import React, { useState, useEffect } from "react";
import { Plus, UserSquare2 } from "lucide-react";
import { fetchAPI, API_ENDPOINTS } from "../../../config/apiConfig";
import { obtenerPartidosDesdeAPI } from "../../../services/candidatosService";
import { mapearCandidatoDesdeBackend, getFotoCandidato, getLogoPartido } from "./utils/candidatosUtils";
import ListaCandidatos from "./components/ListaCandidatos";
import CandidatoCrear from "./CandidatoCrear";
import CandidatoEditar from "./CandidatoEditar";
import CandidatoEliminar from "./CandidatoEliminar";
import CandidatoVerPropuestas from "./CandidatoVerPropuestas";
import { crearCandidatoEnAPI, actualizarCandidatoEnAPI, eliminarCandidatoEnAPI } from "../../../services/candidatosService";
import { registrarExito, registrarError } from "../../../services/auditoriaService";
import { CARGOS_ELECTORALES } from "../../../constants/electoralConstants";
import { obtenerPartidos } from "../../../services/partidosService";

export default function CandidatosParlamentoAndino() {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partidosMap, setPartidosMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("Todos");
  const [partidosParaModales, setPartidosParaModales] = useState([]);

  // Modales
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalVerPropuestas, setModalVerPropuestas] = useState(false);

  // Cargar partidos para mapear IDs a nombres y para los modales
  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        const partidosData = await obtenerPartidosDesdeAPI();
        const mapaPartidos = {};
        partidosData.forEach(p => {
          mapaPartidos[p.idPartido] = p.nombre;
        });
        setPartidosMap(mapaPartidos);
        
        // Cargar partidos para los modales
        const partidosParaModalesData = await obtenerPartidos();
        setPartidosParaModales(partidosParaModalesData.map(p => p.nombre));
      } catch (error) {
        console.error("Error al cargar partidos:", error);
      }
    };
    cargarPartidos();
  }, []);

  // Cargar parlamentarios andinos desde la API
  useEffect(() => {
    const cargarCandidatos = async () => {
      try {
        setLoading(true);
        console.log("🔍 Cargando Parlamento Andino desde:", API_ENDPOINTS.CANDIDATOS.ANDINOS);
        
        const andinos = await fetchAPI(API_ENDPOINTS.CANDIDATOS.ANDINOS);
        console.log("📊 Datos recibidos de /parlamento-andino:", andinos);
        
        const candidatosBackend = Array.isArray(andinos) ? andinos : [];
        
        if (candidatosBackend.length === 0) {
          console.log("⚠️ El endpoint /parlamento-andino retornó un array vacío");
        } else {
          console.log(`✅ Se cargaron ${candidatosBackend.length} parlamentarios andinos desde el endpoint específico`);
        }
        
        // Filtrar candidatos nulos o undefined
        const candidatosValidos = candidatosBackend.filter(c => c != null && typeof c === 'object');
        
        // Mapear candidatos del backend al formato del frontend
        const candidatosMapeados = candidatosValidos.map(c => {
          try {
            return mapearCandidatoDesdeBackend(c, partidosMap);
          } catch (error) {
            console.error("Error al mapear candidato:", c, error);
            return null;
          }
        }).filter(c => c != null);
        
        // Asegurar que todos los candidatos tengan sus fotos y logos correctos
        const candidatosConFotos = candidatosMapeados.map(candidato => {
          if (!candidato || typeof candidato !== 'object') return null;
          try {
            return {
              ...candidato,
              foto: getFotoCandidato(candidato) || candidato.foto || "",
              logoPartido: getLogoPartido(candidato.partidoPolitico) || null,
            };
          } catch (error) {
            console.error("Error al procesar foto/logo del candidato:", candidato, error);
            return candidato;
          }
        }).filter(c => c != null);
        
        setCandidatos(candidatosConFotos);
      } catch (error) {
        console.error("Error al cargar parlamentarios andinos:", error);
        setCandidatos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarCandidatos();
  }, [partidosMap]);

  const handleCrear = async (nuevoCandidato) => {
    try {
      console.log("=== Creando parlamentario andino ===", nuevoCandidato);
      const candidatoCreado = await crearCandidatoEnAPI(nuevoCandidato);
      console.log("=== Parlamentario andino creado ===", candidatoCreado);
      
      // Recargar la lista de candidatos en lugar de recargar toda la página
      const cargarCandidatos = async () => {
        try {
          setLoading(true);
          const andinos = await fetchAPI(API_ENDPOINTS.CANDIDATOS.ANDINOS);
          const candidatosBackend = Array.isArray(andinos) ? andinos : [];
          const candidatosValidos = candidatosBackend.filter(c => c != null && typeof c === 'object');
          
          const candidatosMapeados = candidatosValidos.map(c => {
            try {
              return mapearCandidatoDesdeBackend(c, partidosMap);
            } catch (error) {
              console.error("Error al mapear candidato:", c, error);
              return null;
            }
          }).filter(c => c != null);
          
          const candidatosConFotos = candidatosMapeados.map(candidato => {
            if (!candidato || typeof candidato !== 'object') return null;
            try {
              return {
                ...candidato,
                foto: getFotoCandidato(candidato) || candidato.foto || "",
                logoPartido: getLogoPartido(candidato.partidoPolitico) || null,
              };
            } catch (error) {
              console.error("Error al procesar foto/logo del candidato:", candidato, error);
              return candidato;
            }
          }).filter(c => c != null);
          
          setCandidatos(candidatosConFotos);
          setModalCreate(false);
        } catch (error) {
          console.error("Error al recargar parlamentarios andinos:", error);
        } finally {
          setLoading(false);
        }
      };
      
      await cargarCandidatos();
      
      // Registrar en auditoría
      registrarExito(
        "Crear Candidato Parlamento Andino",
        `Parlamentario Andino creado: ${nuevoCandidato.nombre || nuevoCandidato.nombreCompleto} - Partido: ${nuevoCandidato.partidoPolitico}`,
        { tipo: "Parlamento Andino", partido: nuevoCandidato.partidoPolitico }
      );
    } catch (error) {
      console.error("Error al crear candidato:", error);
      registrarError("Crear Candidato Parlamento Andino", `Error al crear parlamentario andino: ${error.message}`);
      alert(`Error al crear parlamentario andino: ${error.message}`);
      throw error;
    }
  };

  const handleEditar = async (candidatoActualizado) => {
    try {
      await actualizarCandidatoEnAPI(candidatoActualizado.idCandidato, candidatoActualizado);
      
      // Registrar en auditoría
      registrarExito(
        "Editar Candidato Parlamento Andino",
        `Parlamentario Andino editado: ${candidatoActualizado.nombre || candidatoActualizado.nombreCompleto} (ID: ${candidatoActualizado.idCandidato})`,
        { tipo: "Parlamento Andino", candidatoId: candidatoActualizado.idCandidato }
      );
      
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar candidato:", error);
      registrarError("Editar Candidato Parlamento Andino", `Error al editar parlamentario andino: ${error.message}`);
      throw error;
    }
  };

  const handleEliminar = async () => {
    if (!selectedCandidate) return;
    
    try {
      const idCandidato = selectedCandidate.idCandidato || selectedCandidate.id;
      if (!idCandidato) {
        throw new Error("ID del candidato no encontrado");
      }
      await eliminarCandidatoEnAPI(idCandidato);
      
      // Registrar en auditoría
      registrarExito(
        "Eliminar Candidato Parlamento Andino",
        `Parlamentario Andino eliminado: ${selectedCandidate.nombre || selectedCandidate.nombreCompleto} (ID: ${idCandidato})`,
        { tipo: "Parlamento Andino", candidatoId: idCandidato }
      );
      
      // Recargar la página para actualizar la lista
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar candidato:", error);
      alert(`Error al eliminar candidato: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando parlamentarios andinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserSquare2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parlamento Andino</h1>
            <p className="text-sm text-gray-600">Administra la información de los candidatos al Parlamento Andino.</p>
          </div>
        </div>
        <button
          onClick={() => setModalCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Plus className="w-5 h-5" /> Agregar Candidato
        </button>
      </div>

      {/* Lista de candidatos */}
      <ListaCandidatos
        candidatos={candidatos}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCargo={filterCargo}
        setFilterCargo={setFilterCargo}
        onVerPropuestas={(candidato) => {
          setSelectedCandidate(candidato);
          setModalVerPropuestas(true);
        }}
        onEditar={(candidato) => {
          setSelectedCandidate(candidato);
          setModalEdit(true);
        }}
        onEliminar={(candidato) => {
          setSelectedCandidate(candidato);
          setModalDelete(true);
        }}
      />

      {/* Modales */}
      <CandidatoCrear
        isOpen={modalCreate}
        onClose={() => setModalCreate(false)}
        onSave={handleCrear}
        partidos={partidosParaModales}
        cargos={CARGOS_ELECTORALES}
      />

      <CandidatoEditar
        isOpen={modalEdit}
        onClose={() => {
          setModalEdit(false);
          setSelectedCandidate(null);
        }}
        onSave={handleEditar}
        candidate={selectedCandidate}
        partidos={partidosParaModales}
        cargos={CARGOS_ELECTORALES}
      />

      <CandidatoEliminar
        isOpen={modalDelete}
        onClose={() => {
          setModalDelete(false);
          setSelectedCandidate(null);
        }}
        onConfirm={handleEliminar}
        candidate={selectedCandidate}
      />

      <CandidatoVerPropuestas
        isOpen={modalVerPropuestas}
        onClose={() => {
          setModalVerPropuestas(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
      />
    </div>
  );
}

