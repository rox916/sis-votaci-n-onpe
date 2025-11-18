// Importar configuración centralizada de API
import { API_BASE_URL, defaultHeaders } from "../config/apiConfig";

// Servicio para consultar votante por DNI
export const consultarVotantePorDni = async (dni) => {
  try {
    const response = await fetch(`${API_BASE_URL}/votantes/consulta/${dni}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("DNI no encontrado en el sistema");
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al consultar votante:", error);
    throw error;
  }
};

// Servicio para actualizar ubicación del votante
export const actualizarUbicacionVotante = async (dni, departamento, provincia, distrito) => {
  try {
    const response = await fetch(`${API_BASE_URL}/votantes/ubicacion/${dni}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify({
        departamento,
        provincia,
        distrito,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Votante no encontrado");
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    throw error;
  }
};

// Servicio para finalizar voto
export const finalizarVoto = async (dni) => {
  try {
    const response = await fetch(`${API_BASE_URL}/votantes/finalizar/${dni}`, {
      method: "POST",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Votante no encontrado");
      }
      if (response.status === 409) {
        throw new Error("Este votante ya ha votado");
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al finalizar voto:", error);
    throw error;
  }
};
