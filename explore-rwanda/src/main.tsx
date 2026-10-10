import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AccountProvider } from "./context/AccountContext";
import { I18nProvider } from "./context/I18nContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <AccountProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AccountProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
