import { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";
import ThemeProvider, { FixedGlobalStyle } from "./theme";
import { HashRouter } from "react-router-dom";
import { AgentProvider } from "@ic-reactor/react";
import "./index.css";

const root = document.getElementById("root");
render(
  <StrictMode>
    <FixedGlobalStyle />
    <AgentProvider>
      <ThemeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </AgentProvider>
  </StrictMode>,
  root
);
