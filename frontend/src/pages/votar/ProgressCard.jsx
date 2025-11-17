// src/pages/Votar/ProgressCard.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function ProgressCard({
  fadeUp,
  votosRealizados,
  categorias,
  progreso,
}) {
  const completadas = Object.keys(votosRealizados).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 block">
                Progreso de Votación
              </span>
              <span className="text-sm text-gray-500">
                {completadas} de {categorias.length} categorías completadas
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#2563EB]">
              {Math.round(progreso)}%
            </div>
            <div className="text-xs text-gray-500">Completado</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="relative">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 rounded-full shadow-lg"
            />
          </div>

          {/* Iconos por categoría */}
          <div className="flex justify-between mt-4 gap-2">
            {categorias.map((cat) => {
              const Icono = cat.icono;
              const votado = votosRealizados[cat.id];
              return (
                <div
                  key={cat.id}
                  className="flex-1 text-center"
                  title={cat.titulo}
                >
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-all ${
                      votado
                        ? "bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg scale-110"
                        : "bg-gray-200"
                    }`}
                  >
                    <Icono
                      className={`w-5 h-5 ${
                        votado ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      votado ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {votado ? "✓" : "○"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
