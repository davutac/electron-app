import "./assets/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

const APP_FONT = '1rem "Geist Variable"';

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const renderApp = (): void => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

const startApp = async (): Promise<void> => {
  try {
    await document.fonts.load(APP_FONT);
  } finally {
    renderApp();
  }
};

void startApp();
