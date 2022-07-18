import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import 'core/language/i18n';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const app = (
  <Router history={history}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Router>
);

const root = createRoot(document.getElementById('app'));
root.render(app);
