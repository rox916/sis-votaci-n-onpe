// src/pages/panelAdmin/Analisis/components/CargarDataset.jsx

import React, { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { subirDataset } from "../../../../services/datasetsService";

export default function CargarDataset({ onFileUploaded, onError }) {
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      if (onError) onError("Por favor, selecciona un archivo CSV válido");
      return;
    }

    try {
      setLoading(true);
      if (onError) onError("");
      setFileName(file.name);

      // Subir archivo al backend
      const dataset = await subirDataset(file);
      
      // Mostrar información del archivo subido
      const fileInfo = {
        id: dataset.id || dataset.idDataset,
        nombre: dataset.nombre || file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
        fechaSubida: dataset.fechaCreacion || new Date().toISOString(),
      };
      setFileData(fileInfo);
      
      // Notificar al componente padre
      if (onFileUploaded) {
        onFileUploaded(dataset.id || dataset.idDataset, fileInfo);
      }
    } catch (err) {
      console.error("Error al subir archivo:", err);
      const errorMessage = err.message || "Error al subir el archivo. Por favor, intenta nuevamente.";
      if (onError) onError(errorMessage);
      setFileName("");
      setFileData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Paso 1: Carga de Dataset
      </h3>
      <p className="text-gray-600 mb-4">
        Selecciona el archivo con los datos electorales que deseas analizar. Formatos soportados: CSV.
      </p>
      
      {!fileData ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center mb-6">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">
            Arrastra tu archivo aquí o selecciona manualmente.
          </p>
          <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-all">
            Seleccionar archivo
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Archivo cargado exitosamente</span>
            </div>
            <p className="text-sm text-green-700">
              <strong>{fileName}</strong> ({fileData.fileSize})
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Información del archivo</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="text-lg font-bold text-gray-900">{fileData.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamaño</p>
                <p className="text-lg font-bold text-gray-900">{fileData.fileSize}</p>
              </div>
            </div>
            {fileData.fechaSubida && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Fecha de subida</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(fileData.fechaSubida).toLocaleString('es-PE')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

