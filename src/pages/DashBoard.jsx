import AppHeader from "../components/AppHeader";
import StatCard from "../components/StatCard";
import {
  Cell,
  Pie,
  PieChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  vaccineUptakeData,
  COLORS,
  demographicData,
  effectivenessData,
} from "../data/DashboardData";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="HBV Vaccine Distribution Analytics"
        description="A comprehensive dashboard to track HBV vaccination trends"
      />

      {/* Main Content */}
      <div className="container mx-auto py-12">
        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Global Coverage"
            value="77.1%"
            description="Current HBV vaccination coverage rate worldwide"
          />
          <StatCard
            title="Lives Protected"
            value="4M+"
            description="Estimated number of lives protected through vaccination"
          />
          <StatCard
            title="Effectiveness"
            value="90%+"
            description="Prevention rate against HBV-related cancers"
          />
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Vaccination Rate Trends
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={vaccineUptakeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" domain={[0, 100]} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rate"
                  stroke="#1c398e"
                  name="Vaccination Rate (%)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalVaccinated"
                  stroke="#51a2ff"
                  name="Total Vaccinated"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Age Group Distribution
            </h3>
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
                  label={({ age, percentage }) => `${age} (${percentage}%)`}
                >
                  {demographicData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Prevention Effectiveness
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={effectivenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="prevention"
                  fill="#2b7fff"
                  name="Prevention Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-6 text-blue-900">
              Total Vaccinated Individuals
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={vaccineUptakeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalVaccinated"
                  fill="#1c398e"
                  name="Total Vaccinated"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>© 2024 HBV Vaccine Analytics. Data sourced from WHO and CDC.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
