// archivo: /config/apiConfig.js
// Configuración centralizada para las llamadas a la API

// URL base del API - Cambiar según el ambiente
// Para desarrollo local: http://localhost:8080
// Para producción: actualizar con la URL del servidor
// Detectar URL base de la API de forma segura en el navegador (Vite usa import.meta.env)
const resolveApiBaseUrl = () => {
  // 1) Vite: import.meta.env is available in ESM build — intentamos leer VITE_API_URL
  try {
    if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Si el runtime no soporta import.meta (raro), ignoramos
  }

  // 2) Fallback a process.env (solo si el bundler la expone)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 3) Valor por defecto para desarrollo
  return "http://localhost:8080/api";
};

export const API_BASE_URL = resolveApiBaseUrl();

// Configuración de headers por defecto
export const defaultHeaders = {
  "Content-Type": "application/json",
  // Aquí puedes agregar tokens de autenticación si es necesario
  // "Authorization": `Bearer ${token}`
};

// Función helper para hacer fetches con manejo de errores
export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP Error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en fetch de ${endpoint}:`, error);
    throw error;
  }
};

// Configuración de rutas de la API
export const API_ENDPOINTS = {
  // Administradores
  ADMINISTRADORES: {
    LOGIN: "/administradores/login",
    LISTAR: "/administradores",
    CREAR: "/administradores/crear",
    ELIMINAR: (id) => `/administradores/${id}`,
  },

  // Votantes
  VOTANTES: {
    CONSULTA: (dni) => `/votantes/consulta/${dni}`,
    UBICACION: (dni) => `/votantes/ubicacion/${dni}`,
    FINALIZAR: (dni) => `/votantes/finalizar/${dni}`,
    LISTAR: "/votantes",
    KPIS: "/votantes/kpis", // KPIs de participación
  },

  // Candidatos
  CANDIDATOS: {
    // Tabla general de candidatos
    LISTAR: "/candidatos", // GET /api/candidatos - Tabla general
    CREAR: "/candidatos", // POST /api/candidatos - Crear en tabla general
    ACTUALIZAR: (id) => `/candidatos/${id}`, // PUT /api/candidatos/{id}
    ELIMINAR: (id) => `/candidatos/${id}`, // DELETE /api/candidatos/{id}
    POR_ID: (id) => `/candidatos/${id}`,
    
    // Endpoints enriquecidos (con datos de partido)
    PRESIDENCIAL_ENRIQUECIDO: "/candidatos/presidencial", // GET /api/candidatos/presidencial
    CONGRESISTAS_ENRIQUECIDO: "/candidatos/congresistas", // GET /api/candidatos/congresistas
    ANDINOS_ENRIQUECIDO: "/candidatos/andinos", // GET /api/candidatos/andinos
    
    // Tablas específicas (Presidente, Congresista, ParlamentoAndino)
    PRESIDENCIAL: "/presidentes", // GET /api/presidentes - Tabla específica de presidentes
    CONGRESISTAS: "/congresistas", // GET /api/congresistas - Tabla específica
    ANDINOS: "/parlamento-andino", // GET /api/parlamento-andino - Tabla específica
    
    // Endpoints específicos para crear
    CREAR_PRESIDENTE: "/presidentes", // POST /api/presidentes
    CREAR_CONGRESISTA: "/congresistas", // POST /api/congresistas
    CREAR_PARLAMENTARIO: "/parlamento-andino", // POST /api/parlamento-andino
  },

  // Votos
  VOTOS: {
    REGISTRAR: "/votos/registrar",
  },

  // Partidos Políticos
  PARTIDOS: {
    LISTAR: "/partidos",
    POR_ID: (id) => `/partidos/${id}`,
    CREAR: "/partidos", // POST /api/partidos
    ACTUALIZAR: (id) => `/partidos/${id}`, // PUT /api/partidos/{id}
    ELIMINAR: (id) => `/partidos/${id}`, // DELETE /api/partidos/{id}
  },

  // Datasets (Gestión de archivos CSV)
  DATASETS: {
    ORIGINALES: {
      LISTAR: "/datasets/originales",
      SUBIR: "/datasets/originales",
      ELIMINAR: (id) => `/datasets/originales/${id}`,
    },
    LIMPIOS: {
      LISTAR: "/datasets/limpios",
      ELIMINAR: (id) => `/datasets/limpios/${id}`, // DELETE /api/datasets/limpios/{id}
    },
    LIMPIAR: (idOriginal) => `/datasets/limpiar/${idOriginal}`, // POST /api/datasets/limpiar/{idOriginal}
    DESCARGAR: (tipo, id) => `/datasets/${tipo}/${id}/descargar`, // GET /api/datasets/{tipo}/{id}/descargar (tipo: "original" o "limpio")
  },

  // Machine Learning
  ML: {
    ENTRENAR: (idLimpio) => `/ml/entrenar?idLimpio=${idLimpio}`, // POST /api/ml/entrenar?idLimpio={idLimpio}
    PREDICCION: (idLimpio) => `/ml/prediccion?idLimpio=${idLimpio}`, // GET /api/ml/prediccion?idLimpio={idLimpio}
  },

  // Análisis y Gráficos (de datasets limpios)
  ANALISIS: {
    DISTRIBUCION: (idLimpio) => `/analisis/distribucion?idLimpio=${idLimpio}`, // GET /api/analisis/distribucion?idLimpio={idLimpio}
    TENDENCIA: (idLimpio) => `/analisis/tendencia?idLimpio=${idLimpio}`, // GET /api/analisis/tendencia?idLimpio={idLimpio}
  },

  // Análisis de Votos (de votos emitidos en tiempo real)
  VOTO_ANALISIS: {
    RESULTADOS_PARTIDO: "/voto-analisis/resultados-partido", // GET /api/voto-analisis/resultados-partido
    PARTICIPACION_REGION: "/voto-analisis/participacion-region", // GET /api/voto-analisis/participacion-region
  },

  // Auditoría
  AUDITORIA: {
    LISTAR: "/auditoria", // GET /api/auditoria - Lista todos los registros de auditoría
    POR_USUARIO: (usuarioId) => `/auditoria/usuario/${usuarioId}`, // GET /api/auditoria/usuario/{id}
    POR_FECHA: (fechaDesde, fechaHasta) => `/auditoria?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`, // GET /api/auditoria?fechaDesde=...&fechaHasta=...
    POR_NIVEL: (nivel) => `/auditoria?nivel=${nivel}`, // GET /api/auditoria?nivel=...
  },
};
