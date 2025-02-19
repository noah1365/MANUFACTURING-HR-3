import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const initialSalaryData = [
    { id: 1, name: "John Lloyd", hourlyRate: 80, workingHoursPerDay: 8, bonuses: 5000, deductions: 1630, startDate: "2024-11-01", overtimeHours: 10 },
    { id: 2, name: "Oliver", hourlyRate: 90, workingHoursPerDay: 8, bonuses: 4000, deductions: 1500, startDate: "2024-11-01", overtimeHours: 5 },
    { id: 3, name: "Abby", hourlyRate: 85, workingHoursPerDay: 8, bonuses: 6000, deductions: 2500, startDate: "2024-11-01", overtimeHours: 8 },
];

const SalaryComputation = () => {
    const [salaryData, setSalaryData] = useState(initialSalaryData);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const calculateDaysWorked = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end - start;
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    };

    const calculateSalary = (employee) => {
        const totalDaysWorked = calculateDaysWorked(employee.startDate, new Date());
        const dailyRate = employee.hourlyRate * employee.workingHoursPerDay;
        const earnedSalary = dailyRate * totalDaysWorked;

        const overtimeRate = employee.hourlyRate * 1.5; // 1.5x hourly rate for overtime
        const overtimePay = employee.overtimeHours * overtimeRate;

        const netSalary = earnedSalary + employee.bonuses + overtimePay - employee.deductions;
        return { totalDaysWorked, earnedSalary, overtimePay, netSalary };
    };

    const filteredSalaryData = salaryData.filter(employee => {
        const employeeDate = new Date(employee.startDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (!startDate || employeeDate >= start) && (!endDate || employeeDate <= end);
    });

    useEffect(() => {
        document.title = 'Salary Structure Overview';
    }, []);

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <h1 className="text-center text-3xl font-bold mb-4">Salary Structure Overview</h1>

            <div className="mb-4 flex flex-col items-center">
                <h2 className="text-lg mb-1">Filter by Date</h2>
                <div className="md:flex-row items-center justify-center gap-2">
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="input input-bordered w-1/2 md:w-1/3 h-8 text-sm p-1"
                    />
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="input input-bordered w-1/2 md:w-1/3 h-8 text-sm p-1"
                    />
                </div>
            </div>

            <h2 className="text-xl mb-2">Salary Details</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="p-4">Employee Name</th>
                            <th className="p-4">Hourly Rate</th>
                            <th className="p-4">Working Hours/Day</th>
                            <th className="p-4">Total Days Worked</th>
                            <th className="p-4">Base Salary (Earned)</th>
                            <th className="p-4">Overtime Hours</th>
                            <th className="p-4">Overtime Pay</th>
                            <th className="p-4">Bonuses</th>
                            <th className="p-4">Deductions</th>
                            <th className="p-4">Net Salary</th>
                            <th className="p-4">Start Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSalaryData.map(employee => {
                            const { totalDaysWorked, earnedSalary, overtimePay, netSalary } = calculateSalary(employee);
                            return (
                                <tr key={employee.id} className="hover:bg-neutral hover:text-white">
                                    <td className="p-4">{employee.name}</td>
                                    <td className="p-4">₱{employee.hourlyRate.toLocaleString()}</td>
                                    <td className="p-4">{employee.workingHoursPerDay} hrs</td>
                                    <td className="p-4">{totalDaysWorked} days</td>
                                    <td className="p-4">₱{earnedSalary.toLocaleString()}</td>
                                    <td className="p-4">{employee.overtimeHours} hrs</td>
                                    <td className="p-4">₱{overtimePay.toLocaleString()}</td>
                                    <td className="p-4">₱{employee.bonuses.toLocaleString()}</td>
                                    <td className="p-4">₱{employee.deductions.toLocaleString()}</td>
                                    <td className="p-4 font-bold text-green-500">₱{netSalary.toLocaleString()}</td>
                                    <td className="p-4">{new Date(employee.startDate).toLocaleDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalaryComputation;
