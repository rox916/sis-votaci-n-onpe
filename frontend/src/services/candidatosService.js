/**
 * Servicio compartido para gestionar candidatos electorales
 * 
 * Este servicio centraliza la gestión de candidatos para que sean accesibles
 * tanto desde el panel de administración como desde la página de votación.
 * Los datos se almacenan en localStorage para persistencia entre sesiones.
 * 
 * Funcionalidades:
 * - Almacenamiento y recuperación de candidatos
 * - Transformación de datos para diferentes vistas (admin vs votación)
 * - Agrupación de presidentes con sus vicepresidentes
 * - Filtrado por estado (activo/inactivo)
 */

import { initialCandidatos } from './data/candidatosData';
import { propuestasPorPartido } from './data/propuestasData';
import { fetchAPI, API_ENDPOINTS, API_BASE_URL, defaultHeaders } from "../config/apiConfig";

// Clave para almacenar candidatos en localStorage
const CANDIDATOS_STORAGE_KEY = 'candidatos_electorales';

// NOTA: Los datos simulados han sido eliminados. Todos los candidatos se cargan desde la API.
// Este servicio ahora solo usa localStorage como caché temporal de datos de la API.

/**
 * Inicializa los datos de candidatos en localStorage (vacío, ya no hay datos simulados)
 */
const initializeData = () => {
  const stored = localStorage.getItem(CANDIDATOS_STORAGE_KEY);
  if (!stored) {
    // Inicializar con array vacío en lugar de datos simulados
    localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify([]));
  }
};

/**
 * Obtiene todos los candidatos almacenados
 * @returns {Array} Lista de todos los candidatos (vacío si no hay datos en localStorage)
 */
export const getCandidatos = () => {
  initializeData();
  const data = localStorage.getItem(CANDIDATOS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Guarda la lista de candidatos en localStorage
 * @param {Array} candidatos - Lista de candidatos a guardar
 */
export const saveCandidatos = (candidatos) => {
  localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(candidatos));
};

/**
 * Fuerza la actualización de los datos (ahora vacía, ya no hay datos simulados)
 * Útil para limpiar el caché de localStorage
 */
export const forceUpdateCandidatos = () => {
  localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify([]));
  return [];
};

/**
 * Obtiene candidatos filtrados por cargo específico
 * @param {string} cargo - Cargo a filtrar (Presidente, Vicepresidente, Congresista, etc.)
 * @returns {Array} Lista de candidatos activos con el cargo especificado
 */
export const getCandidatosPorCargo = (cargo) => {
  const candidatos = getCandidatos();
  return candidatos.filter(c => c.cargo === cargo && c.estado === "Activo");
};

/**
 * Obtiene candidatos organizados por categoría para la página de votación
 * Agrupa presidentes con sus vicepresidentes y organiza por categorías
 * @returns {Object} Objeto con candidatos organizados por categoría (presidente, congresistas, parlamentoAndino)
 */
export const getCandidatosParaVotacion = () => {
  const candidatos = getCandidatos();
  console.log("=== getCandidatosParaVotacion: Raw candidatos ===", candidatos);

  // Filtrar solo candidatos activos para mostrar en votación
  const activos = candidatos.filter(c => c.estado === "Activo");
  console.log("=== Candidatos activos ===", activos);

  // Agrupar presidentes con sus vicepresidentes correspondientes
  const presidentes = activos.filter(c => c.cargo === "Presidente");
  console.log("=== Presidentes sin Vice ===", presidentes);

  const presidentesConVice = presidentes.map((pres, idx) => {
    const vicepresidentes = activos.filter(
      c => (c.cargo === "Primer Vicepresidente" || c.cargo === "Segundo Vicepresidente" || c.cargo === "Vicepresidente") && 
      c.numeroLista === pres.numeroLista && 
      c.partidoPolitico === pres.partidoPolitico
    ).sort((a, b) => {
      if (a.cargo === "Primer Vicepresidente") return -1;
      if (b.cargo === "Primer Vicepresidente") return 1;
      if (a.cargo === "Segundo Vicepresidente") return -1;
      if (b.cargo === "Segundo Vicepresidente") return 1;
      return 0;
    });

    const transformado = {
      id: pres.idCandidato || `fallback-pres-${idx}`,
      nombre: pres.nombreCompleto,
      partido: pres.idPartido,
      numero: 0,
      foto: pres.foto || "",
      vicepresidentes: vicepresidentes.map(v => v.nombreCompleto),
      propuestas: pres.propuestas || [],
    };
    console.log(`Presidente ${idx}:`, transformado);
    return transformado;
  });

  // Transformar candidatos a congresistas
  const congresistas = activos
    .filter(c => c.cargo === "Congresista")
    .map((c, idx) => {
      const transformado = {
        id: c.idCandidato || `fallback-cong-${idx}`,
        nombre: c.nombreCompleto,
        partido: c.idPartido,
        numero: 0,
        foto: c.foto || "",
        distrito: c.distrito || "Lima",
        propuestas: c.propuestas || [],
      };
      console.log(`Congresista ${idx}:`, transformado);
      return transformado;
    });

  // Transformar candidatos a parlamentarios andinos
  const parlamentoAndino = activos
    .filter(c => c.cargo === "Parlamentario Andino")
    .map((c, idx) => {
      const transformado = {
        id: c.idCandidato || `fallback-andi-${idx}`,
        nombre: c.nombreCompleto,
        partido: c.idPartido,
        numero: 0,
        foto: c.foto || "",
        propuestas: c.propuestas || [],
      };
      console.log(`Andino ${idx}:`, transformado);
      return transformado;
    });

  console.log("=== RESULTADO FINAL ===", {
    presidente: presidentesConVice,
    congresistas,
    parlamentoAndino
  });

  return {
    presidente: presidentesConVice,
    congresistas: congresistas,
    parlamentoAndino: parlamentoAndino,
  };
};

// Inicializar datos al cargar el módulo
initializeData();

// ============================================
// FUNCIONES PARA COMUNICARSE CON LA API DEL BACKEND
// ============================================

/**
 * Obtiene todos los candidatos desde la API del backend
 * @returns {Promise<Array>} Lista de candidatos
 */
export const obtenerCandidatosDesdeAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.LISTAR}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener candidatos desde API:", error);
    throw error;
  }
};

/**
 * Obtiene todos los partidos desde la API para mapear nombres a IDs
 * @returns {Promise<Array>} Lista de partidos
 */
export const obtenerPartidosDesdeAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PARTIDOS.LISTAR}`, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener partidos desde API:", error);
    throw error;
  }
};

/**
 * Busca el ID de un partido por su nombre
 * @param {string} nombrePartido - Nombre del partido
 * @returns {Promise<number|null>} ID del partido o null si no se encuentra
 */
export const obtenerIdPartidoPorNombre = async (nombrePartido) => {
  try {
    console.log("=== Buscando ID del partido ===", nombrePartido);
    const partidos = await obtenerPartidosDesdeAPI();
    console.log("=== Partidos disponibles ===", partidos);
    const partido = partidos.find(p => p.nombre === nombrePartido);
    console.log("=== Partido encontrado ===", partido);
    return partido ? partido.idPartido : null;
  } catch (error) {
    console.error("Error al buscar ID del partido:", error);
    return null;
  }
};

/**
 * Crea un nuevo candidato en el backend
 * Detecta automáticamente el tipo de candidato y usa el endpoint correcto
 * @param {Object} candidatoData - Datos del candidato
 * @returns {Promise<Object>} Candidato creado
 */
export const crearCandidatoEnAPI = async (candidatoData) => {
  try {
    console.log("=== crearCandidatoEnAPI - Datos recibidos ===", candidatoData);
    
    const cargo = candidatoData.cargo;
    
    // Detectar tipo de candidato y usar función específica
    if (cargo === "Congresista") {
      return await crearCongresistaEnAPI(candidatoData);
    } else if (cargo === "Parlamentario Andino") {
      return await crearParlamentarioAndinoEnAPI(candidatoData);
    } else if (cargo === "Presidente" || cargo === "Primer Vicepresidente" || cargo === "Segundo Vicepresidente") {
      return await crearPresidenteEnAPI(candidatoData);
    } else {
      // Para otros cargos, usar el endpoint general de candidatos
      return await crearCandidatoGeneralEnAPI(candidatoData);
    }
  } catch (error) {
    console.error("=== Error completo al crear candidato ===", error);
    if (error.message) {
      throw error;
    }
    throw new Error(`Error al crear candidato: ${error.toString()}`);
  }
};

/**
 * Crea un congresista en el backend
 * @param {Object} candidatoData - Datos del candidato
 * @returns {Promise<Object>} Congresista creado
 */
export const crearCongresistaEnAPI = async (candidatoData) => {
  try {
    const idPartido = await obtenerIdPartidoPorNombre(candidatoData.partidoPolitico);
    if (!idPartido) {
      throw new Error(`No se encontró el partido: ${candidatoData.partidoPolitico}`);
    }

    // Separar nombre completo en nombres y apellidos
    const nombreCompleto = candidatoData.nombre || candidatoData.nombreCompleto || "";
    const partesNombre = nombreCompleto.split(" ");
    const nombres = partesNombre.slice(0, -1).join(" ") || nombreCompleto;
    const apellidos = partesNombre.slice(-1).join(" ") || "";

    // Mapear campos según el modelo Congresista del backend
    const congresistaParaBackend = {
      nombres: nombres,
      apellidos: apellidos,
      dni: candidatoData.dni || "",
      fotoUrl: candidatoData.foto || null,
      region: candidatoData.distrito || "",
      numeroEnLista: parseInt(candidatoData.numeroLista) || 1,
      biografia: candidatoData.biografia || null,
      propuestas: candidatoData.propuestas || null,
      partidoPolitico: {
        idPartido: idPartido
      }
    };

    console.log("=== Creando congresista ===", congresistaParaBackend);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.CREAR_CONGRESISTA}`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(congresistaParaBackend),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("=== Congresista creado exitosamente ===", data);
    return data;
  } catch (error) {
    console.error("Error al crear congresista:", error);
    throw error;
  }
};

/**
 * Crea un parlamentario andino en el backend
 * @param {Object} candidatoData - Datos del candidato
 * @returns {Promise<Object>} Parlamentario creado
 */
export const crearParlamentarioAndinoEnAPI = async (candidatoData) => {
  try {
    const idPartido = await obtenerIdPartidoPorNombre(candidatoData.partidoPolitico);
    if (!idPartido) {
      throw new Error(`No se encontró el partido: ${candidatoData.partidoPolitico}`);
    }

    // Separar nombre completo en nombres y apellidos
    const nombreCompleto = candidatoData.nombre || candidatoData.nombreCompleto || "";
    const partesNombre = nombreCompleto.split(" ");
    const nombres = partesNombre.slice(0, -1).join(" ") || nombreCompleto;
    const apellidos = partesNombre.slice(-1).join(" ") || "";

    // Mapear campos según el modelo ParlamentoAndino del backend
    // NOTA: El modelo ParlamentoAndino NO tiene biografia ni propuestas
    const parlamentarioParaBackend = {
      nombres: nombres,
      apellidos: apellidos,
      dni: candidatoData.dni || "",
      fotoUrl: candidatoData.foto || null,
      numeroEnLista: parseInt(candidatoData.numeroLista) || 1,
      partidoPolitico: {
        idPartido: idPartido
      }
    };

    console.log("=== Creando parlamentario andino ===", parlamentarioParaBackend);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.CREAR_PARLAMENTARIO}`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(parlamentarioParaBackend),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("=== Parlamentario andino creado exitosamente ===", data);
    return data;
  } catch (error) {
    console.error("Error al crear parlamentario andino:", error);
    throw error;
  }
};

/**
 * Crea un presidente/vicepresidente en el backend
 * @param {Object} candidatoData - Datos del candidato
 * @returns {Promise<Object>} Presidente creado
 */
export const crearPresidenteEnAPI = async (candidatoData) => {
  try {
    const idPartido = await obtenerIdPartidoPorNombre(candidatoData.partidoPolitico);
    if (!idPartido) {
      throw new Error(`No se encontró el partido: ${candidatoData.partidoPolitico}`);
    }

    // Separar nombre completo en nombres y apellidos
    const nombreCompleto = candidatoData.nombre || candidatoData.nombreCompleto || "";
    const partesNombre = nombreCompleto.split(" ");
    const nombres = partesNombre.slice(0, -1).join(" ") || nombreCompleto;
    const apellidos = partesNombre.slice(-1).join(" ") || "";

    // Mapear campos según el modelo Presidente del backend
    // NOTA: El modelo Presidente NO tiene dni
    const presidenteParaBackend = {
      nombres: nombres,
      apellidos: apellidos,
      fotoUrl: candidatoData.foto || null,
      biografia: candidatoData.biografia || null,
      propuestas: candidatoData.propuestas || null,
      partidoPolitico: {
        idPartido: idPartido
      }
    };

    console.log("=== Creando presidente ===", presidenteParaBackend);

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.CREAR_PRESIDENTE}`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(presidenteParaBackend),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("=== Presidente creado exitosamente ===", data);
    return data;
  } catch (error) {
    console.error("Error al crear presidente:", error);
    throw error;
  }
};

/**
 * Crea un candidato en la tabla general de candidatos (para otros cargos)
 * @param {Object} candidatoData - Datos del candidato
 * @returns {Promise<Object>} Candidato creado
 */
const crearCandidatoGeneralEnAPI = async (candidatoData) => {
  try {
    const idPartido = await obtenerIdPartidoPorNombre(candidatoData.partidoPolitico);
    if (!idPartido) {
      throw new Error(`No se encontró el partido: ${candidatoData.partidoPolitico}`);
    }

    const candidatoParaBackend = {
      idPartido: idPartido,
      nombreCompleto: candidatoData.nombre || candidatoData.nombreCompleto,
      biografia: candidatoData.biografia || null,
      propuestas: candidatoData.propuestas || null,
      cargo: candidatoData.cargo,
      distrito: candidatoData.distrito || null,
      foto: candidatoData.foto || null,
      estado: candidatoData.estado || "Activo",
    };

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.LISTAR}`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(candidatoParaBackend),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear candidato general:", error);
    throw error;
  }
};

/**
 * Actualiza un candidato existente en el backend
 * @param {number} idCandidato - ID del candidato a actualizar
 * @param {Object} candidatoData - Datos actualizados del candidato
 * @returns {Promise<Object>} Candidato actualizado
 */
export const actualizarCandidatoEnAPI = async (idCandidato, candidatoData) => {
  try {
    console.log("=== actualizarCandidatoEnAPI ===", { idCandidato, candidatoData });
    
    // Obtener idPartido desde el nombre del partido
    const idPartido = await obtenerIdPartidoPorNombre(candidatoData.partidoPolitico);
    
    if (!idPartido) {
      throw new Error(`No se encontró el partido: ${candidatoData.partidoPolitico}. Asegúrate de que el partido exista en la base de datos.`);
    }

    // Mapear campos del frontend al backend
    const candidatoParaBackend = {
      idPartido: idPartido,
      nombreCompleto: candidatoData.nombre || candidatoData.nombreCompleto,
      biografia: candidatoData.biografia || null,
      propuestas: candidatoData.propuestas || null,
      cargo: candidatoData.cargo,
      distrito: candidatoData.distrito || null,
      foto: candidatoData.foto || null,
      estado: candidatoData.estado || "Activo",
    };

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.POR_ID(idCandidato)}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(candidatoParaBackend),
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }
      } catch (parseError) {
        const textError = await response.text().catch(() => "");
        if (textError) {
          errorMessage += ` - ${textError}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar candidato en API:", error);
    if (error.message) {
      throw error;
    }
    throw new Error(`Error al actualizar candidato: ${error.toString()}`);
  }
};

/**
 * Elimina un candidato del backend
 * @param {number} idCandidato - ID del candidato a eliminar
 * @returns {Promise<void>}
 */
export const eliminarCandidatoEnAPI = async (idCandidato) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CANDIDATOS.POR_ID(idCandidato)}`, {
      method: "DELETE",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al eliminar candidato en API:", error);
    throw error;
  }
};

/**
 * Obtiene candidatos desde la API para la página de votación.
 * Los endpoints devuelven modelos específicos: Presidente, Congresista, ParlamentoAndino
 * @returns {Object} Objeto con candidatos organizados por categoría
 */
export const fetchCandidatosParaVotacion = async () => {
  try {
    console.log("=== fetchCandidatosParaVotacion: Iniciando carga desde API ===");
    
    // Obtener partidos para mapear IDs a nombres
    const partidosData = await obtenerPartidosDesdeAPI();
    const partidosMap = {};
    partidosData.forEach(p => {
      partidosMap[p.idPartido] = p.nombre;
    });
    
    // Llamadas paralelas a los endpoints específicos
    const [presidenciales, congresistas, andinos] = await Promise.all([
      fetchAPI(API_ENDPOINTS.CANDIDATOS.PRESIDENCIAL), // /api/presidentes
      fetchAPI(API_ENDPOINTS.CANDIDATOS.CONGRESISTAS), // /api/congresistas
      fetchAPI(API_ENDPOINTS.CANDIDATOS.ANDINOS), // /api/parlamento-andino
    ]);

    console.log("Presidenciales (raw):", presidenciales);
    console.log("Congresistas (raw):", congresistas);
    console.log("Andinos (raw):", andinos);

    // 2. Transformar Presidentes (ACTUALIZADO CON PLANCHA)
    const presTransform = (presidenciales || []).map((pres) => {
      const nombreCompleto = pres.nombres 
        ? `${pres.nombres} ${pres.apellidos || ""}`.trim() 
        : (pres.nombre || "Candidato");

      const nombrePartido = pres.nombrePartido || pres.partidoPolitico?.nombre || "Sin partido";
      const logoPartido = pres.imagenPartido || pres.partidoPolitico?.simbolo || pres.partidoSimbolo || null;
      const idPartido = pres.idPartido || pres.partidoPolitico?.idPartido || pres.partidoPolitico?.id;

      return {
        id: pres.id,
        nombre: nombreCompleto,
        nombreCompleto: nombreCompleto,
        
        // Datos del Partido
        partido: idPartido,
        partidoNombre: nombrePartido,
        imagenPartido: logoPartido,
        partidoSimbolo: logoPartido,
        
        // Datos del Candidato
        foto: pres.fotoUrl || pres.foto || '',
        biografia: pres.biografia || '',
        propuestas: Array.isArray(pres.propuestas) ? pres.propuestas : [],
        
        // --- NUEVOS DATOS PROFESIONALES ---
        formacion: pres.formacionAcademica || "Información no registrada",
        planGobierno: pres.planGobiernoUrl || null,
        vice1: pres.primerVicepresidente || "No registrado",
        vice2: pres.segundoVicepresidente || "No registrado",
        
        cargo: "Presidente" 
      };
    });

    console.log("Presidentes transformados:", presTransform);

    // Transformar congresistas: modelo Congresista (nombres, apellidos, id, fotoUrl, region, partidoPolitico)
    const congresistasTransform = (congresistas || []).map((c) => {
  const nombreCompleto = `${c.nombres || ""} ${c.apellidos || ""}`.trim();
  
  // CORRECCIÓN: Leemos directo lo que manda Java, ya no calculamos nada
  const partidoNombre = c.nombrePartido || "Sin partido";

  return {
    id: c.id,
    nombre: nombreCompleto,
    nombreCompleto: nombreCompleto,
    
    partido: c.idPartido,
    partidoNombre: partidoNombre, // <--- Aquí ya viene el nombre correcto
    imagenPartido: c.imagenPartido, // <--- AQUÍ ESTÁ LA FOTO QUE FALTABA
    partidoSimbolo: c.imagenPartido, // Por si acaso tu frontend lo busca con este nombre
    
    numero: c.numeroEnLista || 0,
    foto: c.fotoUrl || '',
    distrito: c.region || 'N/D',
    propuestas: Array.isArray(c.propuestas) ? c.propuestas : [],
    biografia: c.biografia || '',
  };
});
    console.log("Congresistas transformados:", congresistasTransform);

    // Transformar parlamentarios andinos: modelo ParlamentoAndino (nombres, apellidos, id, fotoUrl, partidoPolitico)
    const andinosTransform = (andinos || []).map((c) => {
      const nombreCompleto = `${c.nombres || ""} ${c.apellidos || ""}`.trim();
      const idPartido = c.partidoPolitico?.idPartido || c.partidoPolitico?.id || null;
      const partidoNombre = idPartido ? (partidosMap[idPartido] || "Sin partido") : "Sin partido";
      
      return {
        id: c.id,
        nombre: nombreCompleto,
        nombreCompleto: nombreCompleto,
        partido: idPartido,
        partidoNombre: partidoNombre,
        partidoSimbolo: "",
        numero: c.numeroEnLista || 0,
        foto: c.fotoUrl || '',
        propuestas: [],
        biografia: '',
      };
    });

    console.log("Andinos transformados:", andinosTransform);

    return {
      presidente: presTransform,
      congresistas: congresistasTransform,
      parlamentoAndino: andinosTransform,
    };
  } catch (error) {
    console.error('Error en fetchCandidatosParaVotacion:', error);
    console.warn('Retornando arrays vacíos en caso de error');
    return {
      presidente: [],
      congresistas: [],
      parlamentoAndino: [],
    };
  }
};
