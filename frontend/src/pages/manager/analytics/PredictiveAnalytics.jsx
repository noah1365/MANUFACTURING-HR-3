import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs"; // TensorFlow.js
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const PredictiveAnalytics = () => {
  const [salaryPredictions, setSalaryPredictions] = useState([]);

  useEffect(() => {
    const employees = [
      { name: "John", rating: 4.5, experience: 5, salary: 50000 },
      { name: "Sarah", rating: 3.8, experience: 3, salary: 45000 },
      { name: "Mike", rating: 4.2, experience: 7, salary: 60000 },
      { name: "Emma", rating: 4.9, experience: 10, salary: 70000 },
      { name: "David", rating: 3.5, experience: 2, salary: 40000 },
    ];

    const trainModel = async () => {
      const xs = employees.map(emp => [emp.rating, emp.experience]); // Input: Performance & Experience
      const ys = employees.map(emp => emp.salary); // Output: Salary

      // Convert data to tensors
      const xsTensor = tf.tensor2d(xs);
      const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

      // Define Linear Regression Model
      const model = tf.sequential();
      model.add(tf.layers.dense({ inputShape: [2], units: 1 }));

      // Compile Model
      model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

      // Train Model
      await model.fit(xsTensor, ysTensor, { epochs: 200 });

      // Predict Future Salaries
      const predictions = employees.map(emp => {
        const input = tf.tensor2d([[emp.rating, emp.experience]]);
        const predictedSalary = model.predict(input).dataSync()[0];
        return { ...emp, predictedSalary: predictedSalary.toFixed(2) };
      });

      setSalaryPredictions(predictions);
    };

    trainModel();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 relative z-10">

      <h2 className="text-xl font-semibold mt-4">Predicted Salary Adjustments (AI-Based)</h2>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salaryPredictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="salary" stroke="#8884d8" name="Current Salary" />
            <Line type="monotone" dataKey="predictedSalary" stroke="#82ca9d" name="Predicted Salary" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Employee</th>
            <th className="border border-gray-300 px-4 py-2">Rating</th>
            <th className="border border-gray-300 px-4 py-2">Experience (Years)</th>
            <th className="border border-gray-300 px-4 py-2">Current Salary (₱)</th>
            <th className="border border-gray-300 px-4 py-2">Predicted Salary (₱)</th>
          </tr>
        </thead>
        <tbody>
          {salaryPredictions.map((emp, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{emp.name}</td>
              <td className="border border-gray-300 px-4 py-2">{emp.rating}</td>
              <td className="border border-gray-300 px-4 py-2">{emp.experience}</td>
              <td className="border border-gray-300 px-4 py-2">{emp.salary}</td>
              <td className="border border-gray-300 px-4 py-2 text-green-600 font-bold">{emp.predictedSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictiveAnalytics;
