// src/pages/panelAdmin/Analisis/components/ProgressCard.jsx

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, AlertCircle, Info } from "lucide-react";

const colorMap = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    progress: "bg-blue-600",
  },
  green: {
    bg: "from-green-500 to-green-600",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    progress: "bg-green-600",
  },
  orange: {
    bg: "from-orange-500 to-orange-600",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    progress: "bg-orange-600",
  },
  purple: {
    bg: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    progress: "bg-purple-600",
  },
};

export default function ProgressCard({ title, value, total, percentage, color = "blue" }) {
  const colors = colorMap[color] || colorMap.blue;
  const getIcon = () => {
    if (percentage >= 90) return CheckCircle;
    if (percentage >= 70) return TrendingUp;
    if (percentage >= 50) return Info;
    return AlertCircle;
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colors.bg} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"
      />
      <div className="relative p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium opacity-90">Análisis</span>
        </div>
        <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
        <p className="text-3xl font-bold mb-2">{value}</p>
        {total && (
          <p className="text-xs opacity-80 mb-3">de {total}</p>
        )}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs opacity-80">Progreso</span>
            <span className="text-xs font-semibold">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-2 rounded-full ${colors.progress}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

