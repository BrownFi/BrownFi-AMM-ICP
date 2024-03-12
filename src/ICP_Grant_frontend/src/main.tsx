import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);