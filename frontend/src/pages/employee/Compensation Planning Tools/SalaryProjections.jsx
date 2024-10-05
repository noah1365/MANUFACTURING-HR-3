import React, { useState } from 'react';

const SalaryProjections = () => {
  const [baseSalary, setBaseSalary] = useState(50000);
  const [annualIncrease, setAnnualIncrease] = useState(5);
  const [years, setYears] = useState(5);
  const [projections, setProjections] = useState([]);

  const calculateProjections = () => {
    const newProjections = [];
    let currentSalary = baseSalary;

    for (let i = 0; i < years; i++) {
      const projectedSalary = currentSalary + (currentSalary * annualIncrease / 100);
      newProjections.push({
        year: i + 1,
        currentSalary,
        projectedSalary,
      });
      currentSalary = projectedSalary;
    }

    setProjections(newProjections);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Salary Projections</h1>
      <form className="flex flex-col gap-4 mb-4">
        <label className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">Base Salary (₱):</span>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
            className="input input-bordered"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">Annual Increase (%):</span>
          <input
            type="number"
            value={annualIncrease}
            onChange={(e) => setAnnualIncrease(Number(e.target.value))}
            className="input input-bordered"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">Number of Years:</span>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="input input-bordered"
          />
        </label>
        <button
          type="button"
          onClick={calculateProjections}
          className="btn btn-primary"
        >
          Calculate Projections
        </button>
      </form>
      {projections.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="text-lg font-bold text-gray-900 p-2 border border-gray-300">Year</th>
              <th className="text-lg font-bold text-gray-900 p-2 border border-gray-300">Current Salary (₱)</th>
              <th className="text-lg font-bold text-gray-900 p-2 border border-gray-300">Projected Salary (₱)</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((projection, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-300">{projection.year}</td>
                <td className="p-2 border border-gray-300">₱{projection.currentSalary.toLocaleString()}</td>
                <td className="p-2 border border-gray-300">₱{projection.projectedSalary.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalaryProjections;
