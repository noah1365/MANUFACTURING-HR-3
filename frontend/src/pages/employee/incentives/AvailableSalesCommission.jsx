import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AvailableSalesCommission = () => {
  const { allSalesCommission = [], fetchAllSalesCommission, assignedSalesCommission, isLoading } = useIncentiveStore();

  useEffect(() => {
    fetchAllSalesCommission();
  }, []); 

  const handleAssign = async (commissionId) => {
    try {
      const newAssignment = { salesCommissionId: commissionId };
      const response = await assignedSalesCommission(newAssignment);
  
      if (response) {
        toast.success("Sales commission assigned successfully!");
        fetchAllSalesCommission();
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
  
        if (errorMessage === "Unauthorized. Please log in.") {
          toast.error("You must be logged in to assign a commission.");
        } else if (errorMessage === "Sales commission ID is required.") {
          toast.error("Sales commission ID is missing.");
        } else if (errorMessage === "Employee not found.") {
          toast.error("Your employee record does not exist.");
        } else if (errorMessage === "Sales commission not found.") {
          toast.error("The selected sales commission does not exist.");
        } else if (errorMessage === "This sales commission is not available for assignment.") {
          toast.warning("This sales commission is no longer available.");
        } else if (errorMessage === "You already have this sales commission assigned.") {
          toast.info("You have already been assigned this sales commission.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };
  
  
  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer />
      <h2 className="text-3xl mb-5 text-center">Available Sales Commissions</h2>

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
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {allSalesCommission?.length > 0 ? (
                allSalesCommission.map((commission) => (
                  <tr key={commission._id} className="hover:bg-neutral hover:text-white">
                    <td className="border px-4 py-2">{commission.salesCommissionName}</td>
                    <td className="border px-4 py-2">{commission.targetAmount?.toFixed(2) || "0.00"}</td>
                    <td className="border px-4 py-2">{commission.commissionRate?.toFixed(2) || "0.00"}</td>
                    <td className="border px-4 py-2">{commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td className="border px-4 py-2">{commission.status || "N/A"}</td>
                    <td className="border px-4 py-2 text-center">
                    <button 
                      className={`px-4 py-1 rounded-md ${commission.assignStatus === "Assigned" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                      onClick={() => handleAssign(commission._id)}
                      disabled={commission.assignStatus === "Assigned"}
                    >
                      {commission.assignStatus === "Assigned" ? "Assigned" : "Assign"}
                    </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No sales commission data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AvailableSalesCommission;
