import React, { useEffect, useState } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MySalesCommission = () => {
  const {
    myCommissions,
    fetchMySalesCommission,
    fetchMyAddedSalesCommissions,
    myAddedSales,
    error,
    addMySalesCommission,
  } = useIncentiveStore();
  const [formData, setFormData] = useState({
    salesCommissionId: "",
    salesAmount: "",
    salesProof: null,
  });
  const [submitError, setSubmitError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    fetchMySalesCommission();
    fetchMyAddedSalesCommissions();
  }, [fetchMySalesCommission, fetchMyAddedSalesCommissions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, salesProof: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.salesProof) {
      setSubmitError("Sales proof is required.");
      return;
    }

    const commissionData = new FormData();
    commissionData.append("salesCommissionId", formData.salesCommissionId);
    commissionData.append("salesAmount", formData.salesAmount);
    commissionData.append("salesProof", formData.salesProof);

    try {
      const response = await addMySalesCommission(commissionData);

      console.log("Sales commission added:", response.data);
      fetchMySalesCommission();
      fetchMyAddedSalesCommissions();

      toast.success("Sales commission added successfully!");

      setFormData({
        salesCommissionId: "",
        salesAmount: "",
        salesProof: null,
      });

      closeFormModal();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Error adding commission"
      );
      console.error("Error adding sales commission:", error);

      toast.error("Failed to add sales commission.");
    }
  };

  const openModal = (commission) => {
    setSelectedCommission(commission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommission(null);
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />

      <h2 className="text-2xl font-bold text-center mb-4">
        My Sales Commission
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {submitError && <p className="text-red-500 text-center">{submitError}</p>}

      <div className="flex justify-center mb-4">
        <button onClick={openFormModal} className="btn btn-primary">
          Add New Commission
        </button>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="modal-header flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Sales Commission
              </h3>
              <button
                onClick={closeFormModal}
                className="btn btn-sm btn-ghost text-gray-500"
              >
                X
              </button>
            </div>
            <div className="modal-body mt-4 space-y-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="salesCommissionId"
                    className="block text-sm font-semibold"
                  >
                    Commission Name
                  </label>
                  <select
                    name="salesCommissionId"
                    value={formData.salesCommissionId}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                  >
                    <option value="">Select Commission</option>
                    {myCommissions?.map((commission) => (
                      <option
                        key={commission.salesCommissionId._id}
                        value={commission.salesCommissionId._id}
                      >
                        {commission.salesCommissionId?.salesCommissionName ||
                          "Unnamed Commission"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="salesAmount"
                    className="block text-sm font-semibold"
                  >
                    Sales Amount
                  </label>
                  <input
                    type="number"
                    id="salesAmount"
                    name="salesAmount"
                    value={formData.salesAmount}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salesProof"
                    className="block text-sm font-semibold"
                  >
                    Sales Proof
                  </label>
                  <input
                    type="file"
                    id="salesProof"
                    name="salesProof"
                    onChange={handleFileChange}
                    required
                    className="input input-bordered w-full"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Add Commission
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap space-x-4">
        {myCommissions.map((commission) => (
          <div
            key={commission._id}
            className="card p-6 mb-4 bg-white shadow-md rounded-lg w-full sm:w-1/2 lg:w-1/3"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p
                  onClick={() => openModal(commission)}
                  className="text-md font-semibold text-primary cursor-pointer"
                >
                  {commission.salesCommissionId?.salesCommissionName ||
                    "Unnamed Commission"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {isModalOpen && selectedCommission && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="modal-header flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Commission Details
              </h3>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-ghost text-gray-500"
              >
                X
              </button>
            </div>
            <div className="modal-body mt-4 space-y-3">
              <p className="text-lg font-medium">
                Name:{" "}
                {selectedCommission.salesCommissionId?.salesCommissionName}
              </p>
              <p className="text-lg font-medium text-green-600">
                Total Sales: {selectedCommission.totalSales}
              </p>
              <p className="text-lg font-medium text-blue-600">
                Sales Status: {selectedCommission.salesStatus}
              </p>
            </div>
            <div className="modal-footer mt-4">
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {myAddedSales.length === 0 ? (
        <p className="text-center">No added commissions available.</p>
      ) : (
        <table className="table w-full mb-4">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Commission Name</th>
              <th className="border px-4 py-2">Target Amount</th>
              <th className="border px-4 py-2">Commission Rate</th>
              <th className="border px-4 py-2">Sales Amount</th>
              <th className="border px-4 py-2">Sales Proof</th>
              <th className="border px-4 py-2">Confirmation Status</th>
            </tr>
          </thead>
          <tbody>
            {myAddedSales?.map((commission) => (
              <tr key={commission._id} className="hover:bg-neutral hover:text-white">
                <td className="border px-4 py-2">
                  {commission.salesCommissionId?.salesCommissionName ||
                    "Unnamed Commission"}
                </td>
                <td className="border px-4 py-2">
                  {commission.salesCommissionId?.targetAmount || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {commission.salesCommissionId?.commissionRate || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {commission.salesAmount || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {commission.salesProof?.length > 0 ? (
                    <a
                      href={commission.salesProof[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={commission.salesProof[0].url}
                        alt="Sales Proof"
                        className="w-16 h-16 object-cover rounded shadow-md hover:opacity-75"
                      />
                    </a>
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border px-4 py-2">
                  {commission.confirmationStatus || "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySalesCommission;
