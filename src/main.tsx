import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter
} from "react-router-dom";
import './index.css'

import { AuthProvider } from './providers/auth';
import App from './App';
import { StationsProvider } from './providers/database';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <StationsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StationsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
