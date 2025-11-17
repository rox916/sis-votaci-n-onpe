import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState("text-size-md");
  // --- CAMBIO: Renombrado a 'darkMode' ---
  const [darkMode, setDarkMode] = useState(false);
  // --- CAMBIO: Añadimos 'highlightLinks' ---
  const [highlightLinks, setHighlightLinks] = useState(false);

  useEffect(() => {
    const root = document.documentElement; 

    // 1. Maneja el tamaño de letra
    root.classList.remove("text-size-md", "text-size-lg", "text-size-xl");
    root.classList.add(fontSize);

    // --- CAMBIO: Usa la clase 'modo-oscuro' ---
    if (darkMode) {
      root.classList.add("modo-oscuro");
    } else {
      root.classList.remove("modo-oscuro");
    }

    // --- CAMBIO: Maneja 'highlight-links' ---
    if (highlightLinks) {
      root.classList.add("highlight-links");
    } else {
      root.classList.remove("highlight-links");
    }
    
  }, [fontSize, darkMode, highlightLinks]); // <-- Dependencias actualizadas

  const value = {
    fontSize,
    setFontSize,
    // --- CAMBIO: Renombrado ---
    darkMode,
    toggleDarkMode: () => setDarkMode((prev) => !prev),
    // --- CAMBIO: Añadido ---
    highlightLinks,
    toggleHighlightLinks: () => setHighlightLinks((prev) => !prev),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};