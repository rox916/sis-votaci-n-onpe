// Importar configuración centralizada de API
import { API_BASE_URL, defaultHeaders } from "../config/apiConfig";

// Servicio para consultar votante por DNI
export const consultarVotantePorDni = async (dni) => {
  try {
    console.log(`🔍 Consultando votante con DNI: ${dni}`);
    console.log(`📍 URL: ${API_BASE_URL}/votantes/consulta/${dni}`);
    
    const response = await fetch(`${API_BASE_URL}/votantes/consulta/${dni}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    console.log(`📡 Respuesta del servidor: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      if (response.status === 404) {
        const errorMessage = `El DNI ${dni} no está registrado en el padrón electoral. Por favor, verifique que el DNI sea correcto o contacte con el administrador del sistema.`;
        console.error(`❌ ${errorMessage}`);
        throw new Error(errorMessage);
      }
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`❌ Error ${response.status}:`, errorText);
      throw new Error(`Error al consultar el padrón electoral: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Votante encontrado:`, data);
    return data;
  } catch (error) {
    console.error("❌ Error al consultar votante:", error);
    // Si el error ya tiene un mensaje descriptivo, lanzarlo tal cual
    if (error.message && error.message.includes('no está registrado')) {
      throw error;
    }
    // Si es un error de red, mejorar el mensaje
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.');
    }
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
