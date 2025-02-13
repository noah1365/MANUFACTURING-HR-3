import React, { useEffect, useState } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const AssignedCommission = () => {
  const {
    assignedCommissions,
    fetchAllAssignedSalesCommissions,
    employeeSalesStatus,
    fetchAllEmployeesSalesStatus,
    error,
  } = useIncentiveStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllAssignedSalesCommissions();
        await fetchAllEmployeesSalesStatus();
        console.log("Fetched assignedCommissions:", assignedCommissions);
        console.log("Fetched employeeSalesStatus:", employeeSalesStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchAllAssignedSalesCommissions, fetchAllEmployeesSalesStatus]);

  const findSalesStatus = (employeeId) => {
    console.log("Searching for sales status for employeeId:", employeeId);
    const status = employeeSalesStatus.find(
      (status) => status.employeeId === employeeId
    );
    console.log("Found status:", status);
    return status;
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Assigned Commissions</h2>

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {assignedCommissions.length === 0 ? (
        <p className="text-gray-500">No sales commission requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Sales Commission</th>
                <th className="border border-gray-300 px-4 py-2">Target Sales</th>
                <th className="border border-gray-300 px-4 py-2">Total Sales</th>
                <th className="border border-gray-300 px-4 py-2">Commission Rate</th>
                <th className="border border-gray-300 px-4 py-2">Sales Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedCommissions.map((commission) => (
                <tr key={commission._id} className="text-gray-700 text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.salesCommissionName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₱{commission.targetAmount?.toLocaleString() || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.assignedTo.length > 0 ? (
                      <ul className="list-none">
                        {commission.assignedTo.map((assignee) => {
                          const salesStatus = findSalesStatus(assignee.employeeId?._id);
                          return (
                            <li key={assignee.employeeId?._id}>
                              ₱{salesStatus?.totalSales?.toLocaleString() || "N/a"}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      "No Sales Data"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.commissionRate
                      ? `${(commission.commissionRate * 100).toFixed(2)}%`
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commission.assignedTo.length > 0 ? (
                      <ul className="list-none">
                        {commission.assignedTo.map((assignee) => {
                          const salesStatus = findSalesStatus(assignee.employeeId?._id);
                          return (
                            <li key={assignee.employeeId?._id}>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  salesStatus?.salesStatus === "Completed"
                                    ? "bg-green-200 text-green-700"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {salesStatus?.salesStatus || "Pending"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      "No Sales Status"
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

export default AssignedCommission;
