import React, { useState, useEffect, useMemo, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, FileText, Clock, Activity } from 'lucide-react';

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

// --- Datos de Ejemplo por Región - Elecciones 2026 ---
const resultadosPorRegion = {
  Nacional: [
    { nombre: "Fuerza Popular", votos: 2350123, color: "#DC2626" },
    { nombre: "Renovación Popular", votos: 1924102, color: "#2563EB" },
    { nombre: "Acción Popular", votos: 1625987, color: "#EA580C" },
    { nombre: "Alianza para el Progreso", votos: 1435115, color: "#16A34A" },
    { nombre: "Juntos por el Perú", votos: 1238220, color: "#9333EA" },
    { nombre: "Partido Morado", votos: 1068765, color: "#7C3AED" },
    { nombre: "Unidad Nacional", votos: 915123, color: "#F59E0B" },
    { nombre: "Somos Perú", votos: 775876, color: "#64748B" },
    { nombre: "Otros", votos: 2017689, color: "#6B7280" },
  ],
  Lima: [
    { nombre: "Fuerza Popular", votos: 980123, color: "#DC2626" },
    { nombre: "Renovación Popular", votos: 824102, color: "#2563EB" },
    { nombre: "Acción Popular", votos: 645987, color: "#EA580C" },
    { nombre: "Alianza para el Progreso", votos: 535115, color: "#16A34A" },
    { nombre: "Partido Morado", votos: 445876, color: "#7C3AED" },
    { nombre: "Otros", votos: 914673, color: "#6B7280" },
  ],
  Cusco: [
    { nombre: "Juntos por el Perú", votos: 245987, color: "#9333EA" },
    { nombre: "Unidad Nacional", votos: 198765, color: "#F59E0B" },
    { nombre: "Fuerza Popular", votos: 180123, color: "#DC2626" },
    { nombre: "Acción Popular", votos: 154102, color: "#EA580C" },
    { nombre: "Renovación Popular", votos: 124876, color: "#2563EB" },
    { nombre: "Otros", votos: 251023, color: "#6B7280" },
  ],
};

const regiones = Object.keys(resultadosPorRegion);

export default function Resultados() {
  const [selectedRegion, setSelectedRegion] = useState('Nacional');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Memoizar los resultados actuales y los totales para evitar recálculos
  const currentResults = useMemo(() => resultadosPorRegion[selectedRegion] || [], [selectedRegion]);
  const totalVotes = useMemo(() => currentResults.reduce((sum, p) => sum + p.votos, 0), [currentResults]);
  const maxVotes = useMemo(() => Math.max(...currentResults.map(p => p.votos)), [currentResults]);

  // Simular actualización cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
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
          <p className="text-3xl font-bold text-gray-900"><AnimatedCounter value={totalVotes} /></p>
          <p className="text-sm text-gray-600 mt-1">En {selectedRegion}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg"><Users className="w-6 h-6 text-green-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900">Participación</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">73.84%</p>
          <p className="text-sm text-gray-600 mt-1">Del padrón electoral</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg"><FileText className="w-6 h-6 text-purple-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900">Actas Procesadas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">52.14%</p>
          <p className="text-sm text-gray-600 mt-1">44,324 de 85,000</p>
        </div>
      </div>

      {/* Gráfico de Barras y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución de Votos</h2>
          <div className="space-y-4">
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
                {currentResults.map((partido) => (
                  <tr key={partido.nombre}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{partido.nombre}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right"><AnimatedCounter value={partido.votos} duration={1.5} /></td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {((partido.votos / totalVotes) * 100).toFixed(3)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}