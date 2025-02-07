import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BehaviouralAnalytics = () => {
  const [behaviorData, setBehaviorData] = useState([]);

  useEffect(() => {
    // Sample Employee Behavioral Data
    const data = [
      { name: "John", attendance: 95, performance: 88, overtime: 5 },
      { name: "Sarah", attendance: 80, performance: 75, overtime: 10 },
      { name: "Mike", attendance: 92, performance: 85, overtime: 7 },
      { name: "Emma", attendance: 98, performance: 90, overtime: 3 },
      { name: "David", attendance: 78, performance: 70, overtime: 12 },
    ];
    
    setBehaviorData(data);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 relative z-10">

      <h2 className="text-xl font-semibold mt-4">Employee Behavioral Insights</h2>
      
      {/* Bar Chart for Attendance vs. Performance */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={behaviorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendance" fill="#82ca9d" name="Attendance %" />
            <Bar dataKey="performance" fill="#8884d8" name="Performance Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Behavior Table */}
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Employee</th>
            <th className="border border-gray-300 px-4 py-2">Attendance (%)</th>
            <th className="border border-gray-300 px-4 py-2">Performance Score</th>
            <th className="border border-gray-300 px-4 py-2">Overtime (Hours)</th>
          </tr>
        </thead>
        <tbody>
          {behaviorData.map((emp, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{emp.name}</td>
              <td className="border border-gray-300 px-4 py-2">{emp.attendance}%</td>
              <td className="border border-gray-300 px-4 py-2">{emp.performance}</td>
              <td className="border border-gray-300 px-4 py-2 text-red-600 font-bold">{emp.overtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BehaviouralAnalytics;
