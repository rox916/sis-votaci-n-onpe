/**
 * Componente modal para ver las propuestas de un candidato
 * Muestra la biografía y las propuestas del candidato seleccionado
 */
import { useEffect } from "react";
import { Eye, X, FileText, List } from "lucide-react";
import { motion } from "framer-motion";

export default function CandidatoVerPropuestas({ isOpen, onClose, candidate }) {
  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen || !candidate) return null;

  // Convertir propuestas a array si es necesario
  const propuestas = Array.isArray(candidate.propuestas) 
    ? candidate.propuestas 
    : (candidate.propuestas ? [candidate.propuestas] : []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro sin cierre por clic */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Contenedor principal animado */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 z-[10000] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A2C56]">
                Propuestas del Candidato
              </h2>
              <p className="text-sm text-gray-600 mt-1">{candidate.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold transition"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          {/* Biografía */}
          {candidate.biografia && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Biografía</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {candidate.biografia}
                </p>
              </div>
            </div>
          )}

          {/* Propuestas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <List className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Propuestas {propuestas.length > 0 && `(${propuestas.length})`}
              </h3>
            </div>
            
            {propuestas.length > 0 ? (
              <div className="space-y-3">
                {propuestas.map((propuesta, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1 leading-relaxed">
                        {propuesta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                <p className="text-gray-500 italic">
                  Este candidato no tiene propuestas registradas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1A2C56] hover:bg-[#23396A] text-white rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

