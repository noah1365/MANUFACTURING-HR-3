import React, { useState, useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalesCommissions = () => {
  const {
    allSalesCommission,
    fetchAllSalesCommission,
    createSalesCommission,
    updateSalesCommission,
    isLoading,
  } = useIncentiveStore();
  const [formData, setFormData] = useState({
    salesCommissionName: "",
    targetAmount: "",
    commissionRate: "",
  });
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchAllSalesCommission();
  }, [fetchAllSalesCommission]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCommissionData = {
      salesCommissionName: formData.salesCommissionName,
      targetAmount: parseFloat(formData.targetAmount),
      commissionRate: parseFloat(formData.commissionRate),
    };

    const success = await createSalesCommission(newCommissionData);
    if (success) {
      toast.success("Sales Commission Added Successfully!");
      setFormData({
        salesCommissionName: "",
        targetAmount: "",
        commissionRate: "",
      });
      setIsModalOpen(false);
    } else {
      toast.error("Failed to Add Sales Commission.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...editData,
      targetAmount: parseFloat(editData.targetAmount),
      commissionRate: parseFloat(editData.commissionRate),
      status: editData.status, 
    };
    const success = await updateSalesCommission(editData._id, editData);
    if (success) {
      toast.success("Sales Commission Updated Successfully!");
      setIsEditModalOpen(false);
      fetchAllSalesCommission();
    } else {
      toast.error("Failed to Update Sales Commission.");
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer/>
      <h2 className='text-3xl mb-5 text-center'>Sales Commission</h2>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-white px-4 py-2 rounded"
        >
          Add Commission
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        {isLoading ? (
          <p className="text-center p-4">Loading...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th>Sales Commission Name</th>
                <th>Target Amount (₱)</th>
                <th>Commission Rate (%)</th>
                <th>Date</th>
                <th>Status</th>
                <th>Applied By:</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allSalesCommission.length > 0 ? (
                allSalesCommission.map((commission) => (
                  <tr
                    key={commission._id}
                    className="hover:bg-neutral hover:text-white"
                  >
                    <td>{commission.salesCommissionName}</td>
                    <td>
                      {commission.targetAmount
                        ? commission.targetAmount.toFixed(2)
                        : "0.00"}
                    </td>
                    <td>
                      {commission.commissionRate
                        ? commission.commissionRate.toFixed(2)
                        : "0.00"}
                    </td>
                    <td>
                      {commission.createdAt
                        ? new Date(commission.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{commission.status ? commission.status : "N/A"}</td>
                    <td>
                      {commission.appliedBy
                        ? commission.appliedBy.firstname
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setEditData(commission);
                          setIsEditModalOpen(true);
                        }}
                        className="btn btn-primary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No sales commission data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Create New Sales Commission
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="salesCommissionName"
                placeholder="Commission Name"
                value={formData.salesCommissionName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="targetAmount"
                placeholder="Target Amount (₱)"
                value={formData.targetAmount}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="commissionRate"
                placeholder="Commission Rate (%)"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Sales Commission</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <select
                name="status"
                value={editData.status}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="Not Available">Not Available</option>
                <option value="Available">Available</option>
              </select>

              <input
                type="text"
                name="salesCommissionName"
                value={editData.salesCommissionName}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="targetAmount"
                value={editData.targetAmount}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="commissionRate"
                value={editData.commissionRate}
                onChange={handleEditChange}
                required
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCommissions;
