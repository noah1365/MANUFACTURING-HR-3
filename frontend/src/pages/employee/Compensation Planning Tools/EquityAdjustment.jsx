import React, { useState } from 'react';

const EquityAdjustment = () => {
  const [equities, setEquities] = useState([
    { id: 1, name: 'Equity 1', value: 1000 },
    { id: 2, name: 'Equity 2', value: 2000 },
    { id: 3, name: 'Equity 3', value: 3000 },
  ]);

  const [newEquity, setNewEquity] = useState({
    id: equities.length + 1,
    name: '',
    value: 0,
  });

  const [showNewEquityForm, setShowNewEquityForm] = useState(false);
  const [editingEquity, setEditingEquity] = useState(null);

  const handleAddEquity = () => {
    setEquities([...equities, newEquity]);
    setNewEquity({
      id: equities.length + 2,
      name: '',
      value: 0,
    });
    setShowNewEquityForm(false);
  };

  const handleUpdateEquity = (id, name, value) => {
    setEquities(
      equities.map((equity) => (equity.id === id ? { id, name, value } : equity))
    );
    setEditingEquity(null);
  };

  const handleDeleteEquity = (id) => {
    setEquities(equities.filter((equity) => equity.id !== id));
  };

  const handleEditEquity = (equity) => {
    setEditingEquity(equity);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Equity Adjustment</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowNewEquityForm(!showNewEquityForm)}
      >
        {showNewEquityForm ? 'Cancel' : 'Add New Equity'}
      </button>
      {showNewEquityForm && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={newEquity.name}
            onChange={(e) => setNewEquity({ ...newEquity, name: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter equity name"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Value
          </label>
          <input
            type="number"
            value={newEquity.value}
            onChange={(e) =>
              setNewEquity({ ...newEquity, value: parseInt(e.target.value) })
            }
            className="input input-bordered w-full"
            placeholder="Enter equity value"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleAddEquity}
          >
            Add Equity
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Equities List</h2>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">ID</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Name</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Value</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equities.map((equity) => (
              <tr key={equity.id}>
                <td className="px-4 py-2 text-gray-700 text-sm">{equity.id}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">{equity.name}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">{equity.value}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEditEquity(equity)}
                  >
                    Change
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                    onClick={() => handleDeleteEquity(equity.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingEquity && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Edit Equity</h2>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={editingEquity.name}
            onChange={(e) =>
              setEditingEquity({ ...editingEquity, name: e.target.value })
            }
            className="input input-bordered w-full"
            placeholder="Edit equity name"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Value
          </label>
          <input
            type="number"
            value={editingEquity.value}
            onChange={(e) =>
              setEditingEquity({
                ...editingEquity,
                value: parseInt(e.target.value),
              })
            }
            className="input input-bordered w-full"
            placeholder="Edit equity value"
          />
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() =>
              handleUpdateEquity(editingEquity.id, editingEquity.name, editingEquity.value)
            }
          >
            Update Equity
          </button>
        </div>
      )}
    </div>
  );
};

export default EquityAdjustment;
