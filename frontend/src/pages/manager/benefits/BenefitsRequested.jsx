import React, { useState, useEffect } from 'react';

const BenefitsRequested = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchEnrollmentRequests = async () => {
    const mockData = [
      {
        id: 1,
        lastName: 'Borlagdatan',
        firstName: 'John Lloyd',
        middleName: 'M',
        dateOfBirth: '1990-01-01',
        phoneNumber: '09171234567',
        email: 'john.doe@example.com',
        address: {
          street: '123 Main St',
          municipality: 'Quezon City',
          province: 'Metro Manila',
          postalCode: '1100'
        },
        benefitType: 'Health Insurance',
        coverageType: 'Employee Only',
        files: [
          { id: 1, name: 'Front ID.jpg', url: 'https://example.com/files/front_id.jpg' },
          { id: 2, name: 'Back ID.jpg', url: 'https://example.com/files/back_id.jpg' }
        ],
        status: 'Pending',
        submittedToAdmin: false
      },
      {
        id: 2,
        lastName: 'Canja',
        firstName: 'Abeguel',
        middleName: 'A',
        dateOfBirth: '1988-05-20',
        phoneNumber: '09179876543',
        email: 'jane.smith@example.com',
        address: {
          street: '456 Side St',
          municipality: 'Makati City',
          province: 'Metro Manila',
          postalCode: '1200'
        },
        benefitType: 'SSS',
        coverageType: 'Family',
        files: [
          { id: 3, name: 'Front ID.jpg', url: 'https://example.com/files/front_id.jpg' },
          { id: 4, name: 'Back ID.jpg', url: 'https://example.com/files/back_id.jpg' }
        ],
        status: 'Pending',
        submittedToAdmin: false
      }
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 1000);
    });
  };

  useEffect(() => {
    document.title = 'Benefit Enrollment requested'
    const loadRequests = async () => {
      const data = await fetchEnrollmentRequests();
      setRequests(data);
      setLoading(false);
    };

    loadRequests();
  }, []);

  const handleApproval = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Approved' } : request
      )
    );
    setSelectedRequest(null);
  };

  const handleDenial = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: 'Denied' } : request
      )
    );
    setSelectedRequest(null);
  };

  const handleSubmitToAdmin = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, submittedToAdmin: true } : request
      )
    );
    alert('Request submitted to admin.');
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(selectedRequest?.id === request.id ? null : request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-2xl text-center font-bold mb-4 text-blue-600">Benefits Requests</h1>
      {requests.length === 0 ? (
        <p>No enrollment requests available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="border border-blue-200 bg-white p-4 rounded-lg shadow-md cursor-pointer transition-shadow duration-200 hover:shadow-lg" 
              onClick={() => handleSelectRequest(request)}
            >
              <h2 className="text-lg font-semibold mb-1 text-blue-700">{`${request.firstName} ${request.lastName}`}</h2>
              <p className="text-sm"><strong>Status:</strong> {request.status}</p>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">{`${selectedRequest.firstName} ${selectedRequest.lastName}`}</h2>
            <p><strong>Middle Name:</strong> {selectedRequest.middleName}</p>
            <p><strong>Date of Birth:</strong> {selectedRequest.dateOfBirth}</p>
            <p><strong>Phone:</strong> {selectedRequest.phoneNumber}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Address:</strong></p>
            <p>{selectedRequest.address.street}</p>
            <p>{`${selectedRequest.address.municipality}, ${selectedRequest.address.province} ${selectedRequest.address.postalCode}`}</p>
            <p><strong>Benefit:</strong> {selectedRequest.benefitType}</p>
            <p><strong>Coverage:</strong> {selectedRequest.coverageType}</p>

            <div className="mt-4">
              <h3 className="text-md font-semibold">Uploaded Documents:</h3>
              <div className="flex flex-col mt-2">
                {selectedRequest.files.map((file) => (
                  <div key={file.id} className="flex items-center mb-1">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-2">
                      {file.name}
                    </a>
                    <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded border border-gray-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button 
                className="btn btn-success btn-sm"
                onClick={() => handleApproval(selectedRequest.id)}
                disabled={selectedRequest.status !== 'Pending'}
              >
                Approve
              </button>
              <button 
                className="btn btn-error btn-sm"
                onClick={() => handleDenial(selectedRequest.id)}
                disabled={selectedRequest.status !== 'Pending'}
              >
                Deny
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={closeModal}
              >
                Close
              </button>
              {selectedRequest.status === 'Approved' && !selectedRequest.submittedToAdmin && (
                <button 
                  className="btn btn-info btn-sm"
                  onClick={() => handleSubmitToAdmin(selectedRequest.id)}
                >
                  Submit to Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitsRequested;
