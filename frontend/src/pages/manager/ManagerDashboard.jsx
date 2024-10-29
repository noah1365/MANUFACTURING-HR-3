import React, { useEffect, useState } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { GrMoney } from "react-icons/gr";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const ManagerDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const payrollData = [
    { employee: "Borlagdatan Johnlloyd", grossPay: 3000, netPay: 2800, deductions: 200, status: "Processed", date: "2024-08-15" },
    { employee: "Canja Abeguel", grossPay: 4000, netPay: 3800, deductions: 200, status: "Pending", date: "2024-09-10" },
  ];



  const incentivesData = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 1500 },
    { month: "Mar", amount: 1800 },
    { month: "Apr", amount: 1700 },
    { month: "May", amount: 1600 },
    { month: "Jun", amount: 1600 },
    { month: "Jul", amount: 1600 },
    { month: "Aug", amount: 1600 },
    { month: "Sep", amount: 1600 },
    { month: "Oct", amount: 1600 },
    { month: "Nov", amount: 1600 },
    { month: "Dec", amount: 1600 },
  ];

  const deductionsData = [
    { month: "Jan", amount: 500 },
    { month: "Feb", amount: 600 },
    { month: "Mar", amount: 700 },
    { month: "Apr", amount: 650 },
    { month: "May", amount: 700 },
    { month: "Jun", amount: 700 },
    { month: "Jul", amount: 700 },
    { month: "Aug", amount: 700 },
    { month: "Sep", amount: 700 },
    { month: "Oct", amount: 700 },
    { month: "Nov", amount: 700 },
    { month: "Dec", amount: 700 },
  ];

  const filterPayrollData = () => {
    return payrollData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === selectedYear && itemDate.getMonth() + 1 === selectedMonth;
    });
  };

  const Card = ({ title, amount, change, icon, isPositive }) => (
    <div className="bg-white shadow-lg w-full sm:w-60 p-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-gray-600 font-semibold text-sm">{title}</p>
        {icon}
      </div>
      <div className="flex gap-2 my-2">
        <p className="text-2xl font-bold">{amount}</p>
        <p className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isPositive ? <IoIosArrowUp /> : <IoIosArrowDown />} {change}
        </p>
      </div>
    </div>
  );
  useEffect(() => {
    document.title = 'Dashboard';
  }, []); 
  return (
    <div className="p-4">
      <p className="font-semibold text-xl">HR 3 Overview - Compensation and Benefits</p>

      <div className="flex gap-4 mb-4">
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="p-2 border rounded">
          {[2022, 2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="p-2 border rounded">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>{new Date(0, i + 1).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-2">
        <Card title="Payroll Summary" amount={filterPayrollData().reduce((acc, curr) => acc + curr.grossPay, 0)} change="5.5%" icon={<HiOutlineCurrencyDollar className="text-gray-600 text-xl" />} isPositive />
        <Card title="Incentives Overview" amount={7200} change="-1.5%" icon={<GrMoney className="text-gray-600 text-xl" />} />
        <Card title="Deductions Overview" amount={5200} change="-1.5%" icon={<GrMoney className="text-gray-600 text-xl" />} />
        <Card title="Benefits Enrollment" amount={15} change="3 New" icon={<RiPassPendingLine className="text-gray-600 text-xl" />} isPositive />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="rounded-lg bg-white p-3">
          <p className="font-semibold text-lg">Payroll Overview</p>
          <AreaChart width={400} height={200} data={filterPayrollData()}>
            <Area type="monotone" dataKey="grossPay" stroke="#8884d8" fill="#8884d8" />
            <XAxis dataKey="employee" />
            <YAxis />
            <Tooltip />
          </AreaChart>
        </div>
        <div className="rounded-lg bg-white p-3">
          <p className="font-semibold text-lg">Incentives Overview</p>
          <AreaChart width={400} height={200} data={incentivesData}>
            <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
          </AreaChart>
        </div>
        <div className="rounded-lg bg-white p-3">
          <p className="font-semibold text-lg">Deductions Overview</p>
          <BarChart width={400} height={200} data={deductionsData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#ff7300" />
          </BarChart>
        </div>
      </div>

            <div className="mt-4 rounded-lg bg-white p-3">
        <p className="font-semibold text-lg">Payroll Processing</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Gross Pay</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Net Pay</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Deductions</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{row.employee}</td>
                  <td className="px-4 py-2">₱{row.grossPay}</td>
                  <td className="px-4 py-2">₱{row.netPay}</td>
                  <td className="px-4 py-2">₱{row.deductions}</td>
                  <td className="px-4 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
