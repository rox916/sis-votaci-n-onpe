// archivo: /services/mlService.js
// Servicio para entrenamiento de modelos y predicciones

import { API_BASE_URL, defaultHeaders, API_ENDPOINTS, fetchAPI } from "../config/apiConfig";

/**
 * Inicia el entrenamiento del modelo con un dataset limpio
 * @param {number|string} idLimpio - ID del dataset limpio a usar para entrenar
 * @returns {Promise<Object>} TrainingSummaryDTO con métricas (accuracy, f1Score, precision, recall)
 */
export const entrenarModelo = async (idLimpio) => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.ML.ENTRENAR(idLimpio), {
      method: "POST",
    });
    return data;
  } catch (error) {
    console.error("Error al entrenar modelo:", error);
    throw error;
  }
};

/**
 * Obtiene las predicciones del modelo entrenado
 * @param {number} idLimpio - ID del dataset limpio usado para entrenar
 * @returns {Promise<Array>} Lista de PartidoPredictionDTO del backend
 * Formato: [{ partido: string, prediccion: number, confianza: number, estado: string }, ...]
 */
export const obtenerPredicciones = async (idLimpio) => {
  if (!idLimpio) {
    console.warn("obtenerPredicciones: idLimpio no proporcionado, retornando array vacío");
    return [];
  }
  try {
    const data = await fetchAPI(API_ENDPOINTS.ML.PREDICCION(idLimpio));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener predicciones:", error);
    return [];
  }
};

