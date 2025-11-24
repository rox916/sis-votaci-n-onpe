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
  // Votantes
  VOTANTES: {
    CONSULTA: (dni) => `/votantes/consulta/${dni}`,
    UBICACION: (dni) => `/votantes/ubicacion/${dni}`,
    FINALIZAR: (dni) => `/votantes/finalizar/${dni}`,
    LISTAR: "/votantes",
  },

  // Candidatos
  CANDIDATOS: {
    PRESIDENCIAL: "/presidentes", // Backend: /api/presidentes (GET) - Tabla específica de presidentes
    CONGRESISTAS: "/congresistas", // Backend: /api/congresistas
    ANDINOS: "/parlamento-andino", // Backend: /api/parlamento-andino (controlador separado ParlamentoAndinoController)
    LISTAR: "/candidatos", // Backend: /api/candidatos (tabla general)
    POR_ID: (id) => `/candidatos/${id}`,
    // Endpoints específicos para crear
    CREAR_PRESIDENTE: "/presidentes", // Backend: /api/presidentes (POST)
    CREAR_CONGRESISTA: "/congresistas", // Backend: /api/congresistas (POST)
    CREAR_PARLAMENTARIO: "/parlamento-andino", // Backend: /api/parlamento-andino (POST)
  },

  // Votos
  VOTOS: {
    REGISTRAR: "/votos/registrar",
  },

  // Partidos Políticos
  PARTIDOS: {
    LISTAR: "/partidos",
    POR_ID: (id) => `/partidos/${id}`,
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
    },
    LIMPIAR: (idOriginal) => `/datasets/limpiar/${idOriginal}`, // Backend usa idOriginal como nombre del parámetro
  },

  // Machine Learning
  ML: {
    ENTRENAR: (idLimpio) => `/ml/entrenar?idLimpio=${idLimpio}`,
    PREDICCION: (idLimpio) => `/ml/prediccion?idLimpio=${idLimpio}`, // Backend requiere idLimpio como query param
  },

  // Análisis y Gráficos
  ANALISIS: {
    DISTRIBUCION: (idLimpio) => `/analisis/distribucion?idLimpio=${idLimpio}`, // Backend requiere idLimpio como query param
    TENDENCIA: (idLimpio) => `/analisis/tendencia?idLimpio=${idLimpio}`, // Backend requiere idLimpio como query param
  },
};
