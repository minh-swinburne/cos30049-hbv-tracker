/*
Authors: 
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { runQuery } from "../data/neo4jConfig";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface VaccinationRecord {
  id: string;
  date: string;
  type: string;
  patientId: string;
  patientRegion: string;
}

interface DailyStats {
  date: string;
  count: number;
}

interface ProviderDashboardProps {
  providerId?: string;
}

const ProviderDashboard: FC<ProviderDashboardProps> = ({
  providerId: propProviderId,
}) => {
  const { providerId: urlProviderId } = useParams<{ providerId: string }>();
  const activeProviderId = propProviderId || urlProviderId;

  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for new vaccination
  const [newVaccination, setNewVaccination] = useState({
    patientId: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const query = `
          MATCH (h:HealthcareProvider {id: $providerId})
          MATCH (v:Vaccination)-[:ADMINISTERED_BY]->(h)
          MATCH (p:Patient)-[:RECEIVED]->(v)
          RETURN v.id as id, v.date as date, v.type as type,
                 p.id as patientId, p.region as patientRegion
          ORDER BY v.date DESC
        `;

        const result = await runQuery(query, { providerId: activeProviderId });

        const records = result.map((record) => ({
          id: record.get("id"),
          date: record.get("date"),
          type: record.get("type"),
          patientId: record.get("patientId"),
          patientRegion: record.get("patientRegion"),
        }));

        setVaccinations(records);

        // Calculate daily statistics
        const stats = records.reduce((acc: { [key: string]: number }, curr) => {
          const date = new Date(curr.date).toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const dailyStatsData = Object.entries(stats).map(([date, count]) => ({
          date,
          count,
        }));

        setDailyStats(
          dailyStatsData.sort((a, b) => a.date.localeCompare(b.date))
        );
      } catch (err) {
        setError("Error fetching provider data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (activeProviderId) {
      fetchProviderData();
    }
  }, [activeProviderId]);

  const handleNewVaccinationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const query = `
        MATCH (h:HealthcareProvider {id: $providerId})
        MATCH (p:Patient {id: $patientId})
        CREATE (v:Vaccination {
          id: randomUUID(),
          date: $date,
          type: $type
        })
        CREATE (p)-[:RECEIVED]->(v)
        CREATE (v)-[:ADMINISTERED_BY]->(h)
        RETURN v.id as id, v.date as date, v.type as type,
               p.id as patientId, p.region as patientRegion
      `;

      const result = await runQuery(query, {
        providerId: activeProviderId,
        ...newVaccination,
      });

      const newRecord = result[0];
      const vaccinationRecord = {
        id: newRecord.get("id"),
        date: newRecord.get("date"),
        type: newRecord.get("type"),
        patientId: newRecord.get("patientId"),
        patientRegion: newRecord.get("patientRegion"),
      };

      setVaccinations([vaccinationRecord, ...vaccinations]);
      setNewVaccination({
        patientId: "",
        type: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError("Error registering new vaccination");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Healthcare Provider Dashboard"
        description="Manage vaccinations and view statistics"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Register New Vaccination */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Register New Vaccination
          </h2>
          <form onSubmit={handleNewVaccinationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={newVaccination.patientId}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      patientId: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vaccine Type
                </label>
                <input
                  type="text"
                  value={newVaccination.type}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      type: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={newVaccination.date}
                  onChange={(e) =>
                    setNewVaccination({
                      ...newVaccination,
                      date: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register Vaccination
              </button>
            </div>
          </form>
        </div>

        {/* Daily Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Daily Statistics
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Vaccinations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Vaccinations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Vaccinations
          </h2>
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
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Region
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaccinations.map((vaccination) => (
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
                      {vaccination.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vaccination.patientRegion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
