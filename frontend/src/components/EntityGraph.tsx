/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { Minus, Plus } from "lucide-react";
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
import type {
  GraphData,
  GraphHealthcareProvider,
  GraphLink,
  GraphNode,
  GraphPatient,
  GraphVaccination,
} from "../types/graph";

interface EntityGraphProps {
  onNodeClick: (node: GraphNode) => void;
  onGraphDataUpdate: (
    vaccinations: GraphVaccination[],
    links: GraphLink[]
  ) => void; // New prop
}

export interface EntityGraphMethods {
  fetchGraphData: () => void;
  setGraphData: (data: GraphData) => void;
  setIsLoading: (loading: boolean) => void;
}

const EntityGraph = forwardRef<EntityGraphMethods, EntityGraphProps>(
  ({ onNodeClick, onGraphDataUpdate }, ref) => {
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
        setGraphDataWithFilter(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    const setGraphDataWithFilter = (data: GraphData) => {
      setGraphData(data);

      // Filter vaccination nodes and their associated links
      const vaccinationNodes = data.nodes.filter(
        (node) => node.type === "Vaccination"
      ) as GraphNode[];
      const vaccinationLinks = data.links.filter((link) =>
        vaccinationNodes.some((node) => node.id === link.source)
      );

      // Send filtered data to parent
      onGraphDataUpdate(
        vaccinationNodes.map((node) => node.data as GraphVaccination),
        vaccinationLinks
      );
    };

    useImperativeHandle(ref, () => ({
      fetchGraphData,
      setGraphData: setGraphDataWithFilter, // Use the new filtered method
      setIsLoading,
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
        setGraphDataWithFilter(data);
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
        className="relative h-[600px] w-full overflow-hidden rounded-lg"
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
            nodeLabel={(node: GraphNode) =>
              `${node.type}<br/>(${
                node.type === "Patient"
                  ? (node.data as GraphPatient).pid
                  : node.type === "Vaccination"
                  ? (node.data as GraphVaccination).name
                  : (node.data as GraphHealthcareProvider).name
              })`
            }
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
            nodeCanvasObject={(node: GraphNode, ctx) => {
              // Draw a slightly larger node
              ctx.arc(node.x!, node.y!, 3, 0, 2 * Math.PI, false); // Increase radius to 3
            }}
            nodeCanvasObjectMode={() => "after"}
            linkLabel={(link: GraphLink) => link.type}
            linkDirectionalArrowLength={3}
            // linkDirectionalArrowRelPos={1}
            onNodeClick={(node: GraphNode) => handleNodeClick(node)}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-0 left-0 flex flex-col gap-2 text-blue-900 bg-white rounded-lg">
          <button
            onClick={zoomIn}
            className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute top-0 left-0 bg-white p-2 rounded-lg border">
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
