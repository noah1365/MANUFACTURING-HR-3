import React, { useEffect, useState } from 'react';

const MarketAnalysis = () => {
  const industryData = [
    { position: 'CEO', dailyWage: 1500 },
    { position: 'Secretary', dailyWage: 500 },
    { position: 'Production Head', dailyWage: 750 },
    { position: 'Resellers Sales Head', dailyWage: 800 },
    { position: 'Reseller', dailyWage: 450 },
    { position: 'Manager', dailyWage: 650 },
  ];

  const geographicData = [
    { location: 'Metro Manila', dailyWage: 710 },
    { location: 'Cebu City', dailyWage: 580 },
    { location: 'Davao City', dailyWage: 520 },
  ];

  const incentivesData = [
    {
      type: 'Bonus',
      yourCompany: '10% of Annual Salary',
      competitor: '5% of Annual Salary',
    },
    {
      type: 'Health Insurance',
      yourCompany: 'Full Coverage',
      competitor: 'Partial Coverage',
    },
    {
      type: 'Paid Time Off',
      yourCompany: '20 Days',
      competitor: '15 Days',
    },
    {
      type: 'Retirement Plan',
      yourCompany: 'Company Match up to 10%',
      competitor: 'No Match',
    },
  ];

  const geographicIncentivesData = [
    { location: 'Metro Manila', incentive: 'Higher transportation allowance' },
    { location: 'Cebu City', incentive: 'Flexible work hours' },
    { location: 'Davao City', incentive: 'Remote work options' },
  ];

  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedback) {
      setFeedbacks([...feedbacks, feedback]);
      setFeedback('');  // Clear the feedback input field
    }
  };

  useEffect(() => {
    document.title = 'Market Analysis';
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary">Market Analysis</h2>

      {/* Feedback Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">User Feedback</h3>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          className="textarea textarea-bordered w-full mb-4"
          rows="4"
          placeholder="Share your feedback based on the market analysis"
        />
        <button onClick={handleFeedbackSubmit} className="btn btn-primary mb-6">
          Submit Feedback
        </button>

        <div>
          <h4 className="text-xl font-semibold text-neutral mb-4">Feedback from Users</h4>
          <ul className="list-disc pl-6">
            {feedbacks.map((item, index) => (
              <li key={index} className="my-2">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Data Tables */}
      {/* Salary Benchmarking (Based on Daily Wage) */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Salary Benchmarking (Based on Daily Wage)</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border px-4 py-2">Job position</th>
                <th className="border px-4 py-2">Daily Wage (PHP)</th>
                <th className="border px-4 py-2">Hourly Wage (PHP)</th>
                <th className="border px-4 py-2">Monthly Salary (PHP)</th>
                <th className="border px-4 py-2">Weekly Salary (PHP)</th>
                <th className="border px-4 py-2">Annual Salary (PHP)</th>
              </tr>
            </thead>
            <tbody>
              {industryData.map((data, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{data.position}</td>
                  <td className="border px-4 py-2">{data.dailyWage.toLocaleString()}</td>
                  <td className="border px-4 py-2">{(data.dailyWage / 8).toFixed(2)}</td>
                  <td className="border px-4 py-2">{(data.dailyWage * 24).toLocaleString()}</td>
                  <td className="border px-4 py-2">{(data.dailyWage * 24 / 4).toLocaleString()}</td>
                  <td className="border px-4 py-2">{(data.dailyWage * 24 * 12).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-4">
        <hr className="border-t-2 border-gray-300 w-full" />
      </div>

      {/* Geographic Analysis */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Geographic Analysis (Based on Daily Wage)</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Daily Wage (PHP)</th>
                <th className="border px-4 py-2">Hourly Wage (PHP)</th>
                <th className="border px-4 py-2">Monthly Salary (PHP)</th>
                <th className="border px-4 py-2">Weekly Salary (PHP)</th>
                <th className="border px-4 py-2">Annual Salary (PHP)</th>
              </tr>
            </thead>
            <tbody>
              {geographicData.map((data, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{data.location}</td>
                  <td className="border px-4 py-2">{data.dailyWage.toLocaleString()}</td>
                  <td className="border px-4 py-2">{(data.dailyWage / 8).toFixed(2)}</td>
                  <td className="border px-4 py-2">{(data.dailyWage * 24).toLocaleString()}</td>
                  <td className="border px-4 py-2">{(data.dailyWage * 24 / 4).toLocaleString()}</td>
                  <td className="border px-4 py-2">{(data.dailyWage * 24 * 12).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
