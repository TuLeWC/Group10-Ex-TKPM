import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n.js';

import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StudentProvider } from './contexts/StudentContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentProvider>
      <App />
    </StudentProvider>
  </StrictMode>
);
