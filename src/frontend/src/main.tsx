import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "./theme";
import { HashRouter } from "react-router-dom";
import { AgentProvider } from "@ic-reactor/react";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <FixedGlobalStyle />
    <AgentProvider>
      <ThemeProvider>
        <ThemedGlobalStyle />
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </AgentProvider>
  </StrictMode>
);
