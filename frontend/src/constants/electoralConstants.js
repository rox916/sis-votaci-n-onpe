/**
 * Constantes compartidas para toda la aplicación electoral
 * 
 * Este archivo centraliza todas las constantes utilizadas en diferentes partes
 * de la aplicación para mantener consistencia y facilitar el mantenimiento.
 * 
 * Incluye:
 * - Partidos políticos
 * - Cargos electorales
 * - Departamentos del Perú
 * - Roles de usuario
 * - Tipos y ámbitos de reportes
 */

// Lista de partidos políticos registrados en el sistema - Elecciones 2026
export const PARTIDOS_POLITICOS = [
  // Partidos principales
  "Acción Popular",
  "Ahora Nación",
  "Alianza para el Progreso",
  "País para Todos",
  "Avanza País",
  "Integridad Democrática",
  "Partido Regionalista de Integración Nacional",
  "Fe en el Perú",
  "Fuerza Popular",
  "Partido Patriótico del Perú",
  "Partido Democrático Federal",
  "Partido Morado",
  "Juntos por el Perú",
  "Libertad Popular",
  "Partido Cívico Obras",
  "Partido Demócrata Verde",
  "Somos Perú",
  "Partido Aprista Peruano",
  "Renovación Popular",
  "Progresemos",
  "Perú Moderno",
  "Perú Primero",
  "Un Camino Diferente",
  "Partido Primero La Gente",
  "Partido Ciudadanos por el Perú",
  "Salvemos al Perú",
  "Frente de la Esperanza",
  "Perú Libre",
  "Podemos Perú",
  "Cooperación Popular",
  "Sí creo",
  "Partido del Buen Gobierno",
  "Partido Demócrata Unido Perú",
  // Alianzas
  "Fuerza y Libertad",
  "Unidad Nacional",
  "Venceremos",
];

// Cargos electorales disponibles en el sistema
export const CARGOS_ELECTORALES = [
  "Presidente",
  "Vicepresidente",
  "Congresista",
  "Parlamentario Andino",
];

// Departamentos del Perú para selección en formularios
export const DEPARTAMENTOS_PERU = [
  "Amazonas",
  "Ancash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
];

// Roles de usuario disponibles en el sistema de administración
export const ROLES_USUARIO = [
  "Super Admin",
  "Admin Regional",
  "Presidente de Mesa",
  "Soporte Técnico",
];

// Tipos de reportes que se pueden generar en el sistema
export const TIPOS_REPORTE = [
  "Resultados",
  "Participación",
  "Auditoría",
  "Padrón Electoral",
];

// Ámbitos geográficos o administrativos para los reportes
export const AMBITOS_REPORTE = [
  "Nacional",
  "Departamento: Lima",
  "Departamento: Cusco",
  "Sistema",
];
// Importar logos de partidos
import logoRenovacion from "../assets/logos/renovacion_popular.png";
import logoFuerza from "../assets/logos/fuerza_popular.png";
import logoAPP from "../assets/logos/app.png";
import logoPaisTodos from "../assets/logos/pais_para_todos.png";
import logoAhoraNacion from "../assets/logos/ahora_nacion.png";
import logoAvanza from "../assets/logos/avanza_pais.png";
import logoPrimeroGente from "../assets/logos/primero_la_gente.png";
import logoAccionPopular from "../assets/logos/accion-popular.png";

// Logos/Símbolos de los partidos políticos (uso local cuando esté disponible)
// Si un partido no tiene logo local, se deja una URL externa o se mostrará símbolo de iniciales
export const LOGOS_PARTIDOS = {
  // Usar logos locales cuando existan en src/assets/logos
  "Acción Popular": logoAccionPopular,
  "Ahora Nación": logoAhoraNacion,
  "Alianza para el Progreso": logoAPP,
  "País para Todos": logoPaisTodos,
  "Avanza País": logoAvanza,
  "Fuerza Popular": logoFuerza,
  "Renovación Popular": logoRenovacion,
  "Primero la Gente": logoPrimeroGente,
  // Para partidos sin logo local, no incluir aquí y se usará el fallback de iniciales
};

// NOTA: Los datos simulados de candidatos presidenciales han sido eliminados.
// Todos los candidatos ahora se cargan desde la API.

