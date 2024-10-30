import React, { useEffect, useState } from 'react';

const initialSalaryData = [
    { id: 1, name: "John Lloyd", baseSalary: 25000, bonuses: 5000, deductions: 2000, date: "2024-09-01" },
    { id: 2, name: "Oliver", baseSalary: 30000, bonuses: 4000, deductions: 1500, date: "2024-09-15" },
    { id: 3, name: "Abby", baseSalary: 28000, bonuses: 6000, deductions: 2500, date: "2024-09-20" },
];

const SalaryStructure = () => {
    const [salaryData, setSalaryData] = useState(initialSalaryData);
    const [name, setName] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [bonuses, setBonuses] = useState('');
    const [deductions, setDeductions] = useState('');
    const [editId, setEditId] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedSalary = {
            id: editId,
            name,
            baseSalary: parseFloat(baseSalary),
            bonuses: parseFloat(bonuses),
            deductions: parseFloat(deductions),
            date: new Date().toISOString().split('T')[0] 
        };

        setSalaryData(salaryData.map(salary => salary.id === editId ? updatedSalary : salary));
        resetForm();
    };

    const handleEdit = (salary) => {
        setName(salary.name);
        setBaseSalary(salary.baseSalary);
        setBonuses(salary.bonuses);
        setDeductions(salary.deductions);
        setEditId(salary.id);
    };

    const resetForm = () => {
        setName('');
        setBaseSalary('');
        setBonuses('');
        setDeductions('');
        setEditId(null);
    };

    const filteredSalaryData = salaryData.filter(salary => {
        const salaryDate = new Date(salary.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (!startDate || salaryDate >= start) && (!endDate || salaryDate <= end);
    });

    useEffect(() => {
        document.title = 'Salary Structure';
      }, []); 
    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <h1 className="text-center text-3xl font-bold mb-4">Salary Structure Overview</h1>

            {editId && (
                <form onSubmit={handleUpdate} className="mb-6">
                    <h2 className="text-xl mb-2">Edit Salary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                            type="text" 
                            placeholder="Employee Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            className="input input-bordered w-full" 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Base Salary" 
                            value={baseSalary}
                            onChange={(e) => setBaseSalary(e.target.value)} 
                            className="input input-bordered w-full" 
                        />
                        <input 
                            type="number" 
                            placeholder="Bonuses" 
                            value={bonuses}
                            onChange={(e) => setBonuses(e.target.value)} 
                            className="input input-bordered w-full" 
                        />
                        <input 
                            type="number" 
                            placeholder="Deductions" 
                            value={deductions}
                            onChange={(e) => setDeductions(e.target.value)} 
                            className="input input-bordered w-full" 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 w-full">
                        Update Salary
                    </button>
                </form>
            )}

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

            <h2 className="text-xl mb-2">Salary Structure Details</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="p-4">Employee Name</th>
                            <th className="p-4">Base Salary</th>
                            <th className="p-4">Bonuses</th>
                            <th className="p-4">Deductions</th>
                            <th className="p-4">Net Salary</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSalaryData.map(salary => {
                            const netSalary = salary.baseSalary + salary.bonuses - salary.deductions;
                            return (
                                <tr key={salary.id} className="hover:bg-neutral hover:text-white">
                                    <td className="p-4">{salary.name}</td>
                                    <td className="p-4">{salary.baseSalary}</td>
                                    <td className="p-4">{salary.bonuses}</td>
                                    <td className="p-4">{salary.deductions}</td>
                                    <td className="p-4">{netSalary}</td>
                                    <td className="p-4">{salary.date}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalaryStructure;
