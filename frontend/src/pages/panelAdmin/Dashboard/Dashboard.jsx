import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  MapPin,
} from "lucide-react";
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
import * as d3 from "d3";

// ===== Datos simulados =====
const estadisticas = {
  mesasProcesadas: 52.14,
  votantesRegistrados: 12763599,
  participacion: 73.84,
  incidencias: 126,
};

// Resultados por partido (barras) - Elecciones 2026
const resultadosPartidos = [
  { partido: "FP", nombre: "Fuerza Popular", porcentaje: 18.5, color: "#DC2626" },
  { partido: "RP", nombre: "Renovación Popular", porcentaje: 15.2, color: "#2563EB" },
  { partido: "AP", nombre: "Acción Popular", porcentaje: 12.8, color: "#EA580C" },
  { partido: "APP", nombre: "Alianza para el Progreso", porcentaje: 11.3, color: "#16A34A" },
  { partido: "JPP", nombre: "Juntos por el Perú", porcentaje: 9.7, color: "#9333EA" },
  { partido: "PM", nombre: "Partido Morado", porcentaje: 8.4, color: "#7C3AED" },
  { partido: "UN", nombre: "Unidad Nacional", porcentaje: 7.2, color: "#F59E0B" },
  { partido: "SP", nombre: "Somos Perú", porcentaje: 6.1, color: "#64748B" },
];

// Participación regional (línea)
const participacionRegional = [
  { region: "Lima", participacion: 78 },
  { region: "Cusco", participacion: 69 },
  { region: "Arequipa", participacion: 73 },
  { region: "Piura", participacion: 71 },
  { region: "Junín", participacion: 68 },
  { region: "Loreto", participacion: 65 },
];

// Resultados por región - Los 24 departamentos de Perú
const resultadosPorRegion = {
  "Amazonas": { partido: "Acción Popular", porcentaje: 24.8, color: "#EA580C", votos: 87654, x: 40, y: 20 },
  "Ancash": { partido: "Renovación Popular", porcentaje: 29.5, color: "#2563EB", votos: 145678, x: 42, y: 45 },
  "Apurímac": { partido: "Juntos por el Perú", porcentaje: 27.3, color: "#9333EA", votos: 98765, x: 58, y: 70 },
  "Arequipa": { partido: "Renovación Popular", porcentaje: 32.1, color: "#2563EB", votos: 187654, x: 55, y: 85 },
  "Ayacucho": { partido: "Unidad Nacional", porcentaje: 26.2, color: "#F59E0B", votos: 112345, x: 56, y: 68 },
  "Cajamarca": { partido: "Alianza para el Progreso", porcentaje: 28.9, color: "#16A34A", votos: 112543, x: 38, y: 30 },
  "Cusco": { partido: "Juntos por el Perú", porcentaje: 28.5, color: "#9333EA", votos: 245987, x: 60, y: 75 },
  "Huancavelica": { partido: "Unidad Nacional", porcentaje: 25.6, color: "#F59E0B", votos: 98765, x: 54, y: 62 },
  "Huánuco": { partido: "Alianza para el Progreso", porcentaje: 27.8, color: "#16A34A", votos: 123456, x: 48, y: 50 },
  "Ica": { partido: "Fuerza Popular", porcentaje: 33.2, color: "#DC2626", votos: 156789, x: 48, y: 75 },
  "Junín": { partido: "Unidad Nacional", porcentaje: 26.8, color: "#F59E0B", votos: 128765, x: 52, y: 55 },
  "La Libertad": { partido: "Acción Popular", porcentaje: 27.3, color: "#EA580C", votos: 165432, x: 35, y: 40 },
  "Lambayeque": { partido: "Fuerza Popular", porcentaje: 31.5, color: "#DC2626", votos: 143256, x: 32, y: 30 },
  "Lima": { partido: "Fuerza Popular", porcentaje: 35.2, color: "#DC2626", votos: 980123, x: 50, y: 65 },
  "Loreto": { partido: "Acción Popular", porcentaje: 25.4, color: "#EA580C", votos: 98765, x: 45, y: 15 },
  "Madre de Dios": { partido: "Juntos por el Perú", porcentaje: 24.9, color: "#9333EA", votos: 54321, x: 62, y: 25 },
  "Moquegua": { partido: "Juntos por el Perú", porcentaje: 28.9, color: "#9333EA", votos: 112345, x: 56, y: 88 },
  "Pasco": { partido: "Unidad Nacional", porcentaje: 26.1, color: "#F59E0B", votos: 87654, x: 50, y: 52 },
  "Piura": { partido: "Alianza para el Progreso", porcentaje: 29.8, color: "#16A34A", votos: 198432, x: 30, y: 25 },
  "Puno": { partido: "Juntos por el Perú", porcentaje: 30.2, color: "#9333EA", votos: 134567, x: 65, y: 80 },
  "San Martín": { partido: "Alianza para el Progreso", porcentaje: 27.5, color: "#16A34A", votos: 112345, x: 42, y: 25 },
  "Tacna": { partido: "Renovación Popular", porcentaje: 31.8, color: "#2563EB", votos: 123456, x: 58, y: 90 },
  "Tumbes": { partido: "Alianza para el Progreso", porcentaje: 28.3, color: "#16A34A", votos: 76543, x: 28, y: 20 },
  "Ucayali": { partido: "Acción Popular", porcentaje: 26.5, color: "#EA580C", votos: 98765, x: 50, y: 20 },
};

// Animación framer
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [mapError, setMapError] = useState(null);
  const svgRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Cargar GeoJSON de Perú
  useEffect(() => {
    // URL pública de GeoJSON de Perú (departamentos)
    const geoJsonUrl = "https://raw.githubusercontent.com/juaneladio/peru-geojson/master/peru_departamental_simple.geojson";
    
    d3.json(geoJsonUrl)
      .then((data) => {
        if (data && data.features) {
          console.log("GeoJSON cargado exitosamente:", data.features.length, "departamentos");
          setGeoData(data);
        } else {
          throw new Error("GeoJSON inválido");
        }
      })
      .catch((error) => {
        console.error("Error cargando GeoJSON:", error);
        // Fallback: intentar otra URL
        const alternativeUrl = "https://raw.githubusercontent.com/techo-pe/peru-geojson/master/peru_departamentos.json";
        return d3.json(alternativeUrl);
      })
      .then((data) => {
        if (data && data.features) {
          console.log("GeoJSON alternativo cargado:", data.features.length, "departamentos");
          setGeoData(data);
        }
      })
      .catch((error) => {
        console.error("Error cargando GeoJSON alternativo:", error);
        setMapError("No se pudo cargar el mapa. Por favor, verifica tu conexión a internet.");
      });
  }, []);

  // Renderizar mapa con D3.js
  useEffect(() => {
    // Usar solo datos de departamentos
    const dataToRender = geoData;
    
    // Asegurarse de que siempre haya datos válidos
    if (!dataToRender || !dataToRender.features || dataToRender.features.length === 0 || !svgRef.current || !mapContainerRef.current) {
      console.warn("No hay datos válidos para renderizar el mapa");
      return;
    }

    // Esperar un momento para asegurar que el contenedor tenga dimensiones
    const renderMap = () => {
      const container = mapContainerRef.current;
      if (!container) {
        console.warn("Contenedor del mapa no encontrado");
        return;
      }

      let width = container.clientWidth || 800;
      const height = 900; // Aumentado de 700 a 900
      
      // Asegurar un ancho mínimo para que el mapa sea visible
      if (width < 400) {
        width = 400;
      }
      
      console.log("Renderizando mapa - Dimensiones:", width, "x", height);

      // Limpiar SVG anterior
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("background", "#f8fafc")
        .style("min-height", "600px");

      // Calcular los bounds del GeoJSON para ajustar la proyección
      const bounds = d3.geoBounds(dataToRender);
      
      console.log("Bounds:", bounds);
      
      // Proyección para Perú - usando fitSize para mejor ajuste
      const projection = d3.geoMercator();
      
      // Ajustar la proyección para que el mapa quepa perfectamente en el viewport
      projection.fitSize(
        [width - 40, height - 40], 
        dataToRender
      );
      
      const path = d3.geoPath().projection(projection);
      
      console.log("Proyección configurada - Scale:", projection.scale(), "Center:", projection.center(), "Translate:", projection.translate());

      // Mapeo de nombres de regiones (normalizar nombres) - Los 24 departamentos
      const normalizeRegionName = (name) => {
        if (!name) return "";
        const nameMap = {
          "AMAZONAS": "Amazonas",
          "ANCASH": "Ancash",
          "ANCÁSH": "Ancash",
          "APURIMAC": "Apurímac",
          "APURÍMAC": "Apurímac",
          "AREQUIPA": "Arequipa",
          "AYACUCHO": "Ayacucho",
          "CAJAMARCA": "Cajamarca",
          "CALLAO": "Callao",
          "CUSCO": "Cusco",
          "HUANCAVELICA": "Huancavelica",
          "HUANUCO": "Huánuco",
          "HUÁNUCO": "Huánuco",
          "ICA": "Ica",
          "JUNIN": "Junín",
          "JUNÍN": "Junín",
          "LA LIBERTAD": "La Libertad",
          "LAMBAYEQUE": "Lambayeque",
          "LIMA": "Lima",
          "LORETO": "Loreto",
          "MADRE DE DIOS": "Madre de Dios",
          "MOQUEGUA": "Moquegua",
          "PASCO": "Pasco",
          "PIURA": "Piura",
          "PUNO": "Puno",
          "SAN MARTIN": "San Martín",
          "SAN MARTÍN": "San Martín",
          "TACNA": "Tacna",
          "TUMBES": "Tumbes",
          "UCAYALI": "Ucayali",
        };
        const upperName = name.toUpperCase().trim();
        return nameMap[upperName] || name;
      };

      // Función helper para obtener el nombre de la región (solo departamentos)
      const getRegionName = (d) => {
        const props = d.properties || {};
        
        // Log para debuggear qué propiedades tiene el GeoJSON
        if (dataToRender.features.indexOf(d) === 0) {
          console.log("🔍 Propiedades del primer feature (DEPARTAMENTO):", props);
        }
        
        const name = props.NAME || 
          props.NOMBRE || 
          props.name || 
          props.DEPARTAMENTO ||
          props.departamento ||
          props.DEPARTAMENT ||
          props.DEPARTAMENTO_NOMBRE ||
          props.NOMBDEP ||
          "";
        
        const normalized = normalizeRegionName(name);
        return normalized || name || "Sin nombre";
      };

      // Renderizar regiones - Usar merge para actualizar paths existentes
      const paths = svg.selectAll("path.region")
        .data(dataToRender.features, (d) => d.properties?.NAME || d.properties?.NOMBRE || d.properties?.name || Math.random());

      // Eliminar paths que ya no existen
      paths.exit().remove();

      // Entrar y crear nuevos paths
      const pathsEnter = paths.enter()
        .append("path")
        .attr("class", "region")
        .attr("d", path)
        .style("cursor", "pointer")
        .on("click", function(event, d) {
          event.stopPropagation();
          const regionName = getRegionName(d);
          console.log("🖱️ Click detectado en:", regionName);
          
          // Si se hace click en un departamento ya seleccionado, deseleccionar
          if (selectedRegion === regionName) {
            console.log("   ↪️ Deseleccionando departamento");
            setSelectedRegion(null);
          } else {
            // Seleccionar el departamento
            console.log("   ↪️ Seleccionando departamento");
            setSelectedRegion(regionName);
          }
        })
        .on("mouseenter", function(event, d) {
          event.stopPropagation();
          const regionName = getRegionName(d);
          console.log("Hover en:", regionName);
          setHoveredRegion(regionName);
          d3.select(this).raise();
        })
        .on("mouseleave", function() {
          // Limpiar hoveredRegion cuando el mouse sale del path
          setHoveredRegion(null);
        });

      // Merge y actualizar todos los paths (nuevos y existentes)
      const pathsUpdate = pathsEnter.merge(paths)
        .attr("d", path)
        .attr("fill", (d) => {
          const regionName = getRegionName(d);
          const regionData = resultadosPorRegion[regionName];
          
          if (selectedRegion === regionName) {
            return regionData?.color || "#3b82f6";
          }
          if (hoveredRegion === regionName) {
            // Hacer el color más brillante al hacer hover
            return regionData?.color || "#60a5fa";
          }
          // Color por defecto más visible
          return regionData?.color || "#93c5fd";
        })
        .attr("stroke", (d) => {
          const regionName = getRegionName(d);
          if (selectedRegion === regionName) {
            return "#1e3a8a";
          }
          if (hoveredRegion === regionName) {
            return "#1e40af";
          }
          return "#ffffff";
        })
        .attr("stroke-width", (d) => {
          const regionName = getRegionName(d);
          if (selectedRegion === regionName) {
            return 3;
          }
          if (hoveredRegion === regionName) {
            return 2.5;
          }
          return 1.5;
        })
        .attr("opacity", (d) => {
          const regionName = getRegionName(d);
          if (selectedRegion === regionName) {
            return 1;
          }
          if (hoveredRegion === regionName) {
            return 0.95;
          }
          return 0.8;
        })
        .style("transition", "all 0.2s ease")
        .style("cursor", "pointer");
      
      console.log("Paths renderizados:", pathsUpdate.size(), "departamentos");

      // Agregar etiquetas de regiones - Usar merge para actualizar
      const labels = svg.selectAll("text.region-label")
        .data(dataToRender.features, (d) => d.properties?.NAME || d.properties?.NOMBRE || d.properties?.name || Math.random());

      // Eliminar etiquetas que ya no existen
      labels.exit().remove();

      const labelsEnter = labels.enter()
        .append("text")
        .attr("class", "region-label")
        .style("pointer-events", "none")
        .style("user-select", "none");

      const labelsUpdate = labelsEnter.merge(labels)
        .each(function(d) {
          const regionName = getRegionName(d);
          const centroid = path.centroid(d);
          
          // Log para los primeros 3 departamentos
          if (dataToRender.features.indexOf(d) < 3) {
            console.log(`Departamento ${dataToRender.features.indexOf(d)}:`, {
              nombre: regionName,
              centroid: centroid,
              propiedades: d.properties
            });
          }
          
          d3.select(this)
            .attr("transform", () => {
              // Solo mostrar etiqueta si el path es válido
              if (isNaN(centroid[0]) || isNaN(centroid[1]) || !isFinite(centroid[0]) || !isFinite(centroid[1])) {
                console.warn("Centroide inválido para:", regionName, centroid);
                return "translate(-1000, -1000)"; // Mover fuera de la vista
              }
              return `translate(${centroid[0]},${centroid[1]})`;
            })
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", () => {
              return selectedRegion === regionName || hoveredRegion === regionName ? "14px" : "13px";
            })
            .attr("font-weight", "bold")
            .attr("font-family", "system-ui, -apple-system, sans-serif")
            .attr("fill", () => {
              if (selectedRegion === regionName || hoveredRegion === regionName) {
                return "#ffffff";
              }
              return "#1f2937";
            })
            .style("text-shadow", () => {
              if (selectedRegion === regionName || hoveredRegion === regionName) {
                return "2px 2px 4px rgba(0,0,0,0.8), 0px 0px 2px rgba(0,0,0,0.5)";
              }
              return "1px 1px 2px rgba(255,255,255,0.9), 0px 0px 1px rgba(255,255,255,0.7)";
            })
            .style("opacity", 1)
            .style("visibility", "visible")
            .style("display", "block")
            .text(regionName || "Sin nombre");
        });
      
      console.log("Etiquetas renderizadas:", labelsUpdate.size());
      
      // Verificar que las etiquetas se hayan creado
      const allLabels = svg.selectAll("text.region-label");
      console.log("Total de etiquetas en el SVG:", allLabels.size());
      allLabels.each(function(d, i) {
        if (i < 3) {
          const text = d3.select(this);
          console.log(`Etiqueta ${i}:`, {
            texto: text.text(),
            transform: text.attr("transform"),
            fill: text.attr("fill"),
            fontSize: text.attr("font-size")
          });
        }
      });
    };

    // Ejecutar renderizado
    renderMap();

    // Agregar listener de resize
    const handleResize = () => {
      renderMap();
    };

    window.addEventListener('resize', handleResize);

    // Limpiar listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [geoData, selectedRegion, hoveredRegion]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="space-y-8"
    >
      {/* ======= TARJETAS SUPERIORES CON DISEÑO MODERNO ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta 1: Mesas Procesadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium opacity-90">Procesamiento</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Mesas Procesadas</h3>
            <p className="text-3xl font-bold">{estadisticas.mesasProcesadas.toFixed(2)}%</p>
            <div className="mt-4 flex items-center gap-2 text-xs opacity-80">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                En progreso
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta 2: Votantes Registrados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium opacity-90">Registro</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Votantes Registrados</h3>
            <p className="text-3xl font-bold">{(estadisticas.votantesRegistrados / 1000000).toFixed(1)}M</p>
            <div className="mt-4 flex items-center gap-2 text-xs opacity-80">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                Total nacional
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta 3: Participación Actual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium opacity-90">Participación</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Participación Actual</h3>
            <p className="text-3xl font-bold">{estadisticas.participacion.toFixed(2)}%</p>
            <div className="mt-4 flex items-center gap-2 text-xs opacity-80">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +2.3% vs anterior
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta 4: Incidencias Reportadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium opacity-90">Alertas</span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Incidencias Reportadas</h3>
            <p className="text-3xl font-bold">{estadisticas.incidencias}</p>
            <div className="mt-4 flex items-center gap-2 text-xs opacity-80">
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Requieren atención
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ======= GRÁFICOS CON DISEÑO MEJORADO ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* === Gráfico de resultados === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Resultados por Partido</h2>
              <p className="text-sm text-gray-500 mt-1">Distribución de votos</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={resultadosPartidos} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="partido" tick={{ fill: "#4B5563", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  formatter={(v) => `${v}%`} 
                  labelFormatter={(n) => `Partido: ${n}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="porcentaje" radius={[8, 8, 0, 0]}>
                  {resultadosPartidos.map((p, i) => (
                    <cell key={i} fill={p.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* === Gráfico de participación === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Participación por Región</h2>
              <p className="text-sm text-gray-500 mt-1">Análisis regional</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <LineChart data={participacionRegional}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="region" tick={{ fill: "#4B5563", fontSize: 12 }} />
                <YAxis hide />
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
                <Line 
                  type="monotone" 
                  dataKey="participacion" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#2563EB' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ======= MAPA DE PERÚ INTERACTIVO ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Distribución Geográfica</h2>
            <p className="text-sm text-gray-500 mt-1">Resultados por región (simulado)</p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mapa SVG Interactivo de Perú con D3.js */}
          <div 
            ref={mapContainerRef}
            className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-lg p-6 border border-gray-200 relative overflow-hidden"
          >
            {/* Decoración de fondo */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative w-full max-w-2xl z-10">
              {!geoData && !mapError && (
                <div className="flex items-center justify-center h-[900px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando mapa de Perú...</p>
                  </div>
                </div>
              )}
              {mapError && (
                <div className="flex items-center justify-center h-[900px]">
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">{mapError}</p>
                    <p className="text-sm text-gray-500">El mapa no se puede mostrar en este momento.</p>
                  </div>
                </div>
              )}
              <svg
                ref={svgRef}
                className="w-full h-auto drop-shadow-2xl"
                style={{ 
                  maxHeight: '900px', 
                  minHeight: '600px',
                  display: geoData ? 'block' : 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
              
              {/* Tooltip con información de región - Aparece SIEMPRE al pasar el mouse sobre el mapa */}
              {hoveredRegion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-30 min-w-[220px] pointer-events-none"
                >
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{hoveredRegion}</h3>
                  {resultadosPorRegion[hoveredRegion] ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded flex-shrink-0"
                          style={{ backgroundColor: resultadosPorRegion[hoveredRegion].color }}
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          {resultadosPorRegion[hoveredRegion].partido}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-sm font-bold text-gray-900">
                          {resultadosPorRegion[hoveredRegion].porcentaje}% de votos
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {resultadosPorRegion[hoveredRegion].votos.toLocaleString('es-PE')} votos totales
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Departamento de Perú</p>
                      <p className="text-xs text-gray-500">Sin datos disponibles</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            <p className="text-sm mt-4 text-gray-600 font-medium text-center">
              Mapa Interactivo del Perú — Pasa el mouse sobre los departamentos para ver información
            </p>
            <p className="text-xs mt-2 text-gray-500 text-center">
              Haz clic en un departamento para seleccionarlo
            </p>
          </div>

          {/* Lista de regiones con resultados - Solo informativa, no interactiva */}
          <div className="lg:w-80 bg-white rounded-lg border border-gray-200 p-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Resultados por Región</h3>
            <p className="text-xs text-gray-500 mb-4">
              Pasa el mouse sobre el mapa para ver información detallada
            </p>
            <div className="space-y-2">
              {Object.entries(resultadosPorRegion).map(([region, data]) => (
                <div
                  key={region}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedRegion === region
                      ? 'border-blue-500 bg-blue-50'
                      : hoveredRegion === region
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{region}</h4>
                    <span className="text-xs font-bold text-gray-600">{data.porcentaje}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="text-xs text-gray-600">{data.partido}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.votos.toLocaleString('es-PE')} votos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
