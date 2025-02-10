import React, { useEffect } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const SalesCommissions = () => {
  const { allSalesCommission, fetchAllSalesCommission, isLoading } = useIncentiveStore();

  useEffect(() => {
    fetchAllSalesCommission();
  }, []);
  
  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <div className="card bg-base-100 shadow-xl">
        {isLoading ? (
          <p className="text-center p-4">Loading...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th>Sales Commission Name</th>
                <th>Target Amount (₱)</th>
                <th>Commission Rate (%)</th>
                <th>Date</th>
                <th>Applied By:</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allSalesCommission.length > 0 ? (
                allSalesCommission.map((commission) => (
                  <tr key={commission._id} className="hover:bg-neutral hover:text-white">
                    <td>{commission.salesCommissionName}</td>
                    <td>{commission.targetAmount ? commission.targetAmount.toFixed(2) : "0.00"}</td>
                    <td>{commission.commissionRate ? commission.commissionRate.toFixed(2) : "0.00"}</td>
                    <td>{commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td>{commission.appliedBy ? commission.appliedBy.firstname : "N/A"}</td>
                    <td><button className="btn btn-primary">Edit</button></td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No sales commission data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  };

export default SalesCommissions;
