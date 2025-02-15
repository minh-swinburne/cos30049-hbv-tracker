import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { COLORS, demographicData } from "../data/DashboardData";

const DemographicDistribution = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">Age Group Distribution</h3>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={demographicData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          dataKey="percentage"
          label={({ name, value }) => `${name} (${value}%)`}
        >
          {demographicData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default DemographicDistribution;
