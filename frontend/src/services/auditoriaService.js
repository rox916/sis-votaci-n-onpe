// archivo: /services/auditoriaService.js
// Servicio para registrar y gestionar eventos de auditoría

const AUDITORIA_STORAGE_KEY = 'auditoria_logs';
const MAX_LOGS = 10000; // Máximo de logs a mantener en localStorage

/**
 * Obtiene el usuario actual desde localStorage
 */
const obtenerUsuarioActual = () => {
  try {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.usuario || parsed.username || 'Sistema';
    }
    return 'Sistema';
  } catch (error) {
    return 'Sistema';
  }
};

/**
 * Obtiene la IP del usuario (simulada, en producción se obtendría del backend)
 */
const obtenerIP = () => {
  // En producción, esto vendría del backend o de un servicio externo
  return 'N/A';
};

/**
 * Obtiene el User Agent del navegador
 */
const obtenerUserAgent = () => {
  return navigator.userAgent || 'N/A';
};

/**
 * Registra un evento de auditoría
 * @param {string} accion - Acción realizada (ej: "Crear Usuario", "Eliminar Candidato")
 * @param {string} detalle - Detalle de la acción
 * @param {string} nivel - Nivel del evento: "Éxito", "Advertencia", "Error"
 * @param {Object} metadata - Información adicional (opcional)
 */
export const registrarAuditoria = (accion, detalle, nivel = 'Éxito', metadata = {}) => {
  try {
    // Obtener logs existentes
    const stored = localStorage.getItem(AUDITORIA_STORAGE_KEY);
    const logs = stored ? JSON.parse(stored) : [];

    // Crear nuevo log
    const nuevoLog = {
      id: Date.now() + Math.random(), // ID único
      timestamp: new Date().toISOString(),
      fecha: new Date().toISOString(),
      date: new Date().toISOString(),
      usuario: {
        nombre: obtenerUsuarioActual()
      },
      accion: accion,
      action: accion, // Alias para compatibilidad
      detalle: detalle,
      detalles: detalle, // Alias
      detail: detalle, // Alias
      nivel: nivel,
      level: nivel, // Alias
      tipo: nivel, // Alias
      ip: obtenerIP(),
      ipAddress: obtenerIP(), // Alias
      userAgent: obtenerUserAgent(),
      user_agent: obtenerUserAgent(), // Alias
      metadata: metadata
    };

    // Agregar al inicio del array (más reciente primero)
    logs.unshift(nuevoLog);

    // Limitar el número de logs para no llenar localStorage
    if (logs.length > MAX_LOGS) {
      logs.splice(MAX_LOGS);
    }

    // Guardar en localStorage
    localStorage.setItem(AUDITORIA_STORAGE_KEY, JSON.stringify(logs));

    // TODO: Cuando el backend esté listo, también enviar al servidor
    // await fetchAPI(API_ENDPOINTS.AUDITORIA.CREAR, { method: 'POST', body: JSON.stringify(nuevoLog) });

    return nuevoLog;
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
  }
};

/**
 * Registra una acción exitosa
 */
export const registrarExito = (accion, detalle, metadata = {}) => {
  return registrarAuditoria(accion, detalle, 'Éxito', metadata);
};

/**
 * Registra una advertencia
 */
export const registrarAdvertencia = (accion, detalle, metadata = {}) => {
  return registrarAuditoria(accion, detalle, 'Advertencia', metadata);
};

/**
 * Registra un error
 */
export const registrarError = (accion, detalle, metadata = {}) => {
  return registrarAuditoria(accion, detalle, 'Error', metadata);
};

/**
 * Obtiene todos los logs de auditoría
 */
export const obtenerAuditoria = () => {
  try {
    const stored = localStorage.getItem(AUDITORIA_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error al obtener auditoría:", error);
    return [];
  }
};

/**
 * Limpia los logs de auditoría (solo para desarrollo/testing)
 */
export const limpiarAuditoria = () => {
  localStorage.removeItem(AUDITORIA_STORAGE_KEY);
};


