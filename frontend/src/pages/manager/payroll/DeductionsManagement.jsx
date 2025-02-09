import React, { useState, useEffect } from "react";
import { useBenefitStore } from "../../../store/benefitStore";

const DeductionsManagement = () => {
  const {
    deductions,
    error,
    fetchBenefitDeductions,
    history,
    fetchBenefitDeductionHistory,
    addBenefitDeduction,
  } = useBenefitStore();
  
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [benefitsName, setBenefitsName] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchBenefitDeductions();
    fetchBenefitDeductionHistory();
  }, [fetchBenefitDeductions, fetchBenefitDeductionHistory]);

  const handleAddDeduction = async (e) => {
    e.preventDefault();
    
    // Ensure 'amount' is converted to a number and check if valid
    const amountAsNumber = Number(amount); // Convert string to number
    if (!employeeId || !benefitsName || !amount || amountAsNumber <= 0 || isNaN(amountAsNumber)) {
      setErrorMessage("Please fill in all fields correctly.");
      return;
    }
  
    // Clear previous error message
    setErrorMessage("");
  
    const deductionData = {
      employeeId,
      benefitsName,
      amount: amountAsNumber, // Ensure amount is number here
    };
  
    try {
      const response = await addBenefitDeduction(deductionData); // Call the store's function
      if (response.success) {
        alert("Benefit Deduction added successfully");
        fetchBenefitDeductions(); // Refresh the deductions list
        fetchBenefitDeductionHistory(); // Refetch history to update the view
      } else {
        setErrorMessage(response.message || "Failed to add deduction.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the deduction.");
    }
  };



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

  const filteredHistory = selectedBenefit
    ? history.filter(
        (item) => item.benefitsName.benefitsName === selectedBenefit
      )
    : [];

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Benefit Deductions</h3>
      
      <form onSubmit={handleAddDeduction} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Employee ID"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Benefit Name</label>
          <input
            type="text"
            value={benefitsName}
            onChange={(e) => setBenefitsName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Benefit Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Amount</label>
          <input
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded"
  placeholder="Enter Amount"
/>

        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Deduction
        </button>
      </form>

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
                    <th className="px-4 py-2 border-b text-left">Employee Name</th>
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
                      <td className="px-4 py-2 border-b">{historyItem.amount}</td>
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
