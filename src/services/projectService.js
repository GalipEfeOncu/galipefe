import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy, where, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { mergeProjectIdentities, nextAvailableIdFrom } from '../utils/projectIdentity';
import { normalizeProjectArrays } from '../utils/projectData';

const COLLECTION_NAME = 'projects';
const TIMEOUT_MS = 3000; // 3 seconds timeout
const documentIdFor = (project) => String(project.docId ?? project.id);

// Helper to prevent database calls from hanging indefinitely (e.g. misconfigured keys or network blocks)
const withTimeout = (promise, ms = TIMEOUT_MS) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Firebase connection timed out. Check your .env config and Firestore status."));
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timer);
                resolve(res);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
};

export const projectService = {
    /**
     * Fetches all projects from Firestore, ordered by the 'order' field ascending.
     * Returns an explicit result so an empty collection is never confused with a failed request.
     */
    async getProjects({ admin = false, includeArchived = false } = {}) {
        if (!isFirebaseConfigured || !db) return { ok: false, error: 'Firebase is not configured' };
        try {
            const projectsRef = collection(db, COLLECTION_NAME);
            const constraints = [];
            if (!admin) {
                constraints.push(
                    where('published', '==', true),
                    where('archived', '==', false),
                    orderBy('order', 'asc'),
                );
            }
            const q = query(projectsRef, ...constraints);
            const querySnapshot = await withTimeout(getDocs(q));
            
            const projectsList = [];
            querySnapshot.forEach((doc) => {
                projectsList.push(normalizeProjectArrays({ ...doc.data(), docId: doc.id }));
            });
            if (admin) projectsList.sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
            return {
                ok: true,
                projects: admin && !includeArchived
                    ? projectsList.filter((project) => project.archived !== true)
                    : projectsList,
            };
        } catch (error) {
            console.error('Error fetching projects from Firestore:', error);
            return { ok: false, error: error.message || 'Firestore projects could not be loaded' };
        }
    },

    /**
     * Saves a project. The Firestore document ID is the immutable record
     * identity; the user-facing `id` field is never used to choose a document.
     */
    async saveProject(project, existingDocId) {
        if (!isFirebaseConfigured || !db) throw new Error('Firebase is not configured');

        // Old records use numeric document IDs. New records receive a generated
        // Firestore ID, so a form value can never redirect an update to another record.
        const docId = existingDocId ?? project.docId ?? doc(collection(db, COLLECTION_NAME)).id;
        const docRef = doc(db, COLLECTION_NAME, docId);
        
        try {
            const data = { ...project };
            delete data.docId;
            await withTimeout(setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true }));
            return { ...data, docId };
        } catch (error) {
            console.error('Error saving project to Firestore:', error);
            throw error;
        }
    },

    async ensureProjectIdentityAllocator(knownProjects = []) {
        const identitiesRef = doc(db, 'systemMetadata', 'project-identities');
        return withTimeout(runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(identitiesRef);
            if (snapshot.exists()) return snapshot.data();

            const identities = mergeProjectIdentities(null, knownProjects);
            if (identities.usedIds.length > 5000 || identities.usedTranslationKeys.length > 5000) {
                throw new Error('The existing project catalogue is too large to initialize the identity allocator.');
            }
            transaction.set(identitiesRef, {
                ...identities,
                updatedAt: serverTimestamp(),
            });
            return identities;
        }));
    },

    /**
     * Creates a project and reserves its public numeric ID and translation key
     * in the same Firestore transaction, so concurrent admin tabs cannot reuse
     * either identity. The allocator is initialized from the complete admin
     * catalogue in a separate transaction the first time it is needed.
     */
    async createProject(project, knownProjects = []) {
        if (!isFirebaseConfigured || !db) throw new Error('Firebase is not configured');

        const projectRef = doc(collection(db, COLLECTION_NAME));
        const identitiesRef = doc(db, 'systemMetadata', 'project-identities');

        try {
            await this.ensureProjectIdentityAllocator(knownProjects);
            return await withTimeout(runTransaction(db, async (transaction) => {
                const [projectSnapshot, identitiesSnapshot] = await Promise.all([
                    transaction.get(projectRef),
                    transaction.get(identitiesRef),
                ]);

                if (projectSnapshot.exists()) throw new Error('A project record with this document ID already exists.');
                if (!identitiesSnapshot.exists()) throw new Error('Project identity allocator is unavailable.');

                const identities = mergeProjectIdentities(identitiesSnapshot.data());
                const id = nextAvailableIdFrom(identities.usedIds);
                const requestedKey = String(project.translationKey ?? '').trim();
                const isGeneratedKey = requestedKey === `proj_${project.id}`;
                const translationKey = isGeneratedKey ? `proj_${id}` : requestedKey;

                if (!translationKey) throw new Error('translationKey is required.');
                if (identities.usedTranslationKeys.includes(translationKey)) {
                    const error = new Error('translationKey already exists');
                    error.code = 'project/translation-key-already-exists';
                    throw error;
                }

                const data = { ...project, id, translationKey, updatedAt: serverTimestamp() };
                delete data.docId;

                transaction.set(identitiesRef, {
                    usedIds: [...identities.usedIds, id],
                    usedTranslationKeys: [...identities.usedTranslationKeys, translationKey],
                    updatedAt: serverTimestamp(),
                    lastProjectDocId: projectRef.id,
                    lastAllocatedId: id,
                    lastTranslationKey: translationKey,
                });
                transaction.set(projectRef, data);

                return { ...data, docId: projectRef.id };
            }));
        } catch (error) {
            console.error('Error creating project in Firestore:', error);
            throw error;
        }
    },

    /**
     * Deletes a project by ID.
     */
    async deleteProject(project) {
        if (!isFirebaseConfigured || !db) throw new Error('Firebase is not configured');

        const docRef = doc(db, COLLECTION_NAME, documentIdFor(project));
        try {
            await withTimeout(deleteDoc(docRef));
        } catch (error) {
            console.error('Error deleting project from Firestore:', error);
            throw error;
        }
    },

    async setArchived(project, archived) {
        if (!isFirebaseConfigured || !db) throw new Error('Firebase is not configured');
        const docRef = doc(db, COLLECTION_NAME, documentIdFor(project));
        await withTimeout(setDoc(docRef, { archived, updatedAt: serverTimestamp() }, { merge: true }));
    },

    /**
     * Updates the ordering indices of multiple projects using a write batch.
     */
    async updateProjectsOrder(projectsList) {
        if (!isFirebaseConfigured || !db) throw new Error('Firebase is not configured');
        
        try {
            const batch = writeBatch(db);
            projectsList.forEach((project, index) => {
                const docRef = doc(db, COLLECTION_NAME, documentIdFor(project));
                batch.update(docRef, { order: index });
            });
            await withTimeout(batch.commit());
        } catch (error) {
            console.error('Error updating projects order in Firestore:', error);
            throw error;
        }
    }
};
