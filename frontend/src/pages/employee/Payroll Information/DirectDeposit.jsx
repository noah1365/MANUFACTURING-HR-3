import React, { useState } from 'react';

const DirectDeposit = () => {
  const [formData, setFormData] = useState({
    accountHolder: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Direct Deposit Info:', formData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Direct Deposit Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Account Holder Name</span>
          </label>
          <input 
            type="text" 
            name="accountHolder" 
            value={formData.accountHolder} 
            onChange={handleChange} 
            className="input input-bordered" 
            required 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Bank Name</span>
          </label>
          <input 
            type="text" 
            name="bankName" 
            value={formData.bankName} 
            onChange={handleChange} 
            className="input input-bordered" 
            required 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Routing Number</span>
          </label>
          <input 
            type="text" 
            name="routingNumber" 
            value={formData.routingNumber} 
            onChange={handleChange} 
            className="input input-bordered" 
            required 
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Account Number</span>
          </label>
          <input 
            type="text" 
            name="accountNumber" 
            value={formData.accountNumber} 
            onChange={handleChange} 
            className="input input-bordered" 
            required 
          />
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default DirectDeposit;
