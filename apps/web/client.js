import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(app, document.getElementById('app'));
