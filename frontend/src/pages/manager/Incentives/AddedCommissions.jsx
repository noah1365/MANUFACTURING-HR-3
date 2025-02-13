import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const AddedCommissions = () => {
  const {
    addedSales,
    fetchAllAddedSalesCommissions,
    updateConfirmationStatus,
    error,
  } = useIncentiveStore();

  useEffect(() => {
    fetchAllAddedSalesCommissions();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateConfirmationStatus(id, status);
    fetchAllAddedSalesCommissions();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Added Sales Commissions
      </h2>

      {error && <p className="text-red-500 font-semibold">⚠️ {error}</p>}

      {addedSales.length === 0 ? (
        <p className="text-gray-500">No added sales commissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full mb-4">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border px-4 py-2">
                  Employee Name
                </th>
                <th className="border px-4 py-2">
                  Sales Commission
                </th>
                <th className="border px-4 py-2">
                  Target Sales
                </th>
                <th className="border px-4 py-2">
                  Commission Rate
                </th>
                <th className="border px-4 py-2">
                  Sales Amount
                </th>
                <th className="border px-4 py-2">
                  Sales Proof
                </th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {addedSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">
                    {sale.employeeId
                      ? `${sale.employeeId.firstName} ${sale.employeeId.lastName}`
                      : "No Employee Assigned"}
                  </td>
                  <td className="border px-4 py-2">
                    {sale.salesCommissionId?.salesCommissionName || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    ₱
                    {sale.salesCommissionId?.targetAmount?.toLocaleString() ||
                      "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {sale.salesCommissionId?.commissionRate
                      ? `${sale.salesCommissionId.commissionRate * 100}%`
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    ₱{sale.salesAmount?.toLocaleString() || "0"}
                  </td>
                  <td className="border px-4 py-2">
                    {sale.salesProof?.length > 0 ? (
                      <a
                        href={sale.salesProof[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={sale.salesProof[0].url}
                          alt="Sales Proof"
                          className="w-16 h-16 object-cover rounded shadow-md hover:opacity-75"
                        />
                      </a>
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    {sale.confirmationStatus === "Pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(sale._id, "Approved")
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(sale._id, "Rejected")
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sale.confirmationStatus === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {sale.confirmationStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddedCommissions;
