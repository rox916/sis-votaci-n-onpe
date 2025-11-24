// archivo: /services/datasetsService.js
// Servicio para gestionar datasets (archivos CSV originales y limpios)

import { API_BASE_URL, defaultHeaders, API_ENDPOINTS, fetchAPI } from "../config/apiConfig";

/**
 * Obtiene la lista de archivos CSV originales subidos
 * @returns {Promise<Array>} Lista de datasets originales
 */
export const obtenerDatasetsOriginales = async () => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.DATASETS.ORIGINALES.LISTAR);
    return data;
  } catch (error) {
    console.error("Error al obtener datasets originales:", error);
    throw error;
  }
};

/**
 * Sube un nuevo archivo CSV al sistema
 * @param {File} archivo - Archivo CSV a subir
 * @returns {Promise<Object>} Dataset creado
 */
export const subirDataset = async (archivo) => {
  try {
    const formData = new FormData();
    formData.append("file", archivo);

    const url = `${API_BASE_URL}${API_ENDPOINTS.DATASETS.ORIGINALES.SUBIR}`;
    console.log("Subiendo archivo a:", url);

    const response = await fetch(url, {
      method: "POST",
      // No incluir Content-Type header, el navegador lo establece automáticamente con el boundary para FormData
      body: formData,
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
    console.error("Error al subir dataset:", error);
    
    // Mejorar mensaje de error para el usuario
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error(
        `No se pudo conectar con el servidor. Verifica que el backend esté corriendo en ${API_BASE_URL}. ` +
        `Error: ${error.message}`
      );
    }
    
    throw error;
  }
};

/**
 * Elimina un dataset original por su ID
 * @param {number|string} id - ID del dataset a eliminar
 * @returns {Promise<void>}
 */
export const eliminarDataset = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.DATASETS.ORIGINALES.ELIMINAR(id)}`,
      {
        method: "DELETE",
        headers: defaultHeaders,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error al eliminar dataset:", error);
    throw error;
  }
};

/**
 * Obtiene la lista de datasets limpios disponibles
 * @returns {Promise<Array>} Lista de datasets limpios
 */
export const obtenerDatasetsLimpios = async () => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.DATASETS.LIMPIOS.LISTAR);
    return data;
  } catch (error) {
    console.error("Error al obtener datasets limpios:", error);
    throw error;
  }
};

/**
 * Aplica limpieza de datos a un dataset original
 * @param {number|string} id - ID del dataset original a limpiar
 * @returns {Promise<Object>} DatasetLimpio con métricas (precisión, completitud, registros eliminados)
 */
export const limpiarDataset = async (id) => {
  try {
    const data = await fetchAPI(API_ENDPOINTS.DATASETS.LIMPIAR(id), {
      method: "POST",
    });
    return data;
  } catch (error) {
    console.error("Error al limpiar dataset:", error);
    throw error;
  }
};

