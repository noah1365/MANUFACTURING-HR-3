import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const employeeData = {
    id: 1,
    name: "Borlagdatan, John Lloyd B.",
    hourlyRate: 80,
    workingHoursPerDay: 8,
    totalWorkingDays: 30,
    bonuses: 5000,
    deductions: 1630,
    startDate: "2024-11-01",
    endDate: new Date(),
    overtimeHours: 10,
};

const MySalaryStructure = () => {
    const [salaryInfo, setSalaryInfo] = useState(employeeData);

    const calculateDaysWorked = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end - start;
        const daysWorked = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return daysWorked;
    };

    const totalDaysWorked = calculateDaysWorked(salaryInfo.startDate, salaryInfo.endDate);

    const dailyRate = salaryInfo.hourlyRate * salaryInfo.workingHoursPerDay;
    const earnedSalary = dailyRate * totalDaysWorked;

    const overtimeRate = salaryInfo.hourlyRate * 1.5; // 1.5x hourly rate for overtime
    const overtimePay = salaryInfo.overtimeHours * overtimeRate;

    const netSalary = earnedSalary + salaryInfo.bonuses + overtimePay - salaryInfo.deductions;

    useEffect(() => {
        document.title = `Salary Details for ${salaryInfo.name}`;
    }, [salaryInfo]);

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <h1 className="text-center text-3xl font-bold mb-6 text-primary">My Salary Structure</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Employee Information</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="text-gray-800">{salaryInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Salary Date:</span>
                        <span className="text-gray-800">{salaryInfo.endDate.toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Salary Breakdown</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Hourly Rate:</span>
                        <span className="text-gray-800">₱{salaryInfo.hourlyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Working Hours/Day:</span>
                        <span className="text-gray-800">{salaryInfo.workingHoursPerDay} hours</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Total Days Worked:</span>
                        <span className="text-gray-800">{totalDaysWorked} days</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Base Salary (Earned):</span>
                        <span className="text-gray-800">₱{earnedSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Overtime Hours:</span>
                        <span className="text-gray-800">{salaryInfo.overtimeHours} hours</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Overtime Pay:</span>
                        <span className="text-gray-800">₱{overtimePay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Bonuses:</span>
                        <span className="text-gray-800">₱{salaryInfo.bonuses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Deductions:</span>
                        <span className="text-gray-800">₱{salaryInfo.deductions.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Net Salary</h2>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Net Salary:</span>
                    <span className="text-lg font-bold text-green-500">₱{netSalary.toLocaleString()}</span>
                </div>
            </div>

            <div className="text-center mt-8">
                <button className="btn btn-outline btn-primary w-full md:w-auto">
                    <Link to="/my-pay-slip"> View Previous PaySlips</Link>
                </button>
            </div>
        </div>
    );
};

export default MySalaryStructure;
