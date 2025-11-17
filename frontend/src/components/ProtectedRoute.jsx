import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth || auth !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const auth = localStorage.getItem("adminAuth");
  
  if (!auth || auth !== "true") {
    return null; // O mostrar un loader mientras redirige
  }

  return children;
}

