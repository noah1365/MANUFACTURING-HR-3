import React, { useState } from 'react';

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([
    { id: 1, name: 'Claim 1', description: 'This is claim 1', status: 'Pending' },
    { id: 2, name: 'Claim 2', description: 'This is claim 2', status: 'Approved' },
    { id: 3, name: 'Claim 3', description: 'This is claim 3', status: 'Rejected' },
  ]);

  const [newClaim, setNewClaim] = useState({
    id: claims.length + 1,
    name: '',
    description: '',
    status: 'Pending',
  });

  const [showNewClaimForm, setShowNewClaimForm] = useState(false);

  const handleAddClaim = () => {
    setClaims([...claims, newClaim]);
    setNewClaim({
      id: claims.length + 2,
      name: '',
      description: '',
      status: 'Pending',
    });
    setShowNewClaimForm(false);
  };

  const handleUpdateClaim = (id, status) => {
    setClaims(
      claims.map((claim) => (claim.id === id ? { ...claim, status } : claim))
    );
  };

  const handleDeleteClaim = (id) => {
    setClaims(claims.filter((claim) => claim.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
      <button
        className="btn btn-primary mt-4"
        onClick={() => setShowNewClaimForm(!showNewClaimForm)}
      >
        {showNewClaimForm ? 'Cancel' : 'Add New Claim'}
      </button>
      
      {showNewClaimForm && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            value={newClaim.name}
            onChange={(e) => setNewClaim({ ...newClaim, name: e.target.value })}
            className="input input-bordered w-full mb-4"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            value={newClaim.description}
            onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
            className="textarea textarea-bordered w-full mb-4"
          />
          <button
            className="btn btn-primary"
            onClick={handleAddClaim}
          >
            Add Claim
          </button>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Claims List</h2>
        <table className="table w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">ID</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Name</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Description</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Status</th>
              <th className="px-4 py-2 text-gray-700 text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-4 py-2 text-gray-700 text-sm">{claim.id}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">{claim.name}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">{claim.description}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">{claim.status}</td>
                <td className="px-4 py-2 text-gray-700 text-sm">
                  <button
                    className="btn btn-success mr-2"
                    onClick={() => handleUpdateClaim(claim.id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-error mr-2"
                    onClick={() => handleUpdateClaim(claim.id, 'Rejected')}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDeleteClaim(claim.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimsManagement;
