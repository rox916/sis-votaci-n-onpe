import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle, FileText, Users, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function Presidentes({
  categoriaActual,
  onConfirmarVoto,
  onVolverCategorias,
  candidatos = [],
}) {
  const { darkMode } = useAccessibility();

  // Estados
  const [votoSeleccionado, setVotoSeleccionado] = useState(null); // ID del candidato
  const [votoNulo, setVotoNulo] = useState(false);
  const [candidatoDetalle, setCandidatoDetalle] = useState(null); // Para el modal
  const [confirmando, setConfirmando] = useState(false);
  const [errorVoto, setErrorVoto] = useState(null);

  // Reiniciar al cargar
  useEffect(() => {
    setVotoSeleccionado(null);
    setVotoNulo(false);
    setCandidatoDetalle(null);
    setErrorVoto(null);
  }, [candidatos.length]);

  // Manejo de Selección
  const handleSelect = (id) => {
    setVotoNulo(false);
    setVotoSeleccionado(id === votoSeleccionado ? null : id);
  };

  const handleNulo = () => {
    setVotoSeleccionado(null);
    setVotoNulo(!votoNulo);
  };

  const handleConfirmar = () => {
    if (!votoSeleccionado && !votoNulo) {
      setErrorVoto("Debes elegir un candidato o voto nulo.");
      setTimeout(() => setErrorVoto(null), 3000);
      return;
    }

    setConfirmando(true);
    
    if (votoNulo) {
      onConfirmarVoto({ id: null, nombre: "Voto Nulo", esNulo: true });
    } else {
      const candidato = candidatos.find((c) => c.id === votoSeleccionado);
      onConfirmarVoto(candidato);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-2xl p-6 min-h-screen border ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${darkMode ? "text-white" : "text-blue-900"}`}>
          Elección Presidencial 2026
        </h2>
        <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Elige al Presidente y su Plancha Presidencial
        </p>
      </div>

      {/* ERROR MSG */}
      <AnimatePresence>
        {errorVoto && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2"
          >
            <AlertCircle size={20} /> {errorVoto}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID CANDIDATOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {candidatos.map((c) => {
          const isSelected = votoSeleccionado === c.id;
          return (
            <motion.div
              key={c.id}
              whileHover={{ y: -5 }}
              onClick={() => handleSelect(c.id)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
                isSelected
                  ? "border-green-500 ring-4 ring-green-200 shadow-xl"
                  : darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg"
              }`}
            >
              {/* Check de Selección */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-20 bg-green-500 text-white rounded-full p-1 shadow-md">
                  <CheckCircle size={32} />
                </div>
              )}

              {/* Imagen y Logo */}
              <div className="relative h-64 bg-gray-200">
                <img 
                  src={c.foto} 
                  alt={c.nombre} 
                  className={`w-full h-full object-cover object-top transition-all ${isSelected ? "" : "grayscale hover:grayscale-0"}`} 
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Logo Partido Flotante */}
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full p-1 shadow-lg">
                   {c.imagenPartido ? (
                       <img src={c.imagenPartido} alt="partido" className="w-full h-full object-contain" />
                   ) : (
                       <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold text-center">SIN LOGO</div>
                   )}
                </div>
              </div>

              {/* Info Básica */}
              <div className={`p-5 pt-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                <h3 className="text-xl font-bold uppercase leading-tight mb-1">{c.nombre}</h3>
                <p className={`text-sm font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                  {c.partidoNombre}
                </p>

                {/* Botones de Acción */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); setCandidatoDetalle(c); }}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors ${
                      darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Users size={16} /> Ver Plancha
                  </button>
                  
                  {c.planGobierno && (
                      <a
                        href={c.planGobierno}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors ${
                          darkMode ? "bg-gray-700 hover:bg-gray-600 text-red-300" : "bg-red-50 hover:bg-red-100 text-red-700"
                        }`}
                      >
                        <FileText size={16} /> Plan .PDF
                      </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* VOTO NULO CARD */}
        <motion.div
            onClick={handleNulo}
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer rounded-2xl flex flex-col items-center justify-center p-8 border-2 border-dashed transition-all ${
                votoNulo 
                ? "border-orange-500 bg-orange-50 ring-4 ring-orange-200" 
                : "border-gray-400 hover:border-orange-400 bg-transparent"
            }`}
        >
            <div className="text-6xl mb-4">∅</div>
            <h3 className="text-xl font-bold text-gray-700">VOTO NULO / BLANCO</h3>
            <p className="text-sm text-gray-500 text-center mt-2">No me siento representado por ninguna opción</p>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center border-t pt-6 border-gray-300 dark:border-gray-700">
        <button
          onClick={onVolverCategorias}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-200"}`}
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <button
          onClick={handleConfirmar}
          disabled={!votoSeleccionado && !votoNulo}
          className={`flex items-center gap-2 px-10 py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${
            (!votoSeleccionado && !votoNulo) || confirmando
              ? "bg-gray-400 cursor-not-allowed opacity-50"
              : "bg-green-600 hover:bg-green-700 text-white transform hover:scale-105"
          }`}
        >
          {confirmando ? "Confirmando..." : "CONFIRMAR VOTO PRESIDENCIAL"}
        </button>
      </div>

      {/* MODAL DETALLE (PLANCHA Y PROPUESTAS) */}
      <AnimatePresence>
        {candidatoDetalle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setCandidatoDetalle(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            >
              {/* Cabecera Modal */}
              <div className="relative h-48 bg-blue-900">
                <img src={candidatoDetalle.foto} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center p-6 gap-6">
                    <img src={candidatoDetalle.imagenPartido} className="w-24 h-24 bg-white rounded-full p-2 shadow-lg object-contain" />
                    <div>
                        <h2 className="text-3xl font-bold text-white">{candidatoDetalle.nombre}</h2>
                        <p className="text-blue-200 font-semibold text-lg">{candidatoDetalle.partidoNombre}</p>
                    </div>
                </div>
                <button onClick={() => setCandidatoDetalle(null)} className="absolute top-4 right-4 bg-black/30 rounded-full p-2 text-white hover:bg-black/50">✕</button>
              </div>

              {/* Contenido Modal */}
              <div className="p-8 space-y-8">
                
                {/* PLANCHA PRESIDENCIAL */}
                <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold border-b pb-2 mb-4 border-gray-200">
                        <Users className="text-blue-600" /> Plancha Presidencial
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            <p className="text-xs uppercase font-bold text-gray-500 mb-1">1er Vicepresidente</p>
                            <p className="font-semibold text-lg">{candidatoDetalle.vice1}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                            <p className="text-xs uppercase font-bold text-gray-500 mb-1">2do Vicepresidente</p>
                            <p className="font-semibold text-lg">{candidatoDetalle.vice2}</p>
                        </div>
                    </div>
                </div>

                {/* FORMACIÓN */}
                <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold border-b pb-2 mb-4 border-gray-200">
                        <Info className="text-blue-600" /> Formación Académica
                    </h3>
                    <p className="leading-relaxed">{candidatoDetalle.formacion}</p>
                </div>

                {/* PROPUESTAS */}
                <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold border-b pb-2 mb-4 border-gray-200">
                        <FileText className="text-blue-600" /> Propuestas Clave
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                        {candidatoDetalle.propuestas.length > 0 ? (
                            candidatoDetalle.propuestas.map((p, i) => <li key={i}>{p}</li>)
                        ) : (
                            <p className="italic text-gray-500">No hay propuestas registradas.</p>
                        )}
                    </ul>
                </div>
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}