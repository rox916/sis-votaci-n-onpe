import React, { useState, useMemo, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, UserSquare2, MapPin, Building2 } from "lucide-react";
import CandidatoCrear from "./CandidatoCrear";
import CandidatoEditar from "./CandidatoEditar";
import CandidatoEliminar from "./CandidatoEliminar";
import { getCandidatos, saveCandidatos, forceUpdateCandidatos } from "../../../services/candidatosService";
import { PARTIDOS_POLITICOS, CARGOS_ELECTORALES, LOGOS_PARTIDOS, CANDIDATOS_PRESIDENCIALES } from "../../../constants/electoralConstants";

// Importamos las fotos y logos
import fotoRLA from "../../../assets/images/rafael_lopez_aliaga.jpg";
import fotoKeiko from "../../../assets/images/keiko_fujimori.jpg";
import fotoAcuna from "../../../assets/images/cesar_acuna.jpg";
import fotoAlvarez from "../../../assets/images/carlos_alvarez.jpg";
import fotoLopezChau from "../../../assets/images/alfonso_lopez_chau.jpg";
import fotoButters from "../../../assets/images/phillip_butters.jpg";
import fotoPerezTello from "../../../assets/images/marisol_perez_tello.jpg";
import fotoNormaYarrow from "../../../assets/images/norma_yarrow_lumbreras.jpg";
import fotoJoseCueto from "../../../assets/images/jose_cueto_aservi.jpg";
import fotoJorgeMontoya from "../../../assets/images/jorge_montoya_manrique.jpg";
import fotoJulioChavez from "../../../assets/images/Julio_Chavez.jpg";

import logoRenovacion from "../../../assets/logos/renovacion_popular.png";
import logoFuerza from "../../../assets/logos/fuerza_popular.png";
import logoAPP from "../../../assets/logos/app.png";
import logoPaisTodos from "../../../assets/logos/pais_para_todos.png";
import logoAhoraNacion from "../../../assets/logos/ahora_nacion.png";
import logoAvanza from "../../../assets/logos/avanza_pais.png";
import logoPrimeroGente from "../../../assets/logos/primero_la_gente.png";
import logoAccionPopular from "../../../assets/logos/accion-popular.png";

// Mapa de fotos por nombre del candidato
const fotosPorNombre = {
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
const logosPorPartido = {
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
const getFotoCandidato = (candidato) => {
  // Si ya tiene foto y no es una URL externa, usarla
  if (candidato.foto && typeof candidato.foto === 'string' && !candidato.foto.includes('http') && !candidato.foto.includes('pravatar') && !candidato.foto.includes('dicebear')) {
    return candidato.foto;
  }
  // Buscar por nombre
  return fotosPorNombre[candidato.nombre] || null;
};

// Función para obtener logo de partido
const getLogoPartido = (partido) => {
  return logosPorPartido[partido] || LOGOS_PARTIDOS[partido] || null;
};

const partidos = PARTIDOS_POLITICOS;
const cargos = CARGOS_ELECTORALES;

// Función para obtener las iniciales del partido para el símbolo
const getPartidoSimbolo = (partido) => {
  const palabras = partido.split(" ");
  if (palabras.length >= 2) {
    return palabras[0][0] + palabras[1][0];
  }
  return partido.substring(0, 2).toUpperCase();
};

// Función para obtener un color basado en el nombre del partido
const getPartidoColor = (partido) => {
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500",
    "bg-teal-500", "bg-cyan-500", "bg-amber-500", "bg-lime-500"
  ];
  const index = partido.length % colors.length;
  return colors[index];
};

// Componente para mostrar el símbolo del partido (logo o iniciales)
const SimboloPartido = ({ partido }) => {
  const [imageError, setImageError] = useState(false);
  // Primero intentar con logos locales, luego con LOGOS_PARTIDOS
  const logoUrl = getLogoPartido(partido) || LOGOS_PARTIDOS[partido];

  if (!logoUrl || imageError) {
    return (
      <div className={`w-16 h-16 ${getPartidoColor(partido)} rounded-lg flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-lg">
          {getPartidoSimbolo(partido)}
        </span>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md border-2 border-gray-200 bg-white flex items-center justify-center">
      <img
        src={logoUrl}
        alt={`Logo ${partido}`}
        className="w-full h-full object-contain p-1"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([]);

  // Cargar candidatos del servicio compartido
  useEffect(() => {
    let candidatosData = getCandidatos();
    
    // Si no hay candidatos guardados, usar los candidatos presidenciales por defecto
    if (!candidatosData || candidatosData.length === 0) {
      const fotosMap = {
        1: fotoRLA,
        2: fotoKeiko,
        3: fotoAcuna,
        4: fotoAlvarez,
        6: fotoLopezChau,
        7: fotoButters,
        8: fotoPerezTello,
      };

      const logosMap = {
        "Renovación Popular": logoRenovacion,
        "Fuerza Popular": logoFuerza,
        "Alianza para el Progreso": logoAPP,
        "País para Todos": logoPaisTodos,
        "Ahora Nación": logoAhoraNacion,
        "Avanza País": logoAvanza,
        "Primero la Gente": logoPrimeroGente,
      };

      candidatosData = CANDIDATOS_PRESIDENCIALES.map(candidato => ({
        id: candidato.id,
        nombre: candidato.nombre,
        foto: fotosMap[candidato.id] || candidato.foto,
        partidoPolitico: candidato.partido,
        cargo: "Presidente",
        numeroLista: candidato.numero,
        estado: "Activo",
        logoPartido: logosMap[candidato.partido],
        vicepresidentes: candidato.vicepresidentes,
        propuestas: candidato.propuestas,
        biografia: candidato.biografia,
      }));
      saveCandidatos(candidatosData);
    }
    
    // Asegurar que todos los candidatos tengan sus fotos y logos correctos
    const candidatosConFotos = candidatosData.map(candidato => ({
      ...candidato,
      foto: getFotoCandidato(candidato) || candidato.foto || "",
      logoPartido: getLogoPartido(candidato.partidoPolitico) || candidato.logoPartido || null,
    }));
    
    setCandidatos(candidatosConFotos);
  }, []);

  // Función para actualizar datos si es necesario
  const handleRefreshData = () => {
    const updated = forceUpdateCandidatos();
    // Asegurar que todos los candidatos tengan sus fotos y logos correctos
    const candidatosConFotos = updated.map(candidato => ({
      ...candidato,
      foto: getFotoCandidato(candidato) || candidato.foto || "",
      logoPartido: getLogoPartido(candidato.partidoPolitico) || candidato.logoPartido || null,
    }));
    setCandidatos(candidatosConFotos);
    alert("Datos actualizados correctamente. Los congresistas ahora muestran su distrito.");
  };

  // Función para cargar candidatos presidenciales
  const handleLoadPresidenciales = () => {
    const fotosMap = {
      1: fotoRLA,
      2: fotoKeiko,
      3: fotoAcuna,
      4: fotoAlvarez,
      6: fotoLopezChau,
      7: fotoButters,
      8: fotoPerezTello,
    };

    const logosMap = {
      "Renovación Popular": logoRenovacion,
      "Fuerza Popular": logoFuerza,
      "Alianza para el Progreso": logoAPP,
      "País para Todos": logoPaisTodos,
      "Ahora Nación": logoAhoraNacion,
      "Avanza País": logoAvanza,
      "Primero la Gente": logoPrimeroGente,
    };

    const candidatosPresidenciales = CANDIDATOS_PRESIDENCIALES.map(candidato => ({
      id: candidato.id,
      nombre: candidato.nombre,
      foto: fotosMap[candidato.id] || candidato.foto,
      partidoPolitico: candidato.partido,
      cargo: "Presidente",
      numeroLista: candidato.numero,
      estado: "Activo",
      logoPartido: logosMap[candidato.partido],
      vicepresidentes: candidato.vicepresidentes,
      propuestas: candidato.propuestas,
      biografia: candidato.biografia,
    }));
    
    setCandidatos(candidatosPresidenciales);
    saveCandidatos(candidatosPresidenciales);
    alert("Candidatos presidenciales cargados correctamente con sus fotos.");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("Todos");

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // Filtro y búsqueda
  const filteredCandidatos = useMemo(() => {
    return candidatos.filter((c) => {
      const matchesSearch =
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.partidoPolitico.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Agrupar Primer Vicepresidente y Segundo Vicepresidente bajo "Vicepresidente"
      let cargoNormalizado = c.cargo;
      if (c.cargo === "Primer Vicepresidente" || c.cargo === "Segundo Vicepresidente") {
        cargoNormalizado = "Vicepresidente";
      }
      
      const matchesCargo = filterCargo === "Todos" || cargoNormalizado === filterCargo;
      return matchesSearch && matchesCargo;
    });
  }, [candidatos, searchTerm, filterCargo]);

  // Acciones - Sincronizar con localStorage
  const handleCreate = (data) => {
    const nuevosCandidatos = [...candidatos, { ...data, id: Date.now() }];
    setCandidatos(nuevosCandidatos);
    saveCandidatos(nuevosCandidatos);
    setModalCreate(false);
  };

  const handleEdit = (data) => {
    const candidatosActualizados = candidatos.map((c) => (c.id === data.id ? data : c));
    setCandidatos(candidatosActualizados);
    saveCandidatos(candidatosActualizados);
    setModalEdit(false);
  };

  const handleDelete = () => {
    const candidatosActualizados = candidatos.filter((c) => c.id !== selectedCandidate.id);
    setCandidatos(candidatosActualizados);
    saveCandidatos(candidatosActualizados);
    setModalDelete(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserSquare2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Candidatos</h1>
            <p className="text-sm text-gray-600">Administra la información de los candidatos y sus partidos políticos.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefreshData}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
            title="Actualizar datos con distritos"
          >
            <Search className="w-5 h-5" /> Actualizar Datos
          </button>
          <button
            onClick={handleLoadPresidenciales}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md"
            title="Cargar candidatos presidenciales"
          >
            <Plus className="w-5 h-5" /> Cargar Presidenciales
          </button>
          <button
            onClick={() => setModalCreate(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <Plus className="w-5 h-5" /> Agregar Candidato
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o partido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterCargo}
            onChange={(e) => setFilterCargo(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los cargos</option>
            {cargos.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3">
            {filteredCandidatos.length} candidatos encontrados
          </div>
        </div>
      </div>

      {/* Lista de candidatos estilo tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Encabezado de la tabla */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              #
            </div>
            <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              AGRUPACIÓN
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              SÍMBOLO
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              CARGO
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              CANDIDATO
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
              ACCIONES
            </div>
          </div>
        </div>

        {/* Lista de candidatos */}
        <div className="divide-y divide-gray-200">
          {filteredCandidatos.map((candidato, index) => (
            <motion.div
              key={candidato.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="group hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="grid grid-cols-12 gap-4 items-center px-6 py-4">
                {/* Número */}
                <div className="col-span-1">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                </div>

                {/* AGRUPACIÓN */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{candidato.partidoPolitico}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          Lista {candidato.numeroLista}
                        </span>
                        {candidato.distrito && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{candidato.distrito}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SÍMBOLO */}
                <div className="col-span-2">
                  <SimboloPartido partido={candidato.partidoPolitico} />
                </div>

                {/* CARGO */}
                <div className="col-span-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{candidato.cargo}</p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                        candidato.estado === "Activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {candidato.estado}
                    </span>
                  </div>
                </div>

                {/* CANDIDATO (Foto y nombre) */}
                <div className="col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {(() => {
                        const foto = getFotoCandidato(candidato);
                        const logo = getLogoPartido(candidato.partidoPolitico);
                        
                        return foto ? (
                          <>
                            <img
                              src={foto}
                              alt={candidato.nombre}
                              className="w-14 h-14 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            {logo && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-gray-200 shadow-md overflow-hidden">
                                <img
                                  src={logo}
                                  alt={`Logo ${candidato.partidoPolitico}`}
                                  className="w-full h-full object-contain p-0.5"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-14 h-14 rounded-lg flex items-center justify-center border-2 border-gray-200 shadow-sm bg-gray-100">
                            <span className="text-sm font-bold text-gray-700">{getPartidoSimbolo(candidato.partidoPolitico)}</span>
                          </div>
                        );
                      })()}
                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md">
                        <UserSquare2 className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{candidato.nombre}</p>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="col-span-1 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidato);
                      setModalEdit(true);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidato);
                      setModalDelete(true);
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensaje cuando no hay candidatos */}
        {filteredCandidatos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <UserSquare2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No se encontraron candidatos</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <CandidatoCrear
        isOpen={modalCreate}
        onClose={() => setModalCreate(false)}
        onSave={handleCreate}
        partidos={partidos}
        cargos={cargos}
      />

      <CandidatoEditar
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        onSave={handleEdit}
        candidate={selectedCandidate}
        partidos={partidos}
        cargos={cargos}
      />

      <CandidatoEliminar
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        onConfirm={handleDelete}
        candidate={selectedCandidate}
      />
    </motion.div>
  );
}
