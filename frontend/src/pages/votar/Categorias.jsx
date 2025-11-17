// src/pages/votar/Categorias.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Vote, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

export default function Categorias({
  fadeUp,
  categorias,              // array de categorías (antes categoriasVotacion)
  votosRealizados,          // objeto { idCategoria: candidato }
  categoriasPendientes,     // categorías que aún no se han votado
  onSeleccionarCategoria,   // función (categoria) => void
  onVolverPaso1,            // función para volver al paso 1
  onIrFinal,                // función para ir directo al paso final
}) {
  return (
    <motion.div
      key="paso2"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={fadeUp}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E40AF] text-white p-8">
        <div className="text-center">
          <div className="inline-block p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <Vote className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Selecciona la categoría para votar
          </h2>
          <p className="text-blue-100 text-lg">
            Elige una de las categorías de las Elecciones Generales 2026
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {categorias.map((categoria, index) => {
            const Icono = categoria.icono;
            const votado = votosRealizados[categoria.id];
            const esPendiente = !votado;

            return (
              <motion.div
                key={categoria.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={esPendiente ? { scale: 1.05, y: -5 } : {}}
                whileTap={esPendiente ? { scale: 0.98 } : {}}
                onClick={() =>
                  esPendiente && onSeleccionarCategoria(categoria)
                }
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                  esPendiente
                    ? "bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-[#2563EB] hover:shadow-2xl shadow-lg"
                    : "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 opacity-90 cursor-not-allowed"
                }`}
              >
                {/* Efecto de brillo al hover */}
                {esPendiente && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <div className="relative p-8">
                  {/* Icono con gradiente mejorado */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${categoria.color} flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300 ${
                        esPendiente ? "group-hover:rotate-6" : ""
                      }`}
                    >
                      <Icono className="w-12 h-12 text-white" />
                      {esPendiente && (
                        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="text-center">
                    <h3
                      className={`font-bold text-xl mb-2 ${
                        esPendiente
                          ? "text-[#1E3A8A] group-hover:text-[#2563EB]"
                          : "text-green-700"
                      } transition-colors`}
                    >
                      {categoria.titulo}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      {categoria.subtitulo}
                    </p>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                      {categoria.descripcion}
                    </p>

                    {/* Estado */}
                    {votado && (
                      <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Votado</span>
                      </div>
                    )}
                    {esPendiente && (
                      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white px-6 py-3 rounded-xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        <ArrowRight className="w-5 h-5" />
                        <span>Votar ahora</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Borde decorativo */}
                {esPendiente && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#1E40AF] to-[#2563EB] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Botón finalizar si todas están votadas */}
        {categoriasPendientes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={onIrFinal}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <CheckCircle2 className="w-6 h-6" />
              Finalizar votación
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {/* Botón volver */}
        <div className="text-center mt-8">
          <button
            onClick={onVolverPaso1}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 mx-auto group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver atrás</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
