import { useState } from "react";
// --- 1. CAMBIO: Importamos 'Link' y 'NavLink' ---
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Vote, Shield, Accessibility, Baseline, Moon, Eye as DaltonismIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "../context/AccessibilityContext";

import logoAnimado from "../assets/logos/logo-animado.gif";

// (Las variables de animación 'logoText', 'textContainerVariants', etc., se quedan igual)
const logoText = "SIVOP 2026";

const textContainerVariants = {
  hover: {
    transition: { staggerChildren: 0.05 },
  },
  initial: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const letterVariants = {
  initial: { y: 0 },
  hover: {
    y: -6,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  
  const { 
    fontSize, setFontSize, 
    darkMode, toggleDarkMode,
    highlightLinks, toggleHighlightLinks 
  } = useAccessibility();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAccessibilityOpen(false); 
  };

  const toggleAccessibilityMenu = () => {
    setIsAccessibilityOpen(!isAccessibilityOpen);
    setIsMenuOpen(false); 
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsAccessibilityOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50 border-b border-blue-100">
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* (El bloque del logo animado no cambia) */}
          <motion.div
            initial="initial"
            whileHover="hover"
          >
            <Link to="/" className="flex items-center gap-3">
              <motion.div 
                className="relative h-14 w-14 flex items-center justify-center border-l-4 border-blue-600 pl-2"
                variants={{ 
                  initial: { scale: 1, rotate: 0 }, 
                  hover: { scale: 1.1, rotate: -5 } 
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={logoAnimado} alt="Logo SIVOP Animado" className="h-full w-auto object-contain" />
              </motion.div>
              <div className="flex flex-col justify-center overflow-hidden">
                <motion.div 
                  className="flex"
                  variants={textContainerVariants}
                  aria-hidden="true"
                >
                  {logoText.split("").map((letter, index) => (
                    <motion.span
                      key={`${letter}-${index}`}
                      className="text-2xl font-bold text-slate-900 leading-none"
                      variants={letterVariants}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.span 
                  className="block text-xs text-gray-500 mt-0.5"
                  variants={{ initial: { y: 0 }, hover: { y: 2 } }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Sistema Inteligente de VOtación Peruana
                </motion.span>
              </div>
            </Link>
          </motion.div>
          
          {/* --- 2. CAMBIO: Menú de Navegación de Escritorio --- */}
          {/* Cambiamos <Link> por <NavLink> y actualizamos las clases */}
          <ul className="hidden md:flex items-center space-x-2 text-gray-700"> {/* Reducimos space-x-8 a space-x-2 */}
            <li>
              <NavLink 
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}`
                }
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/voto-digital"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}`
                }
              >
                Voto Digital
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/resultados"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}`
                }
              >
                Resultados
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/informacion"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'}`
                }
              >
                Información
              </NavLink>
            </li>
            
            {/* (El botón "Ir a votar" y los iconos de accesibilidad/admin no cambian) */}
            <li className="pl-4"> {/* Añadimos un padding a la izquierda para separarlo */}
              <Link to="/votar" onClick={handleLinkClick} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-sm">Ir a votar</Link>
            </li>
            <li className="relative">
              <button
                onClick={toggleAccessibilityMenu}
                className={`p-2 rounded-lg transition-colors ${
                  isAccessibilityOpen
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Opciones de Accesibilidad"
              ><Accessibility className="w-5 h-5" /></button>
            </li>
            <li>
              <Link to="/admin/login" onClick={handleLinkClick} className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg" title="Acceso Administrativo">
                <Shield className="w-5 h-5" />
              </Link>
            </li>
          </ul>

          {/* (El menú de botones de móvil no cambia) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleAccessibilityMenu}
              className={`p-2 rounded-lg transition-colors ${
                isAccessibilityOpen
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-900 hover:text-blue-700"
              }`}
              title="Opciones de Accesibilidad"
            ><Accessibility className="w-6 h-6" /></button>
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-colors ${
                isMenuOpen
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-900 hover:text-blue-700"
              }`}
            >{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>

        {/* --- 3. CAMBIO: Menú Desplegable de Móvil --- */}
        {/* También usamos NavLink aquí para consistencia */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <ul className="space-y-2 text-gray-700"> {/* Reducimos space-y-3 a space-y-2 */}
              <li>
                <NavLink 
                  to="/" 
                  onClick={handleLinkClick} 
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-700'}`
                  }
                >
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/voto-digital" 
                  onClick={handleLinkClick} 
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-700'}`
                  }
                >
                  Voto Digital
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/resultados" 
                  onClick={handleLinkClick} 
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-700'}`
                  }
                >
                  Resultados
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/informacion" 
                  onClick={handleLinkClick} 
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-700'}`
                  }
                >
                  Información
                </NavLink>
              </li>
              {/* (Botones "Ir a votar" y "Admin" no cambian) */}
              <li className="pt-2"><Link to="/votar" onClick={handleLinkClick} className="block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all text-center">Ir a votar</Link></li>
              <li className="pt-2 border-t border-gray-200 mt-2"><Link to="/admin/login" onClick={handleLinkClick} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors py-2"><Shield className="w-5 h-5" /><span>Acceso Administrativo</span></Link></li>
            </ul>
          </div>
        )}
      </div>

      {/* (El panel de accesibilidad no cambia) */}
      <AnimatePresence>
        {isAccessibilityOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 left-0 md:left-auto md:right-6 mt-2 w-auto md:w-80 mx-4 md:mx-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <p className="font-semibold text-gray-800 text-center">
                Opciones de Accesibilidad
              </p>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-gray-700 text-sm">Ajustar Texto</label>
                  <Baseline className="w-5 h-5 text-gray-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFontSize("text-size-md")}
                    className={`p-2 rounded-md font-bold text-sm ${fontSize === 'text-size-md' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >A</button>
                  <button
                    onClick={() => setFontSize("text-size-lg")}
                    className={`p-2 rounded-md font-bold text-lg ${fontSize === 'text-size-lg' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >A</button>
                  <button
                    onClick={() => setFontSize("text-size-xl")}
                    className={`p-2 rounded-md font-bold text-xl ${fontSize === 'text-size-xl' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >A</button>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-gray-700 text-sm">Modo Oscuro</label>
                  <Moon className="w-5 h-5 text-gray-500" />
                </div>
                <button
                  onClick={() => toggleDarkMode()}
                  className={`mt-2 w-full p-2 rounded-md font-semibold text-sm transition-colors ${
                    darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {darkMode ? "Desactivar" : "Activar"}
                </button>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-gray-700 text-sm">Resaltar Enlaces (Daltonismo)</label>
                  <DaltonismIcon className="w-5 h-5 text-gray-500" />
                </div>
                <button
                  onClick={() => toggleHighlightLinks()}
                  className={`mt-2 w-full p-2 rounded-md font-semibold text-sm transition-colors ${
                    highlightLinks
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {highlightLinks ? "Desactivar" : "Activar"}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}