import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { usePayrollStore } from '../../../store/payrollStore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SalaryDistribution = () => {
  const { salaryRequests,setSalaryRequests, addSalaryRequest, fetchSalaryRequests, reviewRequest,toggleRequestAvailability } = usePayrollStore();
  const socketURL = import.meta.env.MODE === "development" 
  ? "http://localhost:7687" 
  : window.location.origin;

const socket = io(socketURL, { withCredentials: true });

  const [visibleSection, setVisibleSection] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    document.title = 'Payroll Distribution';
    fetchSalaryRequests();

    socket.on('existingSalaryRequests', (requests) => {
      setSalaryRequests(requests);
    });

    socket.on('newSalaryRequest', (newRequest) => {
      addSalaryRequest(newRequest);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // add socket for real-time

  const handleReviewRequest = (requestId, action) => {
    reviewRequest(requestId, action);
    if (action === 'approve') {
      toast.success('Salary request approved successfully!');
    } else if (action === 'deny') {
      toast.error('Salary request denied.');
    }
  };

  const handleToggleAvailability = async () => {
    await toggleRequestAvailability();
    setIsAvailable(!isAvailable);
    toast.success(`Salary requests are now ${isAvailable ? 'disabled' : 'enabled'}`);
  };

  const pendingRequests = salaryRequests.filter(request => request.status === 'Pending');
  const approvedRequests = salaryRequests.filter(request => request.status === 'Approved');
  const deniedRequests = salaryRequests.filter(request => request.status === 'Rejected');

  const renderRequests = (requests) => (
    <table className="table w-full border border-base-300 mb-4">
      <thead>
        <tr className="bg-primary text-white">
          <th className="border px-4 py-2">Employee Name</th>
          <th className="border px-4 py-2">Salary Amount</th>
          <th className="border px-4 py-2">Payment Method</th>
          <th className="border px-4 py-2">GCash Number</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.length > 0 ? (
          requests.map((request) => (
            <tr key={request._id} className="hover:bg-neutral hover:text-white">
              <td className="border px-4 py-2">{`${request.employeeId.firstName} ${request.employeeId.lastName}`}</td>
              <td className="border px-4 py-2">
                ₱{typeof request.requestedAmount === 'number' ? request.requestedAmount.toFixed(2) : 'N/A'}
              </td>
              <td className="border px-4 py-2">{request.paymentMethod}</td>
              <td className="border px-4 py-2">{request.paymentMethod === 'GCash' ? request.gCashNumber : 'N/A'}</td>
              <td className="border px-4 py-2 flex space-x-2">
                {request.status === 'Approved' || request.status === 'Rejected' ? (
                  <span className={`badge ${request.status === 'Approved' ? 'badge-success' : 'badge-error'}`}>
                    {request.status}
                  </span>
                ) : (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => handleReviewRequest(request._id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleReviewRequest(request._id, 'deny')}
                    >
                      Deny
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="border px-4 py-2 text-center">No requests found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6">Salary Distribution Requests</h1>
      <div className="flex justify-center space-x-4 mb-4">
      <button 
          className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={handleToggleAvailability}
        >
          {isAvailable ? 'Disable Salary Requests' : 'Enable Salary Requests'}
        </button>
        <button 
          className={`btn btn-primary ${visibleSection === 'pending' ? 'btn-active' : ''}`} 
          onClick={() => setVisibleSection(visibleSection === 'pending' ? null : 'pending')}
        >
          {visibleSection === 'pending' ? 'Hide Pending' : 'View Pending'}
        </button>
        <button 
          className={`btn btn-primary ${visibleSection === 'approved' ? 'btn-active' : ''}`} 
          onClick={() => setVisibleSection(visibleSection === 'approved' ? null : 'approved')}
        >
          {visibleSection === 'approved' ? 'Hide Approved' : 'View Approved'}
        </button>
        <button 
          className={`btn btn-primary ${visibleSection === 'denied' ? 'btn-active' : ''}`} 
          onClick={() => setVisibleSection(visibleSection === 'denied' ? null : 'denied')}
        >
          {visibleSection === 'denied' ? 'Hide Denied' : 'View Denied'}
        </button>
      </div>

      {visibleSection === 'pending' && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Pending Requests</h2>
          {renderRequests(pendingRequests)}
        </>
      )}
      {visibleSection === 'approved' && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Approved Requests</h2>
          {renderRequests(approvedRequests)}
        </>
      )}
      {visibleSection === 'denied' && (
        <>
          <h2 className="text-2xl font-semibold mb-2">Denied Requests</h2>
          {renderRequests(deniedRequests)}
        </>
      )}
    </div>
  );
};

export default SalaryDistribution;
