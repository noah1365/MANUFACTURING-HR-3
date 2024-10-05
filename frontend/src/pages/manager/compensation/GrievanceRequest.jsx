import React, { useEffect, useState } from 'react';

const GrievanceRequest = () => {
  const [grievances, setGrievances] = useState([
    { employeeName: 'John Lloyd', grievanceDescription: 'I have an issue with my salary.', status: 'Pending', response: '', compensationFile: null },
    { employeeName: 'Oliver', grievanceDescription: 'Work conditions are not satisfactory.', status: 'Pending', response: '', compensationFile: null },
    { employeeName: 'Abby', grievanceDescription: 'Work conditions are not satisfactory.', status: 'Pending', response: '', compensationFile: null },
  ]);
  const [selectedGrievanceIndex, setSelectedGrievanceIndex] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [compensationFile, setCompensationFile] = useState(null);

  const handleResponseSubmit = (index) => {
    const updatedGrievances = grievances.map((grievance, i) => 
      i === index 
        ? { ...grievance, status: 'Responded', response: responseText, compensationFile } 
        : grievance
    );
    setGrievances(updatedGrievances);
    setResponseText('');
    setCompensationFile(null); 
    setSelectedGrievanceIndex(null);
  };

  useEffect(() => {
    document.title = 'Grievance Request';
  }, []); 
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Grievance Management</h1>
      <table className="table table-auto w-full border">
        <thead>
          <tr className="bg-primary text-white">
            <th className="border p-2">Employee Name</th>
            <th className="border p-2">Grievance Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((grievance, index) => (
            <tr key={index} className="hover:bg-neutral hover:text-white">
              <td className="border p-2">{grievance.employeeName}</td>
              <td className="border p-2">{grievance.grievanceDescription}</td>
              <td className="border p-2">{grievance.status}</td>
              <td className="border p-2">
                <button 
                  className="btn btn-primary" 
                  onClick={() => setSelectedGrievanceIndex(index)}
                >
                  Respond
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedGrievanceIndex !== null && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">Response to Grievance</h2>
          <textarea 
            value={responseText} 
            onChange={(e) => setResponseText(e.target.value)} 
            className="textarea textarea-bordered w-full" 
            placeholder="Type your response here..." 
            rows={4}
          />
          <div className="mt-4">
            <label className="block mb-1">Upload Compensation Document:</label>
            <input 
              type="file" 
              onChange={(e) => setCompensationFile(e.target.files[0])} 
              className="input input-bordered" 
            />
          </div>
          <button 
            className="btn btn-primary mt-2" 
            onClick={() => handleResponseSubmit(selectedGrievanceIndex)}
          >
            Send Response
          </button>
          {compensationFile && (
            <div className="mt-2">
              <strong>Uploaded File:</strong> {compensationFile.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GrievanceRequest;