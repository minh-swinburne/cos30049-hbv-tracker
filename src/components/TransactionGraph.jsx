import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { runQuery } from "../data/neo4jConfig";

const TransactionGraph = ({ onNodeClick }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

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

  return (
    <div className="h-[600px] border border-gray-300 rounded-lg">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node) => `${node.id}\n(${node.type})`}
        nodeColor={(node) => (node.type === "eoa" ? "#4299e1" : "#f56565")}
        linkLabel={(link) => `Value: ${link.value}`}
        onNodeClick={onNodeClick}
        width={1200}
        height={600}
      />
    </div>
  );
};

export default TransactionGraph;
