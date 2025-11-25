import React, { useState } from "react";
import { getLogoPartido, getPartidoColor, getPartidoSimbolo } from "../utils/candidatosUtils";
import { LOGOS_PARTIDOS } from "../../../../constants/electoralConstants";

// Componente para mostrar el símbolo del partido (logo o iniciales)
export default function SimboloPartido({ partido }) {
  const [imageError, setImageError] = useState(false);
  // Primero intentar con logos locales, luego con LOGOS_PARTIDOS
  const logoUrl = getLogoPartido(partido) || LOGOS_PARTIDOS[partido];

  if (!logoUrl || imageError) {
    return (
      <div className={`w-16 h-16 ${getPartidoColor(partido)} rounded-lg flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-lg">
          {getPartidoSimbolo(partido)}
        </span>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md border-2 border-gray-200 bg-white flex items-center justify-center">
      <img
        src={logoUrl}
        alt={`Logo ${partido}`}
        className="w-full h-full object-contain p-1"
        onError={() => setImageError(true)}
      />
    </div>
  );
}


