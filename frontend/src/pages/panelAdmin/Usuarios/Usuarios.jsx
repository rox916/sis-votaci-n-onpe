import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, Users, Plus, Edit, Trash2 } from "lucide-react";
import { ROLES_USUARIO, DEPARTAMENTOS_PERU } from "../../../constants/electoralConstants";
import UsuarioCrear from "./UsuarioCrear";
import UsuarioEditar from "./UsuarioEditar";
import UsuarioEliminar from "./UsuarioEliminar";

// Datos iniciales de usuarios administrativos
const initialUsuarios = [
  {
    id: 1,
    nombre: "Juan Pérez",
    dni: "12345678",
    email: "juan.perez@onpe.gob.pe",
    rol: "Super Admin",
    departamento: "Lima",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María García",
    dni: "87654321",
    email: "maria.garcia@onpe.gob.pe",
    rol: "Admin Regional",
    departamento: "Cusco",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos López",
    dni: "11223344",
    email: "carlos.lopez@onpe.gob.pe",
    rol: "Presidente de Mesa",
    departamento: "Arequipa",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    dni: "44332211",
    email: "ana.martinez@onpe.gob.pe",
    rol: "Soporte Técnico",
    departamento: "Lima",
    estado: "Inactivo",
  },
];

export default function Usuarios() {
  // Cargar usuarios desde localStorage o usar datos iniciales
  const [usuarios, setUsuarios] = useState(() => {
    const stored = localStorage.getItem("usuarios");
    return stored ? JSON.parse(stored) : initialUsuarios;
  });

  // Guardar en localStorage cuando cambien los usuarios
  React.useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // Filtrar usuarios
  const filtered = usuarios.filter((u) => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.dni.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === "Todos" || u.rol === filterRol;
    const matchesEstado = filterEstado === "Todos" || u.estado === filterEstado;
    return matchesSearch && matchesRol && matchesEstado;
  });

  // Acciones CRUD
  const handleCreate = (data) => {
    setUsuarios([...usuarios, { ...data, id: Date.now() }]);
    setModalCreate(false);
  };

  const handleEdit = (data) => {
    setUsuarios(usuarios.map((u) => (u.id === data.id ? data : u)));
    setModalEdit(false);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    setUsuarios(usuarios.filter((u) => u.id !== selectedUser.id));
    setModalDelete(false);
    setSelectedUser(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-600">
              Administra los usuarios del sistema electoral
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los roles</option>
            {ROLES_USUARIO.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filtered.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{usuario.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{usuario.dni}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{usuario.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{usuario.departamento}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                          usuario.estado === "Activo"
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                            : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
                        }`}
                      >
                        {usuario.estado === "Activo" ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(usuario);
                            setModalEdit(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(usuario);
                            setModalDelete(true);
                          }}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modales */}
      <UsuarioCrear
        isOpen={modalCreate}
        onClose={() => setModalCreate(false)}
        onSave={handleCreate}
        roles={ROLES_USUARIO}
        departamentos={DEPARTAMENTOS_PERU}
      />
      <UsuarioEditar
        isOpen={modalEdit}
        onClose={() => {
          setModalEdit(false);
          setSelectedUser(null);
        }}
        onSave={handleEdit}
        user={selectedUser}
        roles={ROLES_USUARIO}
        departamentos={DEPARTAMENTOS_PERU}
      />
      <UsuarioEliminar
        isOpen={modalDelete}
        onClose={() => {
          setModalDelete(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
        user={selectedUser}
      />
    </motion.div>
  );
}
