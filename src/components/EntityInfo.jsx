import React from "react";

const EntityInfo = ({ entity }) => {
  if (!entity) return null;

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white mb-6">
      <h2 className="text-2xl font-bold mb-4">Entity Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">ID</p>
          <p className="font-mono text-lg">{String(entity.id || "")}</p>
        </div>
        <div>
          <p className="text-gray-600">Name</p>
          <p className="font-bold text-lg">{String(entity.name || "")}</p>
        </div>
        <div>
          <p className="text-gray-600">Type</p>
          <p className="text-lg">{String(entity.type || "")}</p>
        </div>
        <div>
          <p className="text-gray-600">Stock</p>
          <p className="text-lg font-bold">{String(entity.stock || "")}</p>
        </div>
      </div>
    </div>
  );
};

export default EntityInfo;
