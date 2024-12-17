import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


// React application rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

createRoot(rootElement!).render(

  
 

 <StrictMode>
    <App />
 </StrictMode>


);
