import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "../../context/AccessibilityContext";

// Importamos la función para traer los partidos reales desde la Base de Datos
import { obtenerPartidosDesdeAPI } from "../../services/candidatosService";

// Importa tus componentes (asegúrate que estén en la misma carpeta)
import CongresistaCard from "./CongresistaCard";
import VotoNuloCard from "./VotoNuloCard";
import DetalleModal from "./DetalleModal";

export default function Congresistas({
  categoriaActual,
  onConfirmarVoto,
  onVolverCategorias,
  candidatos = [],
}) {
  const { darkMode } = useAccessibility();

  // Estado para la lista de partidos REALES de la base de datos
  const [listaPartidos, setListaPartidos] = useState([]);
  const [cargandoPartidos, setCargandoPartidos] = useState(true);

  // Estado: Para saber qué partido estamos viendo (null = viendo lista de partidos)
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  // Estados de votación
  const [votosSeleccionados, setVotosSeleccionados] = useState([]);
  const [votoNuloSeleccionado, setVotoNuloSeleccionado] = useState(false);
  const [candidatoModal, setCandidatoModal] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [errorVoto, setErrorVoto] = useState(null);

  // --- EFECTO: Cargar los partidos desde la Base de Datos al iniciar ---
  useEffect(() => {
    const cargarPartidosDb = async () => {
      try {
        setCargandoPartidos(true);
        // Llamamos a tu servicio existente que conecta con /api/partidos
        const data = await obtenerPartidosDesdeAPI();
        setListaPartidos(data);
      } catch (error) {
        console.error("Error cargando partidos:", error);
      } finally {
        setCargandoPartidos(false);
      }
    };

    cargarPartidosDb();
  }, []);

  // Reiniciar estado al cambiar categoría
  useEffect(() => {
    setVotosSeleccionados([]);
    setVotoNuloSeleccionado(false);
    setCandidatoModal(null);
    setErrorVoto(null);
    setPartidoSeleccionado(null);
  }, [categoriaActual?.id, candidatos.length]);

  // Limpiar errores automáticos
  useEffect(() => {
    if (errorVoto) {
      const timer = setTimeout(() => setErrorVoto(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorVoto]);

  // --- MANEJADORES DE VOTO ---
  const handleCandidateSelect = (candidatoId, candidatoNombre) => {
    if (votoNuloSeleccionado) setVotoNuloSeleccionado(false);

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

  const handleNuloSelect = () => {
    if (!votoNuloSeleccionado) {
      setVotosSeleccionados([]);
      setVotoNuloSeleccionado(true);
    } else {
      setVotoNuloSeleccionado(false);
    }
  };

  const handleConfirmar = () => {
    if (votoNuloSeleccionado) {
      setConfirmando(true);
      onConfirmarVoto({ id: null, nombre: "Voto Nulo / En Blanco", esNulo: true });
      return;
    }

    if (votosSeleccionados.length === 0) {
      setErrorVoto("Debes seleccionar al menos 1 congresista o voto nulo para votar.");
      return;
    }

    setConfirmando(true);
    const candidatosSeleccionados = candidatos.filter(c => votosSeleccionados.includes(c.id));

    if (candidatosSeleccionados.length > 0) {
      const primero = candidatosSeleccionados[0];
      const votoCongresal = {
        id: primero.id,
        nombre: primero.nombre || primero.nombres,
        partidoNombre: primero.nombrePartido || primero.partidoNombre,
        foto: primero.foto || primero.fotoUrl,
        distrito: primero.region || primero.distrito,
        preferenciales: votosSeleccionados,
        candidatos: candidatosSeleccionados,
        biografia: primero.biografia,
        propuestas: primero.propuestas,
      };
      onConfirmarVoto(votoCongresal);
    } else {
      setConfirmando(false);
    }
  };

  // Filtrar candidatos: Comparamos el ID del partido seleccionado con el ID del partido del candidato
  const candidatosVisibles = partidoSeleccionado 
    ? candidatos.filter(c => c.partido === partidoSeleccionado.idPartido)
    : [];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      key="paso3-congreso"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={fadeUp}
      className={`rounded-2xl shadow-2xl p-8 min-h-screen border ${darkMode ? "bg-gray-900 border-gray-700" : "bg-gradient-to-br from-white to-gray-50 border-gray-100"}`}
    >
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${categoriaActual.color} flex items-center justify-center text-xl`}>
            <categoriaActual.icono className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"}`}>
              {categoriaActual.titulo}
            </h2>
            <p className={`text-base font-semibold ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              {partidoSeleccionado 
                ? `Candidatos de ${partidoSeleccionado.nombre}`
                : "Primero selecciona un Partido Político"}
            </p>
          </div>
        </div>
      </div>

      {/* MENSAJE ERROR */}
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

      {/* --- VISTA 1: GRID DE PARTIDOS REALES DE LA BD --- */}
      {!partidoSeleccionado && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {cargandoPartidos ? (
             <div className="col-span-full text-center py-12 text-gray-500">Cargando partidos...</div>
          ) : (
            listaPartidos.map((partido) => (
              <motion.div
                key={partido.idPartido}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPartidoSeleccionado(partido)}
                className={`cursor-pointer rounded-xl p-6 flex flex-col items-center justify-center gap-4 border-2 transition-all shadow-md ${
                  darkMode 
                    ? "bg-gray-800 border-gray-700 hover:border-blue-500" 
                    : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-xl"
                }`}
              >
                <div className="w-24 h-24 relative flex items-center justify-center">
                  {partido.simbolo ? (
                    <img 
                      src={partido.simbolo} 
                      alt={partido.nombre} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                      SIN LOGO
                    </div>
                  )}
                </div>
                <h3 className={`text-center font-bold text-lg leading-tight ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {partido.nombre}
                </h3>
                <div className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-700 text-blue-300" : "bg-blue-50 text-blue-600"}`}>
                  Ver Candidatos
                </div>
              </motion.div>
            ))
          )}
          
          {/* Opción de Voto Nulo Directa */}
           {!cargandoPartidos && (
             <div className="col-span-1">
               <VotoNuloCard
                seleccionado={votoNuloSeleccionado}
                onSelect={handleNuloSelect}
              />
             </div>
           )}
        </div>
      )}

      {/* --- VISTA 2: GRID DE CANDIDATOS (Filtrados) --- */}
      {partidoSeleccionado && (
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
        >
            <button 
                onClick={() => setPartidoSeleccionado(null)}
                className={`mb-6 flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${
                    darkMode ? "text-blue-300 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-50"
                }`}
            >
                <ArrowLeft className="w-5 h-5" />
                Elegir otro partido
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidatosVisibles.length === 0 ? (
                    <div className={`col-span-full text-center py-12 rounded-xl border-2 border-dashed ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"}`}>
                        <p className="text-xl font-semibold mb-2">Este partido aún no tiene candidatos registrados.</p>
                        <p className="text-sm">Selecciona otro partido para votar.</p>
                    </div>
                ) : (
                    candidatosVisibles.map((candidato) => (
                    <CongresistaCard
                        key={candidato.id}
                        candidato={candidato}
                        estaSeleccionado={votosSeleccionados.includes(candidato.id)}
                        onSelect={handleCandidateSelect}
                        onVerDetalles={setCandidatoModal}
                        darkMode={darkMode}
                    />
                    ))
                )}
            </div>
        </motion.div>
      )}

      {/* FOOTER */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
        <button
          onClick={onVolverCategorias}
          className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all ${darkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-700 hover:text-blue-600 hover:bg-gray-200"}`}
        >
          <ArrowLeft className="w-5 h-5" /> Volver al Inicio
        </button>

        <div className="text-center">
            {votoNuloSeleccionado ? (
            <span className="text-orange-600 font-bold text-lg">Voto Nulo seleccionado</span>
            ) : (
            <span className={`font-semibold text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Seleccionados: <span className="text-blue-600 text-xl font-bold">{votosSeleccionados.length}/2</span>
            </span>
            )}
        </div>

        <button
          disabled={(!votoNuloSeleccionado && votosSeleccionados.length === 0) || confirmando}
          onClick={handleConfirmar}
          className={`flex items-center justify-center gap-3 w-full sm:w-auto bg-green-600 text-white font-bold text-lg py-4 px-10 rounded-lg shadow-lg transition-all transform ${(!votoNuloSeleccionado && votosSeleccionados.length === 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700 hover:scale-105"}`}
        >
          <CheckCircle className="w-6 h-6" />
          {confirmando ? "Enviando..." : "Confirmar Voto"}
        </button>
      </div>

      {/* Modal Detalles */}
      {candidatoModal && (
        <DetalleModal
          candidato={candidatoModal}
          onClose={() => setCandidatoModal(null)}
          darkMode={darkMode}
        />
      )}
    </motion.div>
  );
}