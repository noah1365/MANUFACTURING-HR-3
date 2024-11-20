import React, { useEffect, useState } from 'react';

const MarketAnalysis = () => {
  const industryData = [
    { position: 'CEO', dailyWage: 640 },
    { position: 'Secretary', dailyWage: 640 },
    { position: 'Production Head', dailyWage: 640 },
    { position: 'Resellers Sales Head', dailyWage: 630 },
    { position: 'Reseller', dailyWage: 610 },
    { position: 'Manager', dailyWage: 630 },
  ];

  const geographicData = [
    { location: 'Metro Manila', dailyWage: 710 },
    { location: 'Cebu City', dailyWage: 580 },
    { location: 'Davao City', dailyWage: 520 },
  ];

  const incentivesData = [
    {
      type: 'Bonus',
     myCompany: '10% of Annual Salary',
      competitor: '5% of Annual Salary',
    },
    {
      type: 'Health Insurance',
     myCompany: 'Full Coverage',
      competitor: 'Partial Coverage',
    },
    {
      type: 'Paid Time Off',
     myCompany: '20 Days',
      competitor: '15 Days',
    },
    {
      type: 'Retirement Plan',
     myCompany: 'Company Match up to 10%',
      competitor: 'No Match',
    },
  ];

  const geographicIncentivesData = [
    { location: 'Metro Manila', incentive: 'Higher transportation allowance' },
    { location: 'Cebu City', incentive: 'Flexible work hours' },
    { location: 'Davao City', incentive: 'Remote work options' },
  ];

  const turnoverData = [
    { position: 'CEO', turnoverRate: 8 },
    { position: 'Secretary', turnoverRate: 12 },
    { position: 'Production Head', turnoverRate: 6 },
    { position: 'Resellers Sales Head', turnoverRate: 9 },
    { position: 'Reseller', turnoverRate: 10 },
    { position: 'Manager', turnoverRate: 7 },
  ];

  const WORKING_DAYS_PER_MONTH = 24;
  const WORKING_DAYS_PER_YEAR = WORKING_DAYS_PER_MONTH * 12;
  const WORKING_HOURS_PER_DAY = 8;

  const calculateMonthlySalary = (dailyWage) => dailyWage * WORKING_DAYS_PER_MONTH;
  const calculateWeeklySalary = (dailyWage) => (dailyWage * WORKING_DAYS_PER_MONTH) / 4;
  const calculateAnnualSalary = (dailyWage) => dailyWage * WORKING_DAYS_PER_YEAR;
  const calculateHourlySalary = (dailyWage) => dailyWage / WORKING_HOURS_PER_DAY;

  const averageIndustryWage = industryData.reduce((acc, curr) => acc + curr.dailyWage, 0) / industryData.length;
  const averageGeographicWage = geographicData.reduce((acc, curr) => acc + curr.dailyWage, 0) / geographicData.length;
  const averageTurnoverRate = turnoverData.reduce((acc, curr) => acc + curr.turnoverRate, 0) / turnoverData.length;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredIndustryData = industryData;
  const filteredGeographicData = geographicData;

  useEffect(() => {
    document.title = 'Market Analysis';
  }, []);

  const downloadCSV = () => {
    const csvRows = [];

    csvRows.push(['Job position', 'Daily Wage (PHP)', 'Hourly Wage (PHP)', 'Monthly Salary (PHP)', 'Weekly Salary (PHP)', 'Annual Salary (PHP)'].join(','));

    filteredIndustryData.forEach(data => {
      csvRows.push([
        data.position,
        data.dailyWage.toLocaleString(),
        calculateHourlySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 }),
        calculateMonthlySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 }),
        calculateWeeklySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 }),
        calculateAnnualSalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      ].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'market_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary">Market Analysis</h2>

      <div className="mb-8">
        <label className="mr-4">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="input input-bordered"
        />
        <label className="ml-4 mr-4">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="input input-bordered"
        />
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Salary Benchmarking (Based on Daily Wage)</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className='bg-primary text-white'>
                <th className="border px-4 py-2">Job position</th>
                <th className="border px-4 py-2">Daily Wage (PHP)</th>
                <th className="border px-4 py-2">Hourly Wage (PHP)</th>
                <th className="border px-4 py-2">Monthly Salary (PHP)</th>
                <th className="border px-4 py-2">Weekly Salary (PHP)</th>
                <th className="border px-4 py-2">Annual Salary (PHP)</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndustryData.map((data, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{data.position}</td>
                  <td className="border px-4 py-2">{data.dailyWage.toLocaleString()}</td>
                  <td className="border px-4 py-2">{calculateHourlySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border px-4 py-2">{calculateMonthlySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border px-4 py-2">{calculateWeeklySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border px-4 py-2">{calculateAnnualSalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p className="font-bold">Average Daily Wage in Industry: ₱{averageIndustryWage.toFixed(2).toLocaleString()}</p>
        </div>
        <button onClick={downloadCSV} className="btn btn-primary mt-4">Download</button>
      </div>

      <div className="my-4">
        <hr className="border-t-2 border-gray-300 w-full" />
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Geographic Analysis (Based on Daily Wage)</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className='bg-primary text-white'>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Daily Wage (PHP)</th>
                <th className="border px-4 py-2">Hourly Wage (PHP)</th>
                <th className="border px-4 py-2">Monthly Salary (PHP)</th>
                <th className="border px-4 py-2">Weekly Salary (PHP)</th>
                <th className="border px-4 py-2">Annual Salary (PHP)</th>
              </tr>
            </thead>
            <tbody>
              {filteredGeographicData.map((data, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{data.location}</td>
                  <td className="border px-4 py-2">{data.dailyWage.toLocaleString()}</td>
                  <td className="border px-4 py-2">{calculateHourlySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border px-4 py-2">{calculateMonthlySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border px-4 py-2">{calculateWeeklySalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="border px-4 py-2">{calculateAnnualSalary(data.dailyWage).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p className="font-bold">Average Daily Wage by Location: ₱{averageGeographicWage.toFixed(2).toLocaleString()}</p>
        </div>
        <button onClick={downloadCSV} className="btn btn-primary mt-4">Download</button>

      </div>

      <div className="my-4">
        <hr className="border-t-2 border-gray-300 w-full" />
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Incentives Comparison</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className='bg-primary text-white'>
                <th className="border px-4 py-2">Incentive Type</th>
                <th className="border px-4 py-2">My Company</th>
                <th className="border px-4 py-2">Competitor</th>
              </tr>
            </thead>
            <tbody>
              {incentivesData.map((data, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{data.type}</td>
                  <td className="border px-4 py-2">{data.myCompany}</td>
                  <td className="border px-4 py-2">{data.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-4">
        <hr className="border-t-2 border-gray-300 w-full" />
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Geographic Incentives</h3>
        <ul className="list-disc pl-6">
          {geographicIncentivesData.map((data, index) => (
            <li key={index} className="my-2">{data.location}: {data.incentive}</li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <hr className="border-t-2 border-gray-300 w-full" />
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-neutral">Turnover Rate by Job position</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className='bg-primary text-white'>
                <th className="border px-4 py-2">Job position</th>
                <th className="border px-4 py-2">Turnover Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {turnoverData.map((data, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{data.position}</td>
                  <td className="border px-4 py-2">{data.turnoverRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p className="font-bold">Average Turnover Rate: {averageTurnoverRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
