/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useState, useEffect } from "react";
import AppHeader from "../components/AppHeader";
import EntityInfo from "../components/EntityInfo";
import SearchBar from "../components/SearchBar";
import TransactionGraph from "../components/TransactionGraph";
import TransactionTable from "../components/TransactionTable";
import { runQuery } from "../data/neo4jConfig";

interface Node {
  id: string;
  type: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const Home: FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<Node | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [filteredTransactions, setFilteredTransactions] = useState<Link[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const nodesQuery = `
          MATCH (n:Address)
          RETURN n.id AS id, n.type AS type
        `;

        const linksQuery = `
          MATCH (a)-[r:TRANSACTION]->(b)
          RETURN a.id AS from, b.id AS to, r.value AS value
        `;

        const nodesResult = await runQuery(nodesQuery);
        const linksResult = await runQuery(linksQuery);

        const nodes = nodesResult.map((record) => ({
          id: record.get("id"),
          type: record.get("type"),
        }));

        const links = linksResult.map((record) => ({
          source: record.get("from"),
          target: record.get("to"),
          value: record.get("value"),
        }));

        setGraphData({ nodes, links });
      } catch (error) {
        console.error("Error fetching Neo4j data:", error);
      }
    };

    fetchGraphData();
  }, []);

  const handleSearch = (id: string): void => {
    const entity = graphData.nodes.find((node) => node.id === id);

    if (entity) {
      setSelectedEntity(entity);
      handleNodeClick(entity);
    } else {
      alert("Entity not found. Please check the ID and try again.");
    }
  };

  const handleNodeClick = (node: Node): void => {
    setSelectedEntity(node);

    const relatedTransactions = graphData.links.filter(
      (link) => link.source === node.id || link.target === node.id
    );

    setFilteredTransactions(relatedTransactions);
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
          <TransactionGraph onNodeClick={handleNodeClick} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          <TransactionTable transactions={filteredTransactions} />
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
