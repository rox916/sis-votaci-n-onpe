// src/pages/panelAdmin/Analisis/components/MetricsCard.jsx

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function MetricsCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center"
    >
      {Icon && <Icon className="w-6 h-6 text-[#1A2C56] mb-2" />}
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-lg font-semibold text-[#1A2C56] mt-1">{value}</p>
    </motion.div>
  );
}
