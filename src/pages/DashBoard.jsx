import React from "react";
import NavigationBar from "../components/NavigationBar";
import StatCard from "../components/StatCard";
import VaccinationTrends from "../components/VaccinationTrends";
import DemographicDistribution from "../components/DemographicDistribution";
import PreventionEffectiveness from "../components/PreventionEffectiveness";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

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

export default Dashboard;
