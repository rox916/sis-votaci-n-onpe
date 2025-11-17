import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Building2, MapPin, User } from "lucide-react";
import CentroCrear from "./CentroCrear";
import CentroEditar from "./CentroEditar";
import CentroEliminar from "./CentroEliminar";
import { DEPARTAMENTOS_PERU } from "../../../constants/electoralConstants";

// Datos iniciales de centros de votación (datos de ejemplo para desarrollo)
const initialCentros = [
  { id: 1, nombre: "IE 1234 República de Venezuela", direccion: "Av. República de Venezuela 1455", departamento: "Lima", provincia: "Lima", distrito: "Lima", responsable: "Carlos Mendoza", mesasAsignadas: 15, estado: "Activo" },
  { id: 2, nombre: "Colegio Nacional Nuestra Señora de Guadalupe", direccion: "Av. Alfonso Ugarte 865", departamento: "Lima", provincia: "Lima", distrito: "Lima", responsable: "Ana García", mesasAsignadas: 20, estado: "Activo" },
  { id: 3, nombre: "IE 3050 Ramón Castilla", direccion: "Calle Piura 350", departamento: "Lima", provincia: "Lima", distrito: "San Miguel", responsable: "Lucía Ramírez", mesasAsignadas: 12, estado: "Activo" },
  { id: 4, nombre: 'Complejo Deportivo "La Videna"', direccion: "Av. Aviación 5395", departamento: "Lima", provincia: "Lima", distrito: "San Luis", responsable: "Miguel Torres", mesasAsignadas: 25, estado: "Activo" },
  { id: 5, nombre: "IE 0051 Gran Mariscal Ramón Castilla", direccion: "Jr. Cusco 350", departamento: "Cusco", provincia: "Cusco", distrito: "Cusco", responsable: "Sofia Morales", mesasAsignadas: 18, estado: "Inactivo" },
];

const departamentosPeru = DEPARTAMENTOS_PERU;

export default function Centros() {
  const [centros, setCentros] = useState(initialCentros);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // 🔍 Filtro de búsqueda
  const filteredCentros = centros.filter((centro) =>
    [centro.nombre, centro.direccion, centro.responsable].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Funciones CRUD para gestionar centros de votación
  const handleCreate = (data) => {
    setCentros([...centros, { ...data, id: Date.now() }]);
    setModalCreate(false);
  };

  const handleEdit = (data) => {
    setCentros(centros.map((c) => (c.id === data.id ? data : c)));
    setModalEdit(false);
  };

  const handleDelete = () => {
    setCentros(centros.filter((c) => c.id !== selectedCenter.id));
    setModalDelete(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* 🏛️ Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Locales de Votación</h1>
            <p className="text-sm text-gray-600">Gestiona los centros y mesas de sufragio.</p>
          </div>
        </div>
        <button
          onClick={() => setModalCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all font-medium"
        >
          <Plus className="w-5 h-5" /> Agregar Nuevo Local
        </button>
      </div>

      {/* 🔎 Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o responsable..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 🗂️ Tabla de centros */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Local</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mesas</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCentros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No se encontraron centros</p>
                    <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredCentros.map((centro) => (
                <tr key={centro.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{centro.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{centro.distrito}, {centro.departamento}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-xs" title={centro.direccion}>
                      {centro.direccion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {centro.responsable}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {centro.mesasAsignadas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        centro.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {centro.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCenter(centro);
                          setModalEdit(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCenter(centro);
                          setModalDelete(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Eliminar"
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

      {/* 🧩 Modales */}
      <CentroCrear
        isOpen={modalCreate}
        onClose={() => setModalCreate(false)}
        onSave={handleCreate}
        departamentos={departamentosPeru}
      />

      <CentroEditar
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        onSave={handleEdit}
        center={selectedCenter}
        departamentos={departamentosPeru}
      />

      <CentroEliminar
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        onConfirm={handleDelete}
        center={selectedCenter}
      />
    </motion.div>
  );
}
