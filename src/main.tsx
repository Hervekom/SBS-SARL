import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { inject } from '@vercel/analytics';

// Statistiques de visite Vercel (à activer dans l'onglet Analytics du projet)
inject();

createRoot(document.getElementById('root')!).render(<App />);
