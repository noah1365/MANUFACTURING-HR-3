import React, { useEffect, useState } from 'react';
import { usePayrollStore } from '../../../store/payrollStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalaryRequest = () => {
  const { 
    requestedAmount, 
    setRequestedAmount, 
    paymentMethod, 
    setPaymentMethod, 
    gCashNumber, 
    setGCashNumber, 
    message, 
    requestSalary 
  } = usePayrollStore();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if(!requestedAmount){
      newErrors.requestedAmount = 'Requested amount is required.';
    }else if(requestedAmount <= 0){
      newErrors.requestedAmount = 'Requested amount must be a positive number.';
    }

    if(!paymentMethod){
      newErrors.paymentMethod = 'Payment method is required.';
    }else if(!['Cash', 'GCash'].includes(paymentMethod)){
      newErrors.paymentMethod = 'Payment method must be either "Cash" or "GCash".';
    }

    if(paymentMethod === 'GCash'){
      if(!gCashNumber){
        newErrors.gCashNumber = 'GCash number is required.';
      }else if(!/^(09|\+639)\d{9}$/.test(gCashNumber)){
        newErrors.gCashNumber = 'Invalid GCash number format! Must start with 09 or +639 and have 11 digits.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      await requestSalary();
      const { message } = usePayrollStore.getState();
      
      if (message) {
        toast.success(message);
      } else {
        toast.error('An error occurred. Please try again.1');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };
  
  useEffect(() => {
    document.title = "Salary Request";
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold mb-4">Request Salary Distribution</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="requestedAmount" className="block mb-2">Amount to Request</label>
          <input
            id="requestedAmount"
            type="number"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(Number(e.target.value))}
            className={`input input-bordered w-full ${errors.requestedAmount ? 'border-red-500' : ''}`}
            required
          />
          {errors.requestedAmount && <p className="text-red-500">{errors.requestedAmount}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block mb-2">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              if (e.target.value === 'Cash') {
                setGCashNumber('');
              }
            }}
            className={`select select-bordered w-full ${errors.paymentMethod ? 'border-red-500' : ''}`}
          >
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
          </select>
          {errors.paymentMethod && <p className="text-red-500">{errors.paymentMethod}</p>}
        </div>

        {paymentMethod === 'GCash' && (
          <div className="mb-4">
            <label htmlFor="gCashNumber" className="block mb-2">GCash Number</label>
            <input
              id="gCashNumber"
              type="text"
              value={gCashNumber}
              onChange={(e) => setGCashNumber(e.target.value)}
              className={`input input-bordered w-full ${errors.gCashNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.gCashNumber && <p className="text-red-500">{errors.gCashNumber}</p>}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full">Submit Request</button>
      </form>
    </div>
  );
};

export default SalaryRequest;
