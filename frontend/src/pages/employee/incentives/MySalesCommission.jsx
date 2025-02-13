import React, { useEffect, useState } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const MySalesCommission = () => {
  const { myCommissions, addMySalesCommission, error, fetchMySalesCommission } =
    useIncentiveStore();

  const [salesAmount, setSalesAmount] = useState("");
  const [selectedCommission, setSelectedCommission] = useState("");
  const [salesProof, setSalesProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchMySalesCommission();
  }, [fetchMySalesCommission]);

  const handleFileChange = (e) => {
    setSalesProof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedCommission ||
      !salesAmount ||
      isNaN(salesAmount) ||
      Number(salesAmount) <= 0
    ) {
      alert("Please select a commission and enter a valid sales amount.");
      return;
    }

    const formData = new FormData();
    formData.append("salesCommissionId", selectedCommission);
    formData.append("salesAmount", Number(salesAmount));
    if (salesProof) {
      formData.append("salesProof", salesProof);
    }

    try {
      setIsSubmitting(true);
      await addMySalesCommission(formData);
      alert("Sales commission submitted successfully!");
      setSalesAmount("");
      setSelectedCommission("");
      setSalesProof(null);
    } catch (err) {
      console.error("🔴 Submission Error:", err);
      alert(
        `Failed to submit sales commission. Error: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (commission) => {
    setModalData(commission);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        My Sales Commission
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {myCommissions
          .filter(
            (commission) =>
              commission.salesCommissionId?.assignStatus === "Assigned"
          )
          .map((commission) => (
            <div
              key={commission._id}
              className="card bg-base-100 shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
              onClick={() => openModal(commission)}
            >
              <h3 className="text-lg font-semibold">
                {commission.salesCommissionId?.salesCommissionName ||
                  "Unnamed Commission"}
              </h3>
              <p className="text-sm">
                🎯 Target:{" "}
                <strong>
                  {commission.salesCommissionId?.targetAmount || "N/A"}
                </strong>
              </p>
            </div>
          ))}
      </div>
      {modalOpen && modalData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold mb-4">
              {modalData.salesCommissionId?.salesCommissionName ||
                "Unnamed Commission"}
            </h3>
            <p className="text-sm">
              🎯 Target:{" "}
              <strong>
                {modalData.salesCommissionId?.targetAmount || "N/A"}
              </strong>
            </p>
            <p className="text-sm">
              📊 Total Sales: <strong>{modalData.totalSales}</strong>
            </p>
            <p className="text-sm">
              📌 Status: <strong>{modalData.status}</strong>
            </p>
            <p className="text-sm">
              📝 Assign Status:{" "}
              <strong>
                {modalData.salesCommissionId?.assignStatus || "N/A"}
              </strong>
            </p>

{modalData.salesProof?.length > 0 && (
  <div className="mt-4">
    <h4 className="font-semibold">Sales Proof:</h4>
    <div className="grid grid-cols-4 gap-2">
      {modalData.salesProof.map((proof, index) => {
        // Kunin ang sales amount na naka-link sa proof na ito
        const proofSales = modalData.pendingSales?.filter(
          (sale) => sale.salesStatus !== "Approved"
        ) || [];

        return (
          <div key={index} className="relative group">
            <a href={proof.url} target="_blank" rel="noopener noreferrer">
              <img
                src={proof.url}
                alt={`Sales Proof ${index + 1}`}
                title={`Uploaded on: ${new Date(proof.uploadedAt).toLocaleString()}`}
                className="h-32 w-auto rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
              />
            </a>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-center rounded-lg">
              <p className="text-sm">💰 Sales: {modalData.totalSales}</p>
              <p className="text-sm">
                📌 Status:{" "}
                {proofSales.length > 0 ? (
                  proofSales.map((sale, i) => (
                    <span key={i} className="block">
                      {sale.salesStatus} ({sale.amount})
                    </span>
                  ))
                ) : (
                  "No pending sales"
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}




            <button
              onClick={closeModal}
              className="btn btn-secondary mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 card bg-base-100 shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Add Sales Commission</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Select Assigned Commission:
            </label>
            <select
              value={selectedCommission}
              onChange={(e) => setSelectedCommission(e.target.value)}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Commission</option>
              {myCommissions
                .filter(
                  (commission) =>
                    commission.salesCommissionId?.assignStatus === "Assigned"
                )
                .map((commission) => (
                  <option
                    key={commission._id}
                    value={commission.salesCommissionId?._id}
                  >
                    {commission.salesCommissionId?.salesCommissionName} (Target:{" "}
                    {commission.salesCommissionId?.targetAmount})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Sales Amount:</label>
            <input
              type="number"
              value={salesAmount}
              onChange={(e) => setSalesAmount(e.target.value)}
              min="1"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Upload Sales Proof:</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input file-input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Sales"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MySalesCommission;
