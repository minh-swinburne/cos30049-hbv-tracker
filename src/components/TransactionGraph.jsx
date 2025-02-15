import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

const TransactionGraph = ({ data, onNodeClick }) => {
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge")?.strength(-400);
    }
  }, []);

  if (!data || !data.nodes || !data.edges) {
    return <p>No transaction data available.</p>;
  }

  const handleNodeClick = (node) => {
    if (onNodeClick && typeof onNodeClick === "function") {
      const cleanNode = {
        id: node.id || "",
        name: node.name || "",
        type: node.type || "",
        stock: node.stock || "",
      };
      onNodeClick(cleanNode);
    }
  };

  return (
    <div className="h-[600px] border border-gray-300 rounded-lg">
      <ForceGraph2D
        ref={graphRef}
        graphData={{
          nodes: data.nodes || [],
          links: data.edges || [],
        }}
        nodeLabel={(node) => `${node.id || ""}\n${node.stock || ""}`}
        nodeColor={() => "#4299e1"}
        linkLabel={(link) => `${link.quantity || ""}`}
        onNodeClick={handleNodeClick}
        width={1439}
        height={600}
      />
    </div>
  );
};

export default TransactionGraph;
