import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailableSalesCommission = () => {
  const {
    assignedCommissions = [],
    allSalesCommission = [],
    fetchAllSalesCommission,
    fetchMyAssignedSalesCommissions,
    assignedSalesCommission,
    isLoading,
  } = useIncentiveStore();

  useEffect(() => {
    fetchAllSalesCommission();
    fetchMyAssignedSalesCommissions();
    console.log("Fetched Assigned and Not Assigned Sales Commissions");
  }, [fetchAllSalesCommission, fetchMyAssignedSalesCommissions]);

  const handleAssign = async (commissionId) => {
    try {
      const response = await assignedSalesCommission({ salesCommissionId: commissionId });

      if (response) {
        toast.success("Sales commission assigned successfully!");

        useIncentiveStore.setState((state) => ({
          allSalesCommission: state.allSalesCommission.filter(
            (commission) => commission._id !== commissionId
          ),
        }));

        await fetchMyAssignedSalesCommissions();
      }
    } catch (error) {
      toast.error("Failed to assign sales commission.");
      console.error("Assignment error:", error);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer />
      <h2 className="text-3xl mb-5 text-center">Sales Commissions</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Available Sales Commissions</h3>
        <div className="card bg-base-100 shadow-xl">
          {isLoading ? (
            <p className="text-center p-4">Loading...</p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border px-4 py-2">Sales Commission Name</th>
                  <th className="border px-4 py-2">Target Amount (₱)</th>
                  <th className="border px-4 py-2">Commission Rate (%)</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {allSalesCommission && allSalesCommission.length > 0 ? (
                  allSalesCommission.map((commission) => (
                    <tr key={commission._id} className="hover:bg-neutral hover:text-white">
                      <td className="border px-4 py-2">{commission.salesCommissionName}</td>
                      <td className="border px-4 py-2">{commission.targetAmount?.toFixed(2) || "0.00"}</td>
                      <td className="border px-4 py-2">{commission.commissionRate?.toFixed(2) || "0.00"}</td>
                      <td className="border px-4 py-2">
                        {commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="border px-4 py-2 text-green-500 font-bold">
                        <button onClick={() => handleAssign(commission._id)} className="btn btn-sm btn-success">
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">No available sales commissions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Assigned Sales Commissions</h3>
        <div className="card bg-base-100 shadow-xl">
          {isLoading ? (
            <p className="text-center p-4">Loading...</p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="border px-4 py-2">Sales Commission Name</th>
                  <th className="border px-4 py-2">Target Amount (₱)</th>
                  <th className="border px-4 py-2">Commission Rate (%)</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedCommissions && assignedCommissions.length > 0 ? (
                  assignedCommissions.map((commission) => (
                    <tr key={commission._id} className="hover:bg-neutral hover:text-white">
                      <td className="border px-4 py-2">{commission.salesCommissionName}</td>
                      <td className="border px-4 py-2">{commission.targetAmount?.toFixed(2) || "0.00"}</td>
                      <td className="border px-4 py-2">{commission.commissionRate?.toFixed(2) || "0.00"}</td>
                      <td className="border px-4 py-2">
                        {commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="border px-4 py-2 text-green-500 font-bold">Assigned</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">No assigned sales commissions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableSalesCommission;
