import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Plus, Edit, Trash2, Lock, Search, Filter } from "lucide-react";
import RolCrear from "./RolCrear";
import RolEditar from "./RolEditar";
import RolEliminar from "./RolEliminar";

// Datos iniciales simulados
const initialRoles = [
  {
    id: 1,
    nombre: "Super Admin",
    descripcion: "Acceso total al sistema y configuración global.",
    permisos: ["Usuarios", "Centros", "Resultados", "Configuración", "Auditoría", "Análisis de Datos"],
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Admin Regional",
    descripcion: "Gestiona centros y resultados dentro de su región.",
    permisos: ["Centros", "Resultados", "Reportes"],
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Presidente de Mesa",
    descripcion: "Registra y valida los resultados de mesa electoral.",
    permisos: ["Resultados"],
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Soporte Técnico",
    descripcion: "Da soporte al sistema y usuarios regionales.",
    permisos: ["Usuarios", "Reportes"],
    estado: "Inactivo",
  },
];

export default function RolesyPermisos() {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const handleCreate = (data) => {
    setRoles([...roles, { ...data, id: Date.now() }]);
    setModalCreate(false);
  };

  const handleEdit = (data) => {
    setRoles(roles.map((r) => (r.id === data.id ? data : r)));
    setModalEdit(false);
  };

  const handleDelete = () => {
    setRoles(roles.filter((r) => r.id !== selectedRole.id));
    setModalDelete(false);
  };

  // Filtros y búsqueda
  const filteredRoles = roles.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.permisos.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEstado = filterEstado === "Todos" || r.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* 🧭 Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Roles y Permisos</h1>
            <p className="text-sm text-gray-600">
              Define los niveles de acceso y responsabilidades dentro del sistema.
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all font-medium"
        >
          <Plus className="w-5 h-5" /> Crear Nuevo Rol
        </button>
      </div>

      {/* 🔍 Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o permisos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3">
            <Filter className="w-4 h-4 mr-2" />
            {filteredRoles.length} roles encontrados
          </div>
        </div>
      </div>

      {/* 🧾 Tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Permisos</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No se encontraron roles</p>
                    <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((rol) => (
              <tr key={rol.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {rol.estado === "Activo" ? (
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">{rol.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{rol.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    {rol.permisos.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                      rol.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rol.estado === "Activo" ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {rol.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedRole(rol);
                        setModalEdit(true);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRole(rol);
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
      <RolCrear
        isOpen={modalCreate}
        onClose={() => setModalCreate(false)}
        onSave={handleCreate}
      />
      <RolEditar
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        onSave={handleEdit}
        role={selectedRole}
      />
      <RolEliminar
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        onConfirm={handleDelete}
        role={selectedRole}
      />
    </motion.div>
  );
}
