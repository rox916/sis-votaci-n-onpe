/**
 * Componentes de formulario reutilizables
 * Proporcionan inputs y selects estilizados consistentes para toda la aplicación
 */

/**
 * Componente Input reutilizable con label
 * @param {string} label - Texto del label del input
 * @param {object} props - Props adicionales para el input (value, onChange, etc.)
 */
export function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

/**
 * Componente Select reutilizable con label
 * @param {string} label - Texto del label del select
 * @param {Array} options - Array de opciones para el select
 * @param {object} props - Props adicionales para el select (value, onChange, etc.)
 */
export function FormSelect({ label, options, ...props }) {
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

