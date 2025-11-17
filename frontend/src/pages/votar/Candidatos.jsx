// src/pages/votar/Candidatos.jsx

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  X,
  Eye,
  User,
  List,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Candidatos({
  categoriaActual,
  onConfirmarVoto,
  onVolverCategorias,
  candidatos = [],
}) {

  // Estado local solo para la SELECCIÓN en esta pantalla
  // Usamos `null` (ninguno), un número (id del candidato) o el string 'nulo'
  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [candidatoModal, setCandidatoModal] = useState(null);
  const [tabActiva, setTabActiva] = useState("perfil");
  const [confirmando, setConfirmando] = useState(false); // para mostrar estado del botón

  // Reiniciar votoSeleccionado cuando cambian los candidatos o la categoría
  // Esto previene que votos de categorías anteriores contaminen la selección actual
  useEffect(() => {
    setVotoSeleccionado(null);
    setCandidatoModal(null);
    setTabActiva("perfil");
  }, [categoriaActual?.id, candidatos.length]);

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
  
  const handleConfirmar = () => {
    console.log("=== DEBUG handleConfirmar ===");
    console.log("votoSeleccionado:", votoSeleccionado);
    console.log("candidatos:", candidatos);
    
    setConfirmando(true);
    let candidatoObjeto = null;

    if (votoSeleccionado === "nulo") {
      // Es voto nulo
      candidatoObjeto = { id: null, nombre: "Voto Nulo / En Blanco", esNulo: true };
      console.log("Voto nulo seleccionado:", candidatoObjeto);
    } else if (votoSeleccionado !== null) {
      // Buscar candidato en la lista
      candidatoObjeto = candidatos.find((c) => {
        // comparar números directamente
        console.log(`Comparando candidato ID: ${c.id} === ${votoSeleccionado}?`, c.id === votoSeleccionado);
        return c.id === votoSeleccionado;
      });
      console.log("Candidato encontrado:", candidatoObjeto);
    }

    if (candidatoObjeto) {
      console.log("Llamando a onConfirmarVoto con:", candidatoObjeto);
      onConfirmarVoto(candidatoObjeto);
      // No reseteamos el estado aquí porque el componente se desmonta
    } else {
      console.error("ERROR: No se encontró candidato válido");
      setConfirmando(false);
    }
  };

  return (
    <motion.div
      key="paso3"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={fadeUp}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100 min-h-screen"
    >
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${categoriaActual.color} flex items-center justify-center text-xl`}>
            <categoriaActual.icono className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {categoriaActual.titulo}
            </h2>
            <p className="text-gray-700 text-base font-semibold">
              {categoriaActual.subtitulo}
            </p>
          </div>
        </div>
        <p className="text-gray-800 text-lg font-medium mt-4">
          Selecciona un candidato para marcar tu voto.
        </p>
      </div>

      {/* Grid de candidatos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {candidatos.map((candidato, index) => {
          const estaSeleccionado = votoSeleccionado !== 'nulo' && candidato.id === votoSeleccionado;

          return (
            <motion.div
              key={`cand-${candidato.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                console.log(`Click en candidato ID: ${candidato.id}, nombre: ${candidato.nombre}`);
                setVotoSeleccionado(candidato.id);
              }}
              className={`group rounded-xl overflow-hidden cursor-pointer transition-all relative
                ${
                  estaSeleccionado
                    ? "border-2 border-blue-500 ring-4 ring-blue-200 shadow-lg bg-blue-50"
                    : "border-2 border-gray-300 hover:border-blue-400 hover:shadow-2xl"
                }
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

              <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden h-48">
                <img
                  src={candidato.foto || candidato.logoPartido || ''}
                  alt={candidato.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300 grayscale group-hover:grayscale-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className={"px-4 py-3 " + (estaSeleccionado ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gradient-to-r from-blue-600 to-blue-700")}>
                <p className="text-white text-lg font-bold text-center leading-tight">
                  {candidato.nombre}
                </p>
              </div>

              <div className="p-5 space-y-4 bg-white">
                {/* Sección Partido: Símbolo + Nombre */}
                <div className="text-center border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-center gap-2">
                    {candidato.partidoSimbolo && (
                      <img
                        src={candidato.partidoSimbolo}
                        alt={candidato.partidoNombre || "Partido"}
                        className="h-8 w-8 object-contain"
                      />
                    )}
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                      {candidato.partidoNombre || "Sin partido"}
                    </p>
                  </div>
                </div>
                {/* PROPUESTAS: Sin VICEPRESIDENTES */}
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm font-bold text-gray-700 mb-1 uppercase">
                    PROPUESTAS CLAVE:
                  </p>
                  <div className="space-y-1">
                    {(candidato.propuestas || [])
                      .slice(0, 2)
                      .map((propuesta, i) => (
                        <p
                          key={i}
                          className="text-base text-gray-800 leading-snug pl-2"
                        >
                          • {propuesta}
                        </p>
                      ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModal(candidato);
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-blue-600 transition-colors text-base"
                  >
                    <Eye className="w-5 h-5" />
                    Ver Detalles
                  </button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          );
        })}

        {/* Tarjeta de Voto Nulo */}
        {(() => {
          const nuloSeleccionado = votoSeleccionado === "nulo";
          return (
            <motion.div
              onClick={() => setVotoSeleccionado("nulo")}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              className={`group bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl relative
                ${
                  nuloSeleccionado
                    ? "border-orange-600 ring-4 ring-orange-200 shadow-orange-200"
                    : "border-2 border-dashed border-orange-400 hover:border-orange-600"
                }
              `}
            >
              {nuloSeleccionado && (
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
          );
        })()}
      </div>
      
      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-12">
        <button 
          onClick={onVolverCategorias}
          className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 mx-auto font-semibold text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Categorías
        </button>

        <button
          disabled={votoSeleccionado === null || confirmando}
          onClick={handleConfirmar}
          className="bg-green-600 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
        >
          {confirmando ? "Registrando voto..." : (votoSeleccionado !== null
            ? "Confirmar Voto y Continuar"
            : "Selecciona un candidato para votar")}
        </button>
      </div>


      {/* MODAL */}
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
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors z-10"
              >
                <X size={28} />
              </button>

              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={candidatoModal.foto}
                  alt={candidatoModal.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-2/3 flex flex-col overflow-y-auto">
                <div className="px-8 pt-8 pb-4 border-b border-gray-200 bg-gray-50/50">
                  <h2 className="text-4xl font-bold text-blue-800">
                    {candidatoModal.nombre}
                  </h2>
                  {/* Mostrar Símbolo + Nombre del partido en modal */}
                  <div className="flex items-center gap-3 mt-2 mb-6">
                    {candidatoModal.partidoSimbolo && (
                      <img
                        src={candidatoModal.partidoSimbolo}
                        alt={candidatoModal.partidoNombre || "Partido"}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <p className="text-xl font-semibold text-gray-700">
                      {candidatoModal.partidoNombre || "Sin partido"}
                    </p>
                  </div>

                  <nav className="flex gap-2">
                    <button
                      onClick={() => setTabActiva("perfil")}
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors
                        ${
                          tabActiva === "perfil"
                            ? "bg-white text-blue-700 shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      <User className="w-5 h-5" /> Perfil
                    </button>
                    <button
                      onClick={() => setTabActiva("propuestas")}
                      className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors
                        ${
                          tabActiva === "propuestas"
                            ? "bg-white text-blue-700 shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Biografía
                      </h3>
                      <p className="text-lg text-gray-800 leading-relaxed">
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Propuestas Clave
                      </h3>
                      <ul className="list-disc list-inside text-lg text-gray-800 space-y-3">
                        {(candidatoModal.propuestas || []).map(
                          (prop, i) => (
                            <li key={i}>{prop}</li>
                          )
                        )}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <a
                          href="#"
                          className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-base"
                        >
                          Ver Plan de Gobierno Completo
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Se eliminó la pestaña 'Equipo' porque los datos reales no la proveen */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
