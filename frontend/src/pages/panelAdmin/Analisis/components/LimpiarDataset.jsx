// src/pages/panelAdmin/Analisis/components/LimpiarDataset.jsx

import React, { useState } from "react";
import { Sparkles, CheckCircle } from "lucide-react";
import { limpiarDataset } from "../../../../services/datasetsService";

export default function LimpiarDataset({ 
  selectedDatasetId, 
  fileData, 
  onCleaningComplete,
  onError 
}) {
  const [selectedCleaning, setSelectedCleaning] = useState([]);
  const [cleaningResults, setCleaningResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCleaningToggle = (item) => {
    setSelectedCleaning((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleApplyCleaning = async () => {
    if (selectedCleaning.length === 0) {
      if (onError) onError("Por favor selecciona al menos una operación de limpieza");
      return;
    }

    if (!selectedDatasetId) {
      if (onError) onError("No hay un dataset seleccionado para limpiar");
      return;
    }

    try {
      setLoading(true);
      if (onError) onError("");

      // Llamar al servicio de limpieza
      const datasetLimpio = await limpiarDataset(selectedDatasetId);

      // El backend devuelve DatasetLimpio con métricas
      const resultados = {
        idLimpio: datasetLimpio.id || datasetLimpio.idLimpio,
        registrosEliminados: datasetLimpio.registrosEliminados || 0,
        registrosLimpios: datasetLimpio.registrosLimpios || 0,
        precision: datasetLimpio.precision || 0,
        completitud: datasetLimpio.completitud || 0,
        operacionesAplicadas: selectedCleaning,
      };

      setCleaningResults(resultados);

      // Notificar al componente padre
      if (onCleaningComplete) {
        onCleaningComplete(resultados);
      }
    } catch (err) {
      console.error("Error al limpiar dataset:", err);
      if (onError) onError(err.message || "Error al aplicar limpieza de datos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const operacionesLimpieza = [
    { name: "Eliminar filas vacías", desc: "Elimina registros que no tienen información en campos críticos" },
    { name: "Corregir nombres geográficos", desc: "Normaliza y corrige nombres de regiones, provincias y distritos" },
    { name: "Eliminar duplicados", desc: "Identifica y elimina registros duplicados basados en DNI" },
    { name: "Normalizar variables numéricas", desc: "Estandariza formatos numéricos y corrige valores inconsistentes" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Paso 2: Limpieza de Datos
      </h3>
      <p className="text-gray-600 mb-4">
        Selecciona las operaciones de limpieza que deseas aplicar a los datos cargados. Esto mejorará la calidad de los datos para el análisis.
      </p>

      {fileData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Archivo a procesar:</strong> {fileData.nombre}
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Operaciones de limpieza disponibles:</h4>
        <ul className="space-y-3">
          {operacionesLimpieza.map((op, i) => (
            <li key={i} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={selectedCleaning.includes(op.name)}
                onChange={() => handleCleaningToggle(op.name)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                disabled={loading}
              />
              <div className="flex-1">
                <span className={selectedCleaning.includes(op.name) ? "font-medium text-blue-600" : "text-gray-700"}>
                  {op.name}
                </span>
                <p className="text-xs text-gray-500 mt-1">{op.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedCleaning.length > 0 && !cleaningResults && (
        <div className="mb-4">
          <button
            onClick={handleApplyCleaning}
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Procesando..." : "Aplicar Limpieza"}
          </button>
        </div>
      )}

      {cleaningResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2 text-green-800 mb-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Limpieza completada exitosamente</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-green-700 mb-1">Registros procesados</p>
              <p className="text-lg font-bold text-green-900">{cleaningResults.registrosLimpios.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-green-700 mb-1">Registros eliminados</p>
              <p className="text-lg font-bold text-green-900">{cleaningResults.registrosEliminados.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-green-700 mb-1">Precisión</p>
              <p className="text-lg font-bold text-green-900">{cleaningResults.precision}%</p>
            </div>
            <div>
              <p className="text-xs text-green-700 mb-1">Completitud</p>
              <p className="text-lg font-bold text-green-900">{cleaningResults.completitud}%</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-green-700 mb-1">Operaciones aplicadas:</p>
            <div className="flex flex-wrap gap-2">
              {cleaningResults.operacionesAplicadas.map((op, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                  {op}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

