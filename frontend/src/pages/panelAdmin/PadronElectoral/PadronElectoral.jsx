import React, { useState, useMemo, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ClipboardCheck, Search, Upload, Eye, UserCheck, UserX, Trash2 } from "lucide-react";
import PadronSubir from "./PadronSubir";
import PadronVer from "./PadronVer";
import { obtenerDatasetsOriginales, eliminarDataset } from "../../../services/datasetsService";

export default function PadronElectoral() {
  const [padron] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const fileInputRef = useRef(null);

  // Cargar lista de datasets al montar el componente
  useEffect(() => {
    cargarDatasets();
  }, []);

  const cargarDatasets = async () => {
    try {
      setLoading(true);
      const datos = await obtenerDatasetsOriginales();
      setDatasets(datos || []);
    } catch (error) {
      console.error("Error al cargar datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    // Recargar la lista de datasets después de una carga exitosa
    cargarDatasets();
  };

  const handleDeleteDataset = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
      return;
    }

    try {
      await eliminarDataset(id);
      // Recargar la lista
      cargarDatasets();
    } catch (error) {
      console.error("Error al eliminar dataset:", error);
      alert("Error al eliminar el archivo. Por favor, intenta nuevamente.");
    }
  };

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
  const handleCloseModals = () => {
    setIsUploadModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedVoter(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión del Padrón Electoral
            </h1>
            <p className="text-sm text-gray-600">
              Administra, consulta y visualiza el registro de votantes.
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                  </td>
                </tr>
              ) : (
                filteredPadron.map((voter) => (
                  <tr key={voter.id} className="hover:bg-blue-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{voter.nombre}</div>
                      <div className="text-sm text-gray-500">DNI: {voter.dni}</div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {voter.distrito}, {voter.departamento}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{voter.centroVotacion}</div>
                      <div className="text-xs">
                        Mesa: <strong>{voter.mesa}</strong>
                      </div>
                    </td>

                    <td className="px-6 py-4">
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

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetailsModal(voter)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-200"
                        title="Ver Detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista de archivos subidos */}
      {datasets.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Archivos CSV Subidos</h2>
            <p className="text-sm text-gray-600 mt-1">Gestiona los archivos del padrón electoral</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del Archivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Subida
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datasets.map((dataset) => (
                  <tr key={dataset.id || dataset.idDataset} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dataset.nombre || dataset.nombreArchivo || "Sin nombre"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dataset.fechaCreacion 
                        ? new Date(dataset.fechaCreacion).toLocaleDateString('es-PE')
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteDataset(dataset.id || dataset.idDataset)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      <PadronSubir
        isOpen={isUploadModalOpen}
        onClose={handleCloseModals}
        fileInputRef={fileInputRef}
        onUploadSuccess={handleUploadSuccess}
      />

      <PadronVer
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        voter={selectedVoter}
      />
    </motion.div>
  );
}
