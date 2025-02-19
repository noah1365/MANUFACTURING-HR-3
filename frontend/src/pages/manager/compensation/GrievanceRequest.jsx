import React, { useEffect, useState } from 'react';

const GrievanceRequest = () => {
  const [grievances, setGrievances] = useState([
    {
      referenceNo: 'GR-20250219-001',
      employeeName: 'Borlagdatan Johnlloyd',
      dateSubmitted: '2025-02-19',
      category: 'Salary Issue',
      grievanceDescription: 'I have an issue with my salary.',
      status: 'Pending',
      adminResponse: '',
      remarks: '',
      proofFile: null,
    },
    {
      referenceNo: 'GR-20250219-002',
      employeeName: 'Padit Oliver',
      dateSubmitted: '2025-02-19',
      category: 'Work Conditions',
      grievanceDescription: 'Work conditions are not satisfactory.',
      status: 'Pending',
      adminResponse: '',
      remarks: '',
      proofFile: null,
    },
  ]);

  const [selectedGrievanceIndex, setSelectedGrievanceIndex] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [remarksText, setRemarksText] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleAdminResponseSubmit = (index) => {
    setLoading(true);
    setTimeout(() => {
      const updatedGrievances = grievances.map((grievance, i) =>
        i === index
          ? { ...grievance, status: 'Responded', adminResponse: responseText, remarks: remarksText, proofFile }
          : grievance
      );
      setGrievances(updatedGrievances);
      setResponseText('');
      setRemarksText('');
      setProofFile(null);
      setSelectedGrievanceIndex(null);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    document.title = 'Grievance Request';
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold mb-4">Grievance Requests</h1>
      <table className="table table-auto w-full border">
        <thead>
          <tr className="bg-primary text-white">
            <th className="border p-2">Reference No.</th>
            <th className="border p-2">Employee Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((grievance, index) => (
            <tr key={index} className="hover:bg-neutral hover:text-white">
              <td className="border p-2">{grievance.referenceNo}</td>
              <td className="border p-2">{grievance.employeeName}</td>
              <td className="border p-2">{grievance.category}</td>
              <td className="border p-2">{grievance.status}</td>
              <td className="border p-2">
                <button 
                  className="btn btn-primary" 
                  onClick={() => setSelectedGrievanceIndex(index)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedGrievanceIndex !== null && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">Grievance Details</h2>
          <p><strong>Reference No.:</strong> {grievances[selectedGrievanceIndex].referenceNo}</p>
          <p><strong>Submitted By:</strong> {grievances[selectedGrievanceIndex].employeeName}</p>
          <p><strong>Category:</strong> {grievances[selectedGrievanceIndex].category}</p>
          <p><strong>Description:</strong> {grievances[selectedGrievanceIndex].grievanceDescription}</p>
          <p><strong>Date Submitted:</strong> {grievances[selectedGrievanceIndex].dateSubmitted}</p>

          <label className="block mt-4">Remarks:</label>
          <textarea 
            value={remarksText} 
            onChange={(e) => setRemarksText(e.target.value)} 
            className="textarea textarea-bordered w-full" 
            placeholder="Enter remarks..." 
            rows={2}
          />

          <label className="block mt-4">Admin Response:</label>
          <textarea 
            value={responseText} 
            onChange={(e) => setResponseText(e.target.value)} 
            className="textarea textarea-bordered w-full" 
            placeholder="Type your response here..." 
            rows={4}
          />

          <label className="block mt-4">Attach Proof (Optional):</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="input input-bordered"
          />
          {proofFile && (
            <p className="mt-2"><strong>Uploaded File:</strong> {proofFile.name}</p>
          )}

          <button 
            className="btn btn-primary mt-4" 
            onClick={() => handleAdminResponseSubmit(selectedGrievanceIndex)} 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Send Response'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GrievanceRequest;
