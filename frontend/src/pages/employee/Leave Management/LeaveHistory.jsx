import React, { useState } from 'react';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, startDate: '2022-01-01', endDate: '2022-01-05', type: 'Annual Leave', status: 'Approved' },
    { id: 2, startDate: '2022-02-01', endDate: '2022-02-05', type: 'Sick Leave', status: 'Pending' },
    { id: 3, startDate: '2022-03-01', endDate: '2022-03-05', type: 'Annual Leave', status: 'Approved' },
  ]);

  const handleDeleteLeave = (id) => {
    setLeaves(leaves.filter((leave) => leave.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Leave History</h1>
      <table className="w-full table-auto mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="border-b border-gray-200">
              <td className="px-4 py-2">{leave.startDate}</td>
              <td className="px-4 py-2">{leave.endDate}</td>
              <td className="px-4 py-2">{leave.type}</td>
              <td className="px-4 py-2">{leave.status}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDeleteLeave(leave.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;
