import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import { HelmetProvider, HelmetData } from 'react-helmet-async';
const helmetContext = {};
// React application rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

createRoot(rootElement!).render(

  
 

 <StrictMode>
  <HelmetProvider context={helmetContext}>
    <App />
    </HelmetProvider>  
 </StrictMode>


);
