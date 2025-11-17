import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout principal
import AdminLayout from './Sidebar/AdminLayout';

// Vistas organizadas por categorías
// Principal
import Dashboard from './Dashboard/Dashboard';

// Gestión de Usuarios
import Usuarios from './Usuarios/Usuarios';
import RolesyPermisos from './RolesyPermisos/RolesyPermisos';

// Gestión Electoral
import Candidatos from './Candidatos/Candidatos';
import PadronElectoral from './PadronElectoral/PadronElectoral';
import Centros from './Centros/Centros';

// Resultados y Análisis
import Resultados from './Resultados/Resultados';
import Analisis from './Analisis/Analisis';
import Reportes from './Reportes/Reportes';

// Sistema
import Configuracion from './Configuracion/Configuracion';
import Auditoria from './Auditoria/Auditoria';

export default function Admin() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Principal */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Gestión de Usuarios */}
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="roles" element={<RolesyPermisos />} />

        {/* Gestión Electoral */}
        <Route path="candidatos" element={<Candidatos />} />
        <Route path="padron-electoral" element={<PadronElectoral />} />
        <Route path="centros" element={<Centros />} />

        {/* Resultados y Análisis */}
        <Route path="resultados" element={<Resultados />} />
        <Route path="analisis" element={<Analisis />} />
        <Route path="reportes" element={<Reportes />} />

        {/* Sistema */}
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="auditoria" element={<Auditoria />} />
      </Route>
    </Routes>
  );
}