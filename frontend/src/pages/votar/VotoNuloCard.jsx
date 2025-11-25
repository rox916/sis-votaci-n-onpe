import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function VotoNuloCard({ seleccionado, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`group bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl relative ${
        seleccionado
          ? "border-orange-600 ring-4 ring-orange-200 shadow-orange-200"
          : "border-2 border-dashed border-orange-400 hover:border-orange-600"
      }`}
    >
      {seleccionado && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 z-10"
        >
          <CheckCircle size={40} className="text-white bg-green-500 rounded-full" strokeWidth={3} />
        </motion.div>
      )}

      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      <div className="relative bg-gradient-to-br from-orange-100 to-orange-200 h-48 flex items-center justify-center">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">∅</span>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
        <p className="text-white text-lg font-bold text-center leading-tight">Voto Nulo / En Blanco</p>
      </div>
      <div className="p-5 space-y-4 bg-white">
        <div className="text-center border-b border-orange-200 pb-3">
          <p className="text-base font-bold text-orange-600 uppercase tracking-wider">No me siento representado</p>
        </div>
        <div className="border-t border-orange-200 pt-3">
          <p className="text-sm font-bold text-gray-700 mb-1 uppercase">¿QUÉ SIGNIFICA?</p>
          <div className="space-y-1">
            <p className="text-base text-gray-800 leading-snug pl-2">• Expresas tu derecho sin elegir</p>
            <p className="text-base text-gray-800 leading-snug pl-2">• Manifiestas descontento</p>
            <p className="text-base text-gray-800 leading-snug pl-2">• Tu voto será contabilizado</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
}