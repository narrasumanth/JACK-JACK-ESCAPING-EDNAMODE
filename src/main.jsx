import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MetaMaskProvider } from '@metamask/sdk-react-ui';

createRoot(document.getElementById('root')).render(
  <MetaMaskProvider>
    <App />
  </MetaMaskProvider>
);
