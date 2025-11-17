/**
 * Componente modal para editar un candidato existente
 * Permite modificar los datos del candidato seleccionado
 */
import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { motion } from "framer-motion";
import { FormInput, FormSelect } from "../../../components/shared/FormInput";
import { DEPARTAMENTOS_PERU } from "../../../constants/electoralConstants";

export default function CandidatoEditar({ isOpen, onClose, onSave, candidate, partidos, cargos }) {
  // Estado del formulario inicializado con los datos del candidato
  const [formData, setFormData] = useState(candidate || {});

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Actualizar el formulario cuando cambie el candidato seleccionado
  useEffect(() => {
    if (candidate) setFormData(candidate);
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar los cambios realizados al candidato
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.numeroLista) {
      alert("Por favor completa los campos obligatorios (*)");
      return;
    }

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
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 z-[10000] overflow-y-auto max-h-[90vh]"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#1A2C56]">Editar Candidato</h2>
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
          <FormInput
            label="Nombre Completo *"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            required
          />

          <FormInput
            label="URL de Foto"
            name="foto"
            value={formData.foto || ""}
            onChange={handleChange}
            placeholder="https://..."
          />

          <FormSelect
            label="Partido Político"
            name="partidoPolitico"
            value={formData.partidoPolitico || partidos[0]}
            onChange={handleChange}
            options={partidos}
          />

          <FormInput
            label="Número de Lista *"
            name="numeroLista"
            value={formData.numeroLista || ""}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Cargo"
            name="cargo"
            value={formData.cargo || cargos[0]}
            onChange={handleChange}
            options={cargos}
          />

          {formData.cargo === "Congresista" && (
            <FormSelect
              label="Distrito *"
              name="distrito"
              value={formData.distrito || ""}
              onChange={handleChange}
              options={DEPARTAMENTOS_PERU}
              required
            />
          )}

          <FormSelect
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
