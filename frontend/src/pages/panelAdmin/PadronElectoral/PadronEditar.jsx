import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function PadronEditar({ isOpen, onClose, voter, onSave }) {
  const [estado, setEstado] = useState(voter?.estado || "No Votó");

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Actualizar estado local si cambia el votante
  useEffect(() => {
    if (voter) setEstado(voter.estado);
  }, [voter]);

  if (!isOpen || !voter) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ ...voter, estado });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro (sin cierre al click externo) */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenedor principal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 z-[10000]"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#1A2C56]">
            Editar Estado del Votante
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Votante: <strong>{voter.nombre}</strong>
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Voto
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Votó">Votó</option>
              <option value="No Votó">No Votó</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#1A2C56] hover:bg-[#23396A] text-white rounded-lg transition"
            >
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
