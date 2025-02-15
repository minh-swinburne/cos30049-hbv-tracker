import { useState } from "react";
import AppHeader from "../components/AppHeader";
import EntityInfo from "../components/EntityInfo";
import SearchBar from "../components/SearchBar";
import TransactionGraph from "../components/TransactionGraph";
import TransactionTable from "../components/TransactionTable";
import { mockGraphData } from "../data/Data";

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
      <AppHeader
        title="HPV Vaccine Distribution Tracker"
        description="Ensuring transparency & efficiency in HPV vaccine distribution through blockchain technology"
      />

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
