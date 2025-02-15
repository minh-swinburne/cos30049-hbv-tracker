import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EntityInfo from "../components/EntityInfo";
import SearchBar from "../components/SearchBar";
import TransactionGraph from "../components/TransactionGraph";
import TransactionTable from "../components/TransactionTable";
import { mockGraphData } from "../data/Data";

const vaccineUptakeData = [
  { year: 2018, rate: 51.1, totalVaccinated: 15000 },
  { year: 2019, rate: 54.2, totalVaccinated: 16500 },
  { year: 2020, rate: 58.6, totalVaccinated: 17800 },
  { year: 2021, rate: 61.7, totalVaccinated: 19200 },
  { year: 2022, rate: 75.4, totalVaccinated: 23500 },
  { year: 2023, rate: 77.1, totalVaccinated: 24100 },
];

const Home = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [graphData, ] = useState(mockGraphData);

  const handleSearch = (id) => {
    const entity = mockGraphData.nodes.find((node) => node.id === id);
    setSelectedEntity(entity);
  };

  const handleNodeClick = (node) => {
    setSelectedEntity(node);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
            HPV Vaccine Distribution Tracker
          </h1>
          <p className="text-xl mt-4 text-center text-blue-100 max-w-2xl mx-auto">
            Ensuring transparency & efficiency in HPV vaccine distribution
            through blockchain technology
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6">
        <section className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-900">
            Why Track HPV Vaccine Distribution?
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <p className="text-lg text-slate-700 leading-relaxed">
              The HPV vaccine is crucial in preventing cervical cancer and other
              HPV-related diseases. Effective tracking ensures timely delivery
              to healthcare facilities, preventing shortages and ensuring
              equitable distribution.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Our blockchain-powered tracking system provides real-time
              insights, enhancing transparency and reducing fraud.
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Enter wallet address or ID..."
          />
        </div>

        {selectedEntity && (
          <div className="mb-8">
            <EntityInfo entity={selectedEntity} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-6 text-blue-900">
              Vaccination Rate Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vaccineUptakeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#64748B" />
                <YAxis domain={[0, 100]} stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#0D9488"
                  strokeWidth={2}
                  name="Vaccination Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-6 text-blue-900">
              Total Vaccinated Individuals
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vaccineUptakeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalVaccinated"
                  fill="#2563EB"
                  name="Total Vaccinated"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <TransactionGraph data={graphData} onNodeClick={handleNodeClick} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <TransactionTable transactions={graphData?.edges ?? []} />
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white mt-12">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-blue-100">
            &copy; 2025 HPV Vaccine Tracker | Transparency & Efficiency in
            Distribution
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
