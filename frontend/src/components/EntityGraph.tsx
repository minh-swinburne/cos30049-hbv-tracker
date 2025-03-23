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
import apiClient from "../api";
import type { GraphData, GraphNode } from "../types/graph";

interface EntityGraphProps {
  onNodeClick: (node: GraphNode) => void;
}

const EntityGraph: FC<EntityGraphProps> = ({ onNodeClick }) => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const data = await apiClient.graph.getAllGraphData();
        setGraphData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
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

export default EntityGraph;
