// src/pages/panelAdmin/Configuracion/Configuracion.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Bell, Save, RefreshCw, CheckCircle, AlertCircle, Globe, Clock, Mail, Phone, Server, Image as ImageIcon, Lock } from "lucide-react";

// Clave para almacenar configuración en localStorage
const CONFIG_STORAGE_KEY = 'configuracion_sistema';

// Configuración por defecto
const defaultConfig = {
  sistema: {
    nombreSistema: "Panel Electoral Nacional",
    entidadOrganizadora: "ONPE - Oficina Nacional de Procesos Electorales",
    idioma: "es",
    zonaHoraria: "America/Lima",
    urlAPI: "http://localhost:8080/api",
    emailContacto: "contacto@onpe.gob.pe",
    telefonoContacto: "+51 1 417-0630",
    logoURL: "",
  },
  seguridad: {
    contraseñaMinima: 8,
    requerirMayusculas: true,
    requerirNumeros: true,
    requerirCaracteresEspeciales: true,
    autenticacion2FA: false,
    tiempoSesion: 30, // minutos
    cerrarSesionInactividad: true,
    tiempoInactividad: 15, // minutos
    registrarAuditoria: true,
    maxIntentosLogin: 5,
    bloquearDespuesIntentos: true,
    tiempoBloqueo: 30, // minutos
  },
  notificaciones: {
    notificarNuevosUsuarios: true,
    notificarErroresSistema: true,
    notificarPorEmail: true,
    notificarEnPanel: true,
    alertasEmergentes: true,
    notificarVotaciones: true,
    notificarResultados: true,
  },
};

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("sistema");
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Cargar configuración al montar
  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = () => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig({ ...defaultConfig, ...parsed });
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (seccion) => {
    setSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // Simular guardado (en producción sería una llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Guardar en localStorage
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      const currentConfig = stored ? JSON.parse(stored) : {};
      currentConfig[seccion] = config[seccion];
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(currentConfig));

      setSaveMessage({ 
        type: 'success', 
        text: `Configuración de ${seccion === 'sistema' ? 'Sistema General' : seccion === 'seguridad' ? 'Seguridad' : 'Notificaciones'} guardada exitosamente.` 
      });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setSaveMessage({ 
        type: 'error', 
        text: 'Error al guardar la configuración. Por favor, intente nuevamente.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const resetearConfiguracion = (seccion) => {
    if (window.confirm(`¿Está seguro de que desea restaurar la configuración por defecto de ${seccion === 'sistema' ? 'Sistema General' : seccion === 'seguridad' ? 'Seguridad' : 'Notificaciones'}?`)) {
      setConfig(prev => ({
        ...prev,
        [seccion]: { ...defaultConfig[seccion] }
      }));
    }
  };

  const tabs = [
    { id: "sistema", label: "Sistema General", icon: Settings },
    { id: "seguridad", label: "Seguridad", icon: Shield },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[#1A2C56]" />
      </div>
    );
  }

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

      {/* Mensaje de guardado */}
      {saveMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{saveMessage.text}</span>
        </motion.div>
      )}

      {/* 🧩 Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b flex overflow-x-auto">
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
          {activeTab === "sistema" && (
            <SistemaGeneral 
              config={config.sistema} 
              setConfig={(newConfig) => setConfig(prev => ({ ...prev, sistema: newConfig }))}
              onSave={() => guardarConfiguracion('sistema')}
              onReset={() => resetearConfiguracion('sistema')}
              saving={saving}
            />
          )}
          {activeTab === "seguridad" && (
            <Seguridad 
              config={config.seguridad} 
              setConfig={(newConfig) => setConfig(prev => ({ ...prev, seguridad: newConfig }))}
              onSave={() => guardarConfiguracion('seguridad')}
              onReset={() => resetearConfiguracion('seguridad')}
              saving={saving}
            />
          )}
          {activeTab === "notificaciones" && (
            <Notificaciones 
              config={config.notificaciones} 
              setConfig={(newConfig) => setConfig(prev => ({ ...prev, notificaciones: newConfig }))}
              onSave={() => guardarConfiguracion('notificaciones')}
              onReset={() => resetearConfiguracion('notificaciones')}
              saving={saving}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------ 🧱 COMPONENTES DE CADA TAB ------------------------ */

function SistemaGeneral({ config, setConfig, onSave, onReset, saving }) {
  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const idiomas = [
    { value: "es", label: "Español" },
    { value: "qu", label: "Quechua" },
    { value: "ay", label: "Aimara" },
    { value: "en", label: "English" },
  ];

  const zonasHorarias = [
    { value: "America/Lima", label: "Lima (PET) - UTC-5" },
    { value: "America/New_York", label: "New York (EST) - UTC-5" },
    { value: "America/Mexico_City", label: "México (CST) - UTC-6" },
    { value: "Europe/Madrid", label: "Madrid (CET) - UTC+1" },
  ];

  return (
    <form 
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1A2C56]">
          Configuración General del Sistema
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-[#1A2C56] flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Restaurar valores por defecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre del Sistema"
          icon={Settings}
          value={config.nombreSistema}
          onChange={(e) => handleChange('nombreSistema', e.target.value)}
          placeholder="Panel Electoral Nacional"
        />
        <Input
          label="Entidad Organizadora"
          icon={Shield}
          value={config.entidadOrganizadora}
          onChange={(e) => handleChange('entidadOrganizadora', e.target.value)}
          placeholder="ONPE, JNE, etc."
        />
        <Select
          label="Idioma Principal"
          icon={Globe}
          value={config.idioma}
          onChange={(e) => handleChange('idioma', e.target.value)}
          options={idiomas}
        />
        <Select
          label="Zona Horaria"
          icon={Clock}
          value={config.zonaHoraria}
          onChange={(e) => handleChange('zonaHoraria', e.target.value)}
          options={zonasHorarias}
        />
        <Input
          label="URL de la API"
          icon={Server}
          value={config.urlAPI}
          onChange={(e) => handleChange('urlAPI', e.target.value)}
          placeholder="http://localhost:8080/api"
          type="url"
        />
        <Input
          label="URL del Logo"
          icon={ImageIcon}
          value={config.logoURL}
          onChange={(e) => handleChange('logoURL', e.target.value)}
          placeholder="https://ejemplo.com/logo.png"
          type="url"
        />
        <Input
          label="Email de Contacto"
          icon={Mail}
          value={config.emailContacto}
          onChange={(e) => handleChange('emailContacto', e.target.value)}
          placeholder="contacto@onpe.gob.pe"
          type="email"
        />
        <Input
          label="Teléfono de Contacto"
          icon={Phone}
          value={config.telefonoContacto}
          onChange={(e) => handleChange('telefonoContacto', e.target.value)}
          placeholder="+51 1 417-0630"
          type="tel"
        />
      </div>

      {config.logoURL && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Vista previa del logo:</p>
          <img 
            src={config.logoURL} 
            alt="Logo del sistema" 
            className="h-16 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1A2C56] hover:bg-[#23396A] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Seguridad({ config, setConfig, onSave, onReset, saving }) {
  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const handleCheckbox = (field) => {
    setConfig({ ...config, [field]: !config[field] });
  };

  return (
    <form 
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1A2C56]">
            Configuración de Seguridad
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Establece las políticas de acceso y protección del sistema.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-[#1A2C56] flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Restaurar valores por defecto
        </button>
      </div>

      {/* Políticas de Contraseñas */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Políticas de Contraseñas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud Mínima de Contraseña
            </label>
            <input
              type="number"
              min="6"
              max="20"
              value={config.contraseñaMinima}
              onChange={(e) => handleChange('contraseñaMinima', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56]"
            />
          </div>
          <div className="space-y-2">
            <Checkbox
              label="Requerir mayúsculas"
              checked={config.requerirMayusculas}
              onChange={() => handleCheckbox('requerirMayusculas')}
            />
            <Checkbox
              label="Requerir números"
              checked={config.requerirNumeros}
              onChange={() => handleCheckbox('requerirNumeros')}
            />
            <Checkbox
              label="Requerir caracteres especiales"
              checked={config.requerirCaracteresEspeciales}
              onChange={() => handleCheckbox('requerirCaracteresEspeciales')}
            />
          </div>
        </div>
      </div>

      {/* Autenticación */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Autenticación y Sesiones
        </h3>
        <div className="space-y-3">
          <Checkbox
            label="Activar autenticación en dos pasos (2FA)"
            checked={config.autenticacion2FA}
            onChange={() => handleCheckbox('autenticacion2FA')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Sesión (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={config.tiempoSesion}
                onChange={(e) => handleChange('tiempoSesion', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Inactividad (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={config.tiempoInactividad}
                onChange={(e) => handleChange('tiempoInactividad', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56]"
                disabled={!config.cerrarSesionInactividad}
              />
            </div>
          </div>
          <Checkbox
            label="Cerrar sesión automáticamente tras inactividad prolongada"
            checked={config.cerrarSesionInactividad}
            onChange={() => handleCheckbox('cerrarSesionInactividad')}
          />
        </div>
      </div>

      {/* Protección contra Ataques */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Protección contra Ataques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Intentos de Login
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={config.maxIntentosLogin}
              onChange={(e) => handleChange('maxIntentosLogin', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de Bloqueo (minutos)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={config.tiempoBloqueo}
              onChange={(e) => handleChange('tiempoBloqueo', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56]"
              disabled={!config.bloquearDespuesIntentos}
            />
          </div>
        </div>
        <Checkbox
          label="Bloquear cuenta después de múltiples intentos fallidos"
          checked={config.bloquearDespuesIntentos}
          onChange={() => handleCheckbox('bloquearDespuesIntentos')}
        />
      </div>

      {/* Auditoría */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold text-gray-800">Auditoría</h3>
        <Checkbox
          label="Registrar todas las acciones de usuarios en el sistema de auditoría"
          checked={config.registrarAuditoria}
          onChange={() => handleCheckbox('registrarAuditoria')}
        />
        <p className="text-xs text-gray-500">
          Todas las acciones importantes serán registradas para revisión posterior.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1A2C56] hover:bg-[#23396A] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Notificaciones({ config, setConfig, onSave, onReset, saving }) {
  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const handleCheckbox = (field) => {
    setConfig({ ...config, [field]: !config[field] });
  };

  return (
    <form 
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1A2C56]">
            Configuración de Notificaciones
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Controla los avisos y alertas que se mostrarán a los administradores.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-[#1A2C56] flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Restaurar valores por defecto
        </button>
      </div>

      {/* Notificaciones Generales */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones Generales
        </h3>
        <div className="space-y-3">
          <Checkbox
            label="Notificar nuevos registros de usuarios"
            checked={config.notificarNuevosUsuarios}
            onChange={() => handleCheckbox('notificarNuevosUsuarios')}
          />
          <Checkbox
            label="Alertar errores del sistema"
            checked={config.notificarErroresSistema}
            onChange={() => handleCheckbox('notificarErroresSistema')}
          />
          <Checkbox
            label="Notificar eventos de votación"
            checked={config.notificarVotaciones}
            onChange={() => handleCheckbox('notificarVotaciones')}
          />
          <Checkbox
            label="Notificar resultados electorales"
            checked={config.notificarResultados}
            onChange={() => handleCheckbox('notificarResultados')}
          />
        </div>
      </div>

      {/* Métodos de Notificación */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold text-gray-800">Métodos de Notificación</h3>
        <div className="space-y-3">
          <Checkbox
            label="Enviar notificaciones por correo electrónico"
            checked={config.notificarPorEmail}
            onChange={() => handleCheckbox('notificarPorEmail')}
          />
          <Checkbox
            label="Mostrar notificaciones en el panel"
            checked={config.notificarEnPanel}
            onChange={() => handleCheckbox('notificarEnPanel')}
          />
          <Checkbox
            label="Mostrar alertas emergentes (toast notifications)"
            checked={config.alertasEmergentes}
            onChange={() => handleCheckbox('alertasEmergentes')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1A2C56] hover:bg-[#23396A] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* 🧩 COMPONENTES REUTILIZABLES */
function Input({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56] transition-all"
      />
    </div>
  );
}

function Select({ label, icon: Icon, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <select
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1A2C56] focus:border-[#1A2C56] transition-all"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#1A2C56] transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#1A2C56] focus:ring-[#1A2C56] rounded cursor-pointer"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
