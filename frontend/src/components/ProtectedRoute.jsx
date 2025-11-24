import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarioAutenticado } from "../utils/authUtils";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth || auth !== "true") {
      navigate("/admin/login");
      return;
    }

    // Verificar que el usuario esté activo
    const usuario = obtenerUsuarioAutenticado();
    if (!usuario || usuario.estado !== "Activo") {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminRol");
      localStorage.removeItem("adminPermisos");
      navigate("/admin/login");
    }
  }, [navigate]);

  const auth = localStorage.getItem("adminAuth");
  const usuario = obtenerUsuarioAutenticado();
  
  if (!auth || auth !== "true" || !usuario || usuario.estado !== "Activo") {
    return null; // O mostrar un loader mientras redirige
  }

  return children;
}

