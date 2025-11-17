/**
 * Componente principal de la aplicación
 * Define todas las rutas públicas y de administración
 * Utiliza React Router para la navegación entre páginas
 */
import { Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Votar from "./pages/votar/Votar";
// import VotoDigital from "./pages/VotoDigital"; // <-- 1. ASEGÚRATE DE IMPORTAR ESTA
import Resultados from "./pages/Resultados";
import Informacion from "./pages/Informacion";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/panelAdmin/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

// === 1. IMPORTA AMBOS COMPONENTES ===
import VotoDigital from "./pages/VotoDigital"; 
import Verificacion from "./pages/votar/Verificacion";

/**
 * Layout para las páginas públicas
 * Incluye Navbar y Footer en todas las páginas públicas
 */
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow pt-16">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTop />
      <Routes>
        {/* Rutas de administración */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Rutas públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="votar" element={<Votar />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="informacion" element={<Informacion />} />
          
          {/* === 2. ASEGÚRATE DE TENER AMBAS RUTAS === */}
          <Route path="voto-digital" element={<VotoDigital />} /> {/* Esta es la que acabamos de agregar de vuelta */}
          <Route path="verificacion" element={<Verificacion />} /> {/* Esta es la del mapa */}

        </Route>
        
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </div>
  );
}

export default App;