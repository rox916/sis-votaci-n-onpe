import { useEffect } from "react";
import { Trash2, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function CentroEliminar({ isOpen, onClose, onConfirm, center }) {
  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen || !center) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro sin cierre accidental */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenedor principal animado */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 z-[10000]"
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido principal */}
        <div className="text-center mt-2">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1A2C56] mb-2">
            ¿Eliminar Local?
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            Esta acción eliminará permanentemente el local{" "}
            <span className="font-semibold text-gray-800">{center.nombre}</span>.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
