import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Info,
  Shield,
  Calendar,
  AlertCircle,
  ChevronDown,
  Search,
  Map,
} from "lucide-react";

// Mock data for visualizations
const vaccineUptakeData = [
  { year: 2018, rate: 51.1, totalVaccinated: 15000 },
  { year: 2019, rate: 54.2, totalVaccinated: 16500 },
  { year: 2020, rate: 58.6, totalVaccinated: 17800 },
  { year: 2021, rate: 61.7, totalVaccinated: 19200 },
  { year: 2022, rate: 75.4, totalVaccinated: 23500 },
  { year: 2023, rate: 77.1, totalVaccinated: 24100 },
];

const demographicData = [
  { age: "9-12", percentage: 45 },
  { age: "13-15", percentage: 30 },
  { age: "16-18", percentage: 15 },
  { age: "19-26", percentage: 10 },
];

const effectivenessData = [
  { type: "Cervical Cancer", prevention: 90 },
  { type: "Genital Warts", prevention: 95 },
  { type: "Anal Cancer", prevention: 92 },
  { type: "Throat Cancer", prevention: 88 },
];

const COLORS = ["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4"];

const NavigationBar = () => (
  <nav className="bg-teal-600 text-white p-4 sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">HPV Vaccine Analytics</h1>
      <div className="flex gap-6">
        <a href="#overview" className="hover:text-teal-200">
          Overview
        </a>
        <a href="#statistics" className="hover:text-teal-200">
          Statistics
        </a>
        <a href="#trends" className="hover:text-teal-200">
          Trends
        </a>
        <a href="#impact" className="hover:text-teal-200">
          Impact
        </a>
      </div>
    </div>
  </nav>
);

const StatCard = ({ title, value, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-teal-700 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-teal-600 mb-2">{value}</div>
    <p className="text-gray-600">{description}</p>
  </div>
);

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

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      {/* Hero Section */}
      <div className="bg-teal-50 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">
            HPV Vaccination Data Analytics
          </h1>
          <p className="text-xl text-teal-600 mb-8">
            Exploring vaccination trends, impact, and effectiveness through data
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Global Coverage"
            value="77.1%"
            description="Current HPV vaccination coverage rate worldwide"
          />
          <StatCard
            title="Lives Protected"
            value="4M+"
            description="Estimated number of lives protected through vaccination"
          />
          <StatCard
            title="Effectiveness"
            value="90%+"
            description="Prevention rate against HPV-related cancers"
          />
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <VaccinationTrends />
          <DemographicDistribution />
        </div>

        <div className="mb-12">
          <PreventionEffectiveness />
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Key Findings</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <AlertCircle
                className="text-teal-600 mr-3 mt-1 flex-shrink-0"
                size={20}
              />
              <span>
                Vaccination rates have shown consistent growth since 2018
              </span>
            </li>
            <li className="flex items-start">
              <AlertCircle
                className="text-teal-600 mr-3 mt-1 flex-shrink-0"
                size={20}
              />
              <span>Highest uptake observed in the 9-12 age group</span>
            </li>
            <li className="flex items-start">
              <AlertCircle
                className="text-teal-600 mr-3 mt-1 flex-shrink-0"
                size={20}
              />
              <span>
                Over 90% effectiveness in preventing multiple types of cancer
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-8 mt-12">
        <div className="container mx-auto text-center">
          <p>© 2024 HPV Vaccine Analytics. Data sourced from WHO and CDC.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
