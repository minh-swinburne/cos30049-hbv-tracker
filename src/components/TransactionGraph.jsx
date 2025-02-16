import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import ForceGraph2D from "react-force-graph-2d";

const TransactionGraph = forwardRef(({ graphData, onNodeClick }, ref) => {
  const [filteredGraphData, setFilteredGraphData] = useState(graphData);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const graphContainerRef = useRef(null);
  const graphRef = useRef(null);

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

  useEffect(() => {
    setFilteredGraphData(graphData);
  }, [graphData]);

  useImperativeHandle(ref, () => ({
    reset: () => setFilteredGraphData(graphData),
  }));

  const handleNodeClick = (node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }

    // Filter transactions where the clicked node is either source or target
    const adjacentLinks = graphData.links.filter(
      (link) => link.source.id === node.id || link.target.id === node.id
    );
    // console.log(node);
    // console.log(graphData.links);

    // Collect IDs of connected nodes
    const adjacentNodeIds = new Set([node.id]);
    adjacentLinks.forEach((link) => {
      adjacentNodeIds.add(link.source.id);
      adjacentNodeIds.add(link.target.id);
    });

    // Filter only nodes that are connected
    const filteredNodes = graphData.nodes.filter((n) =>
      adjacentNodeIds.has(n.id)
    );

    setFilteredGraphData({ nodes: filteredNodes, links: adjacentLinks });
  };

  const zoomIn = () => {
    if (graphRef.current) {
      setZoom(zoom * 1.2);
      graphRef.current.zoom(zoom);
    }
  };

  const zoomOut = () => {
    if (graphRef.current) {
      setZoom(zoom * 0.8);
      graphRef.current.zoom(zoom);
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
        nodeLabel={(node) => `${node.id}\n(${node.type})`}
        nodeColor={(node) => (node.type === "eoa" ? "#4299e1" : "#f56565")}
        linkLabel={(link) => `Value: ${link.value}`}
        onNodeClick={handleNodeClick}
        width={dimensions.width}
        height={dimensions.height}
        zoom={zoom}
        onZoomChange={(newZoom) => setZoom(newZoom)}
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
});

TransactionGraph.displayName = "TransactionGraph";
TransactionGraph.propTypes = {
  graphData: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string,
      })
    ).isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
          .isRequired,
        target: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
          .isRequired,
        value: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  onNodeClick: PropTypes.func.isRequired,
};

export default TransactionGraph;
