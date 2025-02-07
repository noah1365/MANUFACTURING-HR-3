import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MarketAnalysis = () => {
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    const sampleData = {
      salaryTrends: [
        { position: "Reseller", hourlyRate: 150 },
        { position: "Sales Head", hourlyRate: 400 },
        { position: "Secretary", hourlyRate: 180 },
        { position: "CEO", hourlyRate: 1200 },
        { position: "Production Head", hourlyRate: 350 }
      ],
      hiringTrends: [
        { position: "Reseller", jobOpenings: 200 },
        { position: "Sales Head", jobOpenings: 20 },
        { position: "Secretary", jobOpenings: 50 },
        { position: "CEO", jobOpenings: 5 },
        { position: "Production Head", jobOpenings: 15 }
      ],
      competitors: ["Company X", "Company Y", "Company Z"]
    };

    sampleData.salaryTrends = sampleData.salaryTrends.map(job => {
      const overtimeRate = (job.hourlyRate * 1.5).toFixed(2);
      const allowances = (job.hourlyRate * 20).toFixed(2);
      const paidLeave = (job.hourlyRate * 8 * 10).toFixed(2);
      const thirteenthMonthPay = (job.hourlyRate * 8 * 30 / 12).toFixed(2);
      const holidayPay = (job.hourlyRate * 8 * 2).toFixed(2); // 2 holiday days assumed
      const totalSalary = (
        job.hourlyRate * 8 * 20 +
        parseFloat(allowances) +
        parseFloat(paidLeave) +
        parseFloat(thirteenthMonthPay) +
        parseFloat(holidayPay)
      ).toFixed(2);
      
      return { ...job, overtimeRate, allowances, paidLeave, thirteenthMonthPay, holidayPay, totalSalary };
    });

    setTimeout(() => {
      setMarketData(sampleData);
    }, 1000);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 relative z-10">

      {marketData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Salary Breakdown</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-primary text-white">
                <th className="border px-4 py-2">Job Position</th>
                <th className="border px-4 py-2">Hourly Rate (₱)</th>
                <th className="border px-4 py-2">Overtime Rate (₱)</th>
                <th className="border px-4 py-2">Allowances (₱)</th>
                <th className="border px-4 py-2">Paid Leave (₱)</th>
                <th className="border px-4 py-2">13th Month Pay (₱)</th>
                <th className="border px-4 py-2">Holiday Pay (₱)</th>
                <th className="border px-4 py-2">Total Salary (₱)</th>
              </tr>
            </thead>
            <tbody>
              {marketData.salaryTrends.map((job, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border px-4 py-2">{job.position}</td>
                  <td className="border px-4 py-2">{job.hourlyRate}</td>
                  <td className="border px-4 py-2">{job.overtimeRate}</td>
                  <td className="border px-4 py-2">{job.allowances}</td>
                  <td className="border px-4 py-2">{job.paidLeave}</td>
                  <td className="border px-4 py-2">{job.thirteenthMonthPay}</td>
                  <td className="border px-4 py-2">{job.holidayPay}</td>
                  <td className="border px-4 py-2">{job.totalSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mt-6">Hiring Trends</h2>
          <div className="w-full md:w-1/2 mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.hiringTrends}>
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobOpenings" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className="text-xl font-semibold mt-6">Top Competitors</h2>
          <ul className="list-disc ml-6">
            {marketData.competitors.map((company, index) => (
              <li key={index}>{company}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;