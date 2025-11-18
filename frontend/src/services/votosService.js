// archivo: /services/votosService.js
// Este archivo contiene los servicios para registrar votos en la API

// Importar configuración centralizada de API
import { API_BASE_URL, defaultHeaders } from "../config/apiConfig";

/**
 * Registra un voto en el backend.
 * @param {string} dniVotante - DNI del votante verificado
 * @param {number|null} idCandidato - ID del candidato (null para voto nulo; se convierte a 0 antes de enviar)
 * @param {string} cargoVotado - Cargo votado (ej. 'Presidente', 'Congresista', 'Parlamentario Andino')
 */
export const registrarVoto = async (dniVotante, idCandidato, cargoVotado = "DESCONOCIDO", candidatoNombre = null, partidoNombre = null) => {
  try {
    // Convertir null a 0 para voto nulo (el backend convertirá 0 a null)
    const idCandidatoEnvio = idCandidato === null ? 0 : idCandidato;
    
    console.log("registrarVoto - Enviando:", { dniVotante, idCandidato: idCandidatoEnvio, cargoVotado, candidatoNombre, partidoNombre });
    
    const bodyJSON = {
      dniVotante,
      idCandidato: idCandidatoEnvio,
      cargoVotado,
      candidatoNombre,
      partidoNombre,
    };
    console.log(">>> JSON que se enviará al backend:", JSON.stringify(bodyJSON, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/votos/registrar`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(bodyJSON),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Votante o candidato no encontrado");
      }
      if (response.status === 500) {
        throw new Error("Error interno del servidor al registrar el voto");
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al registrar voto:", error);
    throw error;
  }
};
