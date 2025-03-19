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
import ForceGraph2D from "react-force-graph-2d";
import { runQuery } from "../data/neo4jConfig";

interface Node {
  id: string;
  type: string;
  color?: string;
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

interface TransactionGraphProps {
  onNodeClick: (node: Node) => void;
}

const TransactionGraph: FC<TransactionGraphProps> = ({ onNodeClick }) => {
  const [graphData, setGraphData] = useState<GraphData>({
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

        const nodes = nodesResult.map((record) => ({
          id: record.get("id"),
          type: record.get("type"),
          color: record.get("type") === "provider" ? "#4CAF50" : "#2196F3",
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
    <div className="h-[600px] w-full">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeColor={(node: any) => node.color}
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={(node: any) => onNodeClick(node)}
        backgroundColor="#ffffff"
        nodeRelSize={6}
        linkColor={() => "#999"}
        width={800}
        height={600}
      />
    </div>
  );
};

export default TransactionGraph;
