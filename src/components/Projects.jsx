import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';

function StatusBadge({ status }) {
    const cls = status === 'Completed' ? 'completed' : status === 'Discontinued' ? 'disc' : 'wip';
    return (
        <span className={`status ${cls}`}>
            <span className="led" />
            {status}
        </span>
    );
}

function ProjectImage({ project, height = 140, style = {} }) {
    const [failed, setFailed] = useState(false);
    if (project.image && !failed) {
        return (
            <img
                src={project.image}
                alt={project.title}
                onError={() => setFailed(true)}
                style={{ width: '100%', height, objectFit: 'cover', display: 'block', ...style }}
            />
        );
    }
    return (
        <div className="sketchy-img" style={{ height, borderRadius: 0, border: 'none', ...style }}>
            [{project.icon || '◇'} {project.title}]
        </div>
    );
}

export default function Projects({ onOpenModal }) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');

    const filters = [
        { key: 'All', label: t('projects.filters.all'), count: projects.length },
        { key: 'Completed', label: t('projects.filters.completed'), count: projects.filter(p => p.status === 'Completed').length },
        { key: 'Work in Progress', label: t('projects.filters.wip'), count: projects.filter(p => p.status === 'Work in Progress').length },
        { key: 'Discontinued', label: t('projects.filters.discontinued'), count: projects.filter(p => p.status === 'Discontinued').length },
    ];

    const list = filter === 'All' ? projects : projects.filter(p => p.status === filter);
    const featured = list[0];
    const rest = list.slice(1);

    const getSubtitle = (p) => t(`projectData.${p.translationKey}.subtitle`) || p.subtitle;
    const getDesc = (p) => t(`projectData.${p.translationKey}.desc`) || p.description;

    return (
        <div className="page">
            <div style={{ marginBottom: 20 }}>
                <div className="mono" style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.18em', marginBottom: 6 }}>~/projects</div>
                <h1 style={{ fontSize: 32, margin: 0, fontWeight: 700 }}>{t('projects.title')}</h1>
                <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>{t('projects.subtitle')}</p>
            </div>

            <div className="row" style={{ gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`pill ${filter === f.key ? 'accent' : ''}`}
                        style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}
                        aria-pressed={filter === f.key}
                    >
                        {f.label}
                        <span className="muted" style={{ marginLeft: 4, fontSize: 10 }}>{f.count}</span>
                    </button>
                ))}
                <span style={{ flex: 1 }} />
                <span className="mono muted" style={{ fontSize: 11 }}>{t('projects.sortLabel')}</span>
            </div>

            {featured && (
                <button
                    className="panel proj-featured"
                    onClick={() => onOpenModal(featured)}
                    style={{ marginBottom: 18, cursor: 'pointer', width: '100%', border: 'none', padding: 0, display: 'block', background: 'none', font: 'inherit', color: 'inherit' }}
                    aria-label={`${featured.title} - ${t('projects.viewDetails')}`}
                >
                    <span className="projects-featured-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', width: '100%', textAlign: 'left' }}>
                        <span className="projects-featured-img" style={{ borderRight: '1px solid var(--border-soft)' }}>
                            <ProjectImage project={featured} height={280} style={{ borderRadius: 0, border: 'none' }} />
                        </span>
                        <span style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em' }}>{t('projects.featuredLabel')}</span>
                            <span style={{ fontSize: 24, fontWeight: 600, display: 'block' }}>{featured.title}</span>
                            <span className="mono muted" style={{ fontSize: 12, display: 'block' }}>{getSubtitle(featured)}</span>
                            <span style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, margin: 0, display: 'block' }}>{getDesc(featured)}</span>
                            <span className="row" style={{ gap: 6, flexWrap: 'wrap', display: 'flex' }}>
                                {featured.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                            </span>
                            <span className="row" style={{ gap: 8, marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
                                <StatusBadge status={featured.status} />
                                <span style={{ flex: 1 }} />
                                <span className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>{t('projects.viewDetails')}</span>
                            </span>
                        </span>
                    </span>
                </button>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {rest.map(p => (
                    <button
                        key={p.id}
                        className="panel proj-card"
                        onClick={() => onOpenModal(p)}
                        style={{ cursor: 'pointer', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', width: '100%', background: 'none', font: 'inherit', color: 'inherit', textAlign: 'left' }}
                        aria-label={`${p.title} - ${t('projects.viewDetails')}`}
                    >
                        <span style={{ borderBottom: '1px solid var(--border-soft)', width: '100%', display: 'block' }}>
                            <ProjectImage project={p} height={140} />
                        </span>
                        <span style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, width: '100%', flex: 1 }}>
                            <span className="row" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{p.title}</span>
                                {p.icon && <span style={{ fontSize: 16 }}>{p.icon}</span>}
                            </span>
                            <span className="mono muted" style={{ fontSize: 11, display: 'block' }}>{getSubtitle(p)}</span>
                            <span className="row" style={{ gap: 4, flexWrap: 'wrap', marginTop: 4, display: 'flex' }}>
                                {p.tags.slice(0, 3).map(tag => <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>)}
                            </span>
                            <span style={{ marginTop: 8, display: 'block' }}><StatusBadge status={p.status} /></span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
