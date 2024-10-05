import React, { useState } from 'react';

const UpdatePersonalInformation = () => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Update Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className="block w-full p-2 text-sm border border-gray-300 rounded"
            type="text"
            id="firstName"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="block w-full p-2 text-sm border border-gray-300 rounded"
            type="text"
            id="lastName"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="block w-full p-2 text-sm border border-gray-300 rounded"
            type="email"
            id="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            className="block w-full p-2 text-sm border border-gray-300 rounded"
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={employee.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="address">
            Address
          </label>
          <textarea
            className="block w-full p-2 text-sm border border-gray-300 rounded"
            id="address"
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Update
        </button>
      </form>
      {isSubmitted && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-sm font-medium">Personal information updated successfully!</p>
        </div>
      )}
    </div>
  );
};

export default UpdatePersonalInformation;
