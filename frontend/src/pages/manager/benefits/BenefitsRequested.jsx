import React, { useState, useEffect } from 'react';
import { useBenefitStore } from '../../../store/benefitStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';


const BenefitsRequested = () => {
  const { benefits, fetchAllRequestBenefits, updateRequestBenefitStatus } = useBenefitStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const processedRequests = benefits.filter(request => request.status === 'Approved' || request.status === 'Denied');

  const socketURL = import.meta.env.MODE === "development" 
  ? "http://localhost:7687" 
  : window.location.origin;

const socket = io(socketURL, { withCredentials: true });


  useEffect(() => {
    document.title = 'Benefit Enrollment Requested';
    const loadRequests = async () => {
      await fetchAllRequestBenefits();
      setLoading(false);
      socket.on('existingBenefitRequests', (requests) => {
        setSalaryRequests(requests);
      });
  
      socket.on('newBenefitRequest', (newRequest) => {
        addSalaryRequest(newRequest);
      });
  
      return () => {
        socket.disconnect();
      };
    };
    loadRequests();
  }, [fetchAllRequestBenefits]);

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedRequest) return;

    try {
      await updateRequestBenefitStatus(selectedRequest._id, status);
      await fetchAllRequestBenefits(); // Reload updated list
      toast.success(`Request ${status} successfully!`, { autoClose: 2000 });
      closeModal();
    } catch (error) {
      toast.error('Failed to update status.');
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer/>
      <h1 className="text-2xl text-center font-bold mb-4 text-blue-600">Benefits Requests</h1>
      {benefits.length === 0 ? (
        <p>No enrollment requests available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.filter(request => request.status !== 'Approved' && request.status !== 'Denied').map((request) => (
            <div
              key={request._id}
              className="border border-blue-200 bg-white p-4 rounded-lg shadow-md cursor-pointer transition-shadow duration-200 hover:shadow-lg"
              onClick={() => handleSelectRequest(request)}
            >
              <h2 className="text-lg font-semibold mb-1 text-blue-700">
                {`${request.employeeId.firstName} ${request.employeeId.lastName}`}
              </h2>
              <p className="text-sm"><strong>Status:</strong> {request.status}</p>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button onClick={closeModal} className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded-full">&times;</button>
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            <p><strong>Name:</strong> {`${selectedRequest.employeeId.firstName} ${selectedRequest.employeeId.lastName}`}</p>
            <p><strong>Benefit Name:</strong> {selectedRequest.benefitsName?.benefitsName || "N/A"}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Requested Date:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
            <div className="mt-4">
              <h3 className="font-bold">Uploaded IDs</h3>
              <div className="flex flex-col gap-4 mt-2">
                {selectedRequest.uploadDocs?.frontId && (
                  <div className="text-center">
                    <p className="font-semibold">Front ID</p>
                    <img
                      src={selectedRequest.uploadDocs.frontId}
                      alt="Front ID"
                      className="w-40 h-24 object-cover border rounded-md shadow-md cursor-pointer"
                      onClick={() => openImageInNewTab(selectedRequest.uploadDocs.frontId)}
                    />
                  </div>
                )}
                {selectedRequest.uploadDocs?.backId && (
                  <div className="text-center">
                    <p className="font-semibold">Back ID</p>
                    <img
                      src={selectedRequest.uploadDocs.backId}
                      alt="Back ID"
                      className="w-40 h-24 object-cover border rounded-md shadow-md cursor-pointer"
                      onClick={() => openImageInNewTab(selectedRequest.uploadDocs.backId)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={() => handleStatusUpdate('Approved')} className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
              <button onClick={() => handleStatusUpdate('Denied')} className="bg-red-500 text-white px-4 py-2 rounded">Deny</button>
            </div>
          </div>
        </div>
      )}

<h2 className="text-xl font-bold mt-6 text-center">Processed Requests</h2>
<table className="table w-full mb-4">
  <thead>
    <tr className="bg-primary text-white">
      <th className="border px-4 py-2">Employee Name</th>
      <th className="border px-4 py-2">Benefit Name</th>
      <th className="border px-4 py-2">Uploaded IDs</th>
      <th className="border px-4 py-2">Status</th>
    </tr>
  </thead>
  <tbody>
    {processedRequests.map((request) => (
      <tr key={request._id} className="hover:bg-neutral hover:text-white">
        <td className="border px-4 py-2">{`${request.employeeId.firstName} ${request.employeeId.lastName}`}</td>
        <td className="border px-4 py-2">{request.benefitsName?.benefitsName || "N/A"}</td>
        <td className="border px-4 py-2 flex justify-center gap-4">
          {request.uploadDocs?.frontId && (
            <div className="relative group">
              <img
                src={request.uploadDocs.frontId}
                alt="Front ID"
                className="w-16 h-10 object-cover border rounded cursor-pointer"
                onClick={() => openImageInNewTab(request.uploadDocs.frontId)}
              />
              <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Front ID
              </span>
            </div>
          )}
          {request.uploadDocs?.backId && (
            <div className="relative group">
              <img
                src={request.uploadDocs.backId}
                alt="Back ID"
                className="w-16 h-10 object-cover border rounded cursor-pointer"
                onClick={() => openImageInNewTab(request.uploadDocs.backId)}
              />
              <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Back ID
              </span>
            </div>
          )}
        </td>
        <td className={`border px-4 py-2 font-bold ${request.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{request.status}</td>
      </tr>
    ))}
  </tbody>
</table>


    </div>
  );
};

export default BenefitsRequested;
