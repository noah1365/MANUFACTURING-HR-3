import React, { useState, useEffect } from 'react';

const initialEmployees = [
    { id: 1, name: "Borlagdatan John Lloyd", salesAchieved: 120, target: 100, performanceRating: 'Exceeds Expectations', salesCommission: 500, bonus: 450, incentiveRequest: 'Performance-Based', date: '2024-09-01' },
    { id: 2, name: "Canja Abeguel", salesAchieved: 90, target: 100, performanceRating: 'Meets Expectations', salesCommission: 600, bonus: 600, incentiveRequest: 'Performance-Based', date: '2024-09-15' },
    { id: 3, name: "Padit Oliver", salesAchieved: 75, target: 100, performanceRating: 'Needs Improvement', salesCommission: 600, bonus: 600, incentiveRequest: 'Performance-Based', date: '2024-09-20' },
];

const PerformanceMetrics = () => {
    const [employees, setEmployees] = useState(initialEmployees);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState(employees);

    useEffect(() => {
        const filterByDate = () => {
            if (startDate && endDate) {
                const filtered = employees.filter(employee => {
                    const employeeDate = new Date(employee.date);
                    return employeeDate >= new Date(startDate) && employeeDate <= new Date(endDate);
                });
                setFilteredEmployees(filtered);
            } else {
                setFilteredEmployees(employees);
            }
        };
        filterByDate();
    }, [startDate, endDate, employees]);

    useEffect(() => {
        document.title = 'Performance Metrics';
    }, []);

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <h1 className="text-center text-3xl font-bold mb-4">Performance Metrics </h1>

            <div className="mb-4 flex items-center justify-center">
                <label className="mr-2">Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-bordered w-32 mr-4"
                />
                <label className="mx-2">End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input input-bordered w-32"
                />
            </div>

            <table className="table w-full mb-4">
                <thead>
                    <tr className="bg-primary text-white">
                        <th className="border px-4 py-2">Employee Name</th>
                        <th className="border px-4 py-2">Sales Achieved</th>
                        <th className="border px-4 py-2">Target</th>
                        <th className="border px-4 py-2">Performance Rating</th>
                        <th className="border px-4 py-2">Sales Commission</th>
                        <th className="border px-4 py-2">Bonus</th>
                        <th className="border px-4 py-2">Incentive Request</th>
                        <th className="border px-4 py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => {
                        const totalRewards = employee.bonus + employee.salesCommission;
                        return (
                            <tr key={employee.id} className="hover:bg-neutral hover:text-white">
                                <td className="border px-4 py-2">{employee.name}</td>
                                <td className="border px-4 py-2">{employee.salesAchieved}</td>
                                <td className="border px-4 py-2">{employee.target}</td>
                                <td className="border px-4 py-2">{employee.performanceRating}</td>
                                <td className="border px-4 py-2">₱{employee.salesCommission}</td>
                                <td className="border px-4 py-2">₱{employee.bonus}</td>
                                <td className="border px-4 py-2">{employee.incentiveRequest}</td>
                                <td className="border px-4 py-2">{employee.date}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-200 font-bold">
                        <td className="border px-4 py-2">Total</td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">₱{filteredEmployees.reduce((acc, emp) => acc + emp.salesCommission, 0)}</td>
                        <td className="border px-4 py-2">₱{filteredEmployees.reduce((acc, emp) => acc + emp.bonus, 0)}</td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">-</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default PerformanceMetrics;
