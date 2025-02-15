import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { runQuery } from "../data/neo4jConfig";

const TransactionGraph = ({ onNodeClick }) => {
  const [fullGraphData, setFullGraphData] = useState({ nodes: [], links: [] });
  const [filteredGraphData, setFilteredGraphData] = useState({
    nodes: [],
    links: [],
  });

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

        // Convert results into graph format
        const nodes = nodesResult.map((record) => ({
          id: record.get("id"),
          type: record.get("type"),
        }));

        const links = linksResult.map((record) => ({
          source:
            nodes.find((n) => n.id === record.get("from")) ||
            record.get("from"),
          target:
            nodes.find((n) => n.id === record.get("to")) || record.get("to"),
          value: record.get("value"),
        }));

        setFullGraphData({ nodes, links });
        setFilteredGraphData({ nodes, links }); // Show full graph initially
      } catch (error) {
        console.error("Error fetching Neo4j data:", error);
      }
    };

    fetchGraphData();
  }, []);

  const handleNodeClick = (node) => {
    if (onNodeClick) {
      onNodeClick(node); // Send full node data to parent component
    }

    // Find links where the node is either source or target
    const adjacentLinks = fullGraphData.links.filter(
      (link) => link.source.id === node.id || link.target.id === node.id
    );

    // Collect IDs of connected nodes
    const adjacentNodeIds = new Set([node.id]);
    adjacentLinks.forEach((link) => {
      adjacentNodeIds.add(link.source.id || link.source);
      adjacentNodeIds.add(link.target.id || link.target);
    });

    // Filter only nodes that are connected
    const filteredNodes = fullGraphData.nodes.filter((n) =>
      adjacentNodeIds.has(n.id)
    );

    setFilteredGraphData({ nodes: filteredNodes, links: adjacentLinks });
  };

  return (
    <div className="h-[600px] border border-gray-300 rounded-lg">
      <ForceGraph2D
        graphData={filteredGraphData}
        nodeLabel={(node) => `${node.id}\n(${node.type})`}
        nodeColor={(node) => (node.type === "eoa" ? "#4299e1" : "#f56565")}
        linkLabel={(link) => `Value: ${link.value}`}
        onNodeClick={handleNodeClick}
        width={1439}
        height={600}
      />
    </div>
  );
};

export default TransactionGraph;
