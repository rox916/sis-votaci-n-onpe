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
import { fetchAPI, API_ENDPOINTS } from "../config/apiConfig";

// Clave para almacenar candidatos en localStorage
const CANDIDATOS_STORAGE_KEY = 'candidatos_electorales';

// Crear una copia saneada de los datos iniciales: eliminar referencias a URLs externas
const sanitizedInitialCandidatos = initialCandidatos.map(c => ({
  ...c,
  foto: (typeof c.foto === 'string' && (c.foto.includes('http://') || c.foto.includes('https://') || c.foto.includes('pravatar') || c.foto.includes('dicebear'))) ? '' : c.foto,
}));

/**
 * Verifica si los datos necesitan actualizarse
 * Compara la cantidad de candidatos y actualiza si es necesario
 */
const needsUpdate = (storedData) => {
  if (!storedData || storedData.length === 0) return true;
  // Si la cantidad de candidatos es muy diferente, actualizar
  if (Math.abs(storedData.length - initialCandidatos.length) > 10) return true;
  // Verificar si los congresistas tienen el campo distrito
  const congresistasStored = storedData.filter(c => c.cargo === "Congresista");
  const congresistasWithDistrito = congresistasStored.filter(c => c.distrito);
  // Si hay congresistas sin distrito, actualizar
  if (congresistasStored.length > 0 && congresistasWithDistrito.length < congresistasStored.length) {
    return true;
  }
  return false;
};

/**
 * Inicializa los datos de candidatos en localStorage si no existen o necesitan actualización
 * Actualiza automáticamente si detecta que faltan campos importantes
 */
const initializeData = () => {
  const stored = localStorage.getItem(CANDIDATOS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(sanitizedInitialCandidatos));
    return;
  }
  
  try {
    const storedData = JSON.parse(stored);
    if (needsUpdate(storedData)) {
      // Actualizar con los datos iniciales que tienen todos los campos
      localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(sanitizedInitialCandidatos));
    }
  } catch (e) {
    // Si hay error al parsear, reemplazar con datos iniciales
    localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(sanitizedInitialCandidatos));
  }
};

/**
 * Obtiene todos los candidatos almacenados
 * @returns {Array} Lista de todos los candidatos
 */
export const getCandidatos = () => {
  initializeData();
  const data = localStorage.getItem(CANDIDATOS_STORAGE_KEY);
  return data ? JSON.parse(data) : sanitizedInitialCandidatos;
};

/**
 * Guarda la lista de candidatos en localStorage
 * @param {Array} candidatos - Lista de candidatos a guardar
 */
export const saveCandidatos = (candidatos) => {
  localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(candidatos));
};

/**
 * Fuerza la actualización de los datos desde los datos iniciales
 * Útil cuando se han actualizado los datos iniciales y se necesita refrescar
 */
export const forceUpdateCandidatos = () => {
  localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(sanitizedInitialCandidatos));
  return sanitizedInitialCandidatos;
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

/**
 * Obtiene candidatos desde la API enriquecidos con datos del partido.
 * El backend ahora devuelve: idCandidato, nombreCompleto, foto, partidoNombre, partidoSimbolo, etc.
 * Si la API falla, retorna el fallback local.
 * @returns {Object} Objeto con candidatos organizados por categoría
 */
export const fetchCandidatosParaVotacion = async () => {
  try {
    console.log("=== fetchCandidatosParaVotacion: Iniciando carga desde API ===");
    
    // Llamadas paralelas a los endpoints (el backend devuelve datos enriquecidos)
    const [presidenciales, congresistas, andinos] = await Promise.all([
      fetchAPI(API_ENDPOINTS.CANDIDATOS.PRESIDENCIAL),
      fetchAPI(API_ENDPOINTS.CANDIDATOS.CONGRESISTAS),
      fetchAPI(API_ENDPOINTS.CANDIDATOS.ANDINOS),
    ]);

    console.log("Presidenciales (raw):", presidenciales);
    console.log("Congresistas (raw):", congresistas);
    console.log("Andinos (raw):", andinos);

    // Transformar presidenciales: el backend ya trae partidoNombre y partidoSimbolo
    const activosPres = (presidenciales || []).filter(p => (p.estado || 'Activo') === 'Activo');
    const presTransform = activosPres
      .filter(pres => pres.cargo === 'Presidente')
      .map((pres) => ({
        id: pres.idCandidato,
        nombre: pres.nombreCompleto || "",
        partido: pres.idPartido,
        partidoNombre: pres.partidoNombre || "Sin partido",
        partidoSimbolo: pres.partidoSimbolo || "",
        numero: 0,
        foto: pres.foto || '',
        propuestas: pres.propuestas || [],
        biografia: pres.biografia || '',
      }));

    console.log("Presidentes transformados:", presTransform);

    // Transformar congresistas
    const congresistasTransform = (congresistas || [])
      .filter(c => c.estado === 'Activo')
      .map((c) => ({
        id: c.idCandidato,
        nombre: c.nombreCompleto || "",
        partido: c.idPartido,
        partidoNombre: c.partidoNombre || "Sin partido",
        partidoSimbolo: c.partidoSimbolo || "",
        numero: 0,
        foto: c.foto || '',
        distrito: c.distrito || 'N/D',
        propuestas: c.propuestas || [],
        biografia: c.biografia || '',
      }));

    console.log("Congresistas transformados:", congresistasTransform);

    // Transformar parlamentarios andinos
    const andinosTransform = (andinos || [])
      .filter(c => c.estado === 'Activo')
      .map((c) => ({
        id: c.idCandidato,
        nombre: c.nombreCompleto || "",
        partido: c.idPartido,
        partidoNombre: c.partidoNombre || "Sin partido",
        partidoSimbolo: c.partidoSimbolo || "",
        numero: 0,
        foto: c.foto || '',
        propuestas: c.propuestas || [],
        biografia: c.biografia || '',
      }));

    console.log("Andinos transformados:", andinosTransform);

    return {
      presidente: presTransform,
      congresistas: congresistasTransform,
      parlamentoAndino: andinosTransform,
    };
  } catch (error) {
    console.error('Error en fetchCandidatosParaVotacion:', error);
    console.warn('Usando fallback local:', error);
    return getCandidatosParaVotacion();
  }
};
