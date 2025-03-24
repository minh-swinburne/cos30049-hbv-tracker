/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import EntityGraph from "../components/EntityGraph";
import EntityInfo from "../components/EntityInfo";
import SearchBar from "../components/SearchBar";
import type { GraphNode } from "../types/graph";
import type { VaccinationRecord } from "../types/vaccination";

const Home: FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<GraphNode | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);

  useEffect(() => {
    // Remove graphData fetching logic
  }, []);

  const handleSearch = (id: string): void => {
    // Remove graphData dependency
    alert("Search functionality is not implemented yet.");
  };

  const handleNodeClick = (node: GraphNode): void => {
    setSelectedEntity(node);
    // Remove relatedEntities logic
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader
        title="HBV Vaccine Distribution Tracker"
        description="Ensuring transparency & efficiency in HBV vaccine distribution through blockchain technology"
      />

      <main className="container mx-auto px-4 py-8 md:px-6">
        <section className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-900">
            Why Track HBV Vaccine Distribution?
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <p className="text-lg text-slate-700 leading-relaxed">
              The HBV vaccine is crucial in preventing cervical cancer and other
              HBV-related diseases. Effective tracking ensures timely delivery
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

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <EntityGraph onNodeClick={handleNodeClick} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          {/* <EntityTable entities={filteredEntities} /> */}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white mt-12">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-blue-100">
            &copy; 2025 HBV Vaccine Tracker | Transparency & Efficiency in
            Distribution
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
