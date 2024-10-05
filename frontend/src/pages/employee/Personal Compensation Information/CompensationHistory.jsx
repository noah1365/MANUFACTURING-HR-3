import React, { useState } from 'react';

const CompensationHistory = () => {
  const [compensations, setCompensations] = useState([
    { id: 1, date: '2022-01-01', salary: 50000, bonus: 10000, total: 60000 },
    { id: 2, date: '2022-07-01', salary: 55000, bonus: 12000, total: 67000 },
    { id: 3, date: '2023-01-01', salary: 60000, bonus: 15000, total: 75000 },
  ]);

  const [newCompensation, setNewCompensation] = useState({
    id: compensations.length + 1,
    date: '',
    salary: 0,
    bonus: 0,
    total: 0,
  });

  const handleAddCompensation = () => {
    setCompensations([...compensations, newCompensation]);
    setNewCompensation({
      id: compensations.length + 2,
      date: '',
      salary: 0,
      bonus: 0,
      total: 0,
    });
  };

  const handleRemoveCompensation = (id) => {
    setCompensations(compensations.filter((compensation) => compensation.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Compensation History</h1>
      <div className="flex flex-col mt-4">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Salary (₱)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Bonus (₱)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total (₱)
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compensations.map((compensation) => (
                    <tr key={compensation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {compensation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₱{compensation.salary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₱{compensation.bonus.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₱{compensation.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveCompensation(compensation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold text-gray-900">Add New Compensation</h2>
        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newCompensation.date}
            onChange={(e) =>
              setNewCompensation({ ...newCompensation, date: e.target.value })
            }
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="number"
            value={newCompensation.salary}
            onChange={(e) =>
              setNewCompensation({
                ...newCompensation,
                salary: parseInt(e.target.value, 10),
                total: parseInt(e.target.value, 10) + newCompensation.bonus,
              })
            }
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium text-gray-700">Bonus</label>
          <input
            type="number"
            value={newCompensation.bonus}
            onChange={(e) =>
              setNewCompensation({
                ...newCompensation,
                bonus: parseInt(e.target.value, 10),
                total: newCompensation.salary + parseInt(e.target.value, 10),
              })
            }
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleAddCompensation}
          className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Compensation
        </button>
      </div>
    </div>
  );
};

export default CompensationHistory;
