// src/pages/panelAdmin/Analisis/Analisis.jsx

import { useState, useEffect } from "react";
import { Upload, Sparkles, Cpu, CheckCircle, BarChart3, TrendingUp, FileText, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import PredictionChart from "./components/PredictionChart";
import ProgressCard from "./components/ProgressCard";
// Importar componentes de pasos
import CargarDataset from "./components/CargarDataset";
import LimpiarDataset from "./components/LimpiarDataset";
import EntrenarModelo from "./components/EntrenarModelo";
// Importar servicios
import { obtenerPredicciones } from "../../../services/mlService";
import { obtenerDistribucionPorRegion, obtenerTendenciaParticipacion } from "../../../services/analisisService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Analisis() {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [selectedLimpioId, setSelectedLimpioId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [cleaningResults, setCleaningResults] = useState(null);
  const [trainingMetrics, setTrainingMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Datos de análisis (cargados desde la API)
  const [analisisData, setAnalisisData] = useState({
    totalRegistros: 0,
    registrosLimpios: 0,
    registrosEliminados: 0,
    precision: 0,
    completitud: 0,
  });

  // Estados para datos de gráficos (cargados desde la API)
  const [distribucionPorRegion, setDistribucionPorRegion] = useState([]);
  const [tendenciaTemporal, setTendenciaTemporal] = useState([]);
  const [prediccionesPartidos, setPrediccionesPartidos] = useState([]);

  // Cargar datos de gráficos cuando se muestren los resultados o cambie el dataset limpio
  useEffect(() => {
    if (showResults && selectedLimpioId) {
      cargarDatosGraficos();
    }
  }, [showResults, selectedLimpioId]);

  const cargarDatosGraficos = async () => {
    try {
      setLoading(true);
      setError(""); // Limpiar errores previos
      
      console.log("Cargando datos de gráficos desde la API...");
      
      // Solo cargar datos si hay un dataset limpio seleccionado
      if (!selectedLimpioId) {
        console.warn("No hay dataset limpio seleccionado, no se pueden cargar los gráficos");
        setDistribucionPorRegion([]);
        setTendenciaTemporal([]);
        setPrediccionesPartidos([]);
        setLoading(false);
        return;
      }

      const [distribucion, tendencia, predicciones] = await Promise.all([
        obtenerDistribucionPorRegion(selectedLimpioId),
        obtenerTendenciaParticipacion(selectedLimpioId),
        obtenerPredicciones(selectedLimpioId),
      ]);

      console.log("Datos recibidos:", { distribucion, tendencia, predicciones });

      // Transformar datos de distribución para el gráfico (API devuelve {label, value})
      if (distribucion && Array.isArray(distribucion) && distribucion.length > 0) {
        const distribucionTransformada = distribucion
          .filter((item) => item && (item.label || item.region) && (item.value || item.votos)) // Solo incluir items con datos válidos
          .map((item) => ({
            region: item.label || item.region || "",
            votos: item.value || item.votos || 0,
            porcentaje: item.porcentaje || 0,
          }));
        setDistribucionPorRegion(distribucionTransformada);
      } else {
        console.warn("No se recibieron datos de distribución desde la API");
        setDistribucionPorRegion([]);
      }

      // Transformar datos de tendencia (API devuelve {label, value})
      if (tendencia && Array.isArray(tendencia) && tendencia.length > 0) {
        const tendenciaTransformada = tendencia
          .filter((item) => item && (item.label || item.hora || item.tiempo) && (item.value || item.participacion !== undefined)) // Solo incluir items con datos válidos
          .map((item) => ({
            hora: item.label || item.hora || item.tiempo || "",
            participacion: item.value || item.participacion || 0,
          }));
        setTendenciaTemporal(tendenciaTransformada);
      } else {
        console.warn("No se recibieron datos de tendencia desde la API");
        setTendenciaTemporal([]);
      }

      // Transformar predicciones del modelo entrenado
      // El backend devuelve PartidoPredictionDTO: { partido: string, prediccion: number, confianza: number, estado: string }
      if (predicciones && Array.isArray(predicciones) && predicciones.length > 0) {
        const prediccionesTransformadas = predicciones
          .filter((item) => {
            // Solo incluir items que tengan partido Y predicción válidos
            return item && item.partido && (item.prediccion !== undefined && item.prediccion !== null);
          })
          .map((item) => {
            // El backend ya devuelve prediccion como porcentaje (Double)
            // y confianza como Integer (0-100)
            return {
              partido: item.partido || "",
              nombre: item.partido || "", // Usar partido como nombre también
              prediccion: Number((item.prediccion || 0).toFixed(2)),
              confianza: item.confianza !== undefined && item.confianza !== null ? item.confianza : 0,
              estado: item.estado || "", // Estado viene del backend (Alta, Media, Baja)
            };
          })
          .filter((item) => item.partido && item.prediccion > 0) // Solo items válidos
          .sort((a, b) => b.prediccion - a.prediccion); // Ordenar por predicción descendente (ya viene ordenado del backend, pero por si acaso)
        
        console.log("Predicciones transformadas:", prediccionesTransformadas);
        setPrediccionesPartidos(prediccionesTransformadas);
      } else {
        console.warn("No se recibieron predicciones desde la API. Asegúrate de haber entrenado el modelo primero.");
        setPrediccionesPartidos([]);
      }
    } catch (err) {
      console.error("Error al cargar datos de gráficos:", err);
      const errorMessage = err.message || "Error al cargar datos de análisis";
      setError(`⚠️ ${errorMessage}. Por favor, verifica que el modelo haya sido entrenado y que el dataset limpio esté disponible.`);
      
      // No usar datos simulados, dejar arrays vacíos
      setDistribucionPorRegion([]);
      setTendenciaTemporal([]);
      setPrediccionesPartidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers para los componentes hijos
  const handleFileUploaded = (datasetId, fileInfo) => {
    setSelectedDatasetId(datasetId);
    setFileData(fileInfo);
  };

  const handleCleaningComplete = (resultados) => {
    setCleaningResults(resultados);
    setSelectedLimpioId(resultados.idLimpio);
    setAnalisisData({
      totalRegistros: resultados.registrosLimpios + resultados.registrosEliminados,
      registrosLimpios: resultados.registrosLimpios,
      registrosEliminados: resultados.registrosEliminados,
      precision: resultados.precision,
      completitud: resultados.completitud,
    });
  };

  const handleTrainingComplete = async (metrics) => {
    setTrainingMetrics(metrics);
    // Recargar predicciones inmediatamente después del entrenamiento
    if (selectedLimpioId && showResults) {
      try {
        const predicciones = await obtenerPredicciones(selectedLimpioId);
        if (predicciones && Array.isArray(predicciones) && predicciones.length > 0) {
          // El backend devuelve PartidoPredictionDTO: { partido, prediccion, confianza, estado }
          const prediccionesTransformadas = predicciones
            .filter((item) => item && item.partido && item.prediccion !== undefined && item.prediccion !== null)
            .map((item) => ({
              partido: item.partido || "",
              nombre: item.partido || "",
              prediccion: Number((item.prediccion || 0).toFixed(2)),
              confianza: item.confianza !== undefined && item.confianza !== null ? item.confianza : 0,
              estado: item.estado || "",
            }))
            .filter((item) => item.partido && item.prediccion > 0)
            .sort((a, b) => b.prediccion - a.prediccion);
          
          setPrediccionesPartidos(prediccionesTransformadas);
        }
      } catch (error) {
        console.error("Error al cargar predicciones después del entrenamiento:", error);
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fileData) {
        setError("Por favor carga un archivo primero");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!cleaningResults) {
        setError("Por favor aplica la limpieza de datos primero");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!trainingMetrics) {
        setError("Por favor espera a que termine el entrenamiento");
        return;
      }
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setStep(1);
    setFileData(null);
    setSelectedDatasetId(null);
    setSelectedLimpioId(null);
    setCleaningResults(null);
    setTrainingMetrics(null);
    setDistribucionPorRegion([]);
    setTendenciaTemporal([]);
    setPrediccionesPartidos([]);
    setError("");
    setAnalisisData({
      totalRegistros: 0,
      registrosLimpios: 0,
      registrosEliminados: 0,
      precision: 0,
      completitud: 0,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Mensaje de error o advertencia */}
      {error && (
        <div className={`border rounded-lg p-4 mb-4 ${
          error.includes("⚠️") 
            ? "bg-yellow-50 border-yellow-200" 
            : "bg-red-50 border-red-200"
        }`}>
          <p className={`text-sm ${
            error.includes("⚠️") 
              ? "text-yellow-800" 
              : "text-red-800"
          }`}>{error}</p>
        </div>
      )}

      {/* 🧭 Encabezado principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Análisis de Datos Electorales
            </h1>
            <p className="text-sm text-gray-600">
              Procesa y analiza datos electorales: carga de archivos, limpieza de datos y entrenamiento de modelos predictivos.
            </p>
          </div>
        </div>
        {showResults && (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
              <Download className="w-4 h-4" />
              Exportar Reporte
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        )}
      </div>

      {/* 📊 Vista de Resultados */}
      {showResults && analisisData.totalRegistros > 0 ? (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProgressCard
              title="Registros Procesados"
              value={analisisData.registrosLimpios.toLocaleString()}
              total={analisisData.totalRegistros.toLocaleString()}
              percentage={analisisData.completitud}
              color="blue"
            />
            <ProgressCard
              title="Precisión de Datos"
              value={`${analisisData.precision}%`}
              total="100%"
              percentage={analisisData.precision}
              color="green"
            />
            <ProgressCard
              title="Registros Eliminados"
              value={analisisData.registrosEliminados.toLocaleString()}
              total={analisisData.totalRegistros.toLocaleString()}
              percentage={(analisisData.registrosEliminados / analisisData.totalRegistros) * 100}
              color="orange"
            />
            <ProgressCard
              title="Completitud"
              value={`${analisisData.completitud}%`}
              total="100%"
              percentage={analisisData.completitud}
              color="purple"
            />
          </div>

          {/* Gráficos de análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de distribución por región */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Distribución por Región</h2>
                  <p className="text-sm text-gray-500 mt-1">Votos por región electoral</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="w-full h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando datos...</p>
                    </div>
                  </div>
                ) : distribucionPorRegion.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={distribucionPorRegion} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" tick={{ fill: "#4B5563", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} />
                      <Tooltip
                        formatter={(v) => `${v.toLocaleString()} votos`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="votos" fill="#2563EB" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </motion.div>

            {/* Gráfico de tendencia temporal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tendencia de Participación</h2>
                  <p className="text-sm text-gray-500 mt-1">Evolución durante el día</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="w-full h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando datos...</p>
                    </div>
                  </div>
                ) : tendenciaTemporal.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={tendenciaTemporal} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" tick={{ fill: "#4B5563", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} />
                      <Tooltip
                        formatter={(v) => `${v}%`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="participacion" stroke="#16A34A" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Predicciones */}
          {prediccionesPartidos.length > 0 ? (
            <PredictionChart data={prediccionesPartidos} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-indigo-50 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay predicciones disponibles</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  {selectedLimpioId 
                    ? "Las predicciones aparecerán aquí una vez que hayas entrenado el modelo de machine learning. Asegúrate de completar el paso de entrenamiento."
                    : "Para ver las predicciones, primero debes cargar un dataset, limpiarlo y entrenar el modelo."}
                </p>
              </div>
            </motion.div>
          )}

          {/* Tabla de resumen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Resumen de Análisis</h2>
                <p className="text-sm text-gray-500 mt-1">Estadísticas generales del proceso</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Métrica
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Total de Registros</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{analisisData.totalRegistros.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Completo
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Registros Limpios</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{analisisData.registrosLimpios.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Procesado
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Precisión</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{analisisData.precision}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Excelente
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Completitud</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{analisisData.completitud}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Alto
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all font-medium"
            >
              Nuevo Análisis
            </button>
          </div>
        </div>
      ) : (
        <div>
      {/* 💠 Card principal */}
      <div className="p-6 bg-white shadow rounded-xl border border-gray-200">
        {/* 🪜 Progreso de pasos */}
        <div className="flex justify-between items-center mb-10">
          {[
            { id: 1, icon: Upload, label: "Cargar Dataset" },
            { id: 2, icon: Sparkles, label: "Limpieza" },
            { id: 3, icon: Cpu, label: "Entrenamiento" },
            // eslint-disable-next-line no-unused-vars
          ].map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              className={`flex flex-col items-center transition-all ${
                step >= id ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 bg-white"
                }`}
              >
                {step > id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <p className="text-sm mt-2 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* 🧩 Contenido dinámico */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Paso 1: Carga */}
          {step === 1 && (
            <CargarDataset
              onFileUploaded={handleFileUploaded}
              onError={setError}
            />
          )}

          {/* Paso 2: Limpieza */}
          {step === 2 && (
            <LimpiarDataset
              selectedDatasetId={selectedDatasetId}
              fileData={fileData}
              onCleaningComplete={handleCleaningComplete}
              onError={setError}
            />
          )}

          {/* Paso 3: Entrenamiento */}
          {step === 3 && (
            <EntrenarModelo
              selectedLimpioId={selectedLimpioId}
              cleaningResults={cleaningResults}
              onTrainingComplete={handleTrainingComplete}
              onError={setError}
            />
          )}
        </motion.div>

        {/* 🔘 Controles inferiores */}
        <div className="flex justify-between mt-8 border-t pt-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg transition-all ${
              step === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            ← Atrás
          </button>

          {step === 1 && (
            <button
              onClick={handleNext}
              disabled={!fileData}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${
                !fileData
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Continuar a Limpieza →
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleNext}
              disabled={!cleaningResults}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${
                !cleaningResults
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Continuar a Entrenamiento →
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleNext}
              disabled={!trainingMetrics}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${
                !trainingMetrics
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Ver Resultados →
            </button>
          )}
        </div>
      </div>
        </div>
      )}
    </motion.div>
  );
}
