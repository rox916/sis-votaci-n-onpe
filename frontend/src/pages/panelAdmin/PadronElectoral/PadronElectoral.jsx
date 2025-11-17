import React, { useState, useMemo, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ClipboardCheck, Search, Upload, Eye, Edit, UserCheck, UserX } from "lucide-react";
import PadronSubir from "./PadronSubir";
import PadronVer from "./PadronVer";
import PadronEditar from "./PadronEditar";

// Datos de ejemplo iniciales
const initialPadron = [
  { id: 1, dni: "87654321", nombre: "Ana Gabriela Castillo Garcia", departamento: "Lima", provincia: "Lima", distrito: "San Borja", centroVotacion: "IE 1234 República de Venezuela", mesa: "045", estado: "Votó" },
  { id: 2, dni: "12345678", nombre: "Carlos Ruiz Mendoza", departamento: "Cusco", provincia: "Cusco", distrito: "Wanchaq", centroVotacion: "Colegio Nacional Nuestra Señora de Guadalupe", mesa: "112", estado: "No Votó" },
  { id: 3, dni: "87654322", nombre: "Lucía Ramírez Torres", departamento: "Arequipa", provincia: "Arequipa", distrito: "Cercado", centroVotacion: "IE 3050 Ramón Castilla", mesa: "023", estado: "Votó" },
  { id: 4, dni: "12345679", nombre: "Miguel Torres Vargas", departamento: "Lima", provincia: "Lima", distrito: "San Miguel", centroVotacion: 'Complejo Deportivo "La Videna"', mesa: "201", estado: "Votó" },
  { id: 5, dni: "45678901", nombre: "Sofia Morales Diaz", departamento: "Piura", provincia: "Piura", distrito: "Catacaos", centroVotacion: "IE 0051 Gran Mariscal Ramón Castilla", mesa: "156", estado: "No Votó" },
  { id: 6, dni: "98765432", nombre: "Pedro Alvarado Sosa", departamento: "Lima", provincia: "Huaral", distrito: "Huaral", centroVotacion: "IE 2070 José Carlos Mariátegui", mesa: "089", estado: "Votó" },
  { id: 7, dni: "11223344", nombre: "Patricia Rojas Benavides", departamento: "Junín", provincia: "Huancayo", distrito: "Huancayo", centroVotacion: "IE 3082 Santa Rosa", mesa: "234", estado: "No Votó" },
];

export default function PadronElectoral() {
  const [padron, setPadron] = useState(initialPadron);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const fileInputRef = useRef(null);

  // Filtro
  const filteredPadron = useMemo(() => {
    return padron.filter(
      (voter) =>
        voter.dni.includes(searchTerm) ||
        voter.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.centroVotacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [padron, searchTerm]);

  // Controladores de modales
  const handleOpenUploadModal = () => setIsUploadModalOpen(true);
  const handleOpenDetailsModal = (voter) => {
    setSelectedVoter(voter);
    setIsDetailsModalOpen(true);
  };
  const handleOpenEditModal = (voter) => {
    setSelectedVoter(voter);
    setIsEditModalOpen(true);
  };
  const handleCloseModals = () => {
    setIsUploadModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedVoter(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSaveStatus = (updatedVoter) => {
    setPadron(padron.map((v) => (v.id === updatedVoter.id ? updatedVoter : v)));
    handleCloseModals();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* 🧭 Encabezado estandarizado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión del Padrón Electoral
            </h1>
            <p className="text-sm text-gray-600">
              Administra, consulta y actualiza el registro de votantes habilitados en el sistema.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenUploadModal}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all font-medium"
        >
          <Upload className="w-5 h-5" /> Cargar Padrón
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por DNI, nombre, departamento o centro de votación..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Votante</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Centro / Mesa</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPadron.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No se encontraron votantes</p>
                    <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredPadron.map((voter) => (
                <tr key={voter.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{voter.nombre}</div>
                    <div className="text-sm text-gray-500">DNI: {voter.dni}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voter.distrito}, {voter.departamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{voter.centroVotacion}</div>
                    <div className="text-xs">
                      Mesa: <strong>{voter.mesa}</strong>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        voter.estado === "Votó"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {voter.estado === "Votó" ? (
                        <UserCheck className="w-3 h-3" />
                      ) : (
                        <UserX className="w-3 h-3" />
                      )}
                      {voter.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDetailsModal(voter)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Ver Detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(voter)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-yellow-500 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Editar Estado"
                      >
                        <Edit className="w-5 h-5" />
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
      <PadronSubir
        isOpen={isUploadModalOpen}
        onClose={handleCloseModals}
        fileInputRef={fileInputRef}
      />
      <PadronVer
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        voter={selectedVoter}
      />
      <PadronEditar
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        voter={selectedVoter}
        onSave={handleSaveStatus}
      />
    </motion.div>
  );
}
