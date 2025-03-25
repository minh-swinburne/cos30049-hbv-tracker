/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import apiClient from "../api";
import { useStore } from "../store";
import type { GraphData, GraphLink, GraphNode } from "../types/graph";

interface EntityGraphProps {
  onNodeClick: (node: GraphNode) => void;
}

export interface EntityGraphMethods {
  fetchGraphData: () => void;
  setGraphData: (data: GraphData) => void;
}

const EntityGraph = forwardRef<EntityGraphMethods, EntityGraphProps>(
  ({ onNodeClick }, ref) => {
    const [graphData, setGraphData] = useState<GraphData>({
      nodes: [],
      links: [],
    });
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const graphContainerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<
      ForceGraphMethods<GraphNode, GraphLink> | undefined
    >(undefined);
    const { user } = useStore(); // Access the user from the store
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const fetchGraphData = async () => {
      if (!user) {
        setGraphData({ nodes: [], links: [] }); // Clear graph data if user is not authenticated
        return;
      }

      setIsLoading(true); // Set loading to true
      try {
        const data = await apiClient.graph.getNodeHop(
          undefined,
          undefined,
          user.sub
        );
        setGraphData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    useImperativeHandle(ref, () => ({
      fetchGraphData,
      setGraphData,
    }));

    useEffect(() => {
      fetchGraphData();
    }, [user]);

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

    const handleNodeClick = async (node: GraphNode) => {
      onNodeClick(node);

      setIsLoading(true); // Set loading to true
      try {
        const data = await apiClient.graph.getNodeHop(
          node.id,
          node.type,
          undefined
        );
        setGraphData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setIsLoading(false); // Set loading to false
      }
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
        {!user ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Please log in to view the graph.
          </div>
        ) : isLoading ? ( // Show spinner while loading
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="flex flex-col items-center">
              <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
              <p>Loading...</p>
            </div>
          </div>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel={(node: GraphNode) => `${node.id}\n(${node.type})`}
            nodeColor={(node: GraphNode) => {
              switch (node.type) {
                case "Patient":
                  return "#3b82f6"; // Blue
                case "HealthcareProvider":
                  return "#f56565"; // Red
                case "Vaccination":
                  return "#facc15"; // Yellow
                default:
                  return "#a0aec0"; // Gray for unknown types
              }
            }}
            linkLabel={(link: GraphLink) => `Value: ${link.type}`}
            onNodeClick={(node: GraphNode) => handleNodeClick(node)}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}

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
            <span>Patient</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Healthcare Provider</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span>Vaccination</span>
          </div>
        </div>
      </div>
    );
  }
);

export default EntityGraph;
