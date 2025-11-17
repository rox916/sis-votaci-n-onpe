// src/pages/votar/Votar.jsx

import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Crown, Globe, Building2 } from "lucide-react";
import { fetchCandidatosParaVotacion } from "../../services/candidatosService";
import { registrarVoto } from "../../services/votosService";
// IMPORTACIONES AÑADIDAS
import { useLocation, Navigate, useNavigate } from "react-router-dom";

// componentes de esta carpeta
import ProgressCard from "./ProgressCard";
// IMPORTACIÓN ELIMINADA: import Verificacion from "./Verificacion";
import Categorias from "./Categorias";
import Candidatos from "./Candidatos";
import Congresistas from "./Congresistas";
import ParliamentoAndino from "./ParliamentoAndino";
import Final from "./Final";

// Categorías de votación disponibles en el proceso electoral
const categoriasVotacion = [
  {
    id: "presidente",
    titulo: "Presidente y Vicepresidentes",
    subtitulo: "de la República",
    icono: Crown,
    color: "from-blue-500 to-blue-600",
    descripcion: "Elige a tu fórmula presidencial",
  },
  {
    id: "congresistas",
    titulo: "Congresistas",
    subtitulo: "de la República",
    icono: Building2,
    color: "from-green-500 to-green-600",
    descripcion: "Elige a tus representantes en el Congreso",
  },
  {
    id: "parlamentoAndino",
    titulo: "Parlamento Andino",
    subtitulo: "Representantes Regionales",
    icono: Globe,
    color: "from-purple-500 to-purple-600",
    descripcion: "Elige a tus representantes regionales",
  },
];

export default function Votar() {
  // === INICIO DE CAMBIOS ===

  // 1. Obtener los datos de la página anterior
  const location = useLocation();
  const navigate = useNavigate();
  const datosVerificacion = location.state || {};

  // 2. Si NO hay datos mínimos (intenta entrar directo), lo botamos a /verificacion
  if (!Object.keys(datosVerificacion).length) {
    return <Navigate to="/verificacion" replace />;
  }

  // 3. Extraer los datos (soportamos ambas formas: 'votante' o 'ciudadano')
  const votante = datosVerificacion.votante || datosVerificacion.ciudadano || {};
  const departamento = datosVerificacion.departamento || votante.departamento || "";
  const provincia = datosVerificacion.provincia || votante.provincia || "";
  const distrito = datosVerificacion.distrito || votante.distrito || "";

  // 4. Ajustar los 'useState' para que empiecen en el paso 2 y con el DNI
  const [paso, setPaso] = useState(2); // Empezamos en el paso 2 (Categorías)
  const [dni, setDni] = useState(datosVerificacion.dni || votante.dni || ""); // Usamos el DNI verificado
  
  // === FIN DE CAMBIOS ===

  // Estados del proceso (sin los del paso 1)
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [votosRealizados, setVotosRealizados] = useState({});
  const [error, setError] = useState("");
  // const [captchaCode, setCaptchaCode] = useState(""); // Ya no se usa
  // const [captchaInput, setCaptchaInput] = useState(""); // Ya no se usa
  const [candidatosData, setCandidatosData] = useState({
    presidente: [],
    congresistas: [],
    parlamentoAndino: [],
  });

  // Animación común
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Cargar candidatos UNA SOLA VEZ al montar el componente (cacheo)
  useEffect(() => {
    let mounted = true;
    const cargarCandidatosAsync = async () => {
      try {
        console.log("=== Votar.jsx: Cargando candidatos (primera vez) ===");
        const datos = await fetchCandidatosParaVotacion();
        console.log("Datos cargados en Votar.jsx:", datos);
        if (mounted) {
          setCandidatosData(datos);
          console.log("candidatosData actualizado:", datos);
        }
      } catch (err) {
        console.error('Error cargando candidatos:', err);
      }
    };

    cargarCandidatosAsync();

    return () => {
      mounted = false;
    };
    // [] = Cargar solo una vez al montar el componente
  }, []);

  // FUNCIONES 'generateCaptcha' y 'verificarDNI' ELIMINADAS (ya no se necesitan)

  const seleccionarCategoria = (categoria) => {
    setCategoriaActual(categoria);
    setPaso(3);
  };

  // Helper: mapear ID de categoría a cargo simplificado
  const obtenerCargoSimplificado = (categoriaId) => {
    const cargoMap = {
      presidente: "Presidente",
      congresistas: "Congresista",
      parlamentoAndino: "Parlamentario Andino",
    };
    return cargoMap[categoriaId] || "DESCONOCIDO";
  };

  // confirmarVotoDirecto
  const confirmarVotoDirecto = (candidatoVotado) => {
    // Registrar voto en backend, luego actualizar estado local
    (async () => {
      try {
        console.log("=== DEBUG confirmarVotoDirecto ===");
        console.log("candidatoVotado:", candidatoVotado);
        console.log("categoriaActual:", categoriaActual);
        console.log("dni:", dni);
        // Helper: buscar candidato por ID en los datos cacheados
        const findCandidateById = (id) => {
          if (!id) return null;
          for (const key of Object.keys(candidatosData)) {
            const arr = candidatosData[key] || [];
            const f = arr.find((c) => c.id === id);
            if (f) return f;
          }
          return null;
        };

        // Extraer ID del candidato (puede ser null para voto nulo)
        const idCandidato = candidatoVotado?.id !== undefined ? candidatoVotado.id : (candidatoVotado.idCandidato || null);
        // Obtener nombre del cargo simplificado según la categoría
        const cargoVotado = obtenerCargoSimplificado(categoriaActual?.id);

        console.log("idCandidato:", idCandidato, "cargoVotado:", cargoVotado);

        // Registrar el voto (ya sea candidato o nulo)
        if (idCandidato === null || candidatoVotado?.esNulo) {
          // Voto nulo - registrar en backend sin candidato
          console.log("Registrando voto nulo...");
          await registrarVoto(dni, null, cargoVotado, null, null);
        } else {
          // Voto válido
          // Si vienen votos preferenciales (array), registrarlos uno por uno
          if (candidatoVotado?.preferenciales && Array.isArray(candidatoVotado.preferenciales)) {
            console.log("=== Registrando votos preferenciales (Congresistas) ===");
            console.log("preferenciales:", candidatoVotado.preferenciales);
            console.log("candidatos disponibles:", candidatoVotado.candidatos);
            
            // Iterar sobre cada ID preferencial
            for (const idPref of candidatoVotado.preferenciales) {
              try {
                // Buscar el candidato en el array incluido
                const candidatoEncontrado = (candidatoVotado.candidatos || []).find(c => c.id === idPref);
                
                const nombre = candidatoEncontrado?.nombre || null;
                const partido = candidatoEncontrado?.partidoNombre || null;
                
                console.log(`Registrando preferencial ID: ${idPref}, nombre: ${nombre}, partido: ${partido}`);
                console.log(`>>> DATOS A ENVIAR: dni=${dni}, idPref=${idPref}, cargoVotado=${cargoVotado}, nombre=${nombre}, partido=${partido}`);
                
                await registrarVoto(dni, idPref, cargoVotado, nombre, partido);
              } catch (err) {
                console.error('Error registrando preferencial', idPref, err);
              }
            }
          } else {
            console.log("Registrando voto válido para candidato:", idCandidato);
            // intentar obtener datos del candidato desde el objeto recibido o del cache
            const nombreDesdeObj = candidatoVotado?.nombre || candidatoVotado?.nombreCompleto || null;
            const partidoDesdeObj = candidatoVotado?.partidoNombre || candidatoVotado?.partido || null;
            let nombre = nombreDesdeObj;
            let partido = partidoDesdeObj;
            if (!nombre || !partido) {
              const cand = findCandidateById(idCandidato);
              if (cand) {
                nombre = nombre || cand.nombre || cand.nombre_completo || null;
                partido = partido || cand.partidoNombre || cand.partido || null;
              }
            }
            await registrarVoto(dni, idCandidato, cargoVotado, nombre, partido);
          }
        }

        // Actualizar estado de votos realizados
        const nuevosVotos = {
          ...votosRealizados,
          [categoriaActual.id]: candidatoVotado,
        };
        console.log("nuevosVotos:", nuevosVotos);
        setVotosRealizados(nuevosVotos);

        // Verificar si se votaron todas las categorías
        const categoriasVotadas = Object.keys(nuevosVotos).length;
        const categoriasRequeridas = categoriasVotacion.length;
        console.log(`Categorías votadas: ${categoriasVotadas}/${categoriasRequeridas}`);

        if (categoriasVotadas === categoriasRequeridas) {
          console.log("Todas las categorías votadas, ir a Final");
          setPaso(5);
        } else {
          console.log("Volviendo a categorías para votar la siguiente");
          setCategoriaActual(null);
          setPaso(2);
        }
      } catch (err) {
        console.error('Error registrando voto:', err);
        setError(err.message || 'No se pudo registrar el voto');
      }
    })();
  };

  // Función para volver a categorías
  const volverACategorias = () => {
    setCategoriaActual(null);
    setPaso(2);
  };

  const reiniciar = () => {
    // Al reiniciar, lo mandamos a la página de verificación, no al paso 1
    navigate("/verificacion", { replace: true });
    
    // (Lógica original, por si acaso la necesitas)
    // setPaso(1);
    // setDni("");
    // setCategoriaActual(null);
    // setVotosRealizados({});
    // setError("");
    // setCaptchaCode("");
    // setCaptchaInput("");
  };

  // 'obtenerCandidatos' y 'categoriasPendientes' se quedan igual
  const obtenerCandidatos = () => {
    if (!categoriaActual) return [];
    const categoriaKey =
      categoriaActual.id === "parlamentoAndino"
        ? "parlamentoAndino"
        : categoriaActual.id;
    return candidatosData[categoriaKey] || [];
  };

  const categoriasPendientes = categoriasVotacion.filter(
    (cat) => !votosRealizados[cat.id]
  );

  const progreso =
    (Object.keys(votosRealizados).length / categoriasVotacion.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header (se queda igual) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Vote className="w-8 h-8 text-[#2563EB]" />
            <h1 className="text-4xl font-bold text-[#1E3A8A]">Realiza tu voto</h1>
          </div>
        </motion.div>

        {/* === NUEVO BLOQUE: DATOS DEL VOTANTE === */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg text-sm"
        >
          <p className="font-semibold text-blue-800">
            Votante: {votante.nombres || votante.nombre_completo || votante.nombre} {votante.apellidos || ''} ({dni})
          </p>
          <p className="text-gray-600">
            Ubicación: {distrito}, {provincia}, {departamento}
          </p>
        </motion.div>
        
        {/* Progreso */}
        {paso < 5 && (
          <ProgressCard
            fadeUp={fadeUp}
            votosRealizados={votosRealizados}
            categorias={categoriasVotacion}
            progreso={progreso}
          />
        )}

        {/* Contenido principal por paso */}
        <AnimatePresence mode="wait">
          
          {/* BLOQUE 'paso === 1' ELIMINADO */}

          {paso === 2 && (
            <Categorias
              key="paso2"
              fadeUp={fadeUp}
              categorias={categoriasVotacion}
              votosRealizados={votosRealizados}
              categoriasPendientes={categoriasPendientes}
              onSeleccionarCategoria={seleccionarCategoria}
              // 'onVolverPaso1' ya no tiene sentido, puedes quitarlo de 'Categorias.jsx' si quieres
              // onVolverPaso1={() => setPaso(1)} 
              onIrFinal={() => setPaso(5)}
            />
          )}

          {paso === 3 && categoriaActual && categoriaActual.id === "presidente" && (
            <Candidatos
              key="paso3-presidente"
              categoriaActual={categoriaActual}
              candidatos={obtenerCandidatos()}
              onConfirmarVoto={confirmarVotoDirecto}
              onVolverCategorias={volverACategorias}
            />
          )}

          {paso === 3 && categoriaActual && categoriaActual.id === "congresistas" && (
            <Congresistas
              key="paso3-congreso"
              categoriaActual={categoriaActual}
              candidatos={obtenerCandidatos()}
              onConfirmarVoto={confirmarVotoDirecto}
              onVolverCategorias={volverACategorias}
            />
          )}

          {paso === 3 && categoriaActual && categoriaActual.id === "parlamentoAndino" && (
            <ParliamentoAndino
              key="paso3-parlamento"
              categoriaActual={categoriaActual}
              candidatos={obtenerCandidatos()}
              onConfirmarVoto={confirmarVotoDirecto}
              onVolverCategorias={volverACategorias}
            />
          )}

          {paso === 5 && (
            <Final
              key="paso5"
              fadeUp={fadeUp}
              votosRealizados={votosRealizados}
              categoriasVotacion={categoriasVotacion}
              onReiniciar={reiniciar}
              dni={dni}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
