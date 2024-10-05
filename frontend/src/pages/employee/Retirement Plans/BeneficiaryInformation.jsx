import React, { useState } from 'react';

const BeneficiaryInformation = () => {
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'John Doe', relationship: 'Father', percentage: 50 },
    { id: 2, name: 'Jane Doe', relationship: 'Mother', percentage: 30 },
    { id: 3, name: 'Bob Smith', relationship: 'Brother', percentage: 20 },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);

  const handleAddBeneficiary = () => {
    const newBeneficiary = {
      id: beneficiaries.length + 1,
      name: '',
      relationship: '',
      percentage: 0,
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setIsEditing(true);
    setEditingBeneficiary(newBeneficiary);
  };

  const handleEditBeneficiary = (beneficiary) => {
    setIsEditing(true);
    setEditingBeneficiary(beneficiary);
  };

  const handleSaveBeneficiary = (beneficiary) => {
    const updatedBeneficiaries = beneficiaries.map((b) =>
      b.id === beneficiary.id ? beneficiary : b
    );
    setBeneficiaries(updatedBeneficiaries);
    setIsEditing(false);
    setEditingBeneficiary(null);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingBeneficiary(null);
  };

  const handleDeleteBeneficiary = (id) => {
    const updatedBeneficiaries = beneficiaries.filter((b) => b.id !== id);
    setBeneficiaries(updatedBeneficiaries);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Beneficiary Information</h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Relationship</th>
            <th className="px-4 py-2 text-left">Percentage</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.id}>
              <td className="px-4 py-2">
                {isEditing && editingBeneficiary?.id === beneficiary.id ? (
                  <input
                    type="text"
                    value={editingBeneficiary.name}
                    onChange={(e) =>
                      setEditingBeneficiary({ ...editingBeneficiary, name: e.target.value })
                    }
                    className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                ) : (
                  beneficiary.name
                )}
              </td>
              <td className="px-4 py-2">
                {isEditing && editingBeneficiary?.id === beneficiary.id ? (
                  <input
                    type="text"
                    value={editingBeneficiary.relationship}
                    onChange={(e) =>
                      setEditingBeneficiary({ ...editingBeneficiary, relationship: e.target.value })
                    }
                    className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                ) : (
                  beneficiary.relationship
                )}
              </td>
              <td className="px-4 py-2">
                {isEditing && editingBeneficiary?.id === beneficiary.id ? (
                  <input
                    type="number"
                    value={editingBeneficiary.percentage}
                    onChange={(e) =>
                      setEditingBeneficiary({ ...editingBeneficiary, percentage: Number(e.target.value) })
                    }
                    className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                ) : (
                  beneficiary.percentage
                )}
              </td>
              <td className="px-4 py-2">
                {isEditing && editingBeneficiary?.id === beneficiary.id ? (
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => handleSaveBeneficiary(editingBeneficiary)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => handleEditBeneficiary(beneficiary)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={handleAddBeneficiary}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
      >
        Add Beneficiary
      </button>
    </div>
  );
};

export default BeneficiaryInformation;
