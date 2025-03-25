/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { FC } from "react";
import type {
  GraphHealthcareProvider,
  GraphNode,
  GraphPatient,
  GraphVaccination,
} from "../types/graph";

interface EntityInfoProps {
  entity: GraphNode | null;
  onClose: () => void; // Add onClose callback
}

const EntityInfo: FC<EntityInfoProps> = ({ entity, onClose }) => {
  if (!entity) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white mb-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold mb-0">{entity.type} Information</h2>
        <IconButton
          className="absolute top-0 right-0"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {entity.type === "Patient" ? (
          <>
            <div>
              <p className="text-gray-600">PID</p>
              <p className="font-bold text-lg">
                {(entity.data as GraphPatient).pid}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Wallet</p>
              <p className="font-mono text-lg">
                {(entity.data as GraphPatient).wallet ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sex</p>
              <p className="text-lg">{(entity.data as GraphPatient).sex}</p>
            </div>
            <div>
              <p className="text-gray-600">Date of Birth</p>
              <p className="text-lg">
                {new Date((entity.data as GraphPatient).dob).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Ethnic</p>
              <p className="text-lg">{(entity.data as GraphPatient).ethnic}</p>
            </div>
            <div>
              <p className="text-gray-600">Province</p>
              <p className="text-lg">
                {(entity.data as GraphPatient).reg_province}
              </p>
            </div>
            <div>
              <p className="text-gray-600">District</p>
              <p className="text-lg">
                {(entity.data as GraphPatient).reg_district}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Commune</p>
              <p className="text-lg">
                {(entity.data as GraphPatient).reg_commune}
              </p>
            </div>
          </>
        ) : entity.type === "HealthcareProvider" ? (
          <>
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-bold text-lg">
                {(entity.data as GraphHealthcareProvider).name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="text-lg">
                {(entity.data as GraphHealthcareProvider).type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Wallet</p>
              <p className="font-mono text-lg">
                {(entity.data as GraphHealthcareProvider).wallet ?? "-"}
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-gray-600">PID</p>
              <p className="font-mono text-lg">
                {(entity.data as GraphVaccination).pid}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-bold text-lg">
                {(entity.data as GraphVaccination).name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="text-lg">
                {new Date((entity.data as GraphVaccination).date).toISOString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="text-lg">
                {(entity.data as GraphVaccination).type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Data Hash</p>
              <p className="font-mono text-lg">
                {(entity.data as GraphVaccination).data_hash ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Transaction Hash</p>
              <p className="font-mono text-lg">
                {(entity.data as GraphVaccination).tx_hash ?? "-"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EntityInfo;
