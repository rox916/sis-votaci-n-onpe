// src/pages/votar/Congresistas.jsx
// VERSIÓN SIMPLIFICADA - Basada en Candidatos.jsx permitiendo 2 selecciones

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

export default function Congresistas({
  categoriaActual,
  onConfirmarVoto,
  onVolverCategorias,
  candidatos = [],
}) {
  const { darkMode } = useAccessibility();

  // Estado: Array de IDs de congresistas seleccionados (máximo 2)
  const [votosSeleccionados, setVotosSeleccionados] = useState([]);
  const [candidatoModal, setCandidatoModal] = useState(null);
  const [tabActiva, setTabActiva] = useState("perfil");
  const [confirmando, setConfirmando] = useState(false);
  const [errorVoto, setErrorVoto] = useState(null);

  // DEBUG: Log de candidatos recibidos
  console.log("=== Congresistas recibió candidatos ===", candidatos);

  // Reiniciar cuando cambia la categoría
  useEffect(() => {
    setVotosSeleccionados([]);
    setCandidatoModal(null);
    setTabActiva("perfil");
    setErrorVoto(null);
  }, [categoriaActual?.id, candidatos.length]);

  // Limpiar error después de 3 segundos
  useEffect(() => {
    if (errorVoto) {
      const timer = setTimeout(() => setErrorVoto(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorVoto]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const abrirModal = (candidato) => {
    setCandidatoModal(candidato);
    setTabActiva("perfil");
  };

  const cerrarModal = () => {
    setCandidatoModal(null);
  };

  const handleCandidateSelect = (candidatoId, candidatoNombre) => {
    console.log(`Click en candidato ID: ${candidatoId}, nombre: ${candidatoNombre}`);

    const yaEstaSeleccionado = votosSeleccionados.includes(candidatoId);

    if (yaEstaSeleccionado) {
      setVotosSeleccionados(votosSeleccionados.filter(id => id !== candidatoId));
    } else {
      if (votosSeleccionados.length < 2) {
        setVotosSeleccionados([...votosSeleccionados, candidatoId]);
      } else {
        setErrorVoto("Solo puedes seleccionar hasta 2 congresistas.");
      }
    }
  };

  const handleConfirmar = () => {
    console.log("=== DEBUG Congresistas handleConfirmar ===");
    console.log("votosSeleccionados:", votosSeleccionados);
    console.log("candidatos disponibles:", candidatos);

    if (votosSeleccionados.length === 0) {
      setErrorVoto("Debes seleccionar al menos 1 congresista para votar.");
      return;
    }

    setConfirmando(true);

    // Buscar los candidatos seleccionados en la lista
    const candidatosSeleccionados = candidatos.filter(c =>
      votosSeleccionados.includes(c.id)
    );

    console.log("Candidatos encontrados:", candidatosSeleccionados);

    if (candidatosSeleccionados.length > 0) {
      // Construir un voto congresal basado en el primer candidato + array de preferenciales
      const votoCongresal = {
        id: candidatosSeleccionados[0].id,
        nombre: candidatosSeleccionados[0].nombre,
        partidoNombre: candidatosSeleccionados[0].partidoNombre,
        foto: candidatosSeleccionados[0].foto,
        distrito: candidatosSeleccionados[0].distrito,
        preferenciales: votosSeleccionados, // Array de IDs
        candidatos: candidatosSeleccionados, // Array de objetos completos
        biografia: candidatosSeleccionados[0].biografia,
        propuestas: candidatosSeleccionados[0].propuestas,
      };

      console.log("=== VOTO CONGRESAL A ENVIAR ===", votoCongresal);
      onConfirmarVoto(votoCongresal);
    } else {
      console.error("ERROR: No se encontraron candidatos válidos");
      setConfirmando(false);
    }
  };

  const handleNuloSelect = () => {
    console.log("Voto nulo seleccionado");
    const votoNulo = {
      id: null,
      nombre: "Voto Nulo / En Blanco",
      esNulo: true,
    };
    console.log("Enviando voto nulo:", votoNulo);
    onConfirmarVoto(votoNulo);
  };

  return (
    <motion.div
      key="paso3-congreso"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={fadeUp}
      className={`rounded-2xl shadow-2xl p-8 min-h-screen border ${
        darkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-100"
      }`}
    >
      {/* ENCABEZADO */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${categoriaActual.color} flex items-center justify-center text-xl`}
          >
            <categoriaActual.icono className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className={`text-3xl font-bold ${
                darkMode
                  ? "text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
              }`}
            >
              {categoriaActual.titulo}
            </h2>
            <p
              className={`text-base font-semibold ${
                darkMode ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Selecciona hasta 2 congresistas
            </p>
          </div>
        </div>
      </div>

      {/* MENSAJE DE ERROR */}
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

      {/* GRID DE CANDIDATOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {candidatos.length === 0 ? (
          <div
            className={`col-span-full text-center py-12 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p className="text-lg">No hay candidatos disponibles</p>
          </div>
        ) : (
          candidatos.map((candidato) => {
            const estaSeleccionado = votosSeleccionados.includes(candidato.id);

            return (
              <motion.div
                key={candidato.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  handleCandidateSelect(candidato.id, candidato.nombre)
                }
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  estaSeleccionado
                    ? `ring-4 ring-green-400 shadow-lg ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      }`
                    : `border-2 ${
                        darkMode
                          ? "border-gray-700 bg-gray-800 hover:border-blue-500"
                          : "border-gray-300 bg-white hover:border-blue-500"
                      }`
                }`}
              >
                {/* CHECK ICON */}
                {estaSeleccionado && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-3 right-3 z-10"
                  >
                    <CheckCircle
                      size={36}
                      className="text-white bg-green-500 rounded-full"
                      strokeWidth={3}
                    />
                  </motion.div>
                )}

                {/* FOTO */}
                <div
                  className={`relative h-56 overflow-hidden ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <img
                    src={candidato.foto}
                    alt={candidato.nombre}
                    className={`w-full h-full object-cover object-top transition-all ${
                      estaSeleccionado ? "" : "grayscale hover:grayscale-0"
                    }`}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>

                {/* NOMBRE */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                  <p className="text-white text-lg font-bold text-center truncate">
                    {candidato.nombre}
                  </p>
                </div>

                {/* INFO */}
                <div className={`p-4 space-y-3 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  {/* DISTRITO */}
                  <div className="text-center">
                    <span
                      className={`inline-block px-3 py-2 rounded-md text-sm font-semibold ${
                        darkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {candidato.distrito || "N/A"}
                    </span>
                  </div>

                  {/* PARTIDO */}
                  <div className="text-center">
                    <p
                      className={`text-sm font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {candidato.partidoNombre || "Sin partido"}
                    </p>
                  </div>

                  {/* PROPUESTAS */}
                  <div className={`border-t pt-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <p
                      className={`text-xs font-bold mb-2 uppercase ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Propuestas:
                    </p>
                    <div className="space-y-1">
                      {(candidato.propuestas || [])
                        .slice(0, 2)
                        .map((prop, i) => (
                          <p
                            key={i}
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            • {prop}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* BOTÓN VER DETALLES */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModal(candidato);
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-blue-300"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* BOTÓN VOTO NULO */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNuloSelect}
          className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg border-4 border-dashed transition-all ${
            darkMode
              ? "border-gray-600 bg-gray-800 hover:border-orange-500 text-orange-400"
              : "border-gray-300 bg-white hover:border-orange-500 text-orange-600"
          }`}
        >
          <span className="text-3xl mr-2">∅</span>
          Voto Nulo / En Blanco
        </motion.button>
      </div>

      {/* INDICADOR DE SELECCIONES */}
      <div
        className={`text-center mb-8 text-lg font-semibold ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Seleccionados: <span className="text-blue-600">{votosSeleccionados.length}/2</span>
      </div>

      {/* BOTONES DE NAVEGACIÓN */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <button
          onClick={onVolverCategorias}
          className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all ${
            darkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-700"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Categorías
        </button>

        <button
          disabled={votosSeleccionados.length === 0 || confirmando}
          onClick={handleConfirmar}
          className={`flex items-center justify-center gap-3 w-full sm:w-auto bg-green-600 text-white font-bold text-lg py-4 px-10 rounded-lg shadow-lg transition-all transform ${
            votosSeleccionados.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700 hover:scale-105"
          }`}
        >
          <CheckCircle className="w-6 h-6" />
          {confirmando
            ? "Confirmando..."
            : `Confirmar (${votosSeleccionados.length}/2)`}
        </button>
      </div>

      {/* MODAL DE DETALLES */}
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
                  onError={(e) => (e.target.style.display = "none")}
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
                      darkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    {candidatoModal.nombre}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 mb-6 flex-wrap">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        Distrito: {candidatoModal.distrito || "N/A"}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-green-900/50 text-green-300"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        {candidatoModal.partidoNombre || "Sin partido"}
                      </p>
                    </div>
                  </div>
                  <nav className="flex gap-2">
                    <button
                      onClick={() => setTabActiva("perfil")}
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors ${
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
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors ${
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
                        {(candidatoModal.propuestas || []).map((prop, i) => (
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
