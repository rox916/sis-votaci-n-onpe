import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  FileSpreadsheet,
  Clock,
  CheckCircle,
  AlertCircle,
  FileChartLine,
  Search,
  Filter,
} from "lucide-react";
import ReporteGenerar from "./ReporteGenerar";

const initialReports = [
  {
    id: 1,
    nombre: "Reporte Oficial de Resultados - Presidenciales",
    descripcion: "Acta con los resultados finales a nivel nacional.",
    tipo: "Resultados",
    ambito: "Nacional",
    estado: "Disponible",
    fechaGeneracion: "2026-05-12 18:30:00",
  },
  {
    id: 2,
    nombre: "Reporte de Participación Ciudadana",
    descripcion: "Estadísticas de participación por departamento.",
    tipo: "Participación",
    ambito: "Nacional",
    estado: "Disponible",
    fechaGeneracion: "2026-05-12 18:45:00",
  },
  {
    id: 3,
    nombre: "Bitácora de Auditoría del Sistema",
    descripcion: "Registro completo de eventos críticos del proceso.",
    tipo: "Auditoría",
    ambito: "Sistema",
    estado: "Generando...",
    fechaGeneracion: null,
  },
  {
    id: 4,
    nombre: "Reporte de Resultados - Departamento Lima",
    descripcion: "Acta con los resultados oficiales para el departamento de Lima.",
    tipo: "Resultados",
    ambito: "Departamento: Lima",
    estado: "Disponible",
    fechaGeneracion: "2026-05-12 19:00:00",
  },
];

export default function Reportes() {
  const [reports, setReports] = useState(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const handleGenerate = (newReport) => {
    setReports([newReport, ...reports]);
    alert("Reporte en proceso de generación...");

    setTimeout(() => {
      setReports((current) =>
        current.map((r) =>
          r.id === newReport.id
            ? {
                ...r,
                estado: "Disponible",
                fechaGeneracion: new Date().toLocaleString("es-PE"),
              }
            : r
        )
      );
      alert(`El reporte "${newReport.nombre}" está disponible para descarga.`);
    }, 3000);
  };

  const handleDownload = (report, format) => {
    alert(`Descargando "${report.nombre}" en formato ${format.toUpperCase()}...`);
  };

  // Filtros y búsqueda
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "Todos" || r.tipo === filterTipo;
    const matchesEstado = filterEstado === "Todos" || r.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "Disponible":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Generando...":
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* 🧭 Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileChartLine className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Generación de Reportes Oficiales
            </h1>
            <p className="text-sm text-gray-600">
              Crea y descarga los documentos finales del proceso electoral.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all font-medium"
        >
          <Plus className="w-5 h-5" /> Generar Nuevo Reporte
        </button>
      </div>

      {/* 🔍 Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los Tipos</option>
            <option value="Resultados">Resultados</option>
            <option value="Participación">Participación</option>
            <option value="Auditoría">Auditoría</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Generando...">Generando...</option>
          </select>

          <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg px-3">
            <Filter className="w-4 h-4 mr-2" />
            {filteredReports.length} reportes encontrados
          </div>
        </div>
      </div>

      {/* 📄 Lista de Reportes */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No se encontraron reportes</p>
            <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          filteredReports.map((r) => (
          <motion.div
            key={r.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Ícono negro */}
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-900" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{r.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">{r.descripcion}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                    <span>
                      Tipo: <strong>{r.tipo}</strong>
                    </span>
                    <span>
                      Ámbito: <strong>{r.ambito}</strong>
                    </span>
                    {r.fechaGeneracion && (
                      <span>
                        Generado: <strong>{r.fechaGeneracion}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Estado y botones */}
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(r.estado)}
                  <span
                    className={`text-sm font-semibold ${
                      r.estado === "Disponible" ? "text-green-700" : "text-yellow-700"
                    }`}
                  >
                    {r.estado}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(r, "pdf")}
                    disabled={r.estado !== "Disponible"}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    <FileText className="w-4 h-4" /> PDF
                  </button>
                  <button
                    onClick={() => handleDownload(r, "excel")}
                    disabled={r.estado !== "Disponible"}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Excel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
        )}
      </div>

      {/* 🧩 Modal Generar */}
      <ReporteGenerar
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
      />
    </motion.div>
  );
}
