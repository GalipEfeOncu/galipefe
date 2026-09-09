import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getProjectContent } from '../utils/projectContent';
import useSEO from '../hooks/useSEO';

// Prefetch Modal chunk on first card hover to eliminate lazy-load delay
const prefetchModal = () => import('./Modal');
let modalPrefetched = false;
const PROJECT_CACHE_KEY = 'galipefe_projects_cache_v1';
const CATEGORY_KEYS = ['AI/Automation', 'Web', 'Games', 'Tools', 'Other'];

function getCategory(project) {
    return CATEGORY_KEYS.includes(project.category) ? project.category : 'Other';
}

function readCachedProjects() {
    try {
        const value = window.localStorage.getItem(PROJECT_CACHE_KEY);
        const projects = value ? JSON.parse(value) : [];
        return Array.isArray(projects) ? projects : [];
    } catch {
        return [];
    }
}

function StatusBadge({ status }) {
    const { t } = useLanguage();
    const cls = status === 'Completed' ? 'completed' : status === 'Discontinued' ? 'disc' : 'wip';
    const label = t(
        status === 'Completed'
            ? 'projects.filters.completed'
            : status === 'Discontinued'
                ? 'projects.filters.discontinued'
                : 'projects.filters.wip'
    );
    return (
        <span className={`status ${cls}`}>
            <span className="led" />
            {label}
        </span>
    );
}

function ProjectImage({ project, height = 140, className = '', loading = 'lazy' }) {
    const [failed, setFailed] = useState(false);
    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                onError={() => setFailed(true)}
                className={className}
                loading={loading}
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
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('featured');
    const [projectList, setProjectList] = useState(readCachedProjects);
    const [loading, setLoading] = useState(() => readCachedProjects().length === 0);
    const [loadError, setLoadError] = useState(false);
    const [showStaleNotice, setShowStaleNotice] = useState(false);
    const isMounted = useRef(false);
    const projectListRef = useRef(projectList);

    useEffect(() => {
        projectListRef.current = projectList;
    }, [projectList]);

    const handleCardMouseEnter = () => {
        if (!modalPrefetched) {
            modalPrefetched = true;
            prefetchModal();
        }
    };

    useSEO({ titleKey: 'projects.title', descriptionKey: 'seo.projectsDesc' });

    const loadProjects = useCallback(async () => {
        if (isMounted.current) {
            setLoadError(false);
            setShowStaleNotice(false);
        }
        try {
            const { projectService } = await import('../services/projectService');
            const data = await projectService.getProjects();
            if (!isMounted.current) return;
            if (Array.isArray(data) && data.length > 0) {
                setProjectList(data);
                try {
                    window.localStorage.setItem(PROJECT_CACHE_KEY, JSON.stringify(data));
                } catch {
                    // Caching is a progressive enhancement; Firestore remains the source of truth.
                }
            } else if (Array.isArray(data)) {
                setProjectList([]);
                try {
                    window.localStorage.removeItem(PROJECT_CACHE_KEY);
                } catch {
                    // An unavailable cache must not affect the Firestore response.
                }
            } else {
                setLoadError(true);
                setShowStaleNotice(projectListRef.current.length > 0);
            }
        } catch {
            if (isMounted.current) {
                setLoadError(true);
                setShowStaleNotice(projectListRef.current.length > 0);
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        loadProjects();
        return () => { isMounted.current = false; };
    }, [loadProjects]); // Firestore is intentionally the only public project source.

    const categorizedList = categoryFilter === 'All'
        ? projectList
        : projectList.filter((project) => getCategory(project) === categoryFilter);
    const filters = [
        { key: 'All', label: t('projects.filters.all'), count: categorizedList.length },
        { key: 'Completed', label: t('projects.filters.completed'), count: categorizedList.filter(p => p.status === 'Completed').length },
        { key: 'Work in Progress', label: t('projects.filters.wip'), count: categorizedList.filter(p => p.status === 'Work in Progress').length },
        { key: 'Discontinued', label: t('projects.filters.discontinued'), count: categorizedList.filter(p => p.status === 'Discontinued').length },
    ];

    const filteredList = filter === 'All' ? categorizedList : categorizedList.filter(p => p.status === filter);
    const list = [...filteredList].sort((a, b) => {
        if (sortOrder === 'titleAsc') return a.title.localeCompare(b.title, lang);
        if (sortOrder === 'titleDesc') return b.title.localeCompare(a.title, lang);
        return 0;
    });
    const featured = list[0];
    const rest = list.slice(1);

    const getSubtitle = (p) => {
        return getProjectContent(p, lang).subtitle;
    };
    
    const getDesc = (p) => {
        return getProjectContent(p, lang).description;
    };
    
    const getLearnings = (p) => {
        return getProjectContent(p, lang).learnings;
    };

    const getRole = (p) => getProjectContent(p, lang).role;
    const getOutcome = (p) => getProjectContent(p, lang).outcome;

    return (
        <div className="page projects-page-container container">
            <div className="page-header">
                <h1 className="page-title">{t('projects.title')}</h1>
                <p className="page-subtitle">{t('projects.subtitle')}</p>
            </div>

            <div className="projects-filters">
                <div className="projects-category-filters" role="group" aria-label={t('projects.categoryLabel')}>
                    <button type="button" onClick={() => setCategoryFilter('All')} className={`projects-filter-btn ${categoryFilter === 'All' ? 'active' : ''}`} aria-pressed={categoryFilter === 'All'}>{t('projects.category.all')}</button>
                    {CATEGORY_KEYS.map((category) => (
                        <button key={category} type="button" onClick={() => setCategoryFilter(category)} className={`projects-filter-btn ${categoryFilter === category ? 'active' : ''}`} aria-pressed={categoryFilter === category}>{t(`projects.category.${category}`)}</button>
                    ))}
                </div>
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
                <span className="projects-filter-spacer" aria-hidden="true" />
                <label className="projects-sort-control">
                    <span>{t('projects.sortLabel')}</span>
                    <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                        <option value="featured">{t('projects.sort.featured')}</option>
                        <option value="titleAsc">{t('projects.sort.titleAsc')}</option>
                        <option value="titleDesc">{t('projects.sort.titleDesc')}</option>
                    </select>
                </label>
            </div>

            {showStaleNotice && (
                <div className="projects-stale-notice" role="status">
                    <span>{t('projects.staleNotice')}</span>
                    <button className="btn ghost" type="button" onClick={() => { setLoading(true); loadProjects(); }}>{t('projects.retry')}</button>
                </div>
            )}

            {loading ? (
                <div className="projects-skeleton" role="status" aria-live="polite">
                    <span className="sr-only">{t('projects.loading')}</span>
                    <span className="projects-skeleton-featured" />
                    <span className="projects-skeleton-grid"><span /><span /><span /></span>
                </div>
            ) : loadError && list.length === 0 ? (
                <div className="projects-empty" role="alert">
                    <div className="projects-empty-icon">!</div>
                    <div className="projects-empty-title">{t('projects.loadErrorTitle')}</div>
                    <div className="projects-empty-desc">{t('projects.loadErrorDesc')}</div>
                    <button className="btn" type="button" onClick={() => { setLoading(true); loadProjects(); }}>{t('projects.retry')}</button>
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
                                    {sortOrder === 'featured' && <span className="proj-featured-label">{t('projects.featuredLabel')}</span>}
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
                                            loading="eager"
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

                                    {(getRole(featured) || getOutcome(featured)) && (
                                        <div className="project-case-summary">
                                            {getRole(featured) && (
                                                <div>
                                                    <span>{t('modal.role')}</span>
                                                    <p>{getRole(featured)}</p>
                                                </div>
                                            )}
                                            {getOutcome(featured) && (
                                                <div>
                                                    <span>{t('modal.outcome')}</span>
                                                    <p>{getOutcome(featured)}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

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
                                        <span className="proj-grid-details">{t('projects.viewDetails')} →</span>
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
