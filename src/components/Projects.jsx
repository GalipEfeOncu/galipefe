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
                    <span
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`pill ${filter === f.key ? 'accent' : ''}`}
                        style={{ cursor: 'pointer' }}
                    >
                        {f.label}
                        <span className="muted" style={{ marginLeft: 4, fontSize: 10 }}>{f.count}</span>
                    </span>
                ))}
                <span style={{ flex: 1 }} />
                <span className="mono muted" style={{ fontSize: 11 }}>{t('projects.sortLabel')}</span>
            </div>

            {featured && (
                <div className="panel proj-featured" onClick={() => onOpenModal(featured)} style={{ marginBottom: 18, cursor: 'pointer' }}>
                    <div className="projects-featured-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>
                        <div className="projects-featured-img" style={{ borderRight: '1px solid var(--border-soft)' }}>
                            <ProjectImage project={featured} height={280} style={{ borderRadius: 0, border: 'none' }} />
                        </div>
                        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <span className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em' }}>{t('projects.featuredLabel')}</span>
                            <div style={{ fontSize: 24, fontWeight: 600 }}>{featured.title}</div>
                            <div className="mono muted" style={{ fontSize: 12 }}>{getSubtitle(featured)}</div>
                            <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>{getDesc(featured)}</p>
                            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                                {featured.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                            </div>
                            <div className="row" style={{ gap: 8, marginTop: 'auto' }}>
                                <StatusBadge status={featured.status} />
                                <span style={{ flex: 1 }} />
                                <span className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>{t('projects.viewDetails')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {rest.map(p => (
                    <div key={p.id} className="panel proj-card" onClick={() => onOpenModal(p)} style={{ cursor: 'pointer' }}>
                        <div style={{ borderBottom: '1px solid var(--border-soft)' }}>
                            <ProjectImage project={p} height={140} />
                        </div>
                        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div className="row">
                                <div style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{p.title}</div>
                                {p.icon && <span style={{ fontSize: 16 }}>{p.icon}</span>}
                            </div>
                            <div className="mono muted" style={{ fontSize: 11 }}>{getSubtitle(p)}</div>
                            <div className="row" style={{ gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                                {p.tags.slice(0, 3).map(tag => <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>)}
                            </div>
                            <div style={{ marginTop: 8 }}><StatusBadge status={p.status} /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
