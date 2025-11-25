import { motion, AnimatePresence } from "framer-motion";
import { X, User, List } from "lucide-react";
import { useState } from "react";

export default function DetalleModal({ candidato, onClose, darkMode }) {
  const [tabActiva, setTabActiva] = useState("perfil");

  if (!candidato) return null;

  // Normalización de datos dentro del modal
  const foto = candidato.fotoUrl || candidato.foto;
  const nombre = candidato.nombres || candidato.nombre;
  const partido = candidato.nombrePartido || candidato.partidoNombre || "Sin partido";
  const distrito = candidato.region || candidato.distrito || "N/A";

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        key="modal-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${darkMode ? "bg-gray-800" : "bg-white"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className={`absolute top-4 right-4 transition-colors z-10 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            <X size={28} />
          </button>

          {/* Imagen Lateral */}
          <div className={`w-full md:w-1/3 flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <img src={foto} alt={nombre} className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
          </div>

          {/* Contenido */}
          <div className="w-full md:w-2/3 flex flex-col overflow-y-auto">
            <div className={`px-8 pt-8 pb-4 border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50/50"}`}>
              <h2 className={`text-4xl font-bold ${darkMode ? "text-blue-300" : "text-blue-800"}`}>{nombre}</h2>
              <div className="flex items-center gap-3 mt-2 mb-6 flex-wrap">
                <div className={`px-4 py-2 rounded-lg ${darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                  <p className="text-sm font-semibold">Distrito: {distrito}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"}`}>
                  <p className="text-sm font-semibold">{partido}</p>
                </div>
              </div>

              {/* Pestañas */}
              <nav className="flex gap-2">
                {[
                  { id: "perfil", icon: User, label: "Perfil" },
                  { id: "propuestas", icon: List, label: "Propuestas" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`flex items-center gap-2 py-3 px-6 rounded-t-lg text-base font-semibold transition-colors ${
                      tabActiva === tab.id
                        ? `${darkMode ? "bg-gray-800 text-blue-300" : "bg-white text-blue-700"} shadow-sm`
                        : `${darkMode ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
                    }`}
                  >
                    <tab.icon className="w-5 h-5" /> {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {tabActiva === "perfil" && (
                <motion.div key="perfil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Biografía</h3>
                  <p className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                    {candidato.biografia || "Información biográfica no disponible."}
                  </p>
                </motion.div>
              )}
              {tabActiva === "propuestas" && (
                <motion.div key="propuestas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Propuestas Clave</h3>
                  <ul className={`list-disc list-inside text-lg space-y-3 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                    {(candidato.propuestas || []).map((prop, i) => (<li key={i}>{prop}</li>))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}