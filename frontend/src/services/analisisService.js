// archivo: /services/analisisService.js
// Servicio para obtener datos de análisis y gráficos

import { API_ENDPOINTS, fetchAPI } from "../config/apiConfig";

/**
 * Obtiene los datos de distribución por región
 * @param {number} idLimpio - ID del dataset limpio a analizar
 * @returns {Promise<Array>} Array de objetos con formato { label: string, value: number }
 * Ejemplo: [{ label: "LIMA", value: 24 }, { label: "CUSCO", value: 16 }]
 */
export const obtenerDistribucionPorRegion = async (idLimpio) => {
  if (!idLimpio) {
    console.warn("obtenerDistribucionPorRegion: idLimpio no proporcionado, retornando array vacío");
    return [];
  }
  try {
    const data = await fetchAPI(API_ENDPOINTS.ANALISIS.DISTRIBUCION(idLimpio));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Si es un error 400, el backend probablemente no tiene datos aún - retornar array vacío
    if (error.message && error.message.includes('400')) {
      return [];
    }
    console.error("Error al obtener distribución por región:", error);
    return [];
  }
};

/**
 * Obtiene los datos de tendencia de participación
 * @param {number} idLimpio - ID del dataset limpio a analizar
 * @returns {Promise<Array>} Array de objetos con formato { label: string, value: number }
 * Ejemplo: [{ label: "09:00", value: 40 }, { label: "10:00", value: 84 }]
 */
export const obtenerTendenciaParticipacion = async (idLimpio) => {
  if (!idLimpio) {
    console.warn("obtenerTendenciaParticipacion: idLimpio no proporcionado, retornando array vacío");
    return [];
  }
  try {
    const data = await fetchAPI(API_ENDPOINTS.ANALISIS.TENDENCIA(idLimpio));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Si es un error 400, el backend probablemente no tiene datos aún - retornar array vacío
    if (error.message && error.message.includes('400')) {
      return [];
    }
    console.error("Error al obtener tendencia de participación:", error);
    return [];
  }
};

