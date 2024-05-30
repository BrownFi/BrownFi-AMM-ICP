import { StrictMode } from "react";
import { render } from "react-dom";
import App from "./App";
import ThemeProvider, { FixedGlobalStyle } from "./theme";
import { HashRouter } from "react-router-dom";
import { AgentProvider, CandidAdapterProvider } from "@ic-reactor/react";
import { agentManger } from "./hooks/config";
import "./index.css";

const root = document.getElementById("root");
render(
  <StrictMode>
    <FixedGlobalStyle />
    <AgentProvider agentManager={agentManger}>
      <CandidAdapterProvider>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </CandidAdapterProvider>
    </AgentProvider>
  </StrictMode>,
  root
);
