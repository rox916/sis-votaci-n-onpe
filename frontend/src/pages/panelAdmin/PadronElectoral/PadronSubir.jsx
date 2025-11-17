import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function PadronSubir({ isOpen, onClose, fileInputRef }) {
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Simular validación de archivo
    if (!file.name.endsWith(".csv")) {
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simular carga progresiva
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadStatus("success"), 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleClose = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    if (fileInputRef?.current) fileInputRef.current.value = null;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenedor principal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 z-[10000] animate-fadeIn"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1A2C56]">
            Cargar Padrón Electoral
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Estado inicial */}
        {uploadStatus === "idle" && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona un archivo <strong>.csv</strong> con el padrón electoral
              para actualizar el sistema.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                         file:rounded-md file:border-0 file:text-sm file:font-semibold 
                         file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
        )}

        {/* Subiendo archivo */}
        {uploadStatus === "uploading" && (
          <div className="text-center">
            <p className="mb-2 font-semibold text-gray-700">
              Subiendo archivo...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-green-600 h-3 rounded-full"
                animate={{ width: `${uploadProgress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
          </div>
        )}

        {/* Éxito */}
        {uploadStatus === "success" && (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">
              ¡Carga Completa!
            </p>
            <p className="text-sm text-gray-600">
              El padrón electoral se ha actualizado correctamente.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Finalizar
            </button>
          </div>
        )}

        {/* Error */}
        {uploadStatus === "error" && (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">
              Error de Formato
            </p>
            <p className="text-sm text-gray-600">
              Por favor, asegúrate de subir un archivo CSV válido.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
