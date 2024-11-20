import React, { useState } from 'react';

const employees = [
  { id: 1, firstName: 'Borlagdatan John Lloyd', lastName: 'Borla' },
  { id: 2, firstName: 'Padit Oliver', lastName: 'Padit' },
  { id: 3, firstName: 'Canja Abeguel', lastName: 'Lumod' },
];

const deductionTypes = ['SSS', 'PhilHealth', 'Pag-IBIG'];

const initialDeductions = [
  { employeeId: 1, type: 'SSS', amount: 500, date: '2024-09-01' },
  { employeeId: 2, type: 'Pag-IBIG', amount: 200, date: '2024-09-01' },
  { employeeId: 2, type: 'SSS', amount: 200, date: '2024-09-01' },
  { employeeId: 3, type: 'Pag-IBIG', amount: 200, date: '2024-10-01' },
  { employeeId: 3, type: 'SSS', amount: 300, date: '2024-10-01' },
];

const DeductionsManagement = () => {
  const [deductions, setDeductions] = useState(initialDeductions);
  const [deductionAmount, setDeductionAmount] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [deductionType, setDeductionType] = useState('');
  const [selectedEmployeeDates, setSelectedEmployeeDates] = useState(null);

  const handleAddDeduction = () => {
    if (selectedEmployee && deductionAmount && deductionType) {
      const newDeduction = {
        employeeId: parseInt(selectedEmployee),
        type: deductionType,
        amount: parseFloat(deductionAmount),
        date: new Date().toISOString().split('T')[0],
      };
      setDeductions((prevDeductions) => [...prevDeductions, newDeduction]);
      setDeductionAmount('');
      setSelectedEmployee('');
      setDeductionType('');
    }
  };

  const aggregatedDeductions = employees.map((employee) => {
    const employeeDeductions = deductions
      .filter((deduction) => deduction.employeeId === employee.id)
      .reduce(
        (acc, curr) => {
          acc.deductionsByType[curr.type] = (acc.deductionsByType[curr.type] || 0) + curr.amount;
          acc.total += curr.amount;
          acc.dates.push({ type: curr.type, amount: curr.amount, date: curr.date });
          return acc;
        },
        { deductionsByType: {}, total: 0, dates: [] }
      );

    return {
      employee,
      deductions: employeeDeductions.deductionsByType,
      total: employeeDeductions.total,
      dates: employeeDeductions.dates,
    };
  });

  const handleViewDates = (dates) => {
    setSelectedEmployeeDates(dates);
  };

  const closeModal = () => {
    setSelectedEmployeeDates(null);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h2 className="text-2xl font-semibold mb-4">Deductions Management</h2>
      <div className="mb-4 flex flex-col md:flex-row">
        <select
          className="select w-full max-w-xs mb-2 md:mr-2"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
        <select
          className="select w-full max-w-xs mb-2 md:mr-2"
          value={deductionType}
          onChange={(e) => setDeductionType(e.target.value)}
        >
          <option value="">Select Deduction Type</option>
          {deductionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={deductionAmount}
          onChange={(e) => setDeductionAmount(e.target.value)}
          placeholder="Deduction Amount"
          className="input w-full max-w-xs mb-2"
        />
        <button onClick={handleAddDeduction} className="btn btn-primary w-32 max-w-xs">
          Add Deduction
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Deductions Summary</h3>
      <table className="table w-full">
        <thead>
          <tr className="bg-primary text-white">
          <th className="border px-4 py-2">Employee Name</th>
            <th className="border px-4 py-2">SSS</th>
            <th className="border px-4 py-2">PhilHealth</th>
            <th className="border px-4 py-2">Pag-IBIG</th>
            <th className="border px-4 py-2">Total Deductions</th>
            <th className="border px-4 py-2">Dates</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedDeductions.map(({ employee, deductions, total, dates }) => (
            <tr key={employee.id} className="hover:bg-neutral hover:text-white">
              <td className="border px-4 py-2">{`${employee.firstName} ${employee.lastName}`}</td>
              <td className="border px-4 py-2">{deductions.SSS || 0}</td>
              <td className="border px-4 py-2">{deductions.PhilHealth || 0}</td>
              <td className="border px-4 py-2">{deductions['Pag-IBIG'] || 0}</td>
              <td className="border px-4 py-2">{total}</td>
              <td className="border px-4 py-2">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleViewDates(dates)}
                >
                  View Dates
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployeeDates && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="modal-box w-full max-w-lg p-5 bg-white rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Deduction Dates</h4>
            <ul>
              {selectedEmployeeDates.map((deduction, index) => (
                <li key={index} className="mb-2">
                  {`${deduction.type} - ${deduction.amount} - ${deduction.date}`}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="btn btn-secondary mt-4 w-full"
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
