/*
Authors:
- Le Luu Phuoc Thinh
- Nguyen Thi Thanh Minh
- Nguyen Quy Hung
- Vo Thi Kim Huyen
- Dinh Danh Nam

Group 3 - COS30049
*/

import { FC } from "react";
import type { VaccinationRecord } from "../types/vaccination";

interface EntityTableProps {
  records: VaccinationRecord[];
}

const EntityTable: FC<EntityTableProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div className="text-center p-4 text-slate-500">
        No data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              PID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Vaccine Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Vaccine Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Vaccine Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Vaccine Place
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Data Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Transaction Hash
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {records.map((record, index) => (
            <tr key={index} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.pid || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.vacname || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.vactype || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.vacdate
                  ? new Date(record.vacdate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.vacplace || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.data_hash || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                {record.tx_hash || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntityTable;
