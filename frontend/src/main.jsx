import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// --- CAMBIO: Importar el Proveedor ---
import { AccessibilityProvider } from "./context/AccessibilityContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* --- CAMBIO: Envolver App --- */}
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
