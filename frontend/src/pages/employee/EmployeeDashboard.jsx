import React, { useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useEmployeeStore } from '../../store/employeeStore';

const EmployeeDashboard = () => {
  const { user } = useEmployeeStore();

  const overtimeData = [
    { date: 'October 1, 2024', hours: 5, rate: 150, bonus: 500 },
    { date: 'October 2, 2024', hours: 3, rate: 150, bonus: 300 },
  ];

  const totalOvertime = overtimeData.reduce((acc, item) => acc + item.hours * item.rate, 0);
  const totalBonus = overtimeData.reduce((acc, item) => acc + item.bonus, 0);
  const totalHours = overtimeData.reduce((acc, item) => acc + item.hours, 0);
  const totalAmount = totalOvertime + totalBonus;

  const benefitsData = [
    { name: 'Health Insurance', value: 3000 },
    { name: 'Pag-ibig', value: 5000 },
    { name: '13th Month Pay', value: 2000 },
    { name: 'SSS', value: 1000 },
  ];

  const deductionsData = [
    { month: 'September', amount: 500 },
    { month: 'October', amount: 300 },
  ];

  const totalDeductions = deductionsData.reduce((acc, item) => acc + item.amount, 0);

  const combinedBenefitsAndDeductions = benefitsData.map((benefit) => ({
    name: benefit.name,
    value: benefit.value,
  }));

  combinedBenefitsAndDeductions.push({ name: 'Total Deductions', value: totalDeductions });

  const incentiveData = [
    { name: 'Approved', value: 2 },
    { name: 'Pending', value: 1 },
  ];

  const commissionsData = [
    { date: '2024-09-01', sales: 10000, commission: 500 },
    { date: '2024-09-05', sales: 15000, commission: 600 },
  ];

  const totalCommissions = commissionsData.reduce((acc, item) => acc + item.commission, 0);

  useEffect(() => {
    document.title = "Employee Dashboard";
  }, []);

  return (
    <div className="container mx-auto p-5">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.lastName} {user?.firstName}!</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { title: 'My Benefits Deduct', amount: '₱ 5,000' },
          { title: 'Salary', amount: '₱ 30,000' },
          { title: 'Commissions', amount: `₱ ${totalCommissions.toLocaleString()}` },
          { title: 'Total Overtime', amount: `₱ ${totalOvertime.toLocaleString()}` },
          { title: 'Total Bonuses', amount: `₱ ${totalBonus.toLocaleString()}` },
          { title: 'Total Amount (Overtime + Bonuses)', amount: `₱ ${totalAmount.toLocaleString()}` },
        ].map((card) => (
          <div key={card.title} className="card bg-base-100 shadow-lg transition-transform transform hover:scale-105">
            <div className="card-body">
              <h2 className="card-title">{card.title}</h2>
              <p className="text-lg font-bold text-green-600">{card.amount}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Chart title="Benefits Overview and Deductions" data={combinedBenefitsAndDeductions} type="pie" />
        <Chart title="Incentive Requests" data={incentiveData} type="pie" />
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2">Overtime and Bonuses</h2>
        <ResponsiveChart type="bar" data={overtimeData.map(item => ({ name: item.date, value: item.hours * item.rate + item.bonus }))} dataKey="value" />
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-2">My Commissions</h2>
        <CommissionTable data={commissionsData} />
      </section>
    </div>
  );
};

const Chart = ({ title, data, type }) => (
  <div className="card bg-base-100 shadow-lg">
    <div className="card-body">
      <h2 className="font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        {type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#82ca9d" label />
            <Tooltip />
          </PieChart>
        ) : (
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#ff7300" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

const ResponsiveChart = ({ type, data, dataKey }) => (
  <div className="card bg-base-100 shadow-lg">
    <div className="card-body">
      <ResponsiveContainer width="100%" height={200}>
        {type === 'bar' && (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#82ca9d" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

const CommissionTable = ({ data }) => (
  <table className="min-w-full border-collapse border border-gray-200">
    <thead>
      <tr>
        <th className="border border-gray-200 p-2">Date</th>
        <th className="border border-gray-200 p-2">Sales Made</th>
        <th className="border border-gray-200 p-2">Commission Earned</th>
      </tr>
    </thead>
    <tbody>
      {data.map((commission, index) => (
        <tr key={index}>
          <td className="border border-gray-200 p-2">{commission.date}</td>
          <td className="border border-gray-200 p-2">₱ {commission.sales.toLocaleString()}</td>
          <td className="border border-gray-200 p-2">₱ {commission.commission.toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default EmployeeDashboard;
