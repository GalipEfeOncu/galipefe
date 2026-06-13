import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projects as staticProjects } from '../data/projects';
import { projectService } from '../services/projectService';
import useSEO from '../hooks/useSEO';

// Prefetch Modal chunk on first card hover to eliminate lazy-load delay
const prefetchModal = () => import('./Modal');
let modalPrefetched = false;

function StatusBadge({ status }) {
    const cls = status === 'Completed' ? 'completed' : status === 'Discontinued' ? 'disc' : 'wip';
    return (
        <span className={`status ${cls}`}>
            <span className="led" />
            {status}
        </span>
    );
}

function ProjectImage({ project, height = 140, className = '' }) {
    const [failed, setFailed] = useState(false);
    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                onError={() => setFailed(true)}
                className={className}
                loading="lazy"
                decoding="async"
                style={{ height, width: '100%', objectFit: 'cover', display: 'block' }}
            />
        );
    }
    return (
        <div className="sketchy-img" style={{ height, width: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            [{project.icon || '◇'} {project.title}]
        </div>
    );
}

export default function Projects({ onOpenModal }) {
    const { t, lang } = useLanguage();
    const [filter, setFilter] = useState('All');
    const [projectList, setProjectList] = useState(staticProjects);
    const [loading, setLoading] = useState(true);

    const handleCardMouseEnter = () => {
        if (!modalPrefetched) {
            modalPrefetched = true;
            prefetchModal();
        }
    };

    useSEO({ titleKey: 'projects.title', descriptionKey: 'seo.projectsDesc' });

    useEffect(() => {
        let active = true;
        async function fetchProjects() {
            setLoading(true);
            const data = await projectService.getProjects();
            if (active) {
                if (data && data.length > 0) {
                    setProjectList(data);
                } else {
                    setProjectList(staticProjects);
                }
                setLoading(false);
            }
        }
        fetchProjects();
        return () => { active = false; };
    }, []);

    const filters = [
        { key: 'All', label: t('projects.filters.all'), count: projectList.length },
        { key: 'Completed', label: t('projects.filters.completed'), count: projectList.filter(p => p.status === 'Completed').length },
        { key: 'Work in Progress', label: t('projects.filters.wip'), count: projectList.filter(p => p.status === 'Work in Progress').length },
        { key: 'Discontinued', label: t('projects.filters.discontinued'), count: projectList.filter(p => p.status === 'Discontinued').length },
    ];

    const list = filter === 'All' ? projectList : projectList.filter(p => p.status === filter);
    const featured = list[0];
    const rest = list.slice(1);

    const getSubtitle = (p) => {
        if (p.subtitleEn || p.subtitleTr) {
            return lang === 'tr' ? (p.subtitleTr || p.subtitle) : (p.subtitleEn || p.subtitle);
        }
        const key = `projectData.${p.translationKey}.subtitle`;
        const val = t(key);
        return val === key ? p.subtitle : val;
    };
    
    const getDesc = (p) => {
        if (p.descriptionEn || p.descriptionTr) {
            return lang === 'tr' ? (p.descriptionTr || p.description) : (p.descriptionEn || p.description);
        }
        const key = `projectData.${p.translationKey}.desc`;
        const val = t(key);
        return val === key ? p.description : val;
    };
    
    const getLearnings = (p) => {
        if (p.learningsEn || p.learningsTr) {
            const list = lang === 'tr' ? p.learningsTr : p.learningsEn;
            return Array.isArray(list) ? list : (p.learnings || []);
        }
        const key = `projectData.${p.translationKey}.learnings`;
        const val = t(key);
        return val === key ? (p.learnings || []) : val;
    };

    return (
        <div className="page projects-page-container container">
            <div className="page-header">
                <h1 className="page-title">{t('projects.title')}</h1>
                <p className="page-subtitle">{t('projects.subtitle')}</p>
            </div>

            <div className="projects-filters">
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`projects-filter-btn ${filter === f.key ? 'active' : ''}`}
                        aria-pressed={filter === f.key}
                    >
                        {f.label}
                        <span className="projects-filter-count">{f.count}</span>
                    </button>
                ))}
                <span style={{ flex: 1 }} />
                <span className="projects-sort">{t('projects.sortLabel')}</span>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 14 }}>
                    {lang === 'tr' ? 'Projeler yükleniyor...' : 'Loading projects...'}
                </div>
            ) : list.length === 0 ? (
                <div className="projects-empty">
                    <div className="projects-empty-icon">🔍</div>
                    <div className="projects-empty-title">{t('projects.emptyStateTitle')}</div>
                    <div className="projects-empty-desc">{t('projects.emptyStateDesc')}</div>
                </div>
            ) : (
                <>
                    {/* Featured Project - Enlarge Showcase Container */}
                    {featured && (
                        <div className="featured-project-container">
                            <div className="proj-featured-card">
                                
                                {/* Left Column: Title, Subtitle, Image Box, Buttons */}
                                <div className="proj-featured-left-col">
                                    <span className="proj-featured-label">{t('projects.featuredLabel')}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            <h2 className="proj-featured-title" style={{ fontSize: 28, margin: 0 }}>{featured.title}</h2>
                                            <StatusBadge status={featured.status} />
                                        </div>
                                        <span className="proj-featured-subtitle">{getSubtitle(featured)}</span>
                                    </div>
                                    
                                    {/* Image Box */}
                                    <div className="proj-featured-img-wrap">
                                        <ProjectImage 
                                            project={featured} 
                                            height="100%" 
                                            className="proj-featured-img" 
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="proj-featured-footer" style={{ border: 'none', padding: 0, marginTop: 4 }}>
                                        {featured.link && (
                                            <a 
                                                href={featured.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn"
                                                style={{ flex: 1 }}
                                            >
                                                {t('modal.repo')} ↗
                                            </a>
                                        )}
                                        {featured.demoLink && (
                                            <a 
                                                href={featured.demoLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn primary"
                                                style={{ flex: 1 }}
                                            >
                                                {t('modal.liveDemo')} ↗
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Description, Tags, Learnings */}
                                <div className="proj-featured-right-col">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <p className="proj-featured-desc" style={{ marginTop: 0 }}>{getDesc(featured)}</p>
                                    </div>

                                    <div className="proj-featured-tags">
                                        {featured.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    {/* Inline key learnings / takeaways showcase */}
                                    {getLearnings(featured).length > 0 && (
                                        <div className="proj-featured-learnings-box" style={{ marginTop: 0 }}>
                                            <span className="proj-featured-learnings-title">{t('modal.keyTakeaways')}</span>
                                            {getLearnings(featured).slice(0, 3).map((l, i) => (
                                                <div key={i} className="proj-featured-learning-item">
                                                    <span className="proj-featured-learning-num">{String(i + 1).padStart(2, '0')}</span>
                                                    <span>{l}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Standard Grid Cards */}
                    <div className="projects-grid">
                        {rest.map(p => (
                            <button
                                key={p.id}
                                className="proj-grid-card"
                                onClick={() => onOpenModal(p)}
                                onMouseEnter={handleCardMouseEnter}
                                aria-label={`${p.title} - ${t('projects.viewDetails')}`}
                            >
                                <span className="proj-grid-img-wrap">
                                    <ProjectImage 
                                        project={p} 
                                        height="100%" 
                                        className="proj-grid-img" 
                                    />
                                </span>
                                <span className="proj-grid-body">
                                    <span className="proj-grid-header">
                                        <span className="proj-grid-title">{p.title}</span>
                                        {p.icon && <span className="proj-grid-icon">{p.icon}</span>}
                                    </span>
                                    <span className="proj-grid-subtitle">{getSubtitle(p)}</span>
                                    <span className="proj-grid-tags">
                                        {p.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </span>
                                    <span className="proj-grid-footer">
                                        <StatusBadge status={p.status} />
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
