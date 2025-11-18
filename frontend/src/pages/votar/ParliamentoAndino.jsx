// src/pages/votar/ParliamentoAndino.jsx

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  X,
  Eye,
  User,
  List,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "../../context/AccessibilityContext";

/**
 * ParliamentoAndino - Votación para Parlamento Andino (Simple)
 * 
 * Patrón: Igual que Congresistas
 * - Usa candidatos reales del backend (vía prop)
 * - Selección directa sin partidos intermedios
 * - Un candidato seleccionado
 * - Datos garantizados de la BD
 */

export default function ParliamentoAndino({
  categoriaActual,
  onConfirmarVoto,
  onVolverCategorias,
  candidatos = [],
}) {
  const { darkMode } = useAccessibility();

  // Estado simple: 1 candidato seleccionado (máximo 1 para Parlamento Andino)
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
  const [votoNuloSeleccionado, setVotoNuloSeleccionado] = useState(false);
  const [errorVoto, setErrorVoto] = useState(null);

  // Modal para ver detalles
  const [candidatoModal, setCandidatoModal] = useState(null);
  const [tabActiva, setTabActiva] = useState("perfil");

  // Limpiar error después de 3 segundos
  useEffect(() => {
    if (errorVoto) {
      const timer = setTimeout(() => {
        setErrorVoto(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorVoto]);

  // Resetear estado cuando cambia la categoría
  useEffect(() => {
    setCandidatoSeleccionado(null);
    setVotoNuloSeleccionado(false);
    setErrorVoto(null);
    setCandidatoModal(null);
  }, [categoriaActual?.id]);

  // === MANEJADORES ===

  const handleCandidateSelect = (candidato) => {
    console.log(
      `Click en candidato ID: ${candidato.id}, nombre: ${candidato.nombre}`
    );
    // Si se selecciona un candidato, deseleccionar voto nulo
    if (votoNuloSeleccionado) {
      setVotoNuloSeleccionado(false);
    }
    setCandidatoSeleccionado(candidato);
    setErrorVoto(null);
  };

  const handleConfirmar = () => {
    // Si se seleccionó voto nulo
    if (votoNuloSeleccionado) {
      console.log("=== DEBUG ParliamentoAndino handleConfirmar - Voto Nulo ===");
      const votoNulo = {
        id: null,
        nombre: "Voto Nulo / En Blanco",
        esNulo: true,
      };
      console.log("Enviando voto nulo:", votoNulo);
      onConfirmarVoto(votoNulo);
      return;
    }

    if (!candidatoSeleccionado) {
      setErrorVoto("Debes seleccionar un representante o voto nulo para votar.");
      return;
    }

    console.log("=== DEBUG ParliamentoAndino handleConfirmar ===");
    console.log("Candidato seleccionado:", candidatoSeleccionado);

    // Estructura del voto para Parlamento Andino (similar a Congresistas pero sin preferenciales)
    const votoParliamento = {
      id: candidatoSeleccionado.id,
      nombre: candidatoSeleccionado.nombre,
      partidoNombre: candidatoSeleccionado.partidoNombre,
      numeroLista: candidatoSeleccionado.numero,
      // Incluir objeto completo para referencia del backend
      candidato: candidatoSeleccionado,
    };

    console.log("=== VOTO PARLAMENTO ANDINO A ENVIAR ===");
    console.log(votoParliamento);

    onConfirmarVoto(votoParliamento);
  };

  const handleNuloSelect = () => {
    console.log("Voto nulo seleccionado/deseleccionado para Parlamento Andino");
    // Si se selecciona voto nulo, limpiar selección de candidato
    if (!votoNuloSeleccionado) {
      setCandidatoSeleccionado(null);
      setVotoNuloSeleccionado(true);
    } else {
      setVotoNuloSeleccionado(false);
    }
    setErrorVoto(null);
  };

  const abrirModal = (candidato) => {
    setCandidatoModal(candidato);
    setTabActiva("perfil");
  };

  const cerrarModal = () => {
    setCandidatoModal(null);
  };

  // === ANIMACIONES ===

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {/* === ENCABEZADO === */}
      <div className={`rounded-2xl shadow-lg p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2
          className={`text-4xl font-bold mb-2 ${
            darkMode ? "text-blue-300" : "text-blue-800"
          }`}
        >
          Parlamento Andino
        </h2>
        <p
          className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Selecciona a tu representante en el Parlamento Andino
        </p>
      </div>

      {/* === MENSAJE DE ERROR FLOTANTE === */}
      <AnimatePresence>
        {errorVoto && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 p-4 bg-red-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorVoto}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === GRID DE CANDIDATOS === */}
      <div className="mt-8">
        <p
          className={`text-xl font-semibold mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Selecciona un representante:
        </p>

        {candidatos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {candidatos.map((candidato) => {
              const estaSeleccionado = candidatoSeleccionado?.id === candidato.id;

              return (
                <motion.div
                  key={candidato.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCandidateSelect(candidato)}
                  className={`group bg-gradient-to-br rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl relative
                    ${
                      estaSeleccionado
                        ? "border-blue-500 ring-4 ring-blue-200 shadow-blue-200"
                        : `border-2 ${
                            darkMode
                              ? "border-gray-700 hover:border-blue-600"
                              : "border-gray-300 hover:border-blue-400"
                          }`
                    }
                    ${darkMode ? "from-gray-800 to-gray-900" : "from-white to-gray-50"}
                  `}
                >
                  {/* Checkmark si está seleccionado */}
                  {estaSeleccionado && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-2 right-2 z-10"
                    >
                      <CheckCircle
                        size={40}
                        className="text-white bg-green-500 rounded-full"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}

                  {/* Foto */}
                  <div
                    className={`relative ${
                      darkMode ? "bg-gray-700" : "bg-gradient-to-br from-gray-200 to-gray-300"
                    } overflow-hidden h-48`}
                  >
                    <img
                      src={candidato.foto}
                      alt={candidato.nombre}
                      className={`w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300 ${
                        estaSeleccionado ? "" : "grayscale group-hover:grayscale-0"
                      }`}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  {/* Nombre */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                    <p
                      className="text-white text-lg font-bold text-center leading-tight truncate"
                      title={candidato.nombre}
                    >
                      {candidato.nombre}
                    </p>
                  </div>

                  {/* Información */}
                  <div className={`p-5 space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    {/* Partido */}
                    <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-3">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {candidato.partidoNombre || "Sin partido"}
                      </p>
                    </div>

                    {/* Propuestas */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <p
                        className={`text-sm font-bold mb-1 uppercase ${
                          darkMode ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        PROPUESTAS:
                      </p>
                      <div className="space-y-1">
                        {candidato.propuestas &&
                          candidato.propuestas.slice(0, 2).map((propuesta, i) => (
                            <p
                              key={i}
                              className={`text-sm leading-snug pl-2 ${
                                darkMode ? "text-gray-300" : "text-gray-800"
                              }`}
                            >
                              • {propuesta}
                            </p>
                          ))}
                      </div>
                    </div>

                    {/* Botón Ver Detalles */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModal(candidato);
                        }}
                        className={`flex items-center justify-center gap-2 w-full font-bold py-3 px-5 rounded-lg transition-colors text-base
                          ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-blue-300"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }
                        `}
                      >
                        <Eye className="w-5 h-5" />
                        Ver Detalles
                      </button>
                    </div>
                  </div>

                  {/* Línea de hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </motion.div>
              );
            })}

            {/* Tarjeta de Voto Nulo */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNuloSelect}
              className={`group bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl relative
                ${
                  votoNuloSeleccionado
                    ? "border-orange-600 ring-4 ring-orange-200 shadow-orange-200"
                    : "border-2 border-dashed border-orange-400 hover:border-orange-600"
                }
              `}
            >
              {votoNuloSeleccionado && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 z-10"
                >
                  <CheckCircle
                    size={40}
                    className="text-white bg-green-500 rounded-full"
                    strokeWidth={3}
                  />
                </motion.div>
              )}

              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
              <div className="relative bg-gradient-to-br from-orange-100 to-orange-200 h-48 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  ∅
                </span>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
                <p className="text-white text-lg font-bold text-center leading-tight">
                  Voto Nulo / En Blanco
                </p>
              </div>
              <div className="p-5 space-y-4 bg-white">
                <div className="text-center border-b border-orange-200 pb-3">
                  <p className="text-base font-bold text-orange-600 uppercase tracking-wider">
                    No me siento representado
                  </p>
                </div>
                <div className="border-t border-orange-200 pt-3">
                  <p className="text-sm font-bold text-gray-700 mb-1 uppercase">
                    ¿QUÉ SIGNIFICA?
                  </p>
                  <div className="space-y-1">
                    <p className="text-base text-gray-800 leading-snug pl-2">
                      • Expresas tu derecho sin elegir
                    </p>
                    <p className="text-base text-gray-800 leading-snug pl-2">
                      • Manifiestas descontento
                    </p>
                    <p className="text-base text-gray-800 leading-snug pl-2">
                      • Tu voto será contabilizado
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          </div>
        ) : (
          <div
            className={`p-8 rounded-lg text-center ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              No hay candidatos disponibles para Parlamento Andino
            </p>
          </div>
        )}
      </div>

      {/* === BOTONES DE CONTROL === */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-12 gap-4">
        <button
          onClick={onVolverCategorias}
          className={`
            flex items-center justify-center gap-2
            font-bold py-3 px-6 rounded-lg 
            transition-all duration-200
            ${
              darkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"
            }
          `}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Categorías
        </button>

        {(candidatoSeleccionado || votoNuloSeleccionado) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleConfirmar}
            className="flex items-center justify-center gap-2 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            {votoNuloSeleccionado ? "Confirmar Voto Nulo" : "Confirmar Voto"}
          </motion.button>
        )}
      </div>

      {/* === MODAL DE DETALLES === */}
      <AnimatePresence>
        {candidatoModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={cerrarModal}
          />
        )}
        {candidatoModal && (
          <motion.div
            key="modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={cerrarModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={cerrarModal}
                className={`absolute top-4 right-4 transition-colors z-10 ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <X size={28} />
              </button>

              {/* Foto (lado izquierdo) */}
              <div
                className={`w-full md:w-1/3 flex-shrink-0 ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <img
                  src={candidatoModal.foto}
                  alt={candidatoModal.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              {/* Contenido (lado derecho) */}
              <div className="w-full md:w-2/3 flex flex-col overflow-y-auto">
                {/* Encabezado del modal */}
                <div
                  className={`px-8 pt-8 pb-4 border-b ${
                    darkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <h2
                    className={`text-4xl font-bold ${
                      darkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    {candidatoModal.nombre}
                  </h2>
                  <p
                    className={`text-lg mt-2 font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {candidatoModal.partidoNombre || "Sin partido"}
                  </p>

                  {/* Tabs */}
                  <nav className="flex gap-2 mt-6">
                    <button
                      onClick={() => setTabActiva("perfil")}
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors
                        ${
                          tabActiva === "perfil"
                            ? `${
                                darkMode
                                  ? "bg-gray-800 text-blue-300"
                                  : "bg-white text-blue-700"
                              } shadow-sm`
                            : `${
                                darkMode
                                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`
                        }`}
                    >
                      <User className="w-5 h-5" /> Perfil
                    </button>
                    <button
                      onClick={() => setTabActiva("propuestas")}
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors
                        ${
                          tabActiva === "propuestas"
                            ? `${
                                darkMode
                                  ? "bg-gray-800 text-blue-300"
                                  : "bg-white text-blue-700"
                              } shadow-sm`
                            : `${
                                darkMode
                                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`
                        }`}
                    >
                      <List className="w-5 h-5" /> Propuestas
                    </button>
                  </nav>
                </div>

                {/* Contenido de tabs */}
                <div className="p-8">
                  {tabActiva === "perfil" && (
                    <motion.div
                      key="perfil"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3
                        className={`text-2xl font-bold mb-3 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Biografía
                      </h3>
                      <p
                        className={`text-lg leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-800"
                        }`}
                      >
                        {candidatoModal.biografia ||
                          "Información biográfica no disponible."}
                      </p>
                    </motion.div>
                  )}
                  {tabActiva === "propuestas" && (
                    <motion.div
                      key="propuestas"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3
                        className={`text-2xl font-bold mb-3 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Propuestas Clave
                      </h3>
                      <ul
                        className={`list-disc list-inside text-lg space-y-3 ${
                          darkMode ? "text-gray-300" : "text-gray-800"
                        }`}
                      >
                        {candidatoModal.propuestas &&
                          candidatoModal.propuestas.map((prop, i) => (
                            <li key={i}>{prop}</li>
                          ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
