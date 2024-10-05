import React, { useState } from 'react';

const LeaveBalances = () => {
  const [leaveBalances, setLeaveBalances] = useState([
    { type: 'Annual Leave', balance: 20, used: 5 },
    { type: 'Sick Leave', balance: 10, used: 2 },
    { type: 'Family Leave', balance: 5, used: 1 },
  ]);

  const handleAddLeave = () => {
    setLeaveBalances([...leaveBalances, { type: '', balance: 0, used: 0 }]);
  };

  const handleRemoveLeave = (index) => {
    setLeaveBalances(leaveBalances.filter((_, i) => i !== index));
  };

  const handleUpdateLeave = (index, key, value) => {
    setLeaveBalances(leaveBalances.map((leave, i) => 
      i === index ? { ...leave, [key]: value } : leave
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Leave Balances</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleAddLeave}
      >
        Add Leave
      </button>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Used</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {leaveBalances.map((leave, index) => (
            <tr key={index}>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={leave.type}
                  onChange={(e) => handleUpdateLeave(index, 'type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={leave.balance}
                  onChange={(e) => handleUpdateLeave(index, 'balance', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={leave.used}
                  onChange={(e) => handleUpdateLeave(index, 'used', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleRemoveLeave(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveBalances;
