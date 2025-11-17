import { motion, AnimatePresence } from "framer-motion";
import { Vote, Shield, AlertCircle, UserCheck, MapPin, ArrowLeft, Check, Loader } from "lucide-react";
import { useState } from "react";
// Importamos useNavigate
import { useNavigate } from "react-router-dom";
// Importamos la imagen del mapa
import mapaPeruImg from "../../assets/images/mapa-peru-3d.png";
// Importamos el servicio de votantes
import { 
  consultarVotantePorDni, 
  actualizarUbicacionVotante
} from "../../services/votantesService";

// Departamentos del Perú - Coordenadas ajustadas según tu mapa de referencia
const DEPARTAMENTOS = [
  { id: 1, nombre: "Amazonas", x: 39.5, y: 25.5 }, // Antes 49, 23
  { id: 2, nombre: "Áncash", x: 40.4, y: 49.5 },     // Antes 46, 35
  { id: 3, nombre: "Apurímac", x: 57.4, y: 75.5 }, // Antes 51, 55
  { id: 4, nombre: "Arequipa", x: 59, y: 81 },   // Antes 50, 72
  { id: 5, nombre: "Ayacucho", x: 53, y: 73 },   // Antes 50, 52
  { id: 6, nombre: "Cajamarca", x: 36.8, y: 31.5 },    // Antes 46, 25
  { id: 7, nombre: "Cusco", x: 59, y: 67.5 },     // Antes 54, 57
  { id: 8, nombre: "Huancavelica", x: 49.7, y: 68 }, // Antes 48, 49
  { id: 9, nombre: "Huánuco", x: 46.1, y: 51 }, // Antes 48, 37
  { id: 10, nombre: "Ica", x: 48  , y: 75 },        // Antes 47, 53
  { id: 11, nombre: "Junín", x: 50, y: 61},    // Antes 50, 43
  { id: 12, nombre: "La Libertad", x: 37, y: 43 }, // Antes 45, 30
  { id: 13, nombre: "Lambayeque", x: 33.4, y: 35.9 }, // Antes 44, 24
  { id: 14, nombre: "Lima", x: 44.5, y: 62 },     // Antes 47, 44
  { id: 15, nombre: "Loreto", x: 50, y: 24 },   // Antes 62, 28
  { id: 16, nombre: "Madre de Dios", x: 66, y: 62 }, // Antes 60, 61
  { id: 17, nombre: "Moquegua", x: 64, y: 87 }, // Antes 51, 79
  { id: 18, nombre: "Pasco", x: 51, y: 55 },      // Antes 49, 40
  { id: 19, nombre: "Piura", x: 32, y: 28.7 },      // Antes 43, 19
  { id: 20, nombre: "Puno", x: 67, y: 73.5 },     // Antes 55, 73
  { id: 21, nombre: "San Martín", x: 44, y: 40 }, // Antes 50, 31
  { id: 22, nombre: "Tacna", x: 66, y: 93 },    // Antes 52, 84
  { id: 23, nombre: "Tumbes", x: 31, y: 22 },   // Antes 42, 15
  { id: 24, nombre: "Ucayali", x: 57, y: 53 },  // Antes 56, 42
];

export default function Verificacion() {
  const [step, setStep] = useState(1);
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [votante, setVotante] = useState(null);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
  const [distrito, setDistrito] = useState("");
  const [provincia, setProvincia] = useState("");

  // Inicializamos useNavigate
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const verificarDNI = async () => {
    if (!dni || dni.length < 8) {
      setError("Debe ingresar un DNI válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const datosVotante = await consultarVotantePorDni(dni);
      setVotante(datosVotante);
      setStep(2);
    } catch (err) {
      setError(err.message || "Error al consultar el DNI");
      setVotante(null);
    } finally {
      setLoading(false);
    }
  };

  const procederActualizarUbicacion = () => {
    if (!departamentoSeleccionado) {
      setError("Debe seleccionar un departamento");
      return;
    }
    setError("");
    // Después de seleccionar departamento, vamos a completar provincia/distrito
    setStep(5);
  };

  const procederAVerificacion = async () => {
    if (!distrito.trim() || !provincia.trim()) {
      setError("Debe completar todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Actualizar la ubicación del votante en el backend
      await actualizarUbicacionVotante(
        dni,
        departamentoSeleccionado.nombre,
        provincia,
        distrito
      );

      // Actualizar el estado local del votante con los nuevos datos
      setVotante(prev => ({
        ...prev,
        departamento: departamentoSeleccionado.nombre,
        provincia: provincia,
        distrito: distrito
      }));

      // Volver a la pantalla de datos del votante
      setStep(2);
    } catch (err) {
      setError(err.message || "Error al actualizar la ubicación");
    } finally {
      setLoading(false);
    }
  };

  const procederCaptcha = () => {
    if (!captchaInput || captchaInput.length < 4) {
      setError("Debe completar el código de verificación");
      return;
    }

    if (captchaInput === captchaCode) {
      setError("");
      // Si el captcha es correcto, finalizamos la verificación (marcar votante como listo y navegar a votar)
      completarVerificacion();
    } else {
      setError("El código ingresado es incorrecto");
      setCaptchaInput("");
      generateCaptcha();
    }
  };

  const completarVerificacion = () => {
    // Solo navega a /votar sin marcar como votado aún
    // El votante se marcará como votado solo cuando termine todas las votaciones (en Final.jsx)
    navigate('/votar', {
      state: {
        dni: dni,
        votante: votante,
        departamento: votante.departamento,
        provincia: votante.provincia,
        distrito: votante.distrito
      }
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      variants={fadeUp}
      // Esta es la "tarjeta" blanca que se adapta al PublicLayout
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg border border-gray-100 mt-8 mb-8"
    >
      
      {/* Encabezado azul adaptado como un "card" dentro de la página */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-lg mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              OFICINA NACIONAL DE PROCESOS ELECTORALES
            </h2>
            <p className="text-xs text-blue-100">
              Sistema Electoral Digital Nacional
            </p>
          </div>
        </div>
      </div>
      
      {/* Contenedor para el contenido de los pasos */}
      <div>
        <AnimatePresence mode="wait">
          {step === 1 && (
             <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto" // mx-auto para centrar dentro del contenedor principal
            >
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                CONSULTE SU IDENTIDAD PARA VOTAR
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Ingrese su Documento Nacional de Identidad (DNI)
              </p>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-blue-900">&gt;</span>
                    Ingrese su DNI:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dni}
                      onChange={(e) => {
                        const newDni = e.target.value.replace(/\D/g, "").slice(0, 8);
                        setDni(newDni);
                        setError("");
                      }}
                      placeholder="Ejemplo: 12345678"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-lg font-medium bg-white"
                      maxLength={8}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <UserCheck className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-6">
                    DNIs de prueba: 12345678, 87654321, 11111111, 22222222, 33333333, 44444444, 55555555, 66666666, 77777777, 88888888, 99999999
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-700 bg-red-50 border-2 border-red-200 p-4 rounded-lg mt-4"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                <button
                  onClick={verificarDNI}
                  disabled={!dni || dni.length < 8 || loading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-800 hover:to-blue-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      CONSULTANDO...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      CONSULTAR
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && votante && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-blue-900">
                  DATOS DEL ELECTOR
                </h3>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombres</p>
                    <p className="text-lg font-bold text-blue-900">{votante.nombres}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Apellidos</p>
                    <p className="text-lg font-bold text-blue-900">{votante.apellidos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                    <p className="text-lg font-bold text-blue-900">
                      {new Date(votante.fechaNac).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sexo</p>
                    <p className="text-lg font-bold text-blue-900">{votante.sexo}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">DNI</p>
                    <p className="text-lg font-bold text-blue-900">{votante.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departamento</p>
                    <p className="text-lg font-bold text-blue-900">{votante.departamento || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Provincia</p>
                    <p className="text-lg font-bold text-blue-900">{votante.provincia || "No especificado"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Distrito</p>
                    <p className="text-lg font-bold text-blue-900">{votante.distrito || "No especificado"}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDepartamentoSeleccionado(null);
                    setProvincia("");
                    setDistrito("");
                    setStep(4);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 uppercase tracking-wide shadow-lg"
                >
                  <MapPin className="w-5 h-5 inline mr-2" />
                  ACTUALIZAR UBICACIÓN
                </button>
                <button
                  onClick={() => {
                    generateCaptcha();
                    setStep(3);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-800 hover:to-blue-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 uppercase tracking-wide shadow-lg"
                >
                  CONTINUAR CON VERIFICACIÓN
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-blue-900">
                  VERIFICACIÓN DE SEGURIDAD
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Ingrese el código que aparece en la imagen:
                </label>

                <div className="flex gap-3 items-center mb-6">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                      setError("");
                    }}
                    placeholder="Código"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-lg font-bold uppercase tracking-widest"
                    maxLength={4}
                  />
                  <div className="relative bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center min-w-[120px] h-[52px] overflow-hidden">
                    <span className="text-2xl font-bold text-gray-800 tracking-wider">{captchaCode}</span>
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-gray-600 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-700 bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-4"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                <button
                  onClick={procederCaptcha}
                  disabled={!captchaInput || captchaInput.length < 4}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-800 hover:to-blue-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      VERIFICANDO...
                    </>
                  ) : (
                    "VERIFICAR"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-blue-900">
                  SELECCIONE SU DEPARTAMENTO
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <p className="text-gray-600 mb-4 text-center font-medium">Haga clic en el departamento donde votará</p>
                
                <div 
                  className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-xl mb-6 border-2 border-blue-200 shadow-inner overflow-hidden"
                  style={{ aspectRatio: "9 / 11.5" }}
                >
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-blue-300 shadow-lg z-20">
                    <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      MAPA DEL PERÚ
                    </p>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-lg border-2 border-gray-200 z-20">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Leyenda:</p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" fill="currentColor" />
                        <span className="text-xs text-gray-600">Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" fill="currentColor" />
                        <span className="text-xs text-gray-600">Seleccionado</span>
                      </div>
                    </div>
                  </div>

                  <img
                    src={mapaPeruImg}
                    alt="Mapa del Perú - Seleccionar Departamento"
                    className="absolute inset-0 w-full h-full object-fill z-0"
                    style={{ filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))" }}
                  />

                  <div className="absolute inset-0 z-10">
                    {DEPARTAMENTOS.map((dept) => (
                      <div
                        key={dept.id}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${dept.x}%`,
                          top: `${dept.y}%`,
                        }}
                      >
                        <button
                          onClick={() => {
                            setDepartamentoSeleccionado(dept);
                            setError("");
                          }}
                          className="pointer-events-auto flex flex-col items-center group -translate-x-1/2 -translate-y-1/2"
                          title={`Seleccionar ${dept.nombre}`}
                        >
                          <div className={`relative transition-all duration-200 ${departamentoSeleccionado?.id === dept.id ? "scale-110" : ""}`}>
                            <MapPin 
                              className={`w-5 h-5 transition-colors duration-200 ${ 
                                departamentoSeleccionado?.id === dept.id
                                  ? "text-green-600"
                                  : "text-red-500 group-hover:text-red-600"
                              }`}
                              fill="currentColor"
                              strokeWidth={1.5}
                            />
                            {departamentoSeleccionado?.id === dept.id && (
                              <motion.div
                                initial={{ scale: 1, opacity: 0.6 }}
                                animate={{ scale: 1.8, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-green-500 -z-10"
                              />
                            )}
                          </div>
                          <div className={`mt-0.5 px-1 py-0.5 rounded text-[0.6rem] font-semibold transition-all duration-200 shadow-sm whitespace-nowrap ${
                            departamentoSeleccionado?.id === dept.id
                              ? "bg-green-600 text-white"
                              : "bg-white text-gray-800 group-hover:bg-blue-50 group-hover:text-blue-700"
                          } border ${
                            departamentoSeleccionado?.id === dept.id
                              ? "border-green-700"
                              : "border-gray-300"
                          }`}>
                            {dept.nombre}
                          </div>
                          {departamentoSeleccionado?.id === dept.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-0.5 -right-0.5 bg-green-600 rounded-full p-0.5 shadow-md"
                            >
                              <Check className="w-1.5 h-1.5 text-white" />
                            </motion.div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

                {departamentoSeleccionado && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2"
                  >
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      Departamento seleccionado: <strong>{departamentoSeleccionado.nombre}</strong>
                    </span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-700 bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-4"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                <button
                  onClick={procederActualizarUbicacion}
                  disabled={!departamentoSeleccionado}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-800 hover:to-blue-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  CONTINUAR
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep(4)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-blue-900">
                  COMPLETE SU UBICACIÓN
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento (Seleccionado)
                    </label>
                    <div className="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-blue-900 font-bold">
                      {departamentoSeleccionado?.nombre}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provincia
                    </label>
                    <input
                      type="text"
                      value={provincia}
                      onChange={(e) => {
                        setProvincia(e.target.value);
                        setError("");
                      }}
                      placeholder="Ejemplo: Lima"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Distrito
                    </label>
                    <input
                      type="text"
                      value={distrito}
                      onChange={(e) => {
                        setDistrito(e.target.value);
                        setError("");
                      }}
                      placeholder="Ejemplo: San Isidro"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-700 bg-red-50 border-2 border-red-200 p-4 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}

                  <button
                    onClick={procederAVerificacion}
                    disabled={!provincia.trim() || !distrito.trim() || loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        FINALIZANDO...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        COMPLETAR VERIFICACIÓN
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-blue-900 mb-1">
                Su información está protegida
              </p>
              <p>
                Utilizamos encriptación de extremo a extremo para proteger sus datos personales.
              </p>
            </div>
          </div>
        </div>
      </div> {/* Fin del contenedor de los pasos */}
    </motion.div>
  );
}
