// src/pages/votar/Confirmacion.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Shield, AlertCircle } from "lucide-react";

export default function Confirmacion({
  fadeUp,
  candidatoSeleccionado,
  categoriaActual,
  onVolver,      // función para volver (normalmente setPaso(3))
  onConfirmar,   // función para confirmar el voto
}) {
  if (!candidatoSeleccionado || !categoriaActual) return null;

  return (
    <motion.div
      key="paso4"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={fadeUp}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-yellow-600" />
        </div>
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-1">
            Confirma tu voto
          </h2>
          <p className="text-sm text-gray-600">
            {categoriaActual.titulo} - {categoriaActual.subtitulo}
          </p>
        </div>
        <p className="text-gray-600">
          Revisa tu selección antes de confirmar. Una vez confirmado, no podrás
          cambiar tu voto.
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-md mx-auto">
        {candidatoSeleccionado.esNulo ? (
          // ----- CONFIRMACIÓN VOTO NULO / EN BLANCO -----
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold">
                <span className="text-4xl">∅</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">
                  {candidatoSeleccionado.nombre}
                </h3>
                <p className="text-gray-600">
                  {candidatoSeleccionado.partido}
                </p>
              </div>
            </div>
            <div className="border-t border-orange-200 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Información importante:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Tu voto será registrado como <strong>nulo</strong> o{" "}
                    <strong>en blanco</strong>.
                  </span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Este voto será contabilizado pero no favorecerá a ningún
                    candidato.
                  </span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Es una forma válida de ejercer tu derecho al voto.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // ----- CONFIRMACIÓN CANDIDATO NORMAL -----
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#2563EB] rounded-xl p-6 mb-6">
            <div className="flex items-center gap-6 mb-4">
              <div className="relative">
                <img
                  src={candidatoSeleccionado.foto || candidatoSeleccionado.logoPartido || ''}
                  alt={candidatoSeleccionado.nombre}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
                  onError={(e) => {
                    if (candidatoSeleccionado.logoPartido && e.target.src !== candidatoSeleccionado.logoPartido) {
                      e.target.src = candidatoSeleccionado.logoPartido;
                    } else {
                      e.target.style.display = 'none';
                    }
                  }}
                />
                <div className="absolute -top-2 -right-2 bg-[#2563EB] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {candidatoSeleccionado.numero}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-[#1E3A8A] mb-1">
                  {candidatoSeleccionado.nombre}
                </h3>
                <p className="text-gray-600 font-semibold">
                  {candidatoSeleccionado.partido}
                </p>
                {candidatoSeleccionado.distrito && (
                  <p className="text-sm text-gray-500 mt-1">
                    Distrito: {candidatoSeleccionado.distrito}
                  </p>
                )}
              </div>
            </div>

            {candidatoSeleccionado.vicepresidentes && (
              <div className="border-t border-blue-200 pt-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Vicepresidentes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidatoSeleccionado.vicepresidentes.map((vp, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
                    >
                      {vp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-blue-200 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Propuestas:
              </p>
              <ul className="space-y-2">
                {candidatoSeleccionado.propuestas.map((propuesta, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0" />
                    <span>{propuesta}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* INFO SEGURIDAD */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#2563EB] mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-[#1E3A8A] mb-1">
                Tu voto es secreto
              </p>
              <p>
                Tu selección está encriptada y será anónima. Nadie podrá conocer
                tu elección.
              </p>
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4">
          <button
            onClick={onVolver}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Volver
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Confirmar voto
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
