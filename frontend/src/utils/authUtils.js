/**
 * Utilidades para autenticación y autorización
 * Maneja roles, permisos y validaciones de acceso
 */

/**
 * Obtiene los permisos de un rol desde localStorage
 * @param {string} nombreRol - Nombre del rol
 * @returns {Array<string>} Array de permisos del rol
 */
export const obtenerPermisosDeRol = (nombreRol) => {
  try {
    const rolesStored = localStorage.getItem("roles");
    if (!rolesStored) {
      // Si no hay roles en localStorage, usar los iniciales
      const initialRoles = [
        {
          id: 1,
          nombre: "Super Admin",
          descripcion: "Acceso total al sistema y configuración global.",
          permisos: ["Dashboard", "Usuarios", "Candidatos", "Centros", "Padrón Electoral", "Resultados", "Configuración", "Auditoría", "Análisis de Datos", "Reportes"],
          estado: "Activo",
        },
        {
          id: 2,
          nombre: "Admin Regional",
          descripcion: "Gestiona centros y resultados dentro de su región.",
          permisos: ["Dashboard", "Centros", "Resultados", "Reportes"],
          estado: "Activo",
        },
        {
          id: 3,
          nombre: "Presidente de Mesa",
          descripcion: "Registra y valida los resultados de mesa electoral.",
          permisos: ["Dashboard", "Resultados"],
          estado: "Activo",
        },
        {
          id: 4,
          nombre: "Soporte Técnico",
          descripcion: "Da soporte al sistema y usuarios regionales.",
          permisos: ["Dashboard", "Usuarios", "Reportes"],
          estado: "Inactivo",
        },
      ];
      const rol = initialRoles.find((r) => r.nombre === nombreRol);
      return rol ? rol.permisos : [];
    }

    const roles = JSON.parse(rolesStored);
    const rol = roles.find((r) => r.nombre === nombreRol);
    return rol ? rol.permisos : [];
  } catch (error) {
    console.error("Error al obtener permisos del rol:", error);
    return [];
  }
};

/**
 * Obtiene el usuario autenticado desde localStorage
 * @returns {Object|null} Usuario autenticado o null
 */
export const obtenerUsuarioAutenticado = () => {
  try {
    const userStored = localStorage.getItem("adminUser");
    if (!userStored) return null;
    return JSON.parse(userStored);
  } catch (error) {
    console.error("Error al obtener usuario autenticado:", error);
    return null;
  }
};

/**
 * Obtiene los permisos del usuario autenticado
 * @returns {Array<string>} Array de permisos del usuario
 */
export const obtenerPermisosUsuario = () => {
  try {
    const permisosStored = localStorage.getItem("adminPermisos");
    if (permisosStored) {
      return JSON.parse(permisosStored);
    }
    return [];
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error);
    return [];
  }
};

/**
 * Verifica si el usuario tiene un permiso específico
 * @param {string} permiso - Nombre del permiso a verificar
 * @returns {boolean} true si tiene el permiso, false en caso contrario
 */
export const tienePermiso = (permiso) => {
  const permisos = obtenerPermisosUsuario();
  return permisos.includes(permiso);
};

/**
 * Verifica si el usuario tiene alguno de los permisos especificados
 * @param {Array<string>} permisosRequeridos - Array de permisos a verificar
 * @returns {boolean} true si tiene al menos uno de los permisos
 */
export const tieneAlgunPermiso = (permisosRequeridos) => {
  const permisos = obtenerPermisosUsuario();
  return permisosRequeridos.some((permiso) => permisos.includes(permiso));
};

/**
 * Mapeo de rutas a permisos requeridos
 */
export const MAPEO_RUTA_PERMISO = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/usuarios": "Usuarios",
  "/admin/roles": "Usuarios", // Solo Super Admin debería tener acceso
  "/admin/candidatos": "Candidatos",
  "/admin/padron-electoral": "Padrón Electoral",
  "/admin/centros": "Centros",
  "/admin/resultados": "Resultados",
  "/admin/analisis": "Análisis de Datos",
  "/admin/reportes": "Reportes",
  "/admin/configuracion": "Configuración",
  "/admin/auditoria": "Auditoría",
};

/**
 * Obtiene el permiso requerido para una ruta
 * @param {string} ruta - Ruta a verificar
 * @returns {string|null} Permiso requerido o null
 */
export const obtenerPermisoDeRuta = (ruta) => {
  return MAPEO_RUTA_PERMISO[ruta] || null;
};

