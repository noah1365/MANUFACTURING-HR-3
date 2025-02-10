import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyCommissions = () => {
  const { allSalesCommission, fetchAllSalesCommission, isLoading } = useIncentiveStore();

  useEffect(() => {
    fetchAllSalesCommission();
  }, [fetchAllSalesCommission]);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer/>
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
              </tr>
            </thead>
            <tbody>
              {allSalesCommission.length > 0 ? (
                allSalesCommission.map((commission) => (
                  <tr key={commission._id} className="hover:bg-neutral hover:text-white">
                    <td className="border px-4 py-2">{commission.salesCommissionName}</td>
                    <td className="border px-4 py-2">{commission.targetAmount ? commission.targetAmount.toFixed(2) : "0.00"}</td>
                    <td className="border px-4 py-2">{commission.commissionRate ? commission.commissionRate.toFixed(2) : "0.00"}</td>
                    <td className="border px-4 py-2">{commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td className="border px-4 py-2">{commission.status || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No sales commission data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyCommissions;
