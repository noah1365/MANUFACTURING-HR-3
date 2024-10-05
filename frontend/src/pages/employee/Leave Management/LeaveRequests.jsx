import React, { useState } from 'react';

const LeaveRequest = () => {
  const [leaveRequest, setLeaveRequest] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // You can add additional logic for form submission here (e.g., API calls)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest({ ...leaveRequest, [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Leave Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="label" htmlFor="name">
            <span className="label-text">Name</span>
          </label>
          <input
            className="input input-bordered w-full"
            id="name"
            type="text"
            name="name"
            value={leaveRequest.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="startDate">
            <span className="label-text">Start Date</span>
          </label>
          <input
            className="input input-bordered w-full"
            id="startDate"
            type="date"
            name="startDate"
            value={leaveRequest.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="endDate">
            <span className="label-text">End Date</span>
          </label>
          <input
            className="input input-bordered w-full"
            id="endDate"
            type="date"
            name="endDate"
            value={leaveRequest.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="reason">
            <span className="label-text">Reason</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            id="reason"
            name="reason"
            value={leaveRequest.reason}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="label" htmlFor="type">
            <span className="label-text">Type</span>
          </label>
          <select
            className="select select-bordered w-full"
            id="type"
            name="type"
            value={leaveRequest.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
            <option value="Paternity Leave">Paternity Leave</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button
          className="btn btn-primary w-full"
          type="submit"
        >
          Submit
        </button>
      </form>
      {isSubmitted && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Leave request submitted successfully!</p>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
