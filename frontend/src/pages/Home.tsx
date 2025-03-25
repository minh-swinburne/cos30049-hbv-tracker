/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useEffect, useRef, useState } from "react";
import apiClient from "../api";
import AppHeader from "../components/AppHeader";
import type { EntityGraphMethods } from "../components/EntityGraph";
import EntityGraph from "../components/EntityGraph";
import EntityInfo from "../components/EntityInfo";
import EntityTable from "../components/EntityTable";
import SearchBar from "../components/SearchBar";
import { useStore } from "../store";
import type { GraphLink, GraphNode, GraphVaccination } from "../types/graph";
import type { VaccinationRecord } from "../types/vaccination";

const Home: FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<GraphNode | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const { user } = useStore(); // Access the user from the store
  const entityGraphRef = useRef<EntityGraphMethods | null>(null);

  useEffect(() => {
    // Remove graphData fetching logic
  }, []);

  const handleSearch = async (query: string) => {
    entityGraphRef.current?.setIsLoading(true); // Set loading to true
    const graphData = await apiClient.graph.searchNodes(query);
    if (graphData) {
      entityGraphRef.current?.setGraphData(graphData);
      if (graphData.root) {
        setSelectedEntity(graphData.root);
      }
    }
    entityGraphRef.current?.setIsLoading(false); // Set loading to false
  };

  const handleNodeClick = (node: GraphNode): void => {
    setSelectedEntity(node);
  };

  const handleEntityClose = (): void => {
    setSelectedEntity(null); // Reset selected entity
    if (user) {
      entityGraphRef.current?.fetchGraphData(); // Reset the graph
    }
  };

  const handleVaccinationDataUpdate = (
    vaccinations: GraphVaccination[],
    links: GraphLink[]
  ) => {
    const mappedVaccinations = vaccinations.map((v) => ({
      pid: v.pid,
      vacname: v.name,
      vactype: v.type,
      vacdate: v.date,
      vacplace:
        links.find((link) => link.source === `${v.pid}_${v.name}_${v.date}`)
          ?.target || "",
      data_hash: v.data_hash,
      tx_hash: v.tx_hash,
    }));
    setVaccinations(mappedVaccinations);
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
            placeholder="Enter wallet address or transaction hash..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex-1 min-w-0">
            <EntityGraph
              ref={entityGraphRef}
              onNodeClick={handleNodeClick}
              onGraphDataUpdate={handleVaccinationDataUpdate} // Pass the new callback
            />
          </div>
          {selectedEntity && (
            <div className="w-full md:w-1/3 flex-shrink-0">
              <EntityInfo entity={selectedEntity} onClose={handleEntityClose} />
            </div>
          )}
        </div>
        {/* Vaccination Records Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Vaccination Records</h2>
          <EntityTable records={vaccinations} />
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
