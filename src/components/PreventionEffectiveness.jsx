import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { effectivenessData } from "../data/DashboardData";

const PreventionEffectiveness = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">Prevention Effectiveness</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={effectivenessData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="prevention" fill="#0d9488" name="Prevention Rate (%)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default PreventionEffectiveness;
