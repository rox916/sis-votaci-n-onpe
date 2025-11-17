import { useEffect } from "react";
import { X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function PadronVer({ isOpen, onClose, voter }) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen || !voter) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro (sin onClick para evitar cierre accidental) */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenedor principal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 z-[10000] overflow-y-auto max-h-[90vh]"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#1A2C56]">
            Detalles del Votante
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-3 text-sm text-gray-700">
          <Detail label="Nombre Completo" value={voter.nombre} />
          <Detail label="DNI" value={voter.dni} />
          <Detail label="Departamento" value={voter.departamento} />
          <Detail label="Provincia" value={voter.provincia} />
          <Detail label="Distrito" value={voter.distrito} />
          <Detail label="Centro de Votación" value={voter.centroVotacion} />
          <Detail label="N° de Mesa" value={voter.mesa} />
          <div>
            <p className="text-sm font-medium text-gray-700">Estado:</p>
            <p
              className={`font-semibold ${
                voter.estado === "Votó" ? "text-green-600" : "text-red-600"
              }`}
            >
              {voter.estado}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* 🧩 Subcomponente reutilizable */
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{label}:</p>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
