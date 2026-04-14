import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LinksProvider } from './context/LinksContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LinksProvider>
      <App />
    </LinksProvider>
  </StrictMode>,
);
