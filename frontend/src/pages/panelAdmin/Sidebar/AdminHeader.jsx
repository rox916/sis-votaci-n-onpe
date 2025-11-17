import React from "react";
import { LogOut, UserCircle2, Menu, X } from "lucide-react";

const AdminHeader = ({ toggleSidebar, isCollapsed }) => {
  const handleLogout = () => {
    // Limpiar todas las variables de autenticación
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    // Redirigir al login
    window.location.href = "/admin/login";
  };

  const userName = localStorage.getItem("adminUser") || localStorage.getItem("userName") || "Administrador";

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 shadow-md px-6 py-4">
      {/* Sección izquierda: botón toggle y logo */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}
        <div className="leading-tight border-l border-gray-200 pl-4">
          <h1 className="text-sm font-bold text-gray-900">
            Oficina Nacional de Procesos Electorales
          </h1>
          <p className="text-xs text-gray-500 font-medium">Panel Administrativo 2026</p>
        </div>
      </div>

      {/* Sección derecha: usuario */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="p-1.5 bg-blue-100 rounded-full">
            <UserCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{userName}</span>
            <span className="text-xs text-gray-500">Administrador</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-[#2F4B8C] to-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-[#243869] hover:to-[#1E3A8A] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <LogOut className="w-4 h-4" />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
