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
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Error adding commission"
      );
      console.error("Error adding sales commission:", error);


      toast.error("Failed to add sales commission.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />

      <h2 className="text-2xl font-bold text-center mb-4">My Sales Commission</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {submitError && <p className="text-red-500 text-center">{submitError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
          <label htmlFor="salesAmount" className="block text-sm font-semibold">
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
          <label htmlFor="salesProof" className="block text-sm font-semibold">
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

      {myAddedSales.length === 0 ? (
        <p className="text-center">No added commissions available.</p>
      ) : (
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Commission Name</th>
              <th className="px-4 py-2 border">Target Amount</th>
              <th className="px-4 py-2 border">Commission Rate</th>
              <th className="px-4 py-2 border">Sales Amount</th>
              <th className="px-4 py-2 border">Sales Proof</th>
              <th className="px-4 py-2 border">Confirmation Status</th>
            </tr>
          </thead>
          <tbody>
            {myAddedSales?.map((commission) => (
              <tr key={commission._id}>
                <td className="px-4 py-2 border">
                  {commission.salesCommissionId?.salesCommissionName ||
                    "Unnamed Commission"}
                </td>
                <td className="px-4 py-2 border">
                  {commission.salesCommissionId?.targetAmount || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {commission.salesCommissionId?.commissionRate || "N/A"}
                </td>
                <td className="px-4 py-2 border">
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

                <td className="px-4 py-2 border">
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
