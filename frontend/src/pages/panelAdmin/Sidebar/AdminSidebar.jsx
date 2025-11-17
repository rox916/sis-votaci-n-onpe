import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,      // Dashboard
  Users,          // Usuarios
  UserSquare2,    // Candidatos
  Building2,      // Centros
  Settings,       // Configuración
  FileText,       // Reportes
  TrendingUp,     // Resultados
  Shield,         // Auditoría
  UserCheck,      // Padrón Electoral
  Brain,          // Análisis de Datos
  KeyRound,       // Roles y Permisos
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed = false }) => {
  const location = useLocation();

  // Menú organizado por categorías lógicas
  const menuSections = [
    {
      id: "principal",
      label: "Principal",
      items: [
        { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/admin" },
      ]
    },
    {
      id: "gestion-usuarios",
      label: "Gestión de Usuarios",
      items: [
        { id: "usuarios", label: "Usuarios", icon: Users, path: "/admin/usuarios" },
        { id: "roles", label: "Roles y Permisos", icon: KeyRound, path: "/admin/roles" },
      ]
    },
    {
      id: "gestion-electoral",
      label: "Gestión Electoral",
      items: [
        { id: "candidatos", label: "Candidatos", icon: UserSquare2, path: "/admin/candidatos" },
        { id: "padron-electoral", label: "Padrón Electoral", icon: UserCheck, path: "/admin/padron-electoral" },
        { id: "centros", label: "Centros de Votación", icon: Building2, path: "/admin/centros" },
      ]
    },
    {
      id: "resultados-analisis",
      label: "Resultados y Análisis",
      items: [
        { id: "resultados", label: "Resultados", icon: TrendingUp, path: "/admin/resultados" },
        { id: "analisis", label: "Análisis de Datos", icon: Brain, path: "/admin/analisis" },
        { id: "reportes", label: "Reportes", icon: FileText, path: "/admin/reportes" },
      ]
    },
    {
      id: "sistema",
      label: "Sistema",
      items: [
        { id: "configuracion", label: "Configuración", icon: Settings, path: "/admin/configuracion" },
        { id: "auditoria", label: "Auditoría", icon: Shield, path: "/admin/auditoria" },
      ]
    },
  ];

  // Función para verificar si una ruta está activa
  const isActive = (item) => {
    if (item.id === 'dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname === item.path;
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 min-h-screen transition-all duration-300`}>
      {/* Encabezado mejorado */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-white">Panel ONPE 2026</h1>
            <p className="text-xs text-blue-100 mt-1">Sistema Electoral</p>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Navegación mejorada */}
      <nav className="mt-4 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {menuSections.map((section, sectionIndex) => (
          <div key={section.id} className={sectionIndex > 0 ? "mt-6" : ""}>
            {/* Título de sección (solo si no está colapsado) */}
            {!isCollapsed && (
              <div className="px-6 py-3 mb-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {section.label}
                </h3>
              </div>
            )}
            
            {/* Separador visual mejorado */}
            {!isCollapsed && sectionIndex > 0 && (
              <div className="mx-6 mb-3 border-t border-gray-200"></div>
            )}

            {/* Items del menú con diseño mejorado */}
            {section.items.map((item) => {
              const Icono = item.icon;
              const itemIsActive = isActive(item);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center gap-3 px-6 py-3 font-medium transition-all duration-200 relative ${
                    itemIsActive
                      ? "text-[#2563EB] bg-gradient-to-r from-blue-50 to-blue-100 border-r-4 border-[#2563EB] shadow-sm"
                      : "text-gray-600 hover:text-[#2563EB] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    itemIsActive 
                      ? "bg-blue-100 text-[#2563EB]" 
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#2563EB]"
                  }`}>
                    <Icono className="w-4 h-4 flex-shrink-0" />
                  </div>
                  {!isCollapsed && (
                    <span className={`transition-colors ${itemIsActive ? "font-semibold" : ""}`}>
                      {item.label}
                    </span>
                  )}
                  {itemIsActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2563EB] rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
