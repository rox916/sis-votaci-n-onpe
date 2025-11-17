import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function UsuarioEditar({ isOpen, onClose, onSave, user, roles, departamentos }) {
  const [formData, setFormData] = useState(user || {});

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Sincronizar los datos del usuario seleccionado
  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro sin cierre por clic fuera */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenedor principal con animación */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 z-[10000] overflow-y-auto max-h-[90vh]"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#1A2C56]">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          <Input label="Nombre Completo" name="nombre" value={formData.nombre || ""} onChange={handleChange} />
          <Input label="DNI" name="dni" value={formData.dni || ""} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
          <Select label="Rol" name="rol" value={formData.rol || roles[0]} onChange={handleChange} options={roles} />
          <Select
            label="Departamento"
            name="departamento"
            value={formData.departamento || departamentos[0]}
            onChange={handleChange}
            options={departamentos}
          />
          <Select
            label="Estado"
            name="estado"
            value={formData.estado || "Activo"}
            onChange={handleChange}
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
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* 🧩 Componentes auxiliares */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        {...props}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
