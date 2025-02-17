import React, { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AnalyticsDashboard = () => {
  const [behaviorData, setBehaviorData] = useState([]);
  const [attritionRiskPredictions, setAttritionRiskPredictions] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const data = [
      { name: "John", attendance: 95, performance: 88, overtime: 5, taskCompletion: 92, satisfaction: 8.5, absent: 0, compensationScore: 7.5, benefitsScore: 8, incentivesScore: 7 },
      { name: "Sarah", attendance: 80, performance: 75, overtime: 10, taskCompletion: 80, satisfaction: 7, absent: 2, compensationScore: 6, benefitsScore: 6.5, incentivesScore: 6 },
      { name: "Mike", attendance: 92, performance: 85, overtime: 7, taskCompletion: 89, satisfaction: 8, absent: 1, compensationScore: 8, benefitsScore: 8.5, incentivesScore: 7.5 },
      { name: "Emma", attendance: 98, performance: 90, overtime: 3, taskCompletion: 95, satisfaction: 9, absent: 0, compensationScore: 9, benefitsScore: 9.5, incentivesScore: 9 },
      { name: "David", attendance: 20, performance: 40, overtime: 12, taskCompletion: 30, satisfaction: 1, absent: 3, compensationScore: 1, benefitsScore: 1, incentivesScore: 1 },
    ];
    setBehaviorData(data);
  }, []);

  useEffect(() => {
    const attritionRiskModel = async () => {
      const xs = behaviorData.map(emp => [
        emp.attendance,
        emp.performance,
        emp.satisfaction,
        emp.overtime,
        emp.taskCompletion,
        emp.absent,
        emp.compensationScore,
        emp.benefitsScore,
        emp.incentivesScore,
      ]);

      const ys = behaviorData.map(emp => {
        let riskScore = 0;

        if (emp.satisfaction < 5) riskScore += 0.5;
        if (emp.performance < 50) riskScore += 0.5;
        if (emp.compensationScore < 4) riskScore += 0.4;
        if (emp.benefitsScore < 4) riskScore += 0.3;
        if (emp.incentivesScore < 4) riskScore += 0.3;

        if (emp.satisfaction >= 8) riskScore -= 0.3;
        if (emp.performance >= 80) riskScore -= 0.3;

        return Math.min(riskScore, 1);
      });

      const riskPredictions = behaviorData.map(emp => {
        const risk = ys[behaviorData.indexOf(emp)];
        
        let riskCategory = "Low"; 
        if (risk > 0.75) {
          riskCategory = "Critical";
        } else if (risk > 0.5) {
          riskCategory = "High";
        } else if (risk > 0.25) {
          riskCategory = "Moderate";
        }

        return { ...emp, attritionRisk: riskCategory };
      });

      setAttritionRiskPredictions(riskPredictions);
    };

    attritionRiskModel();
  }, [behaviorData]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentPageData = attritionRiskPredictions.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  return (
    <div className="container mx-auto p-4">
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Behavioral Analytics</h2>
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentPageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendance" fill="#4CAF50" name="Attendance %" />
              <Bar dataKey="performance" fill="#2196F3" name="Performance Score" />
              <Bar dataKey="overtime" fill="#FF9800" name="Overtime (Hrs)" />
              <Bar dataKey="taskCompletion" fill="#9C27B0" name="Task Completion (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-xl font-semibold mb-4">Attrition Risk Prediction</h2>
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentPageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendance" fill="#4CAF50" name="Attendance %" />
              <Bar dataKey="performance" fill="#2196F3" name="Performance Score" />
              <Bar dataKey="attritionRisk" fill="#FF5722" name="Attrition Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <table className="table w-full mb-4">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Attendance (%)</th>
              <th className="border px-4 py-2">Absences</th>
              <th className="border px-4 py-2">Performance Score</th>
              <th className="border px-4 py-2">Overtime (Hrs)</th>
              <th className="border px-4 py-2">Task Completion (%)</th>
              <th className="border px-4 py-2">Satisfaction Score</th>
              <th className="border px-4 py-2">Compensation Score</th>
              <th className="border px-4 py-2">Benefits Score</th>
              <th className="border px-4 py-2">Incentives Score</th>
              <th className="border px-4 py-2">Attrition Risk</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((emp, index) => (
              <tr key={index} className="hover:bg-neutral hover:text-white">
                <td className="border px-4 py-2">{emp.name}</td>
                <td className="border px-4 py-2">{emp.attendance}%</td>
                <td className="border px-4 py-2">{emp.absent}</td>
                <td className="border px-4 py-2">{emp.performance}</td>
                <td className="border px-4 py-2">{emp.overtime}</td>
                <td className="border px-4 py-2">{emp.taskCompletion}%</td>
                <td className="border px-4 py-2">{emp.satisfaction}</td>
                <td className="border px-4 py-2">{emp.compensationScore}</td>
                <td className="border px-4 py-2">{emp.benefitsScore}</td>
                <td className="border px-4 py-2">{emp.incentivesScore}</td>
                <td className="border px-4 py-2">{emp.attritionRisk}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={prevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={nextPage}
            disabled={page * itemsPerPage >= attritionRiskPredictions.length}
          >
            Next
          </button>
        </div>

        <div className="mt-2">
          <p>Page {page} of {Math.ceil(attritionRiskPredictions.length / itemsPerPage)}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
