import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

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
            const constraints = [orderBy('order', 'asc')];
            if (!admin) {
                constraints.unshift(where('published', '==', true), where('archived', '==', false));
            }
            const q = query(projectsRef, ...constraints);
            const querySnapshot = await withTimeout(getDocs(q));
            
            const projectsList = [];
            querySnapshot.forEach((doc) => {
                projectsList.push({ ...doc.data(), docId: doc.id });
            });
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
