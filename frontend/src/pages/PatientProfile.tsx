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

interface Vaccination {
  id: string;
  date: string;
  type: string;
  provider: {
    id: string;
    name: string;
  };
}

interface Patient {
  id: string;
  region: string;
  vaccinations: Vaccination[];
}

const PatientProfile: FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const query = `
          MATCH (p:Patient {id: $patientId})
          OPTIONAL MATCH (p)-[r:RECEIVED]->(v:Vaccination)
          OPTIONAL MATCH (v)-[a:ADMINISTERED_BY]->(h:HealthcareProvider)
          RETURN p.id as id, p.region as region,
                 collect({
                   id: v.id,
                   date: v.date,
                   type: v.type,
                   provider: {
                     id: h.id,
                     name: h.name
                   }
                 }) as vaccinations
        `;

        const result = await runQuery(query, { patientId });

        if (result.length === 0) {
          setError("Patient not found");
          return;
        }

        const record = result[0];
        setPatient({
          id: record.get("id"),
          region: record.get("region"),
          vaccinations: record.get("vaccinations"),
        });
      } catch (err) {
        setError("Error fetching patient data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">
          {error || "No patient data available"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Patient Profile"
        description="View vaccination history and details"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Patient ID</p>
              <p className="text-lg font-medium">{patient.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Region</p>
              <p className="text-lg font-medium">{patient.region}</p>
            </div>
          </div>
        </div>

        {/* Vaccination History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Vaccination History
          </h2>
          {patient.vaccinations.length === 0 ? (
            <p className="text-gray-600">No vaccination records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vaccination ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Healthcare Provider
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.vaccinations.map((vaccination) => (
                    <tr key={vaccination.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vaccination.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(vaccination.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaccination.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaccination.provider.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
