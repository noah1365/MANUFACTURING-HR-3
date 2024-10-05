import React, { useState } from 'react';

const PayStub = () => {
  const [payStub, setPayStub] = useState({
    employeeName: 'John Doe',
    employeeAddress: '123 Main St, Anytown, USA 12345',
    payPeriod: '01/01/2024 - 01/15/2024',
    payDate: '01/20/2024',
    grossPay: 5000.00,
    federalTax: 750.00,
    stateTax: 250.00,
    netPay: 4000.00,
  });

  const [payStubs, setPayStubs] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPayStub({ ...payStub, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPayStubs([...payStubs, payStub]);
    setPayStub({
      employeeName: '',
      employeeAddress: '',
      payPeriod: '',
      payDate: '',
      grossPay: 0,
      federalTax: 0,
      stateTax: 0,
      netPay: 0,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Pay Stub</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-bold mb-2">Employee Information</label>
          <input
            type="text"
            name="employeeName"
            value={payStub.employeeName}
            onChange={handleInputChange}
            placeholder="Employee Name"
            className="input input-bordered mb-2"
          />
          <input
            type="text"
            name="employeeAddress"
            value={payStub.employeeAddress}
            onChange={handleInputChange}
            placeholder="Employee Address"
            className="input input-bordered mb-2"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-bold mb-2">Pay Period</label>
          <input
            type="text"
            name="payPeriod"
            value={payStub.payPeriod}
            onChange={handleInputChange}
            placeholder="Pay Period"
            className="input input-bordered mb-2"
          />
          <input
            type="text"
            name="payDate"
            value={payStub.payDate}
            onChange={handleInputChange}
            placeholder="Pay Date"
            className="input input-bordered mb-2"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-bold mb-2">Earnings</label>
          <div className="flex justify-between mb-2">
            <span>Gross Pay:</span>
            <input
              type="number"
              name="grossPay"
              value={payStub.grossPay}
              onChange={handleInputChange}
              placeholder="Gross Pay"
              className="input input-bordered w-1/2"
            />
          </div>
          <div className="flex justify-between mb-2">
            <span>Federal Tax:</span>
            <input
              type="number"
              name="federalTax"
              value={payStub.federalTax}
              onChange={handleInputChange}
              placeholder="Federal Tax"
              className="input input-bordered w-1/2"
            />
          </div>
          <div className="flex justify-between mb-2">
            <span>State Tax:</span>
            <input
              type="number"
              name="stateTax"
              value={payStub.stateTax}
              onChange={handleInputChange}
              placeholder="State Tax"
              className="input input-bordered w-1/2"
            />
          </div>
          <div className="flex justify-between mb-2">
            <span>Net Pay:</span>
            <input
              type="number"
              name="netPay"
              value={payStub.netPay}
              onChange={handleInputChange}
              placeholder="Net Pay"
              className="input input-bordered w-1/2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Add Pay Stub
        </button>
      </form>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Employee Name</th>
            <th className="px-4 py-2">Pay Period</th>
            <th className="px-4 py-2">Gross Pay (₱)</th>
            <th className="px-4 py-2">Federal Tax (₱)</th>
            <th className="px-4 py-2">State Tax (₱)</th>
            <th className="px-4 py-2">Net Pay (₱)</th>
          </tr>
        </thead>
        <tbody>
          {payStubs.map((payStub, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{payStub.employeeName}</td>
              <td className="px-4 py-2">{payStub.payPeriod}</td>
              <td className="px-4 py-2">₱{payStub.grossPay.toFixed(2)}</td>
              <td className="px-4 py-2">₱{payStub.federalTax.toFixed(2)}</td>
              <td className="px-4 py-2">₱{payStub.stateTax.toFixed(2)}</td>
              <td className="px-4 py-2">₱{payStub.netPay.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayStub;
