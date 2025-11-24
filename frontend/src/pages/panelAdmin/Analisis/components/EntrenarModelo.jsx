// src/pages/panelAdmin/Analisis/components/EntrenarModelo.jsx

import React, { useState } from "react";
import { Cpu, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { entrenarModelo } from "../../../../services/mlService";
import MetricsCard from "./MetricsCard";

export default function EntrenarModelo({ 
  selectedLimpioId, 
  cleaningResults, 
  onTrainingComplete,
  onError 
}) {
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMetrics, setTrainingMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartTraining = async () => {
    if (!selectedLimpioId) {
      if (onError) onError("No hay un dataset limpio seleccionado para entrenar");
      return;
    }

    try {
      setIsTraining(true);
      setTrainingProgress(0);
      if (onError) onError("");

      // Simular progreso mientras se entrena (el backend puede tardar)
      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 90) {
            return prev; // Mantener en 90% hasta que termine
          }
          return prev + 10;
        });
      }, 500);

      // Llamar al servicio de entrenamiento
      const trainingSummary = await entrenarModelo(selectedLimpioId);
      
      clearInterval(progressInterval);
      setTrainingProgress(100);
      setIsTraining(false);

      // Guardar métricas del entrenamiento
      const metrics = {
        accuracy: trainingSummary.accuracy || 0,
        f1Score: trainingSummary.f1Score || 0,
        precision: trainingSummary.precision || 0,
        recall: trainingSummary.recall || 0,
      };
      setTrainingMetrics(metrics);

      // Notificar al componente padre
      if (onTrainingComplete) {
        onTrainingComplete(metrics);
      }
    } catch (err) {
      console.error("Error al entrenar modelo:", err);
      if (onError) onError(err.message || "Error al entrenar el modelo. Por favor, intenta nuevamente.");
      setIsTraining(false);
      setTrainingProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Paso 3: Entrenamiento del Modelo
      </h3>
      <p className="text-gray-600 mb-4">
        Entrena el modelo de predicción con los datos limpios. Este proceso puede tomar varios minutos.
      </p>

      {cleaningResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Datos para entrenamiento:</strong> {cleaningResults.registrosLimpios.toLocaleString()} registros limpios
          </p>
        </div>
      )}

      {!isTraining && trainingProgress === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-6">
          <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Presiona el botón para iniciar el entrenamiento del modelo de predicción.
          </p>
          <button
            onClick={handleStartTraining}
            disabled={loading || !selectedLimpioId}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all font-medium ${
              loading || !selectedLimpioId ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Iniciar Entrenamiento
          </button>
        </div>
      )}

      {isTraining && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-yellow-800 mb-2">
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">Entrenamiento en progreso...</span>
          </div>
          <p className="text-sm text-yellow-700">
            Por favor espera mientras el modelo se entrena. No cierres esta ventana.
          </p>
        </div>
      )}

      {trainingProgress > 0 && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso del entrenamiento</span>
              <span className="text-sm font-bold text-blue-600">{trainingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-4"
                initial={{ width: 0 }}
                animate={{ width: `${trainingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {trainingProgress < 30 && "Preparando datos..."}
              {trainingProgress >= 30 && trainingProgress < 60 && "Entrenando modelo..."}
              {trainingProgress >= 60 && trainingProgress < 90 && "Validando modelo..."}
              {trainingProgress >= 90 && trainingProgress < 100 && "Finalizando..."}
              {trainingProgress === 100 && "Entrenamiento completado"}
            </p>
          </div>

          {trainingProgress === 100 && trainingMetrics && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Entrenamiento completado exitosamente</span>
              </div>
              <p className="text-sm text-green-700 mb-4">
                El modelo ha sido entrenado con los datos procesados y está listo para generar predicciones.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricsCard title="Accuracy" value={`${(trainingMetrics.accuracy * 100).toFixed(1)}%`} />
                <MetricsCard title="F1 Score" value={trainingMetrics.f1Score.toFixed(2)} />
                <MetricsCard title="Precision" value={`${(trainingMetrics.precision * 100).toFixed(1)}%`} />
                <MetricsCard title="Recall" value={`${(trainingMetrics.recall * 100).toFixed(1)}%`} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

