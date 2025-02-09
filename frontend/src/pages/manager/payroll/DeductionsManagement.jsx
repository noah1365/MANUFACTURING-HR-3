import React, { useState, useEffect } from "react";
import { useBenefitStore } from "../../../store/benefitStore";

const DeductionsManagement = () => {
  const {
    deductions,
    error,
    fetchBenefitDeductions,
    history,
    fetchBenefitDeductionHistory,
  } = useBenefitStore();
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  useEffect(() => {
    fetchBenefitDeductions();
    fetchBenefitDeductionHistory(); 
  }, [fetchBenefitDeductions, fetchBenefitDeductionHistory]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const groupedDeductions = deductions.reduce((acc, deduction) => {
    const employeeKey = `${deduction.employeeId._id}_${deduction.benefitsName._id}`;
    if (!acc[employeeKey]) {
      acc[employeeKey] = {
        employeeName: `${deduction.employeeId.firstName} ${deduction.employeeId.lastName}`,
        benefitsName: deduction.benefitsName.benefitsName,
        totalAmount: 0,
        employeeId: deduction.employeeId._id,
      };
    }
    acc[employeeKey].totalAmount += deduction.amount;

    return acc;
  }, {});

  const groupedArray = Object.values(groupedDeductions);

  let renderedEmployees = {};

  // Filter history by benefit name
  const filteredHistory = selectedBenefit
    ? history.filter(
        (item) => item.benefitsName.benefitsName === selectedBenefit
      )
    : [];

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Benefit Deductions</h3>

      {groupedArray.length === 0 ? (
        <p>No deductions available.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b text-left">Employee Name</th>
              <th className="px-4 py-2 border-b text-left">Benefit Name</th>
              <th className="px-4 py-2 border-b text-left">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {groupedArray.map((deduction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  {renderedEmployees[deduction.employeeId]
                    ? ""
                    : deduction.employeeName}
                  {(renderedEmployees[deduction.employeeId] = true)}
                </td>
                <td
                  className="px-4 py-2 border-b text-blue-500 cursor-pointer"
                  onClick={() => setSelectedBenefit(deduction.benefitsName)}
                >
                  {deduction.benefitsName}
                </td>
                <td className="px-4 py-2 border-b">{deduction.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedBenefit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Benefit Deduction History for {selectedBenefit}
            </h3>
            {filteredHistory.length === 0 ? (
              <p>No history available for this benefit.</p>
            ) : (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2 border-b text-left">
                      Employee Name
                    </th>
                    <th className="px-4 py-2 border-b text-left">Amount</th>
                    <th className="px-4 py-2 border-b text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((historyItem, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">
                        {historyItem.employeeId.firstName}{" "}
                        {historyItem.employeeId.lastName}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {historyItem.amount}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {new Date(historyItem.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
              onClick={() => setSelectedBenefit(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeductionsManagement;
