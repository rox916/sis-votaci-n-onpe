// src/pages/panelAdmin/Analisis/Analisis.jsx

import { useState } from "react";
import { Upload, Sparkles, Cpu, CheckCircle, BarChart3, TrendingUp, FileText, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import MetricsCard from "./components/MetricsCard";
import PredictionChart from "./components/PredictionChart";
import ProgressCard from "./components/ProgressCard";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Analisis() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedCleaning, setSelectedCleaning] = useState([]);
  const [cleaningResults, setCleaningResults] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  // Datos simulados para análisis (se actualizarán con datos reales)
  const [analisisData, setAnalisisData] = useState({
    totalRegistros: 0,
    registrosLimpios: 0,
    registrosEliminados: 0,
    precision: 0,
    completitud: 0,
  });

  // Datos para gráficos
  const distribucionPorRegion = [
    { region: "Lima", votos: 3200000, porcentaje: 25.1 },
    { region: "Cusco", votos: 890000, porcentaje: 7.0 },
    { region: "Arequipa", votos: 750000, porcentaje: 5.9 },
    { region: "Piura", votos: 680000, porcentaje: 5.3 },
    { region: "Junín", votos: 520000, porcentaje: 4.1 },
    { region: "Loreto", votos: 410000, porcentaje: 3.2 },
  ];

  const tendenciaTemporal = [
    { hora: "08:00", participacion: 12 },
    { hora: "10:00", participacion: 28 },
    { hora: "12:00", participacion: 45 },
    { hora: "14:00", participacion: 58 },
    { hora: "16:00", participacion: 68 },
    { hora: "18:00", participacion: 73 },
  ];

  const prediccionesPartidos = [
    { partido: "FP", nombre: "Fuerza Popular", prediccion: 18.5, confianza: 92 },
    { partido: "RP", nombre: "Renovación Popular", prediccion: 15.2, confianza: 89 },
    { partido: "AP", nombre: "Acción Popular", prediccion: 12.8, confianza: 87 },
    { partido: "APP", nombre: "Alianza para el Progreso", prediccion: 11.3, confianza: 85 },
    { partido: "JPP", nombre: "Juntos por el Perú", prediccion: 9.7, confianza: 83 },
    { partido: "PM", nombre: "Partido Morado", prediccion: 8.4, confianza: 81 },
    { partido: "UN", nombre: "Unidad Nacional", prediccion: 7.2, confianza: 79 },
  ];

  const COLORS = ["#DC2626", "#2563EB", "#EA580C", "#16A34A", "#9333EA", "#64748B"];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Simular lectura del archivo y obtener información
      const simulatedData = {
        totalRows: 12763599,
        columns: ["DNI", "Nombres", "Apellidos", "Región", "Provincia", "Distrito", "Centro de Votación", "Mesa"],
        sampleRows: [
          { DNI: "12345678", Nombres: "Juan", Apellidos: "Pérez", Región: "Lima", Provincia: "Lima", Distrito: "San Isidro", "Centro de Votación": "Colegio San Patricio", Mesa: "001A" },
          { DNI: "87654321", Nombres: "María", Apellidos: "García", Región: "Cusco", Provincia: "Cusco", Distrito: "Cusco", "Centro de Votación": "Escuela Primaria", Mesa: "002B" },
          { DNI: "11223344", Nombres: "Carlos", Apellidos: "López", Región: "Arequipa", Provincia: "Arequipa", Distrito: "Yanahuara", "Centro de Votación": "Instituto Tecnológico", Mesa: "003C" },
        ],
        fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
      };
      setFileData(simulatedData);
      setAnalisisData(prev => ({
        ...prev,
        totalRegistros: simulatedData.totalRows,
      }));
    }
  };

  const handleCleaningToggle = (item) => {
    setSelectedCleaning((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleApplyCleaning = () => {
    if (selectedCleaning.length === 0) {
      alert("Por favor selecciona al menos una operación de limpieza");
      return;
    }
    
    // Simular proceso de limpieza
    const totalRows = fileData?.totalRows || analisisData.totalRegistros;
    const registrosEliminados = Math.floor(totalRows * 0.024); // ~2.4% eliminados
    const registrosLimpios = totalRows - registrosEliminados;
    const precision = 94.2;
    const completitud = ((registrosLimpios / totalRows) * 100).toFixed(1);

    setCleaningResults({
      registrosEliminados,
      registrosLimpios,
      precision,
      completitud: parseFloat(completitud),
      operacionesAplicadas: selectedCleaning,
    });

    setAnalisisData({
      totalRegistros: totalRows,
      registrosLimpios,
      registrosEliminados,
      precision,
      completitud: parseFloat(completitud),
    });
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simular progreso del entrenamiento
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fileData) {
        alert("Por favor carga un archivo primero");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!cleaningResults) {
        alert("Por favor aplica la limpieza de datos primero");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (trainingProgress < 100) {
        alert("Por favor espera a que termine el entrenamiento");
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
    setFileName("");
    setFileData(null);
    setSelectedCleaning([]);
    setCleaningResults(null);
    setTrainingProgress(0);
    setIsTraining(false);
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
              </div>
            </motion.div>
          </div>

          {/* Predicciones */}
          <PredictionChart data={prediccionesPartidos} />

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
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">
                Paso 1: Carga de Dataset
              </h3>
              <p className="text-gray-600 mb-4">
                Selecciona el archivo con los datos electorales que deseas analizar. Formatos soportados: CSV, XLSX.
              </p>
              
              {!fileData ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center mb-6">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    Arrastra tu archivo aquí o selecciona manualmente.
                  </p>
                  <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-all">
                    Seleccionar archivo
                    <input
                      type="file"
                      accept=".csv, .xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Archivo cargado exitosamente</span>
                    </div>
                    <p className="text-sm text-green-700">
                      <strong>{fileName}</strong> ({fileData.fileSize})
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Resumen del archivo</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total de registros</p>
                        <p className="text-lg font-bold text-gray-900">{fileData.totalRows.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Columnas</p>
                        <p className="text-lg font-bold text-gray-900">{fileData.columns.length}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Columnas detectadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {fileData.columns.map((col, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Vista previa (primeras 3 filas):</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {fileData.columns.map((col, idx) => (
                                <th key={idx} className="px-2 py-2 text-left border border-gray-200 font-semibold text-gray-700">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {fileData.sampleRows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b border-gray-200">
                                {fileData.columns.map((col, colIdx) => (
                                  <td key={colIdx} className="px-2 py-2 border border-gray-200 text-gray-600">
                                    {row[col] || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 2: Limpieza */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">
                Paso 2: Limpieza de Datos
              </h3>
              <p className="text-gray-600 mb-4">
                Selecciona las operaciones de limpieza que deseas aplicar a los datos cargados. Esto mejorará la calidad de los datos para el análisis.
              </p>

              {fileData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Datos a procesar:</strong> {fileData.totalRows.toLocaleString()} registros
                  </p>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Operaciones de limpieza disponibles:</h4>
                <ul className="space-y-3">
                  {[
                    { name: "Eliminar filas vacías", desc: "Elimina registros que no tienen información en campos críticos" },
                    { name: "Corregir nombres geográficos", desc: "Normaliza y corrige nombres de regiones, provincias y distritos" },
                    { name: "Eliminar duplicados", desc: "Identifica y elimina registros duplicados basados en DNI" },
                    { name: "Normalizar variables numéricas", desc: "Estandariza formatos numéricos y corrige valores inconsistentes" },
                  ].map((op, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCleaning.includes(op.name)}
                        onChange={() => handleCleaningToggle(op.name)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1">
                        <span className={selectedCleaning.includes(op.name) ? "font-medium text-blue-600" : "text-gray-700"}>
                          {op.name}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{op.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCleaning.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={handleApplyCleaning}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all font-medium"
                  >
                    Aplicar Limpieza
                  </button>
                </div>
              )}

              {cleaningResults && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 text-green-800 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Limpieza completada exitosamente</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-green-700 mb-1">Registros procesados</p>
                      <p className="text-lg font-bold text-green-900">{cleaningResults.registrosLimpios.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Registros eliminados</p>
                      <p className="text-lg font-bold text-green-900">{cleaningResults.registrosEliminados.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Precisión</p>
                      <p className="text-lg font-bold text-green-900">{cleaningResults.precision}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Completitud</p>
                      <p className="text-lg font-bold text-green-900">{cleaningResults.completitud}%</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700 mb-1">Operaciones aplicadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {cleaningResults.operacionesAplicadas.map((op, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Entrenamiento */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">
                Paso 3: Entrenamiento del Modelo
              </h3>
              <p className="text-gray-600 mb-4">
                Entrena el modelo de predicción con los datos limpios. Este proceso puede tomar varios minutos.
              </p>

              {cleaningResults && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Datos para entrenamiento:</strong> {cleaningResults.registrosLimpios.toLocaleString()} registros limpios
                  </p>
                </div>
              )}

              {!isTraining && trainingProgress === 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-6">
                  <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Presiona el botón para iniciar el entrenamiento del modelo de predicción.
                  </p>
                  <button
                    onClick={handleStartTraining}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all font-medium"
                  >
                    Iniciar Entrenamiento
                  </button>
                </div>
              )}

              {isTraining && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <Cpu className="w-5 h-5 animate-pulse" />
                    <span className="font-semibold">Entrenamiento en progreso...</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Por favor espera mientras el modelo se entrena. No cierres esta ventana.
                  </p>
                </div>
              )}

              {trainingProgress > 0 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso del entrenamiento</span>
                      <span className="text-sm font-bold text-blue-600">{trainingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="bg-blue-600 h-4"
                        initial={{ width: 0 }}
                        animate={{ width: `${trainingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {trainingProgress < 30 && "Preparando datos..."}
                      {trainingProgress >= 30 && trainingProgress < 60 && "Entrenando modelo..."}
                      {trainingProgress >= 60 && trainingProgress < 90 && "Validando modelo..."}
                      {trainingProgress >= 90 && trainingProgress < 100 && "Finalizando..."}
                      {trainingProgress === 100 && "Entrenamiento completado"}
                    </p>
                  </div>

                  {trainingProgress === 100 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Entrenamiento completado exitosamente</span>
                      </div>
                      <p className="text-sm text-green-700 mb-4">
                        El modelo ha sido entrenado con los datos procesados y está listo para generar predicciones.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricsCard title="Accuracy" value="92%" />
                        <MetricsCard title="F1 Score" value="0.88" />
                        <MetricsCard title="Precision" value="89%" />
                        <MetricsCard title="Recall" value="91%" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
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
              disabled={trainingProgress < 100}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${
                trainingProgress < 100
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
