// src/pages/panelAdmin/Analisis/components/PredictionChart.jsx

import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#DC2626", "#2563EB", "#EA580C", "#16A34A", "#9333EA", "#64748B"];

export default function PredictionChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Predicciones por Partido</h2>
          <p className="text-sm text-gray-500 mt-1">Proyección de resultados electorales</p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="w-full h-80 mb-6">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="partido" tick={{ fill: "#4B5563", fontSize: 12 }} />
            <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} />
            <Tooltip
              formatter={(v) => `${v}%`}
              labelFormatter={(label) => {
                const item = data.find((d) => d.partido === label);
                return item ? item.nombre : label;
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="prediccion" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de detalles */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partido
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Predicción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confianza
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.partido}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">{item.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.prediccion}%</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.confianza}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-10">{item.confianza}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.confianza >= 90
                        ? "bg-green-100 text-green-800"
                        : item.confianza >= 85
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.confianza >= 90
                      ? "Alta"
                      : item.confianza >= 85
                      ? "Media"
                      : "Baja"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}


