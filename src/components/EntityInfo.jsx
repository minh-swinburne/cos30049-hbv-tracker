import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

const EntityInfo = ({ entity, onClose }) => {
  if (!entity) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white mb-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold mb-0">Entity Information</h2>
        <IconButton
          className="absolute top-0 right-0"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
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

EntityInfo.displayName = "EntityInfo";
EntityInfo.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    stock: PropTypes.number,
  }),
  onClose: PropTypes.func,
};

export default EntityInfo;
