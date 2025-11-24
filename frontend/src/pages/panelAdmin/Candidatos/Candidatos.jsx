import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { UserSquare2, Flag, Search, Plus, Edit, Trash2 } from "lucide-react";
// Importar componentes de candidatos separados
import CandidatosPresidentes from "./CandidatosPresidentes";
import CandidatosCongresistas from "./CandidatosCongresistas";
import CandidatosParlamentoAndino from "./CandidatosParlamentoAndino";
// Importar componentes de partidos
import PartidoCrear from "../Partidos/PartidoCrear";
import PartidoEditar from "../Partidos/PartidoEditar";
import PartidoEliminar from "../Partidos/PartidoEliminar";
import {
  obtenerPartidos,
  crearPartido,
  actualizarPartido,
  eliminarPartido
} from "../../../services/partidosService";
import { obtenerPartidosDesdeAPI } from "../../../services/candidatosService";
import { getLogoPartido, getPartidoSimbolo } from "./utils/candidatosUtils";
import { PARTIDOS_POLITICOS } from "../../../constants/electoralConstants";

export default function Candidatos() {
  const location = useLocation();
  
  // Estado para pestañas - detectar si viene de la ruta de partidos
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes("/partidos") ? "partidos" : "candidatos"
  );
  
  // Estado para sub-pestañas de tipo de candidato
  const [tipoCandidato, setTipoCandidato] = useState("presidentes"); // "presidentes", "congresistas", "andino"
  
  // Estados para partidos
  const [partidos, setPartidos] = useState([]);
  const [loadingPartidos, setLoadingPartidos] = useState(false);
  const [searchPartidos, setSearchPartidos] = useState("");
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [modalPartidoCreate, setModalPartidoCreate] = useState(false);
  const [modalPartidoEdit, setModalPartidoEdit] = useState(false);
  const [modalPartidoDelete, setModalPartidoDelete] = useState(false);

  // Cargar partidos una sola vez al inicio
  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        setLoadingPartidos(true);
        const partidosData = await obtenerPartidos();
        setPartidos(partidosData || []);
      } catch (error) {
        console.error("Error al cargar partidos desde API:", error);
        setPartidos([]);
      } finally {
        setLoadingPartidos(false);
      }
    };

    cargarPartidos();
  }, []);

  // Filtro de partidos
  const filteredPartidos = useMemo(() => {
    return partidos.filter((p) =>
      `${p.nombre || ""} ${p.abreviatura || ""}`
        .toLowerCase()
        .includes(searchPartidos.toLowerCase())
    );
  }, [partidos, searchPartidos]);

  // Handlers para partidos
  const handlePartidoCreate = async (data) => {
    try {
      setLoadingPartidos(true);
      const partidoCreado = await crearPartido({
        nombre: data.nombre,
        abreviatura: data.abreviatura,
        estado: data.estado || "Activo",
      });
      setPartidos([...partidos, partidoCreado]);
      setModalPartidoCreate(false);
      alert("Partido creado exitosamente.");
    } catch (error) {
      console.error("Error al crear partido:", error);
      alert(`Error al crear partido: ${error.message}`);
    } finally {
      setLoadingPartidos(false);
    }
  };

  const handlePartidoEdit = async (data) => {
    try {
      setLoadingPartidos(true);
      const partidoId = data.idPartido || data.id;
      const partidoActualizado = await actualizarPartido(partidoId, {
        nombre: data.nombre,
        abreviatura: data.abreviatura,
        estado: data.estado,
      });
      setPartidos(partidos.map((p) => {
        const pId = p.idPartido || p.id;
        return pId === partidoId ? partidoActualizado : p;
      }));
      setModalPartidoEdit(false);
      alert("Partido actualizado exitosamente.");
    } catch (error) {
      console.error("Error al actualizar partido:", error);
      alert(`Error al actualizar partido: ${error.message}`);
    } finally {
      setLoadingPartidos(false);
    }
  };

  const handlePartidoDelete = async () => {
    if (!selectedPartido) return;
    
    if (!confirm(`¿Estás seguro de eliminar el partido ${selectedPartido.nombre}?`)) {
      return;
    }

    try {
      setLoadingPartidos(true);
      const partidoId = selectedPartido.idPartido || selectedPartido.id;
      await eliminarPartido(partidoId);
      setPartidos(partidos.filter((p) => {
        const pId = p.idPartido || p.id;
        return pId !== partidoId;
      }));
      setModalPartidoDelete(false);
      alert("Partido eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar partido:", error);
      alert(`Error al eliminar partido: ${error.message}`);
    } finally {
      setLoadingPartidos(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserSquare2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Candidatos y Partidos</h1>
            <p className="text-sm text-gray-600">Administra la información de los candidatos y sus partidos políticos.</p>
          </div>
        </div>
        {activeTab === "partidos" && (
          <button
            onClick={() => setModalPartidoCreate(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <Plus className="w-5 h-5" /> Nuevo Partido
          </button>
        )}
      </div>

      {/* Pestañas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("candidatos")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "candidatos"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserSquare2 className="w-5 h-5" />
              <span>Candidatos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("partidos")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "partidos"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Flag className="w-5 h-5" />
              <span>Partidos Políticos</span>
            </div>
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === "candidatos" && (
        <>
          {/* Sub-pestañas de tipo de candidato */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setTipoCandidato("presidentes")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
                  tipoCandidato === "presidentes"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Presidentes y Vicepresidentes
              </button>
              <button
                onClick={() => setTipoCandidato("congresistas")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
                  tipoCandidato === "congresistas"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Congresistas
              </button>
              <button
                onClick={() => setTipoCandidato("andino")}
                className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
                  tipoCandidato === "andino"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Parlamento Andino
              </button>
            </div>
          </div>

          {/* Renderizar componente según el tipo seleccionado */}
          {tipoCandidato === "presidentes" && <CandidatosPresidentes />}
          {tipoCandidato === "congresistas" && <CandidatosCongresistas />}
          {tipoCandidato === "andino" && <CandidatosParlamentoAndino />}
        </>
      )}

      {/* Vista de Partidos */}
      {activeTab === "partidos" && (
        <>
          {/* Búsqueda de partidos */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o abreviatura..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchPartidos}
                onChange={(e) => setSearchPartidos(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de partidos */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Cabecera */}
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nombre del Partido
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Abreviatura
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>

                {/* Cuerpo */}
                <tbody className="bg-white divide-y divide-gray-100">
                  {loadingPartidos ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando partidos...</p>
                      </td>
                    </tr>
                  ) : filteredPartidos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No se encontraron partidos</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPartidos.map((p) => (
                      <tr
                        key={p.idPartido || p.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200"
                      >
                        {/* ID */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                          #{p.idPartido || p.id}
                        </td>

                        {/* Logo */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-14 h-14 rounded-lg shadow-sm border bg-white overflow-hidden flex items-center justify-center">
                            {getLogoPartido(p.nombre) ? (
                              <img
                                src={getLogoPartido(p.nombre)}
                                alt={`Logo ${p.nombre}`}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-blue-600 font-bold text-xl">
                                {p.abreviatura || getPartidoSimbolo(p.nombre)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Nombre */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {p.nombre}
                        </td>

                        {/* Abreviatura */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {p.abreviatura}
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              (p.estado === "Activo" || !p.estado)
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.estado || "Activo"}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedPartido(p);
                                setModalPartidoEdit(true);
                              }}
                              className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-lg transition-all duration-200 hover:scale-110"
                            >
                              <Edit className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedPartido(p);
                                setModalPartidoDelete(true);
                              }}
                              className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 hover:scale-110"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modales de Partidos */}
      <PartidoCrear
        isOpen={modalPartidoCreate}
        onClose={() => setModalPartidoCreate(false)}
        onSave={handlePartidoCreate}
      />
      <PartidoEditar
        isOpen={modalPartidoEdit}
        onClose={() => setModalPartidoEdit(false)}
        onSave={handlePartidoEdit}
        partido={selectedPartido}
      />
      <PartidoEliminar
        isOpen={modalPartidoDelete}
        onClose={() => setModalPartidoDelete(false)}
        onConfirm={handlePartidoDelete}
        partido={selectedPartido}
      />
    </div>
  );
}
