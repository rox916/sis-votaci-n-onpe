/**
 * Componente modal para crear un nuevo candidato
 * Permite ingresar todos los datos necesarios del candidato y guardarlo en el sistema
 */
import { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FormInput, FormSelect, FormTextArea } from "../../../components/shared/FormInput";
import { DEPARTAMENTOS_PERU } from "../../../constants/electoralConstants";

export default function CandidatoCrear({ isOpen, onClose, onSave, partidos, cargos }) {
  // Estado del formulario con valores iniciales
  const [formData, setFormData] = useState({
    nombre: "",
    partidoPolitico: partidos[0],
    numeroLista: "1",
    cargo: cargos[0],
    foto: "",
    estado: "Activo",
    distrito: "",
    biografia: "",
    propuestas: "",
  });

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para convertir propuestas de string a array
  const convertirPropuestasAArray = (propuestasString) => {
    if (!propuestasString || propuestasString.trim() === "") {
      return null;
    }
    // Separar por saltos de línea o comas
    const propuestas = propuestasString
      .split(/\n|,/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    return propuestas.length > 0 ? propuestas : null;
  };

  // Guardar el nuevo candidato y cerrar el modal
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre) {
      alert("Por favor completa el nombre del candidato (*)");
      return;
    }

    // Convertir propuestas de string a array
    const propuestasArray = convertirPropuestasAArray(formData.propuestas);
    
    onSave({ 
      ...formData, 
      propuestas: propuestasArray,
      biografia: formData.biografia || null,
      id: Date.now() 
    });
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
          <h2 className="text-lg font-bold text-[#1A2C56]">Crear Nuevo Candidato</h2>
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
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <FormTextArea
            label="Biografía"
            name="biografia"
            value={formData.biografia}
            onChange={handleChange}
            placeholder="Ingrese la biografía del candidato..."
            rows={4}
          />

          <FormTextArea
            label="Propuestas"
            name="propuestas"
            value={formData.propuestas}
            onChange={handleChange}
            placeholder="Ingrese las propuestas separadas por comas o saltos de línea..."
            rows={4}
          />

          <FormInput
            label="URL de Foto"
            name="foto"
            value={formData.foto}
            onChange={handleChange}
            placeholder="https://..."
          />

          <FormSelect
            label="Partido Político"
            name="partidoPolitico"
            value={formData.partidoPolitico}
            onChange={handleChange}
            options={partidos}
          />

          <FormInput
            label="Número de Lista"
            name="numeroLista"
            value={formData.numeroLista}
            onChange={handleChange}
          />

          <FormSelect
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            options={cargos}
          />

          {formData.cargo === "Congresista" && (
            <FormSelect
              label="Distrito *"
              name="distrito"
              value={formData.distrito}
              onChange={handleChange}
              options={DEPARTAMENTOS_PERU}
              required
            />
          )}

          <FormSelect
            label="Estado"
            name="estado"
            value={formData.estado}
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
              <PlusCircle className="w-4 h-4" /> Crear Candidato
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
