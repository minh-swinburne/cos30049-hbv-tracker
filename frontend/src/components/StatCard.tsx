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

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2 text-blue-900">{title}</h3>
      <p className="text-3xl font-bold mb-2 text-blue-800">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default StatCard;
