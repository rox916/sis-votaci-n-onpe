import { useEffect, useState } from "react";
import { X, Save, PlusCircle } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const allPermisos = [
  "Dashboard",
  "Usuarios",
  "Candidatos",
  "Centros",
  "Padrón Electoral",
  "Configuración",
  "Reportes",
  "Resultados",
  "Análisis de Datos",
  "Auditoría",
];

export default function RolCrear({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
    estado: "Activo",
  });

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePermiso = (permiso) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permiso)
        ? prev.permisos.filter((p) => p !== permiso)
        : [...prev.permisos, permiso],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descripcion)
      return alert("Completa los campos obligatorios (*)");
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro sin cierre accidental */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenedor principal animado */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 z-[10000] overflow-y-auto max-h-[90vh]"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#1A2C56]">Crear Nuevo Rol</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <Input
            label="Nombre del Rol *"
            name="nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          <TextArea
            label="Descripción *"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />

          {/* Permisos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permisos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allPermisos.map((permiso) => (
                <label
                  key={permiso}
                  className="flex items-center space-x-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={formData.permisos.includes(permiso)}
                    onChange={() => togglePermiso(permiso)}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>{permiso}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estado */}
          <Select
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.value })
            }
            options={["Activo", "Inactivo"]}
          />

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
              <PlusCircle className="w-4 h-4" /> Crear Rol
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* 🧩 Subcomponentes reutilizables */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows="3"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        {...props}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
