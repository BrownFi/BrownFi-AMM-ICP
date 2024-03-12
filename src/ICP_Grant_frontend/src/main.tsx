import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from './theme';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter> 
        <App /> 
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);