import { Mail, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-12 pb-8 mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Columna 1: Identidad */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">
            Sistema Electoral Digital Nacional
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Plataforma tecnológica orientada a garantizar procesos electorales
            transparentes, seguros y accesibles para todos los ciudadanos del Perú.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div className="text-sm">
          <h4 className="text-lg font-semibold text-white mb-3">Enlaces útiles</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/informacion#voto-digital" className="hover:text-white transition">
                Voto Digital
              </Link>
            </li>
            <li>
              <Link to="/votar" className="hover:text-white transition">
                Proceso de Votación
              </Link>
            </li>
            <li>
              <Link to="/resultados" className="hover:text-white transition">
                Resultados
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="text-sm">
          <h4 className="text-lg font-semibold text-white mb-3">Contacto</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={16} /> contacto@sedn.pe
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Lima, Perú
            </li>
            <li className="flex items-center gap-2">
              <Globe size={16} /> www.sedn.pe
            </li>
          </ul>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-700 mt-10 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Sistema Electoral Digital Nacional. Todos los derechos reservados.
          </p>

        </div>
      </div>
    </footer>
  );
}
