import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { projectService } from '../services/projectService';
import { projects as staticProjects } from '../data/projects';

export default function Admin() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Auth Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    
    // Projects State
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [formState, setFormState] = useState(getEmptyFormState());
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setLoading(false);
            return;
        }
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadProjects();
            } else {
                setLoading(false);
            }
        });
        
        return () => unsubscribe();
    }, []);

    async function loadProjects() {
        setLoading(true);
        const data = await projectService.getProjects();
        if (data) {
            setProjects(data);
        } else {
            // If empty in DB, let's offer to seed with static projects
            setProjects([]);
        }
        setLoading(false);
    }

    async function seedDatabase() {
        if (!window.confirm('Bu işlem veritabanını localdeki projelerle dolduracaktır. Emin misiniz?')) return;
        setLoading(true);
        try {
            for (let i = 0; i < staticProjects.length; i++) {
                const proj = { ...staticProjects[i], order: i };
                await projectService.saveProject(proj);
            }
            showStatus('Veritabanı başarıyla dolduruldu!');
            loadProjects();
        } catch (error) {
            showStatus('Hata: ' + error.message, true);
            setLoading(false);
        }
    }

    function getEmptyFormState() {
        return {
            id: '',
            translationKey: '',
            title: '',
            subtitleEn: '',
            subtitleTr: '',
            status: 'Work in Progress',
            descriptionEn: '',
            descriptionTr: '',
            link: '',
            demoLink: '',
            image: '',
            icon: '',
            tagsInput: '',
            learningsEnInput: '',
            learningsTrInput: '',
        };
    }

    function showStatus(msg, isError = false) {
        setStatusMessage(`${isError ? '❌' : '✅'} ${msg}`);
        setTimeout(() => setStatusMessage(''), 5000);
    }

    // Login logic
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setAuthError('Giriş başarısız. E-posta veya şifre hatalı.');
            console.error('Login error:', error);
        }
        setLoading(false);
    };

    // Logout logic
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setProjects([]);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Image file handler with canvas compression
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await compressImage(file);
            setFormState(prev => ({ ...prev, image: base64 }));
            setImagePreview(base64);
        } catch (err) {
            console.error('Image compression failed:', err);
            alert('Resim yüklenemedi ve sıkıştırılamadı.');
        }
    };

    function compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    
                    // 16:9 Crop math
                    const targetRatio = 16 / 9;
                    let sourceX = 0;
                    let sourceY = 0;
                    let sourceWidth = img.width;
                    let sourceHeight = img.height;

                    if (img.width / img.height > targetRatio) {
                        // Image is wider than 16:9, crop sides
                        sourceWidth = img.height * targetRatio;
                        sourceX = (img.width - sourceWidth) / 2;
                    } else if (img.width / img.height < targetRatio) {
                        // Image is taller than 16:9, crop top and bottom
                        sourceHeight = img.width / targetRatio;
                        sourceY = (img.height - sourceHeight) / 2;
                    }

                    // Set target canvas resolution (max 1200px width)
                    const canvasWidth = Math.min(1200, sourceWidth);
                    const canvasHeight = Math.round(canvasWidth / targetRatio);

                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    const ctx = canvas.getContext('2d');
                    
                    // Enable high-quality image smoothing
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    
                    // Draw cropped portion onto target canvas
                    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvasWidth, canvasHeight);
                    
                    // Compress to WebP with 0.85 quality for extremely good visuals & low size.
                    // Fallback to JPEG if WebP is not supported by the browser.
                    let dataUrl = canvas.toDataURL('image/webp', 0.85);
                    if (!dataUrl.startsWith('data:image/webp')) {
                        dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    }
                    resolve(dataUrl);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    }

    // Move project in list to reorder
    const moveProject = async (index, direction) => {
        const newProjects = [...projects];
        const targetIndex = index + direction;
        
        if (targetIndex < 0 || targetIndex >= projects.length) return;
        
        // Swap elements
        const temp = newProjects[index];
        newProjects[index] = newProjects[targetIndex];
        newProjects[targetIndex] = temp;
        
        // Update local state first for instant UI response
        setProjects(newProjects);
        
        try {
            await projectService.updateProjectsOrder(newProjects);
            showStatus('Sıralama güncellendi!');
        } catch (error) {
            showStatus('Sıralama güncellenirken hata oluştu: ' + error.message, true);
            loadProjects(); // reload to correct state
        }
    };

    // Edit project select
    const startEdit = (proj) => {
        setEditingProject(proj);
        setFormState({
            id: proj.id || Date.now(),
            translationKey: proj.translationKey || '',
            title: proj.title || '',
            subtitleEn: proj.subtitleEn || proj.subtitle || '',
            subtitleTr: proj.subtitleTr || proj.subtitle || '',
            status: proj.status || 'Work in Progress',
            descriptionEn: proj.descriptionEn || proj.description || '',
            descriptionTr: proj.descriptionTr || proj.description || '',
            link: proj.link || '',
            demoLink: proj.demoLink || '',
            image: proj.image || '',
            icon: proj.icon || '',
            tagsInput: Array.isArray(proj.tags) ? proj.tags.join(', ') : '',
            learningsEnInput: Array.isArray(proj.learningsEn) ? proj.learningsEn.join('\n') : Array.isArray(proj.learnings) ? proj.learnings.join('\n') : '',
            learningsTrInput: Array.isArray(proj.learningsTr) ? proj.learningsTr.join('\n') : Array.isArray(proj.learnings) ? proj.learnings.join('\n') : '',
        });
        setImagePreview(proj.image || null);
    };

    const startCreate = () => {
        setEditingProject({ isNew: true });
        const nextId = projects.length > 0 ? Math.max(...projects.map(p => Number(p.id) || 0)) + 1 : 1;
        setFormState({
            ...getEmptyFormState(),
            id: nextId,
            translationKey: `proj_${nextId}`,
        });
        setImagePreview(null);
    };

    // Save project
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formState.title) return alert('Başlık zorunludur.');
        
        setIsSaving(true);
        
        const tags = formState.tagsInput
            ? formState.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
            : [];
            
        const learningsEn = formState.learningsEnInput
            ? formState.learningsEnInput.split('\n').map(l => l.trim()).filter(Boolean)
            : [];
            
        const learningsTr = formState.learningsTrInput
            ? formState.learningsTrInput.split('\n').map(l => l.trim()).filter(Boolean)
            : [];

        // Structure final project object
        const updatedProject = {
            id: Number(formState.id) || Date.now(),
            translationKey: formState.translationKey || `proj_${formState.id}`,
            title: formState.title,
            subtitle: formState.subtitleTr || formState.subtitleEn || '', // compatibility fallback
            subtitleEn: formState.subtitleEn,
            subtitleTr: formState.subtitleTr,
            status: formState.status,
            description: formState.descriptionTr || formState.descriptionEn || '', // compatibility fallback
            descriptionEn: formState.descriptionEn,
            descriptionTr: formState.descriptionTr,
            link: formState.link || null,
            demoLink: formState.demoLink || null,
            image: formState.image || null,
            icon: formState.icon || null,
            tags,
            learningsEn,
            learningsTr,
            learnings: learningsTr.length > 0 ? learningsTr : learningsEn // compatibility fallback
        };

        if (editingProject.isNew) {
            updatedProject.order = projects.length;
        } else {
            updatedProject.order = editingProject.order !== undefined ? editingProject.order : projects.indexOf(editingProject);
        }

        try {
            await projectService.saveProject(updatedProject);
            showStatus('Proje başarıyla kaydedildi!');
            setEditingProject(null);
            loadProjects();
        } catch (error) {
            showStatus('Kaydederken hata oluştu: ' + error.message, true);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete project
    const handleDelete = async (proj) => {
        if (!window.confirm(`"${proj.title}" projesini silmek istediğinize emin misiniz?`)) return;
        
        setLoading(true);
        try {
            await projectService.deleteProject(proj.id);
            showStatus('Proje silindi.');
            loadProjects();
        } catch (error) {
            showStatus('Proje silinemedi: ' + error.message, true);
            setLoading(false);
        }
    };

    // Firebase Not Configured fallback view
    if (!isFirebaseConfigured) {
        return (
            <div className="container" style={{ paddingTop: 120, paddingBottom: 100, maxWidth: 600 }}>
                <div className="metadata-card" style={{ gap: 16, border: '1px solid var(--accent-line)', background: 'var(--accent-soft)' }}>
                    <h2 className="proj-featured-title" style={{ color: 'var(--accent)' }}>Firebase Konfigüre Edilmemiş</h2>
                    <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                        Lütfen projenizin ana dizinindeki <code>.env</code> dosyasını oluşturun ve Firebase API anahtarlarını ekleyin.
                    </p>
                    <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 6, fontFamily: 'monospace', fontSize: 12, border: '1px solid var(--border)' }}>
                        VITE_FIREBASE_API_KEY=your_api_key<br />
                        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain<br />
                        VITE_FIREBASE_PROJECT_ID=your_project_id<br />
                        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket<br />
                        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id<br />
                        VITE_FIREBASE_APP_ID=your_app_id
                    </div>
                    <button onClick={() => navigate('/projects')} className="btn">
                        ← Projelere Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !user) {
        return (
            <div className="container" style={{ paddingTop: 150, textAlign: 'center', color: 'var(--muted)' }}>
                Yükleniyor...
            </div>
        );
    }

    // Login UI
    if (!user) {
        return (
            <div className="container" style={{ paddingTop: 140, paddingBottom: 100, display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
                <div className="metadata-card" style={{ width: '100%', maxWidth: 420, padding: 32, gap: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="page-title" style={{ fontSize: 32, marginBottom: 8 }}>Yönetim Girişi</h2>
                        <p className="page-subtitle" style={{ margin: 0 }}>Projeleri yönetmek için oturum açın</p>
                    </div>
                    
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>E-posta</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required
                                style={inputStyle}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-2)' }}>Şifre</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required
                                style={inputStyle}
                            />
                        </div>

                        {authError && <span style={{ color: 'var(--bad)', fontSize: 13, textAlign: 'center' }}>{authError}</span>}
                        
                        <button type="submit" className="btn primary" style={{ marginTop: 8 }}>
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main Dashboard & Editor UI
    return (
        <div className="container" style={{ paddingTop: 110, paddingBottom: 100, maxWidth: 1000 }}>
            {statusMessage && (
                <div style={{
                    position: 'fixed',
                    top: 24,
                    right: 24,
                    background: 'var(--panel)',
                    border: '1px solid var(--border)',
                    padding: '12px 24px',
                    borderRadius: 'var(--r)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 9999,
                    animation: 'pageFadeIn 0.3s ease'
                }}>
                    {statusMessage}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="page-title">Proje Paneli</h1>
                    <p className="page-subtitle">{user.email} (Yönetici Oturumu)</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    {projects.length === 0 && (
                        <button onClick={seedDatabase} className="btn">
                            🌱 Local Projeleri Aktar
                        </button>
                    )}
                    <button onClick={startCreate} className="btn primary">
                        ＋ Yeni Proje Ekle
                    </button>
                    <button onClick={handleLogout} className="btn ghost">
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Projeler yükleniyor...</div>
            ) : editingProject ? (
                // Add / Edit Form View
                <div className="metadata-card" style={{ padding: 32, gap: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                        <h2 className="proj-featured-title" style={{ fontSize: 24 }}>
                            {editingProject.isNew ? 'Yeni Proje Oluştur' : `Projeyi Düzenle: ${editingProject.title}`}
                        </h2>
                        <button onClick={() => setEditingProject(null)} className="btn ghost">Kapat</button>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={formRowStyle}>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Proje Başlığı *</label>
                                <input 
                                    type="text" 
                                    value={formState.title} 
                                    onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))} 
                                    required 
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Küçük Simge / Emoji (Örn: 🥂)</label>
                                <input 
                                    type="text" 
                                    value={formState.icon} 
                                    onChange={e => setFormState(prev => ({ ...prev, icon: e.target.value }))} 
                                    placeholder="Emoji"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Teknik Alt Başlık (İngilizce) *</label>
                                <input 
                                    type="text" 
                                    value={formState.subtitleEn} 
                                    onChange={e => setFormState(prev => ({ ...prev, subtitleEn: e.target.value }))} 
                                    placeholder="React & Vite / Web App"
                                    required 
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Teknik Alt Başlık (Türkçe) *</label>
                                <input 
                                    type="text" 
                                    value={formState.subtitleTr} 
                                    onChange={e => setFormState(prev => ({ ...prev, subtitleTr: e.target.value }))} 
                                    placeholder="React & Vite / Web Uygulaması"
                                    required 
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Durum</label>
                                <select 
                                    value={formState.status} 
                                    onChange={e => setFormState(prev => ({ ...prev, status: e.target.value }))}
                                    style={selectStyle}
                                >
                                    <option value="Completed">Completed (Tamamlandı)</option>
                                    <option value="Work in Progress">Work in Progress (Devam Ediyor)</option>
                                    <option value="Discontinued">Discontinued (Askıya Alındı)</option>
                                </select>
                            </div>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Translation Key (Gelişmiş)</label>
                                <input 
                                    type="text" 
                                    value={formState.translationKey} 
                                    onChange={e => setFormState(prev => ({ ...prev, translationKey: e.target.value }))} 
                                    required 
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formColStyle}>
                            <label style={labelStyle}>Teknoloji Etiketleri (Virgülle ayırın)</label>
                            <input 
                                type="text" 
                                value={formState.tagsInput} 
                                onChange={e => setFormState(prev => ({ ...prev, tagsInput: e.target.value }))} 
                                placeholder="React, Vite, Firebase, CSS"
                                style={inputStyle}
                            />
                        </div>

                        <div style={formColStyle}>
                            <label style={labelStyle}>Açıklama (İngilizce)</label>
                            <textarea 
                                value={formState.descriptionEn} 
                                onChange={e => setFormState(prev => ({ ...prev, descriptionEn: e.target.value }))} 
                                rows={4}
                                required
                                style={textareaStyle}
                            />
                        </div>

                        <div style={formColStyle}>
                            <label style={labelStyle}>Açıklama (Türkçe)</label>
                            <textarea 
                                value={formState.descriptionTr} 
                                onChange={e => setFormState(prev => ({ ...prev, descriptionTr: e.target.value }))} 
                                rows={4}
                                required
                                style={textareaStyle}
                            />
                        </div>

                        <div style={formRowStyle}>
                            <div style={formColStyle}>
                                <label style={labelStyle}>GitHub Repo Linki</label>
                                <input 
                                    type="url" 
                                    value={formState.link} 
                                    onChange={e => setFormState(prev => ({ ...prev, link: e.target.value }))} 
                                    placeholder="https://github.com/..."
                                    style={inputStyle}
                                />
                            </div>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Canlı Demo (Live) Linki</label>
                                <input 
                                    type="url" 
                                    value={formState.demoLink} 
                                    onChange={e => setFormState(prev => ({ ...prev, demoLink: e.target.value }))} 
                                    placeholder="https://..."
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Kapak Fotoğrafı Yükle</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    style={{ ...inputStyle, padding: '8px' }}
                                />
                            </div>
                            <div style={formColStyle}>
                                <label style={labelStyle}>Kapak Fotoğrafı URL'i (Alternatif)</label>
                                <input 
                                    type="text" 
                                    value={formState.image || ''} 
                                    onChange={e => {
                                        setFormState(prev => ({ ...prev, image: e.target.value }));
                                        setImagePreview(e.target.value);
                                    }} 
                                    placeholder="Yüklemek yerine doğrudan URL de yapıştırabilirsiniz"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {imagePreview && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={labelStyle}>Kapak Fotoğrafı Önizlemesi</label>
                                <img 
                                    src={imagePreview} 
                                    alt="Önizleme" 
                                    style={{ maxHeight: 150, maxWidth: 300, objectFit: 'cover', borderRadius: 'var(--r)', border: '1px solid var(--border)' }} 
                                />
                                <span style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>
                                    Sıkıştırılmış Boyut: {getImageSizeString(imagePreview)}
                                </span>
                            </div>
                        )}

                        <div style={formColStyle}>
                            <label style={labelStyle}>Neler Öğrendim (İngilizce) - Satır satır yazın</label>
                            <textarea 
                                value={formState.learningsEnInput} 
                                onChange={e => setFormState(prev => ({ ...prev, learningsEnInput: e.target.value }))} 
                                rows={4}
                                placeholder="Öğrenilen madde 1&#10;Öğrenilen madde 2"
                                style={textareaStyle}
                            />
                        </div>

                        <div style={formColStyle}>
                            <label style={labelStyle}>Neler Öğrendim (Türkçe) - Satır satır yazın</label>
                            <textarea 
                                value={formState.learningsTrInput} 
                                onChange={e => setFormState(prev => ({ ...prev, learningsTrInput: e.target.value }))} 
                                rows={4}
                                placeholder="Öğrenilen madde 1&#10;Öğrenilen madde 2"
                                style={textareaStyle}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                            <button type="button" onClick={() => setEditingProject(null)} className="btn">İptal</button>
                            <button type="submit" disabled={isSaving} className="btn primary">
                                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Dashboard Projects List View
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {projects.length === 0 ? (
                        <div className="metadata-card" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                            <p style={{ marginBottom: 16 }}>Henüz veritabanında hiçbir proje yok.</p>
                            <button onClick={seedDatabase} className="btn primary">🌱 Local Projeleri Aktararak Başla</button>
                        </div>
                    ) : (
                        projects.map((proj, idx) => (
                            <div key={proj.id} className="metadata-card" style={{
                                padding: '16px 24px',
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto',
                                alignItems: 'center',
                                gap: 20,
                                borderLeft: idx === 0 ? '4px solid var(--accent)' : '1px solid var(--border)'
                            }}>
                                {/* Reordering Controls */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <button 
                                        onClick={() => moveProject(idx, -1)} 
                                        disabled={idx === 0} 
                                        style={{ ...btnArrowStyle, opacity: idx === 0 ? 0.3 : 1 }}
                                        title="Yukarı Taşı"
                                    >
                                        ▲
                                    </button>
                                    <button 
                                        onClick={() => moveProject(idx, 1)} 
                                        disabled={idx === projects.length - 1} 
                                        style={{ ...btnArrowStyle, opacity: idx === projects.length - 1 ? 0.3 : 1 }}
                                        title="Aşağı Taşı"
                                    >
                                        ▼
                                    </button>
                                </div>

                                {/* Project Info */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                                            {proj.icon} {proj.title}
                                        </h3>
                                        {idx === 0 && (
                                            <span className="tag accent" style={{ fontSize: 10, padding: '2px 8px' }}>
                                                ★ FAVORİ PROJE
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                                        {proj.subtitleTr || proj.subtitle || 'Alt başlık girilmemiş'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={() => startEdit(proj)} className="btn">Düzenle</button>
                                    <button onClick={() => handleDelete(proj)} className="btn ghost" style={{ color: 'var(--bad)' }}>Sil</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// Helper to calculate and format base64 image size
function getImageSizeString(imageStr) {
    if (!imageStr) return '';
    if (imageStr.startsWith('http')) return 'Uzak Görsel (URL)';
    try {
        const base64Content = imageStr.split(',')[1] || '';
        const sizeInBytes = Math.floor((base64Content.length * 3) / 4);
        const sizeInKB = (sizeInBytes / 1024).toFixed(1);
        if (sizeInBytes > 1024 * 1024) {
            return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB ⚠️ (Firestore 1MB limitini aşıyor!)`;
        }
        if (sizeInBytes > 800 * 1024) {
            return `${sizeInKB} KB ⚠️ (Firestore 1MB limitine çok yakın!)`;
        }
        return `${sizeInKB} KB`;
    } catch {
        return '';
    }
}

// Styling Constants
const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    color: 'var(--text)',
    padding: '12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--sans)',
    transition: 'border-color 0.2s',
};

const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
};

const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
};

const formColStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: '100%',
};

const labelStyle = {
    fontSize: '12px',
    fontFamily: 'var(--mono)',
    color: 'var(--text-2)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const btnArrowStyle = {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '14px',
    padding: '4px 8px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
