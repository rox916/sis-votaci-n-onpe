import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Vote,
} from "lucide-react";

export default function AdminLogin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Credenciales de ejemplo - en producción esto vendría de una API segura
  const adminCredentials = {
    usuario: "admin",
    password: "admin123",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulación de autenticación
    setTimeout(() => {
      if (
        usuario === adminCredentials.usuario &&
        password === adminCredentials.password
      ) {
        // Guardar sesión en localStorage
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminUser", usuario);
        navigate("/admin");
      } else {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
      }
    }, 1000);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] flex items-center justify-center px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-[#0F172A] p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">
              Acceso Administrativo
            </h1>
            <p className="text-gray-600">
              Ingresa tus credenciales para acceder al panel de administración
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    setError("");
                  }}
                  placeholder="Ingresa tu usuario"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Información de seguridad */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
              <Shield className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-[#1E3A8A] mb-1">
                  Acceso restringido
                </p>
                <p>
                  Solo personal autorizado puede acceder a esta sección. Todas las
                  acciones son monitoreadas y registradas.
                </p>
              </div>
            </div>
          </div>

          {/* Nota de credenciales (solo para desarrollo) */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Usuario: admin | Contraseña: admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

