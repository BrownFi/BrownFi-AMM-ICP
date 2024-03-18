import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { InternetIdentityProvider } from "ic-use-internet-identity";
import App from "./App";
import ThemeProvider from "./theme";
import { HashRouter } from "react-router-dom";
import { ActorManagersContext } from "./hooks/useActorManagers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <InternetIdentityProvider>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
    </InternetIdentityProvider>
  </StrictMode>
);
