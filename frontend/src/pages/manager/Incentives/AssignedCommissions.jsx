import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const AssignedCommission = () => {
  const { assignedCommissions, fetchAllAssignedSalesCommissions, error } = useIncentiveStore();

  useEffect(() => {
    fetchAllAssignedSalesCommissions();
  }, []);

  console.log("Rendering Assigned Commissions:", assignedCommissions); // ✅ Debugging

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Assigned Commissions</h2>

      {error && <p className="text-red-500 font-semibold">⚠️ {error}</p>}

      {assignedCommissions.length === 0 ? (
        <p className="text-gray-500">No sales commission requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Employee Name</th>
                <th className="border border-gray-300 px-4 py-2">Sales Commission</th>
                <th className="border border-gray-300 px-4 py-2">Target Sales</th>
                <th className="border border-gray-300 px-4 py-2">Commission Rate</th>
                <th className="border border-gray-300 px-4 py-2">Total Sales</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedCommissions.map((commission) => (
                <tr key={commission._id} className="text-gray-700 text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.employeeId
                      ? `${commission.employeeId.firstName} ${commission.employeeId.lastName}`
                      : "No Employee Assigned"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.salesCommissionId?.salesCommissionName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₱{commission.salesCommissionId?.targetAmount?.toLocaleString() || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.salesCommissionId?.commissionRate
                      ? `${commission.salesCommissionId.commissionRate * 100}%`
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₱{commission.totalSales?.toLocaleString() || "0"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        commission.salesStatus === "In Progress"
                          ? "bg-yellow-200 text-yellow-800"
                          : commission.salesStatus === "Approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {commission.salesStatus || "Unknown"}
                    </span>
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

export default AssignedCommission;
