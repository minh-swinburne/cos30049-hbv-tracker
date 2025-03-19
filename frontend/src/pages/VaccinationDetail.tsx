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
import { useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { runQuery } from "../data/neo4jConfig";
import { QRCodeSVG } from "qrcode.react";

interface VaccinationDetail {
  id: string;
  date: string;
  type: string;
  patient: {
    id: string;
    region: string;
  };
  provider: {
    id: string;
    name: string;
  };
  blockchainHash?: string;
  verificationStatus: "Verified" | "Pending" | "Failed";
}

const VaccinationDetail: FC = () => {
  const { vaccinationId } = useParams<{ vaccinationId: string }>();
  const [vaccination, setVaccination] = useState<VaccinationDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaccinationData = async () => {
      try {
        const query = `
          MATCH (v:Vaccination {id: $vaccinationId})
          MATCH (p:Patient)-[:RECEIVED]->(v)
          MATCH (v)-[:ADMINISTERED_BY]->(h:HealthcareProvider)
          RETURN v.id as id, v.date as date, v.type as type,
                 p.id as patientId, p.region as patientRegion,
                 h.id as providerId, h.name as providerName,
                 v.blockchainHash as blockchainHash
        `;

        const result = await runQuery(query, { vaccinationId });

        if (result.length === 0) {
          setError("Vaccination record not found");
          return;
        }

        const record = result[0];
        setVaccination({
          id: record.get("id"),
          date: record.get("date"),
          type: record.get("type"),
          patient: {
            id: record.get("patientId"),
            region: record.get("patientRegion"),
          },
          provider: {
            id: record.get("providerId"),
            name: record.get("providerName"),
          },
          blockchainHash: record.get("blockchainHash"),
          verificationStatus: record.get("blockchainHash")
            ? "Verified"
            : "Pending",
        });
      } catch (err) {
        setError("Error fetching vaccination data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (vaccinationId) {
      fetchVaccinationData();
    }
  }, [vaccinationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !vaccination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">
          {error || "No vaccination data available"}
        </div>
      </div>
    );
  }

  const verificationStatusColor = {
    Verified: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Vaccination Record Details"
        description="View detailed information about a vaccination record"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Verification Status
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  verificationStatusColor[vaccination.verificationStatus]
                }`}
              >
                {vaccination.verificationStatus}
              </span>
            </div>
            {vaccination.blockchainHash && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Blockchain Transaction Hash
                </p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                  {vaccination.blockchainHash}
                </p>
              </div>
            )}
          </div>

          {/* Vaccination Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Vaccination Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Vaccination ID</p>
                <p className="text-lg font-medium">{vaccination.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-medium">
                  {new Date(vaccination.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-lg font-medium">{vaccination.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient Region</p>
                <p className="text-lg font-medium">
                  {vaccination.patient.region}
                </p>
              </div>
            </div>
          </div>

          {/* Healthcare Provider Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Healthcare Provider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Provider ID</p>
                <p className="text-lg font-medium">{vaccination.provider.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider Name</p>
                <p className="text-lg font-medium">
                  {vaccination.provider.name}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Verification QR Code
            </h2>
            <div className="flex justify-center">
              <QRCodeSVG
                value={JSON.stringify({
                  id: vaccination.id,
                  date: vaccination.date,
                  type: vaccination.type,
                  patientId: vaccination.patient.id,
                  providerId: vaccination.provider.id,
                  blockchainHash: vaccination.blockchainHash,
                })}
                size={200}
                level="H"
              />
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Scan this QR code to verify the vaccination record
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VaccinationDetail;
