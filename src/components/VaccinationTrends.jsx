import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { vaccineUptakeData } from "../data/DashboardData";

const VaccinationTrends = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">Vaccination Rate Trends</h3>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={vaccineUptakeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#0d9488"
          name="Vaccination Rate (%)"
        />
        <Line
          type="monotone"
          dataKey="totalVaccinated"
          stroke="#14b8a6"
          name="Total Vaccinated"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default VaccinationTrends;
