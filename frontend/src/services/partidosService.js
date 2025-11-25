// archivo: /services/partidosService.js
// Servicio para gestionar partidos políticos

import { API_BASE_URL, defaultHeaders, API_ENDPOINTS, fetchAPI } from "../config/apiConfig";

/**
 * Obtiene todos los partidos desde la API
 * @returns {Promise<Array>} Lista de partidos
 */
export const obtenerPartidos = async () => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.PARTIDOS.LISTAR);
    return data;
  } catch (error) {
    console.error("Error al obtener partidos:", error);
    throw error;
  }
};

/**
 * Obtiene un partido por su ID
 * @param {number|string} id - ID del partido
 * @returns {Promise<Object>} Partido
 */
export const obtenerPartidoPorId = async (id) => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.PARTIDOS.POR_ID(id));
    return data;
  } catch (error) {
    console.error("Error al obtener partido:", error);
    throw error;
  }
};

/**
 * Crea un nuevo partido
 * @param {Object} partidoData - Datos del partido
 * @returns {Promise<Object>} Partido creado
 */
export const crearPartido = async (partidoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PARTIDOS.LISTAR}`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(partidoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear partido:", error);
    throw error;
  }
};

/**
 * Actualiza un partido existente
 * @param {number|string} id - ID del partido
 * @param {Object} partidoData - Datos actualizados del partido
 * @returns {Promise<Object>} Partido actualizado
 */
export const actualizarPartido = async (id, partidoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PARTIDOS.POR_ID(id)}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(partidoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar partido:", error);
    throw error;
  }
};

/**
 * Elimina un partido
 * @param {number|string} id - ID del partido a eliminar
 * @returns {Promise<void>}
 */
export const eliminarPartido = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PARTIDOS.POR_ID(id)}`, {
      method: "DELETE",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error al eliminar partido:", error);
    throw error;
  }
};


