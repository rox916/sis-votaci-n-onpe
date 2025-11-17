// src/pages/panelAdmin/Configuracion/Configuracion.jsx

import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Settings, Shield, Bell } from "lucide-react";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("sistema");

  const tabs = [
    { id: "sistema", label: "Sistema General", icon: Settings },
    { id: "seguridad", label: "Seguridad", icon: Shield },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* 🧭 Encabezado */}
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-[#1A2C56]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configuración del Panel Administrativo
          </h1>
          <p className="text-sm text-gray-600">
            Ajusta los parámetros generales, seguridad y notificaciones del sistema.
          </p>
        </div>
      </div>

      {/* 🧩 Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b flex overflow-x-auto">
            {/* eslint-disable-next-line no-unused-vars */}
            {tabs.map(({ id, label, icon: Icon }) => (
            <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === id
                    ? "border-b-2 border-[#1A2C56] text-[#1A2C56] bg-gray-50"
                    : "text-gray-600 hover:text-[#1A2C56] hover:bg-gray-50"
                }`}
            >
                <Icon className="w-4 h-4" />
                {label}
            </button>
            ))}
        </div>

        <div className="p-6">
          {activeTab === "sistema" && <SistemaGeneral />}
          {activeTab === "seguridad" && <Seguridad />}
          {activeTab === "notificaciones" && <Notificaciones />}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------ 🧱 COMPONENTES DE CADA TAB ------------------------ */

function SistemaGeneral() {
  return (
    <form className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1A2C56]">
        Configuración General del Sistema
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre del Sistema" placeholder="Panel Electoral Nacional" />
        <Input label="Entidad Organizadora" placeholder="ONPE, JNE, etc." />
        <Input label="Idioma Principal" placeholder="Español" />
        <Input label="Zona Horaria" placeholder="America/Lima" />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          className="bg-[#1A2C56] hover:bg-[#23396A] text-white px-4 py-2 rounded-lg"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

function Seguridad() {
  return (
    <form className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1A2C56]">
        Configuración de Seguridad
      </h2>
      <p className="text-sm text-gray-600">
        Establece las políticas de acceso y protección del sistema.
      </p>

      <div className="space-y-3">
        <Checkbox label="Requerir contraseñas seguras (mínimo 8 caracteres)" />
        <Checkbox label="Activar autenticación en dos pasos (2FA)" />
        <Checkbox label="Cerrar sesión automáticamente tras inactividad prolongada" />
        <Checkbox label="Registrar acciones de auditoría de usuarios" />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          className="bg-[#1A2C56] hover:bg-[#23396A] text-white px-4 py-2 rounded-lg"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

function Notificaciones() {
  return (
    <form className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1A2C56]">
        Configuración de Notificaciones
      </h2>
      <p className="text-sm text-gray-600">
        Controla los avisos y alertas que se mostrarán a los administradores.
      </p>

      <div className="space-y-3">
        <Checkbox label="Notificar nuevos registros de usuarios" />
        <Checkbox label="Alertar errores del sistema" />
        <Checkbox label="Enviar notificaciones por correo electrónico" />
        <Checkbox label="Mostrar alertas emergentes en el panel" />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          className="bg-[#1A2C56] hover:bg-[#23396A] text-white px-4 py-2 rounded-lg"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

/* 🧩 COMPONENTES REUTILIZABLES */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56]"
      />
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-gray-700">
      <input
        type="checkbox"
        {...props}
        className="w-4 h-4 text-[#1A2C56] focus:ring-[#1A2C56]"
      />
      {label}
    </label>
  );
}
