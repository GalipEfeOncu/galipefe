import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const STEPS = ['research', 'build', 'orchestrate', 'review', 'deliver'];

export default function AgentWorkflow() {
    const { t } = useLanguage();
    const [activeStep, setActiveStep] = useState('research');

    return (
        <section className="agent-workflow" aria-label={t('agentWorkflow.label')}>
            <div className="agent-workflow-header">
                <div>
                    <span className="agent-workflow-eyebrow">{t('agentWorkflow.eyebrow')}</span>
                    <h3>{t('agentWorkflow.title')}</h3>
                </div>
                <span className="agent-workflow-state">{t('agentWorkflow.state')}</span>
            </div>

            <div className="agent-workflow-steps" aria-label={t('agentWorkflow.label')}>
                {STEPS.map((step, index) => (
                    <button
                        key={step}
                        type="button"
                        aria-pressed={activeStep === step}
                        className={`agent-workflow-step ${activeStep === step ? 'active' : ''}`}
                        onClick={() => setActiveStep(step)}
                    >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {t(`agentWorkflow.steps.${step}.label`)}
                    </button>
                ))}
            </div>

            <div className="agent-workflow-output" role="region" aria-live="polite" aria-label={t('agentWorkflow.outputLabel')}>
                <span className="agent-workflow-output-label">{t('agentWorkflow.outputLabel')}</span>
                <strong>{t(`agentWorkflow.steps.${activeStep}.title`)}</strong>
                <p>{t(`agentWorkflow.steps.${activeStep}.desc`)}</p>
            </div>
        </section>
    );
}
