import React, { useState, useEffect, useMemo, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, FileText, Clock, Activity, RefreshCw } from 'lucide-react';
import { 
  obtenerResultadosPorPartido,
  obtenerParticipacionPorRegion,
  obtenerKPIsVotantes,
} from '../../../services/analisisService';

// --- Componente para Contador Animado ---
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const easing = (t) => 1 - Math.pow(1 - t, 3); // Easing function for smooth animation

  useEffect(() => {
    let startTime;
    const startValue = countRef.current;
    const endValue = value;
    const changeInValue = endValue - startValue;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = easing(progress);
      const currentValue = Math.floor(startValue + changeInValue * easedProgress);
      
      setCount(currentValue);
      countRef.current = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value, duration]);

  return <span>{count.toLocaleString('es-PE')}</span>;
};

export default function Resultados() {
  const [selectedRegion, setSelectedRegion] = useState('Nacional');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [resultadosPartidos, setResultadosPartidos] = useState([]);
  const [participacionPorRegion, setParticipacionPorRegion] = useState({});
  const [kpis, setKpis] = useState({
    totalVotantes: 0,
    votosEmitidos: 0,
    participacion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar datos desde la API
  const cargarDatos = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Cargar KPIs
      const kpisData = await obtenerKPIsVotantes();
      setKpis(kpisData);

      // Cargar resultados por partido (Nacional)
      const resultadosNacional = await obtenerResultadosPorPartido();
      setResultadosPartidos(resultadosNacional);

      // Cargar participación por región
      const participacionRegion = await obtenerParticipacionPorRegion();
      setParticipacionPorRegion(participacionRegion);

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error al cargar datos de resultados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();

    // Actualizar cada 15 segundos (más frecuente para que se note más dinámico)
    const interval = setInterval(() => {
      cargarDatos(true); // Pasar true para mostrar el indicador de refreshing
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Obtener regiones disponibles (Nacional + regiones con datos)
  const regiones = useMemo(() => {
    const regionesList = ['Nacional'];
    const regionesConDatos = Object.keys(participacionPorRegion).filter(r => r && r !== 'Nacional');
    return [...regionesList, ...regionesConDatos];
  }, [participacionPorRegion]);

  // Transformar resultados por partido para mostrar
  const resultadosNacional = useMemo(() => {
    return resultadosPartidos.map(p => ({
      nombre: p.partido,
      votos: p.votos || 0,
      color: p.color,
      porcentaje: p.porcentaje || 0,
    })).sort((a, b) => b.votos - a.votos);
  }, [resultadosPartidos]);

  // Obtener resultados según la región seleccionada
  const currentResults = useMemo(() => {
    if (selectedRegion === 'Nacional') {
      return resultadosNacional;
    }
    
    // Para regiones específicas, mostrar datos de participación
    const regionData = participacionPorRegion[selectedRegion];
    if (regionData) {
      // Si hay datos de la región, mostrar resultados nacionales filtrados o datos de la región
      // Por ahora, mostramos resultados nacionales ya que el backend no tiene resultados por partido por región
      return resultadosNacional;
    }
    
    return [];
  }, [selectedRegion, resultadosNacional, participacionPorRegion]);

  const totalVotes = useMemo(() => {
    if (selectedRegion === 'Nacional') {
      return currentResults.reduce((sum, p) => sum + (p.votos || 0), 0);
    }
    const regionData = participacionPorRegion[selectedRegion];
    return regionData ? (regionData.votos || 0) : 0;
  }, [currentResults, selectedRegion, participacionPorRegion]);

  const maxVotes = useMemo(() => {
    if (currentResults.length === 0) return 1;
    return Math.max(...currentResults.map(p => p.votos || 0), 1);
  }, [currentResults]);

  // Calcular participación real
  const participacionReal = useMemo(() => {
    if (selectedRegion === 'Nacional') {
      return kpis.participacion || 0;
    }
    const regionData = participacionPorRegion[selectedRegion];
    return regionData ? (regionData.porcentaje || 0) : 0;
  }, [selectedRegion, kpis, participacionPorRegion]);

  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resultados en Tiempo Real</h1>
            <p className="text-sm text-gray-600">Monitoreo del conteo de votos.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
          </div>
          <button
            onClick={() => cargarDatos(true)}
            disabled={refreshing || loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              refreshing || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Filtros de Región */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {regiones.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg"><Activity className="w-6 h-6 text-blue-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900">Votos Emitidos</h3>
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-9 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900"><AnimatedCounter value={totalVotes} /></p>
          )}
          <p className="text-sm text-gray-600 mt-1">En {selectedRegion}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg"><Users className="w-6 h-6 text-green-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900">Participación</h3>
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-9 bg-gray-200 rounded w-24"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{participacionReal.toFixed(2)}%</p>
          )}
          <p className="text-sm text-gray-600 mt-1">Del padrón electoral</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg"><FileText className="w-6 h-6 text-purple-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900">Total Votantes</h3>
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-9 bg-gray-200 rounded w-32"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter value={kpis.totalVotantes || 0} />
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">Registrados en el sistema</p>
        </div>
      </div>

      {/* Gráfico de Barras y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución de Votos</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : currentResults.length > 0 ? (
              <AnimatePresence mode="wait">
                {currentResults.map((partido, index) => (
                <motion.div
                  key={`${selectedRegion}-${partido.nombre}`} // Key única para re-animar al cambiar de región
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-28 text-sm font-medium text-gray-700 truncate">{partido.nombre}</div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{ backgroundColor: partido.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(partido.votos / maxVotes) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                      >
                        <span className="text-white text-xs font-semibold drop-shadow">
                          {((partido.votos / totalVotes) * 100).toFixed(2)}%
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos disponibles para {selectedRegion}
              </div>
            )}
          </div>
        </div>

        {/* Tabla de Resultados Detallados */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resultados Detallados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Partido</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Votos</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Porcentaje</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-3 py-8 text-center">
                      <div className="animate-pulse text-gray-500">Cargando datos...</div>
                    </td>
                  </tr>
                ) : currentResults.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {currentResults.map((partido, index) => (
                      <motion.tr
                        key={partido.nombre}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={refreshing ? 'opacity-75' : ''}
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{partido.nombre}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          <AnimatedCounter value={partido.votos || 0} duration={1.5} />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                          {totalVotes > 0 ? (((partido.votos || 0) / totalVotes) * 100).toFixed(3) : 0}%
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan="3" className="px-3 py-8 text-center text-gray-500">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}