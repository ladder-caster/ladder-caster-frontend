import React from 'react';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import 'core/language/i18n';
import { createBrowserHistory } from 'history';
import { createRoot } from 'react-dom/client';

const history = createBrowserHistory();

const app = (
  <Router history={history}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Router>
);

const domNode = document.getElementById('app');
const root = createRoot(domNode);

root.render(app);
