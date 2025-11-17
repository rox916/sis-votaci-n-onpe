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
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "../../context/AccessibilityContext";

// --- LOGOS ---
import logoRenovacion from "../../assets/logos/renovacion_popular.png";
import logoFuerza from "../../assets/logos/fuerza_popular.png";
import logoAPP from "../../assets/logos/app.png";
import logoPaisTodos from "../../assets/logos/pais_para_todos.png";
import logoAhoraNacion from "../../assets/logos/ahora_nacion.png";
import logoAvanza from "../../assets/logos/avanza_pais.png";
import logoPrimeroGente from "../../assets/logos/primero_la_gente.png";

// --- DATOS DE PARTIDOS ---
const partidosData = [
  { id: "p1", nombre: "Renovación Popular", logo: logoRenovacion, color: "bg-sky-600" },
  { id: "p2", nombre: "Fuerza Popular", logo: logoFuerza, color: "bg-orange-500" },
  { id: "p3", nombre: "Alianza Para el Progreso", logo: logoAPP, color: "bg-blue-500" },
  { id: "p4", nombre: "Avanza País", logo: logoAvanza, color: "bg-purple-600" },
  { id: "p5", nombre: "Ahora Nación", logo: logoAhoraNacion, color: "bg-red-600" },
  { id: "p6", nombre: "País para Todos", logo: logoPaisTodos, color: "bg-green-600" },
  { id: "p7", nombre: "Primero la Gente", logo: logoPrimeroGente, color: "bg-indigo-600" },
];

// --- CANDIDATOS PARA PARLAMENTO ANDINO (Mock Data) ---
const mockParliamentoAndino = [
  // Renovación Popular
  { id: 1001, nombre: "representante 1", partido: "Renovación Popular", logoPartido: logoRenovacion, numero: "1", biografia: "Representante de RP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1002, nombre: "representante 2", partido: "Renovación Popular", logoPartido: logoRenovacion, numero: "2", biografia: "Representante de RP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1003, nombre: "representante 3", partido: "Renovación Popular", logoPartido: logoRenovacion, numero: "3", biografia: "Representante de RP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },

  // Fuerza Popular
  { id: 1101, nombre: "representante 1", partido: "Fuerza Popular", logoPartido: logoFuerza, numero: "1", biografia: "Representante de FP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1102, nombre: "representante 2", partido: "Fuerza Popular", logoPartido: logoFuerza, numero: "2", biografia: "Representante de FP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1103, nombre: "representante 3", partido: "Fuerza Popular", logoPartido: logoFuerza, numero: "3", biografia: "Representante de FP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },

  // Alianza Para el Progreso
  { id: 1201, nombre: "representante 1", partido: "Alianza Para el Progreso", logoPartido: logoAPP, numero: "1", biografia: "Representante de APP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1202, nombre: "representante 2", partido: "Alianza Para el Progreso", logoPartido: logoAPP, numero: "2", biografia: "Representante de APP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1203, nombre: "representante 3", partido: "Alianza Para el Progreso", logoPartido: logoAPP, numero: "3", biografia: "Representante de APP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },

  // Avanza País
  { id: 1301, nombre: "representante 1", partido: "Avanza País", logoPartido: logoAvanza, numero: "1", biografia: "Representante de AP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1302, nombre: "representante 2", partido: "Avanza País", logoPartido: logoAvanza, numero: "2", biografia: "Representante de AP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1303, nombre: "representante 3", partido: "Avanza País", logoPartido: logoAvanza, numero: "3", biografia: "Representante de AP...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },

  // Ahora Nación
  { id: 1401, nombre: "representante 1", partido: "Ahora Nación", logoPartido: logoAhoraNacion, numero: "1", biografia: "Representante de AN...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1402, nombre: "representante 2", partido: "Ahora Nación", logoPartido: logoAhoraNacion, numero: "2", biografia: "Representante de AN...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1403, nombre: "representante 3", partido: "Ahora Nación", logoPartido: logoAhoraNacion, numero: "3", biografia: "Representante de AN...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },

  // País para Todos
  { id: 1501, nombre: "representante 1", partido: "País para Todos", logoPartido: logoPaisTodos, numero: "1", biografia: "Representante de PTT...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1502, nombre: "representante 2", partido: "País para Todos", logoPartido: logoPaisTodos, numero: "2", biografia: "Representante de PTT...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1503, nombre: "representante 3", partido: "País para Todos", logoPartido: logoPaisTodos, numero: "3", biografia: "Representante de PTT...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },

  // Primero la Gente
  { id: 1601, nombre: "representante 1", partido: "Primero la Gente", logoPartido: logoPrimeroGente, numero: "1", biografia: "Representante de PLG...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1602, nombre: "representante 2", partido: "Primero la Gente", logoPartido: logoPrimeroGente, numero: "2", biografia: "Representante de PLG...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
  { id: 1603, nombre: "representante 3", partido: "Primero la Gente", logoPartido: logoPrimeroGente, numero: "3", biografia: "Representante de PLG...", propuestas: ["Propuesta 1", "Propuesta 2"], foto: "" },
];

export default function ParliamentoAndino({
  categoriaActual,
  onConfirmarVoto,
  onVolverCategorias,
  candidatos = [],
}) {
  const { darkMode } = useAccessibility();

  const [vista, setVista] = useState("partidos");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [votoPreferencial, setVotoPreferencial] = useState(null);
  const [errorVoto, setErrorVoto] = useState(null);

  const [candidatoModal, setCandidatoModal] = useState(null);
  const [tabActiva, setTabActiva] = useState("perfil");

  // Obtener todos los partidos únicos de los candidatos
  const partidos = [...new Set(candidatos.filter(c => c.partidoNombre).map(c => c.partidoNombre))];

  const candidatosDelPartido = candidatos.filter(c => c.partidoNombre === partidoSeleccionado);

  useEffect(() => {
    if (errorVoto) {
      const timer = setTimeout(() => {
        setErrorVoto(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorVoto]);

  useEffect(() => {
    setVista("partidos");
    setPartidoSeleccionado(null);
    setVotoPreferencial(null);
    setErrorVoto(null);
  }, [categoriaActual?.id]);

  const handlePartySelect = (partidoNombre) => {
    setPartidoSeleccionado(partidoNombre);
    setVotoPreferencial(null);
    setErrorVoto(null);
    setVista("candidatos");
  };

  const handleNuloSelect = () => {
    const voto = {
      partido: null,
      representante: null,
    };
    onConfirmarVoto(voto);
  };

  const handleCandidateSelect = (candidatoId) => {
    setErrorVoto(null);
    setVotoPreferencial(candidatoId);
  };

  const handleBackToPartidos = () => {
    setVista("partidos");
    setPartidoSeleccionado(null);
    setVotoPreferencial(null);
    setErrorVoto(null);
  };

  const handleConfirmar = () => {
    if (!partidoSeleccionado || !votoPreferencial) {
      setErrorVoto("Debes seleccionar un partido y un representante para votar.");
      return;
    }
    const votoAndino = {
      partido: partidoSeleccionado,
      representante: votoPreferencial,
    };
    onConfirmarVoto(votoAndino);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const abrirModal = (candidato) => {
    setCandidatoModal(candidato);
    setTabActiva("perfil");
  };
  const cerrarModal = () => {
    setCandidatoModal(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
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

      {/* --- MENSAJE DE ERROR FLOTANTE --- */}
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

      {/* --- CONTENEDOR DE VISTAS (Partidos → Candidato) --- */}
      <AnimatePresence mode="wait">
        {/* --- VISTA 1: SELECCIÓN DE PARTIDO --- */}
        {vista === "partidos" && (
          <motion.div
            key="partidos"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p
              className={`text-xl font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Paso 1: Selecciona un partido político
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {partidos.map((nombrePartido) => {
                const partyData = partidosData.find(
                  (p) => p.nombre === nombrePartido
                );
                return (
                  <motion.div
                    key={nombrePartido}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    onClick={() => handlePartySelect(nombrePartido)}
                    className={`
                      rounded-2xl shadow-lg overflow-hidden cursor-pointer h-48
                      flex flex-col items-center justify-center p-6
                      transition-all duration-300 border-4 border-transparent
                      ${
                        darkMode
                          ? "bg-gray-800 hover:border-blue-700"
                          : "bg-white hover:shadow-xl hover:border-blue-400"
                      }
                    `}
                  >
                    {partyData && (
                      <img
                        src={partyData.logo}
                        alt={nombrePartido}
                        className="h-20 w-auto object-contain mb-4"
                      />
                    )}
                    <p
                      className={`text-center text-lg font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {nombrePartido}
                    </p>
                  </motion.div>
                );
              })}

              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.98, y: 0 }}
                onClick={handleNuloSelect}
                className={`
                  rounded-2xl shadow-lg overflow-hidden cursor-pointer h-48
                  flex flex-col items-center justify-center p-6
                  transition-all duration-300 border-4 border-dashed
                  ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 hover:border-orange-400"
                      : "bg-white border-gray-300 hover:border-orange-500"
                  }
                `}
              >
                <span
                  className={`text-7xl font-light ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  ∅
                </span>
                <p
                  className={`text-center text-lg font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Voto Nulo / En Blanco
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* --- VISTA 2: SELECCIÓN DE CANDIDATO --- */}
        {vista === "candidatos" && (
          <motion.div
            key="candidatos"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={handleBackToPartidos}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Atrás
              </button>
              <p
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Partido: <span className="text-blue-500">{partidoSeleccionado}</span>
              </p>
            </div>

            <p
              className={`text-xl font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Paso 2: Selecciona un representante
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candidatosDelPartido.map((candidato) => {
                const estaSeleccionado = votoPreferencial === candidato.id;

                return (
                  <motion.div
                    key={candidato.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCandidateSelect(candidato.id)}
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

                    <div className="absolute top-2 left-2 z-10 bg-black/50 text-white font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-full border-2 border-white">
                      {candidato.numero}
                    </div>

                    <div
                      className={`relative ${
                        darkMode ? "bg-gray-700" : "bg-gradient-to-br from-gray-200 to-gray-300"
                      } overflow-hidden h-48`}
                    >
                      <img
                        src={candidato.foto}
                        alt={candidato.nombre}
                        className={`w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300 ${
                          estaSeleccionado
                            ? ""
                            : "grayscale group-hover:grayscale-0"
                        }`}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3">
                      <p
                        className="text-white text-lg font-bold text-center leading-tight truncate"
                        title={candidato.nombre}
                      >
                        {candidato.nombre}
                      </p>
                    </div>

                    <div className={`p-5 space-y-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                      <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-3">
                        <div className="flex items-center justify-center gap-2 h-6">
                          <img
                            src={candidato.logoPartido}
                            alt={`Logo ${candidato.partido}`}
                            className="h-full object-contain"
                          />
                          <p className="text-base font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                            {candidato.partido}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <p
                          className={`text-sm font-bold mb-1 uppercase ${
                            darkMode ? "text-gray-400" : "text-gray-700"
                          }`}
                        >
                          PROPUESTAS CLAVE:
                        </p>
                        <div className="space-y-1">
                          {candidato.propuestas
                            .slice(0, 2)
                            .map((propuesta, i) => (
                              <p
                                key={i}
                                className={`text-base leading-snug pl-2 ${
                                  darkMode ? "text-gray-300" : "text-gray-800"
                                }`}
                              >
                                • {propuesta}
                              </p>
                            ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModal(candidato);
                          }}
                          className={`flex items-center justify-center gap-2 w-full font-bold py-3 px-5 rounded-lg transition-colors text-base
                            ${
                              darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-purple-300"
                                : "bg-purple-500 hover:bg-purple-600 text-white"
                            }
                          `}
                        >
                          <Eye className="w-5 h-5" />
                          Ver Detalles
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTONES DE CONTROL --- */}
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

        {vista === "candidatos" && votoPreferencial && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleConfirmar}
            className="flex items-center justify-center gap-2 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmar Voto
          </motion.button>
        )}
      </div>

      {/* --- MODAL DE DETALLES --- */}
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
              <div className="w-full md:w-2/3 flex flex-col overflow-y-auto">
                <div
                  className={`px-8 pt-8 pb-4 border-b ${
                    darkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <h2
                    className={`text-4xl font-bold ${
                      darkMode ? "text-purple-300" : "text-purple-800"
                    }`}
                  >
                    {candidatoModal.nombre}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 mb-6">
                    <img
                      src={candidatoModal.logoPartido}
                      alt={`Logo ${candidatoModal.partido}`}
                      className="w-10 h-10 object-contain"
                    />
                    <p
                      className={`text-xl font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {candidatoModal.partido}
                    </p>
                  </div>
                  <nav className="flex gap-2">
                    <button
                      onClick={() => setTabActiva("perfil")}
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors
                        ${
                          tabActiva === "perfil"
                            ? `${
                                darkMode
                                  ? "bg-gray-800 text-purple-300"
                                  : "bg-white text-purple-700"
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
                                  ? "bg-gray-800 text-purple-300"
                                  : "bg-white text-purple-700"
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
                        {candidatoModal.propuestas.map((prop, i) => (
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
