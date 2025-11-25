import { motion } from "framer-motion";
import { CheckCircle, Eye } from "lucide-react";

export default function CongresistaCard({ 
  candidato, 
  estaSeleccionado, 
  onSelect, 
  onVerDetalles, 
  darkMode 
}) {

    console.log("DATOS DE " + candidato.nombres, candidato);
  // Normalización de datos (para evitar errores si el backend cambia nombres)
  const foto = candidato.fotoUrl || candidato.foto;
  const nombre = candidato.nombres || candidato.nombre;
  const apellidos = candidato.apellidos || "";
  const partido = candidato.nombrePartido || candidato.partidoNombre || "Sin partido";
  const logoPartido = candidato.imagenPartido || candidato.partidoLogo;
  const distrito = candidato.region || candidato.distrito || "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(candidato.id, nombre)}
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
        estaSeleccionado
          ? `ring-4 ring-green-400 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`
          : `border-2 ${darkMode ? "border-gray-700 bg-gray-800 hover:border-blue-500" : "border-gray-300 bg-white hover:border-blue-500"}`
      }`}
    >
      {/* Icono de Check */}
      {estaSeleccionado && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 z-10"
        >
          <CheckCircle size={36} className="text-white bg-green-500 rounded-full" strokeWidth={3} />
        </motion.div>
      )}

      {/* Foto */}
      <div className={`relative h-56 overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
        <img
          src={foto}
          alt={nombre}
          className={`w-full h-full object-cover object-top transition-all ${estaSeleccionado ? "" : "grayscale hover:grayscale-0"}`}
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      {/* Nombre */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <p className="text-white text-lg font-bold text-center truncate">
          {nombre} {apellidos}
        </p>
      </div>

      {/* Info */}
      <div className={`p-4 space-y-3 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="text-center">
          <span className={`inline-block px-3 py-2 rounded-md text-sm font-semibold ${darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
            {distrito}
          </span>
        </div>

        {/* Logo y Nombre del Partido */}
        <div className="flex flex-col items-center justify-center gap-2">
          {logoPartido && (
            <div className="h-10 w-full flex items-center justify-center">
              <img src={logoPartido} alt="Partido" className="h-full object-contain" />
            </div>
          )}
          <p className={`text-sm font-bold uppercase text-center ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
            {partido}
          </p>
        </div>

        {/* Propuestas (Resumen) */}
        <div className={`border-t pt-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <p className={`text-xs font-bold mb-2 uppercase ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Propuestas:
          </p>
          <div className="space-y-1">
            {(candidato.propuestas || []).slice(0, 2).map((prop, i) => (
              <p key={i} className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                • {prop}
              </p>
            ))}
          </div>
        </div>

        {/* Botón Detalles */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVerDetalles(candidato);
          }}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-blue-300" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          <Eye className="w-4 h-4" />
          Ver Detalles
        </button>
      </div>
    </motion.div>
  );
}