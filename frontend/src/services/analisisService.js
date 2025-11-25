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

/**
 * Obtiene los KPIs de participación de votantes
 * @returns {Promise<Object>} Objeto con { totalVotantes, votosEmitidos, participacion }
 */
export const obtenerKPIsVotantes = async () => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.VOTANTES.KPIS);
    console.log("📈 KPIs de votantes recibidos:", data);
    return {
      totalVotantes: data.totalVotantes || 0,
      votosEmitidos: data.votosEmitidos || 0,
      participacion: data.participacion || 0,
    };
  } catch (error) {
    console.error("❌ Error al obtener KPIs de votantes:", error);
    return {
      totalVotantes: 0,
      votosEmitidos: 0,
      participacion: 0,
    };
  }
};

/**
 * Obtiene los resultados por partido (gráfico de barras)
 * @returns {Promise<Array>} Array de objetos con formato { partido: string, porcentaje: number, votos: number, color: string }
 */
export const obtenerResultadosPorPartido = async () => {
  try {
    const response = await fetchAPI(API_ENDPOINTS.VOTO_ANALISIS.RESULTADOS_PARTIDO);
    console.log("📊 Respuesta de resultados por partido:", response);
    
    // El backend devuelve: { data: [...], totalVotosValidos: ... }
    if (response && typeof response === 'object') {
      // Si tiene la propiedad 'data', extraer el array
      if (response.data && Array.isArray(response.data)) {
        // Mapear los colores para cada partido
        const colores = [
          "#DC2626", "#2563EB", "#EA580C", "#16A34A", "#9333EA", 
          "#7C3AED", "#F59E0B", "#64748B", "#6B7280", "#EF4444"
        ];
        
        return response.data.map((item, index) => ({
          partido: item.partido || item.label || "Sin partido",
          porcentaje: item.porcentaje || 0,
          votos: item.votos || item.value || 0,
          color: item.color || colores[index % colores.length],
        }));
      }
      
      // Si es un array directo
      if (Array.isArray(response)) {
        const colores = [
          "#DC2626", "#2563EB", "#EA580C", "#16A34A", "#9333EA", 
          "#7C3AED", "#F59E0B", "#64748B", "#6B7280", "#EF4444"
        ];
        
        return response.map((item, index) => ({
          partido: item.partido || item.label || "Sin partido",
          porcentaje: item.porcentaje || 0,
          votos: item.votos || item.value || 0,
          color: item.color || colores[index % colores.length],
        }));
      }
      
      // Si es un objeto con estructura { partido: { votos, porcentaje } }
      return Object.entries(response).map(([partido, info], index) => {
        const colores = [
          "#DC2626", "#2563EB", "#EA580C", "#16A34A", "#9333EA", 
          "#7C3AED", "#F59E0B", "#64748B", "#6B7280", "#EF4444"
        ];
        
        return {
          partido,
          porcentaje: (info && info.porcentaje) ? info.porcentaje : (info && info.porcentajeVotos) ? info.porcentajeVotos : 0,
          votos: (info && info.votos) ? info.votos : (info && info.totalVotos) ? info.totalVotos : 0,
          color: (info && info.color) ? info.color : colores[index % colores.length],
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error al obtener resultados por partido:", error);
    return [];
  }
};

/**
 * Obtiene la participación por región (para el mapa y gráficos)
 * @returns {Promise<Object>} Objeto con formato { region: { partido, porcentaje, votos, color } }
 */
export const obtenerParticipacionPorRegion = async () => {
  try {
    const response = await fetchAPI(API_ENDPOINTS.VOTO_ANALISIS.PARTICIPACION_REGION);
    console.log("🗺️ Respuesta de participación por región:", response);
    
    // El backend devuelve: { data: [...], totalVotosRegistrados: ... }
    if (response && typeof response === 'object') {
      let dataArray = [];
      
      // Si tiene la propiedad 'data', extraer el array
      if (response.data && Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (Array.isArray(response)) {
        dataArray = response;
      } else if (!Array.isArray(response)) {
        // Si ya es un objeto con estructura { region: { ... } }, retornarlo
        return response;
      }
      
      // Convertir array a objeto con estructura { region: { porcentaje, votos, color } }
      const resultado = {};
      const colores = [
        "#DC2626", "#2563EB", "#EA580C", "#16A34A", "#9333EA", 
        "#7C3AED", "#F59E0B", "#64748B", "#6B7280", "#EF4444"
      ];
      
      dataArray.forEach((item, index) => {
        // El backend devuelve { label: "Lima", value: 123, porcentaje: 45.5 }
        const region = item.label || item.region || item.departamento || `Región ${index + 1}`;
        
        resultado[region] = {
          partido: item.partido || null, // El backend no devuelve partido por región, se asignará desde Dashboard
          porcentaje: item.porcentaje || 0,
          votos: item.value || item.votos || item.totalVotos || 0,
          color: item.color || colores[index % colores.length],
        };
      });
      
      console.log("🗺️ Datos transformados:", resultado);
      return resultado;
    }
    return {};
  } catch (error) {
    console.error("Error al obtener participación por región:", error);
    return {};
  }
};

