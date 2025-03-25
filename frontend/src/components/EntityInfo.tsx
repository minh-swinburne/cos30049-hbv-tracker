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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";
import { FC } from "react";
import { toast } from "react-toastify";
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

  const blockchainExplorerUrl = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white h-full relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{entity.type} Information</h2>
        <IconButton
          onClick={handleClose}
          aria-label="close"
          className="text-gray-500 hover:text-gray-700"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {entity.type === "Patient" ? (
          <>
            <div>
              <p className="font-bold text-gray-600 text-lg">PID</p>
              <p className="">{(entity.data as GraphPatient).pid}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Wallet</p>
              <div className="flex items-center gap-2">
                <p className="font-mono break-all">
                  {(entity.data as GraphPatient).wallet ?? "-"}
                </p>
                {(entity.data as GraphPatient).wallet && (
                  <Tooltip title="Copy">
                    <IconButton
                      onClick={() =>
                        handleCopy((entity.data as GraphPatient).wallet!)
                      }
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Sex</p>
              <p className="">{(entity.data as GraphPatient).sex}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Date of Birth</p>
              <p className="">
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
              <p className="font-bold text-gray-600 text-lg">Ethnic</p>
              <p className="">{(entity.data as GraphPatient).ethnic}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Province</p>
              <p className="">{(entity.data as GraphPatient).regProvince}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">District</p>
              <p className="">{(entity.data as GraphPatient).regDistrict}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Commune</p>
              <p className="">{(entity.data as GraphPatient).regCommune}</p>
            </div>
          </>
        ) : entity.type === "HealthcareProvider" ? (
          <>
            <div>
              <p className="font-bold text-gray-600 text-lg">Name</p>
              <p className="">
                {(entity.data as GraphHealthcareProvider).name}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Type</p>
              <p className="">
                {(entity.data as GraphHealthcareProvider).type}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Wallet</p>
              <div className="flex items-center gap-2">
                <p className="font-mono break-all">
                  {(entity.data as GraphHealthcareProvider).wallet ?? "-"}
                </p>
                {(entity.data as GraphHealthcareProvider).wallet && (
                  <Tooltip title="Copy">
                    <IconButton
                      onClick={() =>
                        handleCopy(
                          (entity.data as GraphHealthcareProvider).wallet!
                        )
                      }
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="font-bold text-gray-600 text-lg">PID</p>
              <p className="">{(entity.data as GraphVaccination).pid}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Name</p>
              <p className="">{(entity.data as GraphVaccination).name}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Date</p>
              <p className="">
                {new Date((entity.data as GraphVaccination).date).toISOString()}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Type</p>
              <p className="">{(entity.data as GraphVaccination).type}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">Data Hash</p>
              <div className="flex items-center gap-2">
                <p className="font-mono break-all">
                  {(entity.data as GraphVaccination).dataHash ?? "-"}
                </p>
                {(entity.data as GraphVaccination).dataHash && (
                  <Tooltip title="Copy">
                    <IconButton
                      onClick={() =>
                        handleCopy((entity.data as GraphVaccination).dataHash!)
                      }
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">
                Transaction Hash
              </p>
              <div className="flex items-center gap-2">
                {(entity.data as GraphVaccination).txHash ? (
                  <a
                    href={`${blockchainExplorerUrl}/tx/${
                      (entity.data as GraphVaccination).txHash
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline break-all font-mono"
                  >
                    {(entity.data as GraphVaccination).txHash}
                  </a>
                ) : (
                  <p className="font-mono break-all">-</p>
                )}
                {(entity.data as GraphVaccination).txHash && (
                  <Tooltip title="Copy">
                    <IconButton
                      onClick={() =>
                        handleCopy((entity.data as GraphVaccination).txHash!)
                      }
                      size="small"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EntityInfo;
