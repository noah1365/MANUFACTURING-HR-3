import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const SalesCommissionRequests = () => {
  const { assignedCommissions, fetchAllAssignedSalesCommissions, error } = useIncentiveStore();

  useEffect(() => {
    fetchAllAssignedSalesCommissions();
  }, []);

  console.log("Rendering Assigned Commissions:", assignedCommissions); // ✅ Debugging

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Sales Commission Requests</h2>

      {error && <p className="text-red-500 font-semibold">⚠️ {error}</p>}

      {assignedCommissions.length === 0 ? (
        <p className="text-gray-500">No sales commission requests found.</p>
      ) : (
        <div className="space-y-4">
          {assignedCommissions.map((commission) => (
            <div key={commission._id} className="border p-4 rounded-lg shadow-md bg-gray-50">
           <h3 className="text-lg font-semibold text-gray-700">
  {commission.employeeId ? `${commission.employeeId.firstName} ${commission.employeeId.lastName}` : "No Employee Assigned"}
</h3>

              
              <p className="text-gray-600">
                🎯 <strong>Target Sales:</strong> ₱{commission.salesCommissionId?.targetAmount?.toLocaleString()}
              </p>
              <p className="text-gray-600">
                💰 <strong>Commission Rate:</strong> {commission.salesCommissionId?.commissionRate * 100}%
              </p>
              <p className="text-gray-600">
  📊 <strong>Pending Sales:</strong> ₱{commission.salesAmount?.toLocaleString()}
</p>


              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium 
                ${
                  commission.salesStatus === "In Progress"
                    ? "bg-yellow-200 text-yellow-800"
                    : commission.salesStatus === "Approved"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}>
                {commission.salesStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesCommissionRequests;
