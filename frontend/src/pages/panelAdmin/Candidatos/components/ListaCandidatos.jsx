import React from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, UserSquare2, MapPin, Building2, Eye } from "lucide-react";
import { getFotoCandidato, getLogoPartido, getPartidoSimbolo } from "../utils/candidatosUtils";
import SimboloPartido from "./SimboloPartido";
import { CARGOS_ELECTORALES } from "../../../../constants/electoralConstants";

const cargos = CARGOS_ELECTORALES;

export default function ListaCandidatos({
  candidatos,
  searchTerm,
  setSearchTerm,
  filterCargo,
  setFilterCargo,
  onVerPropuestas,
  onEditar,
  onEliminar,
}) {
  // Filtro y búsqueda de candidatos
  const filteredCandidatos = candidatos.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.partidoPolitico.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCargo = filterCargo === "Todos" || c.cargo === filterCargo;
    return matchesSearch && matchesCargo;
  });

  return (
    <>
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
                    onClick={() => onVerPropuestas(candidato)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Ver Propuestas"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditar(candidato)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEliminar(candidato)}
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
    </>
  );
}


