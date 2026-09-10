import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { projectService } from '../services/projectService';
import { prepareCover, validateImageValue } from './admin/imageUpload';
import { useProjectDraft } from './admin/useProjectDraft';
import Modal from './Modal';

const STATUSES = ['Completed', 'Work in Progress', 'Discontinued'];
const CATEGORIES = ['AI/Automation', 'Web', 'Games', 'Tools', 'Other'];
const REQUIRED = ['title', 'translationKey', 'subtitleTr', 'subtitleEn', 'descriptionTr', 'descriptionEn'];

function blank(projects) { const id = projects.length ? Math.max(...projects.map((p) => Number(p.id) || 0)) + 1 : 1; return { id: String(id), translationKey: `proj_${id}`, title: '', category: 'Other', status: 'Work in Progress', published: false, archived: false, subtitleTr: '', subtitleEn: '', descriptionTr: '', descriptionEn: '', roleTr: '', roleEn: '', outcomeTr: '', outcomeEn: '', learningsTrInput: '', learningsEnInput: '', tagsInput: '', image: '', icon: '', link: '', demoLink: '' }; }
function formFor(project, projects) { if (!project) return blank(projects); return { ...blank(projects), ...project, id: String(project.id), published: project.published === true, archived: project.archived === true, subtitleTr: project.subtitleTr || project.subtitle || '', subtitleEn: project.subtitleEn || project.subtitle || '', descriptionTr: project.descriptionTr || project.description || '', descriptionEn: project.descriptionEn || project.description || '', roleTr: project.roleTr || project.role || '', roleEn: project.roleEn || project.role || '', outcomeTr: project.outcomeTr || project.outcome || '', outcomeEn: project.outcomeEn || project.outcome || '', tagsInput: Array.isArray(project.tags) ? project.tags.join(', ') : '', learningsTrInput: Array.isArray(project.learningsTr) ? project.learningsTr.join('\n') : '', learningsEnInput: Array.isArray(project.learningsEn) ? project.learningsEn.join('\n') : '' }; }
function validate(form, projects, editingId) { const errors = {}; REQUIRED.forEach((key) => { if (!form[key]?.trim()) errors[key] = 'Bu alan zorunludur.'; }); if (!STATUSES.includes(form.status)) errors.status = 'Geçerli durum seçin.'; if (projects.some((p) => String(p.id) === form.id && String(p.id) !== String(editingId))) errors.id = 'Bu ID zaten kullanılıyor.'; if (projects.some((p) => p.translationKey === form.translationKey && String(p.id) !== String(editingId))) errors.translationKey = 'Bu anahtar zaten kullanılıyor.'; ['link', 'demoLink'].forEach((key) => { if (form[key] && !/^https?:\/\/.+/.test(form[key])) errors[key] = 'Geçerli bir http(s) URL girin.'; }); const imageError = validateImageValue(form.image); if (imageError) errors.image = imageError; return errors; }
function Field({ label, error, children }) { const errorId = `admin-error-${label.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`; return <label className="admin-field"><span>{label}</span>{cloneElement(children, { 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined })}{error && <small id={errorId} className="admin-error">{error}</small>}</label>; }

function ProjectThumbnail({ project, compact = false }) {
    const [failed, setFailed] = useState(false);
    const hasImage = Boolean(project.image) && !failed;
    return <span className={`admin-project-thumbnail ${compact ? 'compact' : ''}`} aria-hidden="true">{hasImage ? <img src={project.image} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <span>{project.icon || project.title?.trim().charAt(0) || '◇'}</span>}</span>;
}

function PublishBadge({ project }) {
    return <span className={`admin-badge ${project.archived ? 'archived' : project.published ? 'live' : 'draft'}`}>{project.archived ? 'Arşivde' : project.published ? 'Yayında' : 'Taslak'}</span>;
}

function DragPreview({ project, position, previewRef }) {
    return <div ref={previewRef} className="admin-drag-preview" style={{ width: position.width, transform: `translate3d(${position.left}px, ${position.top}px, 0)` }} aria-hidden="true"><span className="admin-drag-preview-handle">⠿</span><ProjectThumbnail project={project} /><div className="admin-project-copy"><div className="admin-project-title"><strong>{project.title}</strong><PublishBadge project={project} /></div><span>{project.category || 'Other'} · {project.status}</span></div></div>;
}

function Login({ login, error, loading }) { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); return <main className="container admin-auth"><section className="metadata-card admin-auth-card"><h1 className="page-title">Yönetim Girişi</h1><form className="admin-form" onSubmit={(e) => { e.preventDefault(); login(email, password); }}><Field label="E-posta"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field><Field label="Şifre"><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>{error && <p className="admin-error" role="alert">{error}</p>}<button className="btn primary" disabled={loading}>{loading ? 'Giriş yapılıyor…' : 'Giriş yap'}</button></form></section></main>; }

function Editor({ project, projects, close, saved, notice, remove }) {
    const initial = useMemo(() => formFor(project, projects), [project, projects]);
    const { form, setForm, dirty, markSaved, discard } = useProjectDraft(initial, project?.id ?? `new-${initial.id}`);
    const [section, setSection] = useState('general'); const [locale, setLocale] = useState('side'); const [errors, setErrors] = useState({}); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(0); const [preview, setPreview] = useState(false); const [confirmDelete, setConfirmDelete] = useState(false); const [deleteTitle, setDeleteTitle] = useState('');
    const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));
    const safeClose = () => { if (!dirty || window.confirm('Kaydedilmemiş değişiklikler var. Kapatmak istiyor musunuz?')) { discard(); close(); } };
    const asProject = (next) => { const lines = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean); const payload = { ...next, id: Number(next.id), order: project?.order ?? projects.length, tags: next.tagsInput.split(',').map((item) => item.trim()).filter(Boolean), learningsTr: lines(next.learningsTrInput), learningsEn: lines(next.learningsEnInput), subtitle: next.subtitleTr || next.subtitleEn, description: next.descriptionTr || next.descriptionEn, role: next.roleTr || next.roleEn, outcome: next.outcomeTr || next.outcomeEn }; delete payload.tagsInput; delete payload.learningsTrInput; delete payload.learningsEnInput; return payload; };
    const submit = async (published) => { const next = { ...form, published: published ?? form.published }; const nextErrors = validate(next, projects, project?.id); setErrors(nextErrors); if (Object.keys(nextErrors).length) { notice('İşaretli alanları düzeltin.', true); requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus()); return; } setSaving(true); try { const payload = asProject(next); await projectService.saveProject(payload); markSaved(next); saved({ ...payload, docId: String(payload.id) }); notice(payload.published ? 'Proje yayınlandı.' : 'Taslak kaydedildi.'); } catch (error) { notice(`Kaydetme başarısız: ${error.message}`, true); } finally { setSaving(false); } };
    const upload = async (file) => { if (!file) return; setUploading(1); try { set('image', await prepareCover(file)); notice('Kapak görseli sıkıştırıldı ve kayda hazır.'); } catch (error) { notice(`Görsel yüklenemedi: ${error.message}`, true); } finally { setUploading(0); } };
    const text = (key, label, long = false) => <Field label={label} error={errors[key]}><textarea rows={long ? 5 : 2} value={form[key]} onChange={(e) => set(key, e.target.value)} required={REQUIRED.includes(key)} /></Field>;
    return <section className="metadata-card admin-editor"><header className="admin-editor-header"><div><span className="admin-eyebrow">Proje editörü</span><h2>{project ? project.title : 'Yeni proje'}</h2><div className="admin-editor-state"><span className={`admin-publish-state ${form.published ? 'live' : ''}`}>{form.published ? 'Yayında' : 'Taslak'}</span>{dirty && <span className="admin-unsaved">Kaydedilmemiş değişiklik</span>}</div></div><button className="btn admin-secondary" type="button" onClick={safeClose}>Editörü kapat</button></header><div className="admin-tabs" role="tablist" aria-label="Proje düzenleme bölümleri">{[['general','Genel'],['content','İçerik'],['media','Medya'],['links','Linkler'],['advanced','Gelişmiş']].map(([key, label]) => <button type="button" role="tab" aria-selected={section === key} className={section === key ? 'active' : ''} onClick={() => setSection(key)} key={key}>{label}</button>)}</div><form className="admin-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        {section === 'general' && <div className="admin-grid"><Field label="Proje başlığı" error={errors.title}><input required value={form.title} onChange={(e) => set('title', e.target.value)} /></Field><Field label="Kategori"><select value={form.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Durum" error={errors.status}><select value={form.status} onChange={(e) => set('status', e.target.value)}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Simge"><input value={form.icon} onChange={(e) => set('icon', e.target.value)} /></Field><Field label="Etiketler (virgülle ayırın)"><input value={form.tagsInput} onChange={(e) => set('tagsInput', e.target.value)} /></Field></div>}
        {section === 'content' && <><div className="admin-locale-switch">{[['tr','TR'],['en','EN'],['side','Yan yana']].map(([key, label]) => <button className={locale === key ? 'active' : ''} type="button" onClick={() => setLocale(key)} key={key}>{label}</button>)}</div><div className="admin-content-grid"><div hidden={locale === 'en'}>{text('subtitleTr','Alt başlık · Türkçe')}{text('descriptionTr','Açıklama · Türkçe',true)}{text('roleTr','Rol · Türkçe')}{text('outcomeTr','Doğrulanabilir sonuç · Türkçe',true)}{text('learningsTrInput','Öğrenimler · Türkçe (satır satır)',true)}</div><div hidden={locale === 'tr'}>{text('subtitleEn','Subtitle · English')}{text('descriptionEn','Description · English',true)}{text('roleEn','Role · English')}{text('outcomeEn','Verifiable outcome · English',true)}{text('learningsEnInput','Learnings · English (one per line)',true)}</div></div></>}
        {section === 'media' && (
            <div className="admin-media">
                <Field label="Kapak görseli URL’si" error={errors.image}>
                    <input type="url" value={form.image} onChange={(e) => set('image', e.target.value)} />
                </Field>
                <Field label="Yeni kapak yükle (16:9, en fazla 700 KB)">
                    <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
                </Field>
                {uploading > 0 && <p role="status">Görsel işleniyor…</p>}
                {form.image && <img src={form.image} alt="Kapak önizlemesi" className="admin-cover-preview" />}
            </div>
        )}
        {section === 'links' && <div className="admin-grid"><Field label="GitHub repo URL" error={errors.link}><input type="url" value={form.link} onChange={(e) => set('link', e.target.value)} /></Field><Field label="Canlı demo URL" error={errors.demoLink}><input type="url" value={form.demoLink} onChange={(e) => set('demoLink', e.target.value)} /></Field></div>}
        {section === 'advanced' && <div className="admin-grid"><Field label="ID" error={errors.id}><input inputMode="numeric" value={form.id} onChange={(e) => set('id', e.target.value)} /></Field><Field label="translationKey" error={errors.translationKey}><input value={form.translationKey} onChange={(e) => set('translationKey', e.target.value)} /></Field></div>}
        {preview && <Modal project={asProject(form)} previewLang={locale === 'en' ? 'en' : 'tr'} onClose={() => setPreview(false)} />}
        <footer className="admin-action-bar">
            <div className="admin-action-main"><button className="btn admin-secondary" type="button" onClick={() => setPreview(true)}>{locale === 'en' ? 'EN önizle' : 'TR önizle'}</button><button className="btn admin-secondary" disabled={saving || uploading > 0}>{saving ? 'Kaydediliyor…' : 'Taslak kaydet'}</button><button className="btn primary" type="button" disabled={saving || uploading > 0} onClick={() => submit(true)}>{form.published ? 'Yayını güncelle' : 'Yayınla'}</button>{form.published && <button className="btn admin-secondary" type="button" onClick={() => submit(false)}>Yayından kaldır</button>}</div>
            {project && !project.isNew && <div className="admin-action-danger">{confirmDelete ? <div className="admin-delete-confirm" role="alertdialog" aria-label="Kalıcı silme onayı"><span>Kalıcı silmek için <strong>{project.title}</strong> yazın.</span><input value={deleteTitle} onChange={(event) => setDeleteTitle(event.target.value)} aria-label="Proje başlığıyla silmeyi onayla" /><button type="button" className="admin-delete" disabled={deleteTitle !== project.title} onClick={() => remove(project)}>Kalıcı sil</button><button type="button" className="btn ghost" onClick={() => { setConfirmDelete(false); setDeleteTitle(''); }}>Vazgeç</button></div> : <button type="button" className="admin-delete-link" onClick={() => setConfirmDelete(true)}>Kalıcı sil</button>}</div>}
        </footer></form></section>;
}

export default function Admin() {
    const navigate = useNavigate(); const [user, setUser] = useState(null); const [authLoading, setAuthLoading] = useState(true); const [loading, setLoading] = useState(false); const [projects, setProjects] = useState([]); const [selected, setSelected] = useState(null); const [loadError, setLoadError] = useState(''); const [status, setStatus] = useState(null); const [showArchived, setShowArchived] = useState(false); const [ordering, setOrdering] = useState(false); const [orderDirty, setOrderDirty] = useState(false);
    const dragSessionRef = useRef(null); const dragPreviewRef = useRef(null); const dragFrameRef = useRef(null); const [draggingId, setDraggingId] = useState(null); const [dragTargetIndex, setDragTargetIndex] = useState(null); const [dragLayout, setDragLayout] = useState(null); const [dragPosition, setDragPosition] = useState(null);
    const notice = (message, error = false) => setStatus({ message, error }); const load = async () => { setLoading(true); setLoadError(''); const result = await projectService.getProjects({ admin: true, includeArchived: true }); if (result.ok) setProjects(result.projects); else setLoadError(result.error); setLoading(false); };
    useEffect(() => { if (!isFirebaseConfigured) return undefined; return onAuthStateChanged(auth, (current) => { setUser(current); setAuthLoading(false); if (current) load(); }); }, []);
    const login = async (email, password) => { setAuthLoading(true); try { await signInWithEmailAndPassword(auth, email, password); } catch { notice('Giriş başarısız. E-posta veya şifreyi kontrol edin.', true); setAuthLoading(false); } };
    const upsert = (saved) => setProjects((list) => { const i = list.findIndex((x) => String(x.id) === String(saved.id)); return i < 0 ? [...list, saved] : list.map((x, index) => index === i ? saved : x); });
    const archive = async (project) => { if (!window.confirm(`“${project.title}” arşivlensin mi?`)) return; try { await projectService.setArchived(project.id, true); setProjects((list) => list.map((x) => x.id === project.id ? { ...x, archived: true } : x)); notice('Proje arşivlendi.'); } catch (error) { notice(`Arşivleme başarısız: ${error.message}`, true); } };
    const erase = async (project) => { try { await projectService.deleteProject(project.id); setProjects((list) => list.filter((x) => x.id !== project.id)); setSelected(null); notice('Proje kalıcı olarak silindi.'); } catch (error) { notice(`Silme başarısız: ${error.message}`, true); } };
    const move = (projectId, targetId) => { setProjects((list) => { const next = [...list]; const index = next.findIndex((item) => String(item.id) === String(projectId)); const targetIndex = next.findIndex((item) => String(item.id) === String(targetId)); if (index < 0 || targetIndex < 0 || index === targetIndex) return list; const [moved] = next.splice(index, 1); next.splice(targetIndex, 0, moved); return next; }); setOrderDirty(true); };
    const finishProjectDrag = (commit = false) => {
        const session = dragSessionRef.current;
        if (!session) return;
        dragSessionRef.current = null;
        session.cleanup();
        if (commit && session.targetIndex !== session.originalIndex) {
            setProjects((list) => {
                const next = [...list];
                const currentIndex = next.findIndex((item) => String(item.id) === session.projectId);
                const targetId = session.rowIds[session.targetIndex];
                const targetIndex = next.findIndex((item) => String(item.id) === targetId);
                if (currentIndex < 0 || targetIndex < 0 || currentIndex === targetIndex) return list;
                const [moved] = next.splice(currentIndex, 1);
                next.splice(targetIndex, 0, moved);
                return next;
            });
            setOrderDirty(true);
        }
        setDraggingId(null);
        setDragTargetIndex(null);
        setDragLayout(null);
        setDragPosition(null);
    };
    const updateProjectDrag = () => {
        dragFrameRef.current = null;
        const session = dragSessionRef.current;
        if (!session) return;
        const { clientX, clientY } = session.pointer;
        if (dragPreviewRef.current) dragPreviewRef.current.style.transform = `translate3d(${clientX - session.offsetX}px, ${clientY - session.offsetY}px, 0)`;
        const scrollDelta = window.scrollY - session.startScrollY;
        let nextIndex = 0;
        session.centers.forEach((center, index) => { if (clientY > center - scrollDelta) nextIndex = index; });
        if (nextIndex !== session.targetIndex) {
            session.targetIndex = nextIndex;
            setDragTargetIndex(nextIndex);
        }
        const scrollSpeed = clientY < 88 ? -14 : clientY > window.innerHeight - 64 ? 14 : 0;
        if (scrollSpeed) {
            const before = window.scrollY;
            window.scrollBy(0, scrollSpeed);
            if (window.scrollY !== before) dragFrameRef.current = requestAnimationFrame(updateProjectDrag);
        }
    };
    const startProjectDrag = (event, projectId) => {
        if (!ordering || event.button !== 0 || dragSessionRef.current) return;
        event.preventDefault();
        const handle = event.currentTarget;
        const row = handle.closest('[data-project-id]');
        const rows = [...row.parentElement.querySelectorAll('[data-project-id]')];
        const rowIds = rows.map((item) => item.dataset.projectId);
        const projectKey = String(projectId);
        const originalIndex = rowIds.indexOf(projectKey);
        const rect = row.getBoundingClientRect();
        const pointer = { clientX: event.clientX, clientY: event.clientY };
        const onMove = (pointerEvent) => {
            const session = dragSessionRef.current;
            if (!session || pointerEvent.pointerId !== session.pointerId) return;
            pointerEvent.preventDefault();
            session.pointer = { clientX: pointerEvent.clientX, clientY: pointerEvent.clientY };
            if (!dragFrameRef.current) dragFrameRef.current = requestAnimationFrame(updateProjectDrag);
        };
        const onEnd = (pointerEvent) => {
            const session = dragSessionRef.current;
            if (!session || pointerEvent.pointerId !== session.pointerId) return;
            finishProjectDrag(pointerEvent.type === 'pointerup');
        };
        const onKeyDown = (keyEvent) => { if (keyEvent.key === 'Escape') finishProjectDrag(false); };
        const onBlur = () => finishProjectDrag(false);
        const onLostCapture = () => finishProjectDrag(false);
        const onVisibilityChange = () => { if (document.hidden) finishProjectDrag(false); };
        const cleanup = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onEnd);
            window.removeEventListener('pointercancel', onEnd);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('blur', onBlur);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            handle.removeEventListener('lostpointercapture', onLostCapture);
            if (dragFrameRef.current) cancelAnimationFrame(dragFrameRef.current);
            dragFrameRef.current = null;
            document.body.classList.remove('admin-drag-active');
            if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        };
        dragSessionRef.current = { projectId: projectKey, pointerId: event.pointerId, originalIndex, targetIndex: originalIndex, rowIds, centers: rows.map((item) => { const itemRect = item.getBoundingClientRect(); return itemRect.top + itemRect.height / 2; }), draggedHeight: rect.height, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, startScrollY: window.scrollY, pointer, cleanup };
        window.addEventListener('pointermove', onMove, { passive: false });
        window.addEventListener('pointerup', onEnd);
        window.addEventListener('pointercancel', onEnd);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('blur', onBlur);
        document.addEventListener('visibilitychange', onVisibilityChange);
        handle.addEventListener('lostpointercapture', onLostCapture);
        document.body.classList.add('admin-drag-active');
        setDraggingId(projectKey);
        setDragTargetIndex(originalIndex);
        setDragLayout({ originalIndex, draggedHeight: rect.height });
        setDragPosition({ left: rect.left, top: rect.top, width: rect.width });
        handle.setPointerCapture?.(event.pointerId);
    };
    useEffect(() => () => dragSessionRef.current?.cleanup(), []);
    const saveOrder = async () => { try { await projectService.updateProjectsOrder(projects); setOrderDirty(false); notice('Sıralama kaydedildi.'); } catch (error) { notice(`Sıralama kaydedilemedi: ${error.message}`, true); load(); } };
    if (!isFirebaseConfigured) return <main className="container admin-auth"><section className="metadata-card admin-auth-card"><h1 className="page-title">Firebase yapılandırılmamış</h1><p>Yönetim paneli için gerekli VITE_FIREBASE değişkenleri eksik.</p><button className="btn" onClick={() => navigate('/projects')}>Projelere dön</button></section></main>;
    if (authLoading && !user) return <main className="container admin-loading" role="status">Yükleniyor…</main>;
    if (!user) return <Login login={login} error={status?.error ? status.message : ''} loading={authLoading} />;
    const visible = projects.filter((p) => showArchived || !p.archived);
    const liveCount = projects.filter((p) => p.published && !p.archived).length;
    const draftCount = projects.filter((p) => !p.published && !p.archived).length;
    const archivedCount = projects.filter((p) => p.archived).length;
    const incompleteCount = projects.filter((p) => !p.subtitleTr || !p.subtitleEn || !p.descriptionTr || !p.descriptionEn).length;
    const header = <header className="admin-header"><div><span className="admin-eyebrow">Portfolyo yönetimi</span><h1 className="page-title">Proje Paneli</h1><p className="page-subtitle">İçerikleri düzenle, önizle ve yayın durumunu yönet.</p></div><div className="admin-header-actions"><button className="btn primary" onClick={() => setSelected({ isNew: true })} disabled={Boolean(loadError)}>+ Yeni proje</button><button className="btn admin-secondary" onClick={() => signOut(auth)}>Çıkış yap</button></div></header>;
    const draggedProject = projects.find((project) => String(project.id) === draggingId);
    const toast = <>{status && <div className={`admin-toast ${status.error ? 'error' : ''}`} role={status.error ? 'alert' : 'status'}>{status.message}</div>}{draggedProject && dragPosition && <DragPreview project={draggedProject} position={dragPosition} previewRef={dragPreviewRef} />}</>;

    if (selected) return <main className="container admin-page" aria-busy={loading}>{toast}{header}<section className="admin-workspace editing"><aside className="admin-list-pane" aria-label="Proje listesi"><div className="admin-pane-heading"><h2>Projeler</h2><span>{visible.length}</span></div>{visible.map((project) => <button type="button" className={`admin-project-picker ${project.id === selected.id ? 'active' : ''}`} onClick={() => setSelected(project)} key={project.id}><ProjectThumbnail project={project} compact /><span className="admin-picker-copy"><strong>{project.title}</strong><small>{project.published ? 'Yayında' : 'Taslak'}</small></span></button>)}</aside><Editor project={selected.isNew ? null : selected} projects={projects} close={() => setSelected(null)} saved={upsert} notice={notice} remove={erase} /></section></main>;

    return <main className="container admin-page" aria-busy={loading}>{toast}{header}{loadError ? <section className="admin-error-panel" role="alert"><p>Projeler yüklenemedi: {loadError}</p><button className="btn admin-secondary" onClick={load}>Yeniden dene</button></section> : <><section className="admin-overview" aria-label="Proje özeti"><div><strong>{projects.length}</strong><span>Toplam proje</span></div><div><strong>{liveCount}</strong><span>Yayında</span></div><div><strong>{draftCount}</strong><span>Taslak</span></div><div><strong>{archivedCount}</strong><span>Arşivde</span></div><div className={incompleteCount ? 'attention' : ''}><strong>{incompleteCount}</strong><span>İçeriği eksik</span></div></section><section className="admin-list-panel"><div className="admin-list-heading"><div><span className="admin-eyebrow">İçerik kataloğu</span><h2>Projeler</h2></div><div className="admin-list-tools"><button className={`btn admin-secondary ${showArchived ? 'active' : ''}`} onClick={() => setShowArchived((v) => !v)}>{showArchived ? 'Arşivleri gizle' : 'Arşivleri göster'}</button><button className={`btn admin-secondary ${ordering ? 'active' : ''}`} onClick={() => { setOrdering((v) => !v); setShowArchived(true); finishProjectDrag(); }}>{ordering ? 'Sıralamayı kapat' : 'Sıralama modu'}</button>{ordering && orderDirty && <button className="btn primary" onClick={saveOrder}>Sıralamayı kaydet</button>}</div></div>{ordering && <p className="admin-order-hint" role="status">Tutamacı basılı tutup projeyi istediğiniz konuma sürükleyin. İmleç liste dışına çıksa da sürükleme devam eder; vazgeçmek için Esc’e basın. Klavye için ok düğmelerini kullanabilirsiniz.</p>}<div className={`admin-list ${draggingId ? 'is-dragging' : ''}`}>{loading ? <p className="admin-empty" role="status">Projeler yükleniyor…</p> : visible.length === 0 ? <p className="admin-empty">{showArchived ? 'Arşivde proje yok.' : 'Proje yok.'}</p> : visible.map((project, index) => { const complete = project.subtitleTr && project.subtitleEn && project.descriptionTr && project.descriptionEn; const projectId = String(project.id); let dragShift = 0; if (dragLayout && index !== dragLayout.originalIndex) { if (dragLayout.originalIndex < dragTargetIndex && index > dragLayout.originalIndex && index <= dragTargetIndex) dragShift = -dragLayout.draggedHeight; if (dragLayout.originalIndex > dragTargetIndex && index >= dragTargetIndex && index < dragLayout.originalIndex) dragShift = dragLayout.draggedHeight; } return <article className={`admin-project-row ${ordering ? 'ordering' : ''} ${draggingId === projectId ? 'dragging' : ''} ${dragShift ? 'drag-shifted' : ''}`} style={dragShift ? { transform: `translate3d(0, ${dragShift}px, 0)` } : undefined} data-project-id={projectId} key={project.id}>{ordering && <button type="button" className="admin-drag-handle" aria-label={`${project.title} projesini basılı tutup sürükleyerek sırala`} data-dragging={draggingId === projectId || undefined} onPointerDown={(event) => startProjectDrag(event, project.id)}><span aria-hidden="true">⠿</span></button>}<ProjectThumbnail project={project} /><div className="admin-project-copy"><div className="admin-project-title"><strong>{project.title}</strong><PublishBadge project={project} /></div><span>{project.category || 'Other'} · {project.status}</span><small className={complete ? '' : 'incomplete'}>TR/EN içerik {complete ? 'tamam' : 'eksik'}</small></div>{ordering && <div className="admin-order-actions"><button className="admin-icon-button" aria-label={`${project.title} yukarı taşı`} disabled={index === 0} onClick={() => move(project.id, visible[index - 1].id)}>↑</button><button className="admin-icon-button" aria-label={`${project.title} aşağı taşı`} disabled={index === visible.length - 1} onClick={() => move(project.id, visible[index + 1].id)}>↓</button></div>}<div className="admin-row-actions"><button className="btn admin-secondary" onClick={() => setSelected(project)}>Düzenle</button>{!project.archived && <button className="btn admin-secondary" onClick={() => archive(project)}>Arşivle</button>}<button className="btn admin-danger-secondary" onClick={() => setSelected(project)}>Sil…</button></div></article>; })}</div></section></>}</main>;
}
