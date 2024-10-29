import React, { useEffect, useState } from 'react';

const GenerateReports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleReportGeneration = () => {
    if (!reportType) {
      alert('Please select a report type before generating the report.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    setTimeout(() => {
      // Sample report data for different report types
      const sampleReportData = [
        { employeeName: 'John Lloyd', salary: 30000, paymentMethod: 'Cash', status: 'Approved', date: new Date().toLocaleDateString() },
        { employeeName: 'Oliver', salary: 32000, paymentMethod: 'GCash', status: 'Approved', date: new Date().toLocaleDateString() },
        { employeeName: 'Abby', salary: 32000, paymentMethod: 'GCash', status: 'Approved', date: new Date().toLocaleDateString() },
      ];

      // Filter for custom date range
      if (reportType === 'custom' && startDate && endDate) {
        const filteredData = sampleReportData.filter(data => {
          const reportDate = new Date(data.date);
          return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
        });
        setReportData(filteredData);
      } else {
        // Populate report data for other types
        setReportData(sampleReportData);
      }

      setSuccessMessage('Report generated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('report-table').innerHTML;
    const newWindow = window.open('', '', 'width=800, height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Payroll Report</title>
          <link href="https://cdn.jsdelivr.net/npm/daisyui/dist/full.css" rel="stylesheet" />
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: left; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 12px; text-align: left; }
            th { background-color: #007bff; color: white; }
            tr:hover { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Payroll Report</h1>
          <div>${printContent}</div>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  const handleClearReport = () => {
    setReportData([]);
    setSuccessMessage('');
    setReportType('');
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => {
    document.title = 'Generate Reports';
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-4xl font-bold mb-6">Generate Reports</h1>

      <div className="mb-6">
        <label className="label" htmlFor="reportType">
          <span className="label-text">Select Report Type:</span>
        </label>
        <select
          id="reportType"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="select select-bordered w-full mb-4"
        >
          <option value="">Select Report Type</option>
          <option value="monthly">Monthly Payroll Report</option>
          <option value="yearly">Yearly Payroll Report</option>
          <option value="custom">Custom Date Range Report</option>
        </select>
      </div>

      {reportType === 'custom' && (
        <div className="mb-6">
          <label className="label" htmlFor="startDate">
            <span className="label-text">Start Date:</span>
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <label className="label" htmlFor="endDate">
            <span className="label-text">End Date:</span>
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
        </div>
      )}

      <button className="btn btn-primary w-full mb-6" onClick={handleReportGeneration} disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : 'Generate Report'}
      </button>

      {successMessage && <div className="alert alert-success mb-6">{successMessage}</div>}

      <div className={`mt-6 border-2 rounded-lg p-8 ${reportData.length === 0 ? 'bg-gray-100 border-gray-300' : ''}`}>
        {reportData.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Generated Report</h2>
            <div id="report-table" className="overflow-x-auto">
              <table className="table w-full border-2 border-gray-300 rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4">Employee Name</th>
                    <th className="p-4">Salary</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((data, index) => (
                    <tr key={index} className="hover:bg-neutral hover:text-white">
                      <td className="border-b p-4">{data.employeeName}</td>
                      <td className="border-b p-4">₱{data.salary.toFixed(2)}</td>
                      <td className="border-b p-4">{data.paymentMethod}</td>
                      <td className="border-b p-4">{data.status}</td>
                      <td className="border-b p-4">{data.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-start mt-4">
              <button className="btn btn-secondary mr-4" onClick={handlePrint}>
                Print Report
              </button>
              <button className="btn btn-warning" onClick={handleClearReport}>
                Clear Report
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start justify-start min-h-[100px] text-gray-500">
            <span className="text-lg mb-2">No report generated yet.</span>
            <span className="text-sm">Please select a report type and click "Generate Report".</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReports;
