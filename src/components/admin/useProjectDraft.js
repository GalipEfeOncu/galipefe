import { useEffect, useMemo, useState } from 'react';

const keyFor = (projectId) => `galipefe_admin_draft_${projectId}`;

export function useProjectDraft(initialForm, projectId) {
    const [form, setForm] = useState(initialForm);
    const [baseline, setBaseline] = useState(initialForm);

    useEffect(() => {
        const key = keyFor(projectId);
        try {
            const saved = window.localStorage.getItem(key);
            const next = saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm;
            setForm(next);
            setBaseline(initialForm);
        } catch {
            setForm(initialForm);
            setBaseline(initialForm);
        }
    // Switching records resets the draft. The parent memoizes its initial form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);

    useEffect(() => {
        if (!dirty) return undefined;
        try { window.localStorage.setItem(keyFor(projectId), JSON.stringify(form)); } catch { /* recovery is optional */ }
        const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty, form, projectId]);

    const markSaved = (savedForm = form) => {
        setBaseline(savedForm);
        try { window.localStorage.removeItem(keyFor(projectId)); } catch { /* no-op */ }
    };
    const discard = () => {
        setForm(baseline);
        try { window.localStorage.removeItem(keyFor(projectId)); } catch { /* no-op */ }
    };
    return { form, setForm, dirty, markSaved, discard };
}
