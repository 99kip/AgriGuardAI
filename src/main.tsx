import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { FarmerProvider } from './context/FarmerContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <FarmerProvider>
          <App />
        </FarmerProvider>
      </AuthProvider>
    </SettingsProvider>
  </StrictMode>,
);
