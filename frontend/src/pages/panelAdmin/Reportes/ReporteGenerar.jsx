import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X, Download } from "lucide-react";

import { TIPOS_REPORTE, AMBITOS_REPORTE } from "../../../constants/electoralConstants";

const tiposReporte = TIPOS_REPORTE;
const ambitosReporte = AMBITOS_REPORTE;

export default function ReporteGenerar({ isOpen, onClose, onGenerate }) {
  const [formData, setFormData] = useState({
    tipo: tiposReporte[0],
    ambito: ambitosReporte[0],
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReport = {
      id: Date.now(),
      nombre: `Reporte de ${formData.tipo} - ${formData.ambito}`,
      descripcion: `Reporte generado automáticamente para ${formData.ambito}.`,
      tipo: formData.tipo,
      ambito: formData.ambito,
      estado: "Generando...",
      fechaGeneracion: null,
    };

    onGenerate(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 z-[10000]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Generar Nuevo Reporte
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Reporte
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {tiposReporte.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ámbito del Reporte
            </label>
            <select
              value={formData.ambito}
              onChange={(e) =>
                setFormData({ ...formData, ambito: e.target.value })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {ambitosReporte.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              <Download className="w-4 h-4" /> Generar Reporte
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
