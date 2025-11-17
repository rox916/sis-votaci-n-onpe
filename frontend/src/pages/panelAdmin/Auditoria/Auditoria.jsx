import React, { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { History, Search, Filter, CheckCircle, AlertCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Función para generar datos de ejemplo realistas
const generateMockAudits = () => {
  const usuarios = ['Ana García Castillo', 'Carlos Ruiz Mendoza', 'Lucía Ramírez Torres', 'Miguel Torres Vargas', 'Sofia Morales Diaz', 'Sistema Automático'];
  const acciones = [
    { texto: 'Inicio de Sesión', nivel: 'Éxito' },
    { texto: 'Cierre de Sesión', nivel: 'Éxito' },
    { texto: 'Creó Usuario', nivel: 'Éxito' },
    { texto: 'Editó Usuario', nivel: 'Éxito' },
    { texto: 'Eliminó Usuario', nivel: 'Advertencia' },
    { texto: 'Configuró Parámetro de Elección', nivel: 'Éxito' },
    { texto: 'Generó Reporte de Resultados', nivel: 'Éxito' },
    { texto: 'Intento de Acceso No Autorizado', nivel: 'Error' },
    { texto: 'Subió Padrón Electoral', nivel: 'Éxito' },
    { texto: 'Modificó Candidato', nivel: 'Advertencia' },
  ];

  let audits = [];
  for (let i = 0; i < 85; i++) {
    const accion = acciones[Math.floor(Math.random() * acciones.length)];
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    audits.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      usuario: { nombre: usuario },
      accion: accion.texto,
      detalle: `Detalle del evento ${i + 1}. ${accion.texto === 'Creó Usuario' ? 'Nuevo usuario asignado.' : 'Operación completada.'}`,
      nivel: accion.nivel,
    });
  }
  return audits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export default function Auditoria() {
  const [audits, setAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterUser, setFilterUser] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setAudits(generateMockAudits());
  }, []);

  const uniqueUsers = useMemo(() => {
    const users = [...new Set(audits.map(audit => audit.usuario.nombre))];
    return users.sort();
  }, [audits]);

  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      const matchesSearch =
        audit.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = filterLevel === 'Todos' || audit.nivel === filterLevel;
      const matchesUser = filterUser === 'Todos' || audit.usuario.nombre === filterUser;

      return matchesSearch && matchesLevel && matchesUser;
    });
  }, [audits, searchTerm, filterLevel, filterUser]);

  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAudits.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const getLevelIcon = (nivel) => {
    switch (nivel) {
      case 'Éxito': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Advertencia': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <History className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bitácora de Auditoría</h1>
          <p className="text-sm text-gray-600">
            Registro inmutable de todas las acciones críticas del sistema.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar en auditoría..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => {
              setFilterLevel(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los Niveles</option>
            <option value="Éxito">Éxito</option>
            <option value="Advertencia">Advertencia</option>
            <option value="Error">Error</option>
          </select>
          <select
            value={filterUser}
            onChange={(e) => {
              setFilterUser(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los Usuarios</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3">
            <Filter className="w-4 h-4 mr-2" />
            {filteredAudits.length} eventos encontrados
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(audit.timestamp).toLocaleString('es-PE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {audit.usuario.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.accion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p className="truncate max-w-xs" title={audit.detalle}>
                      {audit.detalle}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(audit.nivel)}
                      <span
                        className={`text-sm font-semibold ${
                          audit.nivel === 'Éxito'
                            ? 'text-green-800'
                            : audit.nivel === 'Advertencia'
                            ? 'text-yellow-800'
                            : 'text-red-800'
                        }`}
                      >
                        {audit.nivel}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
            <span className="font-medium">
              {indexOfLastItem > filteredAudits.length ? filteredAudits.length : indexOfLastItem}
            </span>{' '}
            de <span className="font-medium">{filteredAudits.length}</span> resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
