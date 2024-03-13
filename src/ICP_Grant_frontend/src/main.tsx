import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Actors from "./ic/Actors";
import { InternetIdentityProvider } from "ic-use-internet-identity";
import App from "./App";
import ThemeProvider from "./theme";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <InternetIdentityProvider>
      <Actors>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </Actors>
    </InternetIdentityProvider>
  </StrictMode>
);
