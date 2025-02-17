import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BehaviouralAnalytics = () => {
  const [behaviorData, setBehaviorData] = useState([]);

  useEffect(() => {
    const data = [
      { name: "John", attendance: 95, performance: 88, overtime: 5, taskCompletion: 92, satisfaction: 8.5 },
      { name: "Sarah", attendance: 80, performance: 75, overtime: 10, taskCompletion: 80, satisfaction: 7 },
      { name: "Mike", attendance: 92, performance: 85, overtime: 7, taskCompletion: 89, satisfaction: 8 },
      { name: "Emma", attendance: 98, performance: 90, overtime: 3, taskCompletion: 95, satisfaction: 9 },
    ];
    setBehaviorData(data);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Behavioral Analytics</h2>

      {/* Bar Chart */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={behaviorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#4CAF50" name="Attendance %" />
            <Bar dataKey="performance" fill="#2196F3" name="Performance Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Table */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Employee</th>
            <th className="px-4 py-2">Attendance (%)</th>
            <th className="px-4 py-2">Performance Score</th>
            <th className="px-4 py-2">Overtime (Hrs)</th>
            <th className="px-4 py-2">Task Completion (%)</th>
            <th className="px-4 py-2">Satisfaction Score</th>
          </tr>
        </thead>
        <tbody>
          {behaviorData.map((emp, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{emp.name}</td>
              <td className="px-4 py-2">{emp.attendance}%</td>
              <td className="px-4 py-2">{emp.performance}</td>
              <td className="px-4 py-2">{emp.overtime}</td>
              <td className="px-4 py-2">
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${emp.taskCompletion}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${emp.satisfaction * 10}%` }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BehaviouralAnalytics;
