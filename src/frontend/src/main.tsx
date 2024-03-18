import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./theme";
import { HashRouter } from "react-router-dom";
import { AgentProvider } from "@ic-reactor/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <AgentProvider>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
    </AgentProvider>
  </StrictMode>
);
