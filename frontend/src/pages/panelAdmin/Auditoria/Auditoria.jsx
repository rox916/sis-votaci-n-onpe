import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Calendar,
  User,
  Activity,
  Clock,
  FileText,
  RefreshCw,
  Eye,
  EyeOff,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { fetchAPI, API_ENDPOINTS } from '../../../config/apiConfig';
import { obtenerAuditoria } from '../../../services/auditoriaService';

export default function Auditoria() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterUser, setFilterUser] = useState('Todos');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterAction, setFilterAction] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAudit, setExpandedAudit] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 15;

  // Cargar datos de auditoría
  useEffect(() => {
    cargarAuditoria();
  }, []);

  const cargarAuditoria = async () => {
    try {
      setLoading(true);
      // TODO: Cuando el backend tenga el endpoint, usar:
      // const data = await fetchAPI(API_ENDPOINTS.AUDITORIA.LISTAR);
      // Por ahora, usar el servicio de auditoría que maneja localStorage
      const data = obtenerAuditoria();
      setAudits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar auditoría:", error);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuarios únicos
  const uniqueUsers = useMemo(() => {
    const users = [...new Set(audits.map(audit => audit.usuario?.nombre || audit.usuario || 'Sistema'))];
    return users.sort();
  }, [audits]);

  // Obtener acciones únicas
  const uniqueActions = useMemo(() => {
    const actions = [...new Set(audits.map(audit => audit.accion || audit.action || ''))];
    return actions.filter(a => a).sort();
  }, [audits]);

  // Filtrar auditoría
  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      const auditDate = new Date(audit.timestamp || audit.fecha || audit.date);
      
      // Filtro de búsqueda
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (audit.accion || audit.action || '').toLowerCase().includes(searchLower) ||
        (audit.detalle || audit.detalles || audit.detail || '').toLowerCase().includes(searchLower) ||
        (audit.usuario?.nombre || audit.usuario || 'Sistema').toLowerCase().includes(searchLower) ||
        (audit.ip || audit.ipAddress || '').toLowerCase().includes(searchLower);

      // Filtro de nivel
      const matchesLevel = filterLevel === 'Todos' || (audit.nivel || audit.level || audit.tipo) === filterLevel;

      // Filtro de usuario
      const user = audit.usuario?.nombre || audit.usuario || 'Sistema';
      const matchesUser = filterUser === 'Todos' || user === filterUser;

      // Filtro de acción
      const action = audit.accion || audit.action || '';
      const matchesAction = filterAction === 'Todos' || action === filterAction;

      // Filtro de fecha
      let matchesDate = true;
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (auditDate < fromDate) matchesDate = false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (auditDate > toDate) matchesDate = false;
      }

      return matchesSearch && matchesLevel && matchesUser && matchesAction && matchesDate;
    });
  }, [audits, searchTerm, filterLevel, filterUser, filterAction, filterDateFrom, filterDateTo]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = filteredAudits.length;
    const exitos = filteredAudits.filter(a => (a.nivel || a.level || a.tipo) === 'Éxito').length;
    const advertencias = filteredAudits.filter(a => (a.nivel || a.level || a.tipo) === 'Advertencia').length;
    const errores = filteredAudits.filter(a => (a.nivel || a.level || a.tipo) === 'Error').length;
    
    return { total, exitos, advertencias, errores };
  }, [filteredAudits]);

  // Paginación
  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAudits.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const getLevelIcon = (nivel) => {
    const level = nivel || 'Info';
    switch (level) {
      case 'Éxito':
      case 'Success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Advertencia':
      case 'Warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (nivel) => {
    const level = nivel || 'Info';
    switch (level) {
      case 'Éxito':
      case 'Success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Advertencia':
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportarAuditoria = () => {
    const csvContent = [
      ['Fecha y Hora', 'Usuario', 'Acción', 'Detalle', 'Nivel', 'IP', 'User Agent'].join(','),
      ...filteredAudits.map(audit => {
        const fecha = new Date(audit.timestamp || audit.fecha || audit.date).toLocaleString('es-PE');
        const usuario = audit.usuario?.nombre || audit.usuario || 'Sistema';
        const accion = (audit.accion || audit.action || '').replace(/,/g, ';');
        const detalle = (audit.detalle || audit.detalles || audit.detail || '').replace(/,/g, ';').replace(/\n/g, ' ');
        const nivel = audit.nivel || audit.level || audit.tipo || 'Info';
        const ip = audit.ip || audit.ipAddress || '';
        const userAgent = (audit.userAgent || audit.user_agent || '').replace(/,/g, ';');
        return [fecha, usuario, accion, detalle, nivel, ip, userAgent].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFilterLevel('Todos');
    setFilterUser('Todos');
    setFilterAction('Todos');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bitácora de Auditoría</h1>
            <p className="text-sm text-gray-600">
              Registro inmutable de todas las acciones críticas del sistema.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarAuditoria}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={exportarAuditoria}
            disabled={filteredAudits.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Eventos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Éxitos</p>
              <p className="text-2xl font-bold text-green-600">{stats.exitos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Advertencias</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.advertencias}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errores</p>
              <p className="text-2xl font-bold text-red-600">{stats.errores}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={limpiarFiltros}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showFilters ? 'Ocultar' : 'Mostrar'} filtros avanzados
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
            >
              <select
                value={filterAction}
                onChange={(e) => {
                  setFilterAction(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Todas las Acciones</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  placeholder="Fecha desde"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filterDateFrom}
                  onChange={(e) => {
                    setFilterDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  placeholder="Fecha hasta"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filterDateTo}
                  onChange={(e) => {
                    setFilterDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{filteredAudits.length} eventos encontrados</span>
          </div>
          {filteredAudits.length !== audits.length && (
            <span className="text-blue-600">
              {audits.length - filteredAudits.length} eventos ocultos por filtros
            </span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando auditoría...</p>
            </div>
          </div>
        ) : filteredAudits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <History className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay registros de auditoría</h3>
            <p className="text-sm text-gray-600 text-center max-w-md">
              {audits.length === 0 
                ? "No se han registrado eventos de auditoría aún. Los eventos aparecerán aquí cuando se realicen acciones en el sistema."
                : "No se encontraron eventos que coincidan con los filtros aplicados."}
            </p>
            {audits.length > 0 && (
              <button
                onClick={limpiarFiltros}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {currentItems.map((audit) => (
                      <motion.tr
                        key={audit.id || audit.timestamp}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {new Date(audit.timestamp || audit.fecha || audit.date).toLocaleString('es-PE', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {audit.usuario?.nombre || audit.usuario || 'Sistema'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {audit.accion || audit.action || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <p className="truncate max-w-xs" title={audit.detalle || audit.detalles || audit.detail || ''}>
                            {audit.detalle || audit.detalles || audit.detail || 'Sin detalles'}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getLevelIcon(audit.nivel || audit.level || audit.tipo)}
                            <span className={`text-sm font-semibold px-2 py-1 rounded border ${getLevelColor(audit.nivel || audit.level || audit.tipo)}`}>
                              {audit.nivel || audit.level || audit.tipo || 'Info'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setExpandedAudit(expandedAudit === audit.id ? null : audit.id)}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {expandedAudit === audit.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {expandedAudit === audit.id ? 'Ocultar' : 'Ver'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Detalles expandidos */}
            <AnimatePresence>
              {expandedAudit && currentItems.find(a => a.id === expandedAudit) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 bg-gray-50 p-6"
                >
                  {(() => {
                    const audit = currentItems.find(a => a.id === expandedAudit);
                    if (!audit) return null;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Información Completa</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Fecha y Hora:</span>{' '}
                              <span className="text-gray-600">
                                {new Date(audit.timestamp || audit.fecha || audit.date).toLocaleString('es-PE')}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Usuario:</span>{' '}
                              <span className="text-gray-600">{audit.usuario?.nombre || audit.usuario || 'Sistema'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Acción:</span>{' '}
                              <span className="text-gray-600">{audit.accion || audit.action || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Nivel:</span>{' '}
                              <span className="text-gray-600">{audit.nivel || audit.level || audit.tipo || 'Info'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Detalles Técnicos</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">IP:</span>{' '}
                              <span className="text-gray-600">{audit.ip || audit.ipAddress || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">User Agent:</span>{' '}
                              <span className="text-gray-600 break-all">{audit.userAgent || audit.user_agent || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Detalle Completo:</span>
                              <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                                {audit.detalle || audit.detalles || audit.detail || 'Sin detalles adicionales'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
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
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Números de página */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
