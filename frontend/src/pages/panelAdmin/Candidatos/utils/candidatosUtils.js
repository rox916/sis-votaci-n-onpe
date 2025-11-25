/**
 * Utilidades compartidas para los componentes de candidatos
 */

import fotoRLA from "../../../../assets/logos/images/rafael_lopez_aliaga.jpg";
import fotoKeiko from "../../../../assets/logos/images/keiko_fujimori.jpg";
import fotoAcuna from "../../../../assets/logos/images/cesar_acuna.jpg";
import fotoAlvarez from "../../../../assets/logos/images/carlos_alvarez.jpg";
import fotoLopezChau from "../../../../assets/logos/images/alfonso_lopez_chau.jpg";
import fotoButters from "../../../../assets/logos/images/phillip_butters.jpg";
import fotoPerezTello from "../../../../assets/logos/images/marisol_perez_tello.jpg";
import fotoNormaYarrow from "../../../../assets/logos/images/norma_yarrow_lumbreras.jpg";
import fotoJoseCueto from "../../../../assets/logos/images/jose_cueto_aservi.jpg";
import fotoJorgeMontoya from "../../../../assets/logos/images/jorge_montoya_manrique.jpg";
import fotoJulioChavez from "../../../../assets/logos/images/Julio_Chavez.jpg";

import logoRenovacion from "../../../../assets/logos/renovacion_popular.png";
import logoFuerza from "../../../../assets/logos/fuerza_popular.png";
import logoAPP from "../../../../assets/logos/app.png";
import logoPaisTodos from "../../../../assets/logos/pais_para_todos.png";
import logoAhoraNacion from "../../../../assets/logos/ahora_nacion.png";
import logoAvanza from "../../../../assets/logos/avanza_pais.png";
import logoPrimeroGente from "../../../../assets/logos/primero_la_gente.png";
import logoAccionPopular from "../../../../assets/logos/accion-popular.png";
import { LOGOS_PARTIDOS } from "../../../../constants/electoralConstants";

// Mapa de fotos por nombre del candidato
export const fotosPorNombre = {
  "Julio Chávez": fotoJulioChavez,
  "Rafael López Aliaga": fotoRLA,
  "Keiko Fujimori": fotoKeiko,
  "César Acuña": fotoAcuna,
  "Carlos Álvarez": fotoAlvarez,
  "Alfonso López Chau": fotoLopezChau,
  "Phillip Butters": fotoButters,
  "Marisol Pérez Tello": fotoPerezTello,
  "Norma Yarrow": fotoNormaYarrow,
  "Norma Yarrow Lumbreras": fotoNormaYarrow,
  "José Cueto": fotoJoseCueto,
  "José Cueto Aservi": fotoJoseCueto,
  "Jorge Montoya": fotoJorgeMontoya,
  "Jorge Montoya Manrique": fotoJorgeMontoya,
};

// Mapa de logos por nombre del partido
export const logosPorPartido = {
  "Acción Popular": logoAccionPopular,
  "Renovación Popular": logoRenovacion,
  "Fuerza Popular": logoFuerza,
  "Alianza para el Progreso": logoAPP,
  "País para Todos": logoPaisTodos,
  "Ahora Nación": logoAhoraNacion,
  "Avanza País": logoAvanza,
  "Primero la Gente": logoPrimeroGente,
};

// Función para obtener foto de candidato
export const getFotoCandidato = (candidato) => {
  // Si ya tiene foto y no es una URL externa, usarla
  if (candidato.foto && typeof candidato.foto === 'string' && !candidato.foto.includes('http') && !candidato.foto.includes('pravatar') && !candidato.foto.includes('dicebear')) {
    return candidato.foto;
  }
  // Buscar por nombre
  return fotosPorNombre[candidato.nombre] || null;
};

// Función para obtener logo de partido
export const getLogoPartido = (partido) => {
  return logosPorPartido[partido] || LOGOS_PARTIDOS[partido] || null;
};

// Función para obtener las iniciales del partido para el símbolo
export const getPartidoSimbolo = (partido) => {
  const palabras = partido.split(" ");
  if (palabras.length >= 2) {
    return palabras[0][0] + palabras[1][0];
  }
  return partido.substring(0, 2).toUpperCase();
};

// Función para obtener un color basado en el nombre del partido
export const getPartidoColor = (partido) => {
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500",
    "bg-teal-500", "bg-cyan-500", "bg-amber-500", "bg-lime-500"
  ];
  const index = partido.length % colors.length;
  return colors[index];
};

// Función para mapear candidato del backend al formato del frontend
export const mapearCandidatoDesdeBackend = (candidatoBackend, partidosMap) => {
  // Validar que candidatoBackend sea un objeto válido
  if (!candidatoBackend || typeof candidatoBackend !== 'object') {
    throw new Error("Candidato inválido: debe ser un objeto");
  }
  
  // Detectar el tipo de modelo basado en los campos presentes
  const esCongresista = candidatoBackend.nombres !== undefined && candidatoBackend.apellidos !== undefined && candidatoBackend.region !== undefined;
  const esParlamentario = candidatoBackend.nombres !== undefined && candidatoBackend.apellidos !== undefined && candidatoBackend.region === undefined && candidatoBackend.dni !== undefined;
  const esPresidente = candidatoBackend.nombres !== undefined && candidatoBackend.apellidos !== undefined && candidatoBackend.dni === undefined;
  
  // Obtener ID del partido según el modelo
  let idPartido = null;
  if (candidatoBackend.idPartido) {
    idPartido = candidatoBackend.idPartido;
  } else if (candidatoBackend.partidoPolitico) {
    // Si viene como objeto anidado
    idPartido = candidatoBackend.partidoPolitico.idPartido || candidatoBackend.partidoPolitico.id;
  }
  
  const nombrePartido = partidosMap && idPartido 
    ? (partidosMap[idPartido] || "Sin partido")
    : "Sin partido";
  
  // Construir nombre completo según el modelo
  let nombreCompleto = "";
  if (esCongresista || esParlamentario || esPresidente) {
    // Modelos con nombres y apellidos separados
    nombreCompleto = `${candidatoBackend.nombres || ""} ${candidatoBackend.apellidos || ""}`.trim();
  } else {
    // Modelo general con nombreCompleto
    nombreCompleto = candidatoBackend.nombreCompleto || candidatoBackend.nombre || "";
  }
  
  // Obtener ID según el modelo
  const id = candidatoBackend.idCandidato || candidatoBackend.id || null;
  
  // Obtener foto según el modelo
  const foto = candidatoBackend.fotoUrl || candidatoBackend.foto || "";
  
  // Obtener distrito/región según el modelo
  const distrito = candidatoBackend.region || candidatoBackend.distrito || "";
  
  return {
    id: id,
    idCandidato: id,
    nombre: nombreCompleto,
    nombreCompleto: nombreCompleto,
    partidoPolitico: nombrePartido,
    idPartido: idPartido,
    cargo: candidatoBackend.cargo || (esCongresista ? "Congresista" : esParlamentario ? "Parlamentario Andino" : ""),
    distrito: distrito,
    foto: foto,
    estado: candidatoBackend.estado || "Activo",
    biografia: candidatoBackend.biografia || "",
    propuestas: Array.isArray(candidatoBackend.propuestas) ? candidatoBackend.propuestas : [],
    numeroLista: candidatoBackend.numeroEnLista || candidatoBackend.numeroLista || 0,
    dni: candidatoBackend.dni || "",
  };
};

