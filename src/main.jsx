import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './styles/design-system.css';
import './index.css';
import { localeFromPath } from './utils/localePath.js';

const rootElement = document.getElementById('root');
const prerenderElement = document.getElementById('portfolio-prerender-data');
const prerenderData = prerenderElement ? JSON.parse(prerenderElement.textContent) : undefined;
const isStaticNotFoundPage = prerenderElement?.dataset.staticStatus === '404';
const pathLanguage = localeFromPath(window.location.pathname);

const application = (
  <React.StrictMode>
    <BrowserRouter basename={pathLanguage === 'tr' ? '/tr' : '/'}>
      <LanguageProvider initialLanguage={pathLanguage}>
        <App prerenderData={prerenderData} />
        <Analytics />
        <SpeedInsights />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes() && !isStaticNotFoundPage) {
  hydrateRoot(rootElement, application);
} else {
  createRoot(rootElement).render(application);
}
