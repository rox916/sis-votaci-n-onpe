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
// Importar imágenes locales desde la carpeta assets
import fotoJulioChavez from "../assets/images/Julio_Chavez.jpg";
import fotoRLA from "../assets/images/rafael_lopez_aliaga.jpg";
import fotoKeiko from "../assets/images/keiko_fujimori.jpg";
import fotoAcuna from "../assets/images/cesar_acuna.jpg";
import fotoAlvarez from "../assets/images/carlos_alvarez.jpg";
import fotoLopezChau from "../assets/images/alfonso_lopez_chau.jpg";
import fotoButters from "../assets/images/phillip_butters.jpg";
import fotoPerezTello from "../assets/images/marisol_perez_tello.jpg";

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

// Datos de candidatos presidenciales con foto y detalles
export const CANDIDATOS_PRESIDENCIALES = [
  {
    id: 0,
    numero: "01",
    nombre: "Julio Chávez",
    foto: fotoJulioChavez,
    partido: "Acción Popular",
    vicepresidentes: [
      "María del Carmen Alva (1ra VP)",
      "Por confirmarse (2da VP)",
    ],
    propuestas: [
      "Democracia participativa",
      "Reforma del Estado",
      "Desarrollo sostenible",
      "Lucha contra la corrupción",
      "Inclusión social",
    ],
    biografia:
      "Julio Chávez es un político peruano miembro de Acción Popular. Su candidatura se enfoca en la renovación democrática y el fortalecimiento de las instituciones del Estado.",
  },
  {
    id: 1,
    numero: "02",
    nombre: "Rafael López Aliaga",
    foto: fotoRLA,
    partido: "Renovación Popular",
    vicepresidentes: [
      "Norma Yarrow (1ra VP)",
      "Jhon Iván Ramos Malpica (2da VP)",
    ],
    propuestas: [
      "Retorno a la Unicameralidad del Congreso",
      "Proyectos de desarrollo en Lima y costa",
      "Seguridad y orden público",
      "Lucha frontal contra la corrupción y delincuencia.",
      "Promoción de la inversión privada para generar empleo.",
    ],
    biografia:
      "Rafael López Aliaga es un empresario y político peruano, actual alcalde de Lima. Fundador del partido Renovación Popular, es conocido por sus posturas conservadoras en lo social y liberales en lo económico. Esta es su segunda postulación a la presidencia.",
  },
  {
    id: 2,
    numero: "03",
    nombre: "Keiko Fujimori",
    foto: fotoKeiko,
    partido: "Fuerza Popular",
    vicepresidentes: [
      "Luis Galarreta Valerde (1ra VP)",
      "Miguel Torres Morales (2da VP)",
    ],
    propuestas: [
      "Continuidad institucional",
      "Orden y seguridad ciudadana",
      "Reactivación económica",
      "Reformas para fortalecer la lucha contra la delincuencia.",
      "Programas de apoyo a la pequeña y mediana empresa.",
    ],
    biografia:
      "Keiko Fujimori es una política peruana, lideresa de Fuerza Popular. Ha sido Congresista de la República y ha postulado a la presidencia en múltiples ocasiones, pasando a segunda vuelta en 2011, 2016 y 2021. Es hija del expresidente Alberto Fujimori.",
  },
  {
    id: 3,
    numero: "04",
    nombre: "César Acuña",
    foto: fotoAcuna,
    partido: "Alianza para el Progreso",
    vicepresidentes: [
      "Alejandro Soto Reyes (1ra VP)",
      "Jessica Tumi Rivas (2da VP)",
    ],
    propuestas: [
      "Desarrollo regional y descentralización",
      "Inclusión social",
      "Combate a la corrupción",
    ],
    biografia:
      "César Acuña es un empresario y político, fundador de la Universidad César Vallejo y del partido Alianza para el Progreso. Ha sido Congresista y Gobernador Regional de La Libertad. Este es un nuevo intento por alcanzar la presidencia.",
  },
  {
    id: 4,
    numero: "05",
    nombre: "Carlos Álvarez",
    foto: fotoAlvarez,
    partido: "País para Todos",
    vicepresidentes: ["Por confirmarse (1ra VP)", "Por confirmarse (2da VP)"],
    propuestas: [
      "Cambio y renovación política",
      "Propuestas innovadoras",
      "Representación del voto de protesta",
    ],
    biografia:
      "Conocido comediante e imitador, Carlos Álvarez incursiona en la política con su partido 'País para Todos'. Su plataforma se centra en la lucha contra la corrupción y la renovación de la clase política, buscando capitalizar el descontento ciudadano.",
  },
  {
    id: 6,
    numero: "07",
    nombre: "Alfonso López Chau",
    foto: fotoLopezChau,
    partido: "Ahora Nación",
    vicepresidentes: ["Por confirmarse (1ra VP)", "Por confirmarse (2da VP)"],
    propuestas: [
      "Educación científica y tecnológica",
      "Mecanismos democráticos participativos",
      "Desarrollo sostenible",
    ],
    biografia:
      "Alfonso López Chau es un académico y fue rector de la Universidad Nacional de Ingeniería (UNI). Su candidatura se enfoca en la educación, la ciencia y la tecnología como motores del desarrollo nacional, con un enfoque en la participación ciudadana.",
  },
  {
    id: 7,
    numero: "08",
    nombre: "Phillip Butters",
    foto: fotoButters,
    partido: "Avanza País",
    vicepresidentes: ["Fernán Altuve (1ra VP)", "Karol Paredes (2da VP)"],
    propuestas: [
      "Cambio estructural del país",
      "Modernización de instituciones",
      "Oportunidades para todos",
    ],
    biografia:
      "Phillip Butters es un conocido comunicador y comentarista político. Postula con Avanza País, promoviendo ideas de libre mercado, mano dura contra la delincuencia y una reestructuración del estado. Es su primera incursión como candidato presidencial.",
  },
  {
    id: 8,
    numero: "09",
    nombre: "Marisol Pérez Tello",
    foto: fotoPerezTello,
    partido: "Primero la Gente",
    vicepresidentes: ["Raúl Molina (1ra VP)", "Manuel Ato (2da VP)"],
    propuestas: [
      "Perú seguro, justo e inclusivo",
      "Justicia efectiva",
      "Conexión territorial",
    ],
    biografia:
      "Marisol Pérez Tello es una abogada y política. Fue Ministra de Justicia y Derechos Humanos y Congresista. Lidera el partido 'Primero la Gente' con un enfoque en la reforma del sistema de justicia, la seguridad ciudadana y la inclusión social.",
  },
];

