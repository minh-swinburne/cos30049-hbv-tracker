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
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
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
  const [filteredGraphData, setFilteredGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const data = await apiClient.graph.getAllGraphData();
        setGraphData(data);
        setFilteredGraphData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (graphContainerRef.current) {
        setDimensions({
          width: graphContainerRef.current.offsetWidth,
          height: graphContainerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = (node: GraphNode) => {
    onNodeClick(node);

    const adjacentLinks = graphData.links.filter(
      (link) => link.source === node.id || link.target === node.id
    );

    const adjacentNodeIds = new Set([node.id]);
    adjacentLinks.forEach((link) => {
      adjacentNodeIds.add(link.source as string);
      adjacentNodeIds.add(link.target as string);
    });

    const filteredNodes = graphData.nodes.filter((n) =>
      adjacentNodeIds.has(n.id)
    );
    setFilteredGraphData({ nodes: filteredNodes, links: adjacentLinks });
  };

  const zoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.2);
    }
  };

  const zoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 0.8);
    }
  };

  return (
    <div
      ref={graphContainerRef}
      className="relative h-[600px] border border-gray-300 rounded-lg"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={filteredGraphData}
        nodeLabel={(node: any) => `${node.id}\n(${node.type})`}
        nodeColor={(node: any) => (node.type === "eoa" ? "#4299e1" : "#f56565")}
        linkLabel={(link: any) => `Value: ${link.value}`}
        onNodeClick={(node: any) => handleNodeClick(node)}
        width={dimensions.width}
        height={dimensions.height}
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-2 bg-white p-2 rounded-lg shadow">
        <button
          onClick={zoomIn}
          className="p-2 bg-sky-100 hover:bg-sky-200 cursor-pointer text-white rounded"
        >
          ➕
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-sky-100 hover:bg-sky-200 cursor-pointer text-white rounded"
        >
          ➖
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-2 left-2 bg-white p-2 rounded-lg shadow">
        <p className="text-sm font-bold">Legend</p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>EOA (Externally Owned Address)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Contract Address</span>
        </div>
      </div>
    </div>
  );
};

export default EntityGraph;
