import React, { useEffect, useState } from 'react';

const employeeData = {
    name: 'Borlagdatan John lloyd', 
    benefits: [
        {
            planName: 'PhilHealth',
            type: 'Health Insurance',
            deduction: 300,
            description: 'Government-mandated health insurance program.',
            contributionHistory: [
                { date: '2024-01-01', amount: 300 },
                { date: '2024-02-01', amount: 300 },
                { date: '2024-03-01', amount: 300 },
                { date: '2024-04-01', amount: 300 },
                { date: '2024-05-01', amount: 300 },
                { date: '2024-06-01', amount: 300 },
                { date: '2024-07-01', amount: 300 },
                { date: '2024-08-01', amount: 300 },
                { date: '2024-09-01', amount: 300 },
                { date: '2024-10-01', amount: 300 },
            ],
        },
        {
            planName: 'SSS',
            type: 'Social Security',
            deduction: 400,
            description: 'Social Security System contributions.',
            contributionHistory: [
                { date: '2024-01-01', amount: 400 },
                { date: '2024-02-01', amount: 400 },
                { date: '2024-03-01', amount: 400 },
                { date: '2024-04-01', amount: 400 },
                { date: '2024-05-01', amount: 400 },
                { date: '2024-06-01', amount: 400 },
                { date: '2024-07-01', amount: 400 },
                { date: '2024-08-01', amount: 400 },
                { date: '2024-09-01', amount: 400 },
                { date: '2024-10-01', amount: 400 },
            ],
        },
        {
            planName: 'Pag-IBIG',
            type: 'Housing Fund',
            deduction: 100,
            description: 'Pag-IBIG Fund contributions.',
            contributionHistory: [
                { date: '2024-01-01', amount: 100 },
                { date: '2024-02-01', amount: 100 },
                { date: '2024-03-01', amount: 100 },
                { date: '2024-04-01', amount: 100 },
                { date: '2024-05-01', amount: 100 },
                { date: '2024-06-01', amount: 100 },
                { date: '2024-07-01', amount: 100 },
                { date: '2024-08-01', amount: 100 },
                { date: '2024-09-01', amount: 100 },
                { date: '2024-10-01', amount: 100 },
            ],
        },
    ],
};

const Deductions = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentBenefitHistory, setCurrentBenefitHistory] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredHistory, setFilteredHistory] = useState([]);

    const openModal = (history) => {
        setCurrentBenefitHistory(history);
        setModalOpen(true);
        setStartDate('');
        setEndDate('');
        setFilteredHistory([]); // Reset filtered history when modal is opened
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentBenefitHistory([]);
    };

    const calculateTotalDeductions = (benefits) => {
        return benefits.reduce((total, benefit) => total + benefit.deduction, 0);
    };

    const filterHistoryByDate = () => {
        // Reset filtered history if no date range is provided
        if (!startDate && !endDate) {
            setFilteredHistory([]);
            return;
        }

        const filtered = currentBenefitHistory.filter((history) => {
            const historyDate = new Date(history.date);
            const isAfterStartDate = !startDate || historyDate >= new Date(startDate);
            const isBeforeEndDate = !endDate || historyDate <= new Date(endDate);
            return isAfterStartDate && isBeforeEndDate;
        });
        setFilteredHistory(filtered);
    };

    useEffect(() => {
        document.title = 'Deductions History';
    }, []);

    return (
        <div className='relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl'>
            <h2 className="text-2xl font-bold mb-6 text-center">My Deductions</h2>

            <table className="table w-full mb-4">
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="border px-4 py-2">Plan Name</th>
                        <th className="border px-4 py-2">Benefit Type</th>
                        <th className="border px-4 py-2">Deduction</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">View All Deductions</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeData.benefits.map((benefit, index) => (
                        <tr key={index} className="hover:bg-neutral hover:text-white">
                            <td className='hover:bg-neutral hover:text-white'>{benefit.planName}</td>
                            <td className='hover:bg-neutral hover:text-white'>{benefit.type}</td>
                            <td className='hover:bg-neutral hover:text-white'>{benefit.deduction}</td>
                            <td className='hover:bg-neutral hover:text-white'>{benefit.description}</td>
                            <td>
                                <button 
                                    onClick={() => openModal(benefit.contributionHistory)}
                                    className="btn btn-primary">
                                    View History
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} className="text-right font-bold">Total Deductions:</td>
                        <td className="font-bold">{calculateTotalDeductions(employeeData.benefits)}</td>
                        <td colSpan={2}></td>
                    </tr>
                </tbody>
            </table>

            {modalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Contribution History</h3>
                        <div className="flex justify-between mb-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input input-bordered"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input input-bordered"
                            />
                            <button onClick={filterHistoryByDate} className="btn">
                                Filter
                            </button>
                        </div>
                        <ul>
                            {(filteredHistory.length ? filteredHistory : currentBenefitHistory).map((history, index) => (
                                <li key={index}>
                                    {history.date} - Amount: {history.amount}
                                </li>
                            ))}
                        </ul>
                        <div className="modal-action">
                            <button className="btn" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deductions;
