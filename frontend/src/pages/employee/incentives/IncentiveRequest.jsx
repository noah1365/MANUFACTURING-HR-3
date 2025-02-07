import React, { useState } from 'react';
import { useIncentiveStore } from '../../../store/incentiveStore';

const IncentiveRequest = () => {
    const [incentiveType, setIncentiveType] = useState('');
    const [comments, setComments] = useState('');
    const [status, setStatus] = useState('');
    const { requestIncentive, error } = useIncentiveStore();

    const incentiveOptions = [
        'Performance Bonus', 'Referral Bonus', 'Sales Commission', 
        'Project Completion Bonus', 'Training or Development Programs', 
        'Flexible Work Arrangements', 'Extra Paid Time Off', 
        'Health and Wellness Programs', 'Recognition Awards', 
        'Stock Options or Equity Grants', 'Professional Memberships', 
        'Home Office Stipend', 'Transportation Allowance', 
        'Performance Review Adjustments'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await requestIncentive({ incentiveType, comments });

        if (success) {
            setStatus('Incentive request submitted successfully!');
            setIncentiveType('');
            setComments('');
        } else {
            setStatus(error || 'Failed to submit incentive request.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Request Incentive</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="incentiveType" className="block text-sm font-medium text-gray-700">
                        Select Incentive Type
                    </label>
                    <select
                        id="incentiveType"
                        value={incentiveType}
                        onChange={(e) => setIncentiveType(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        <option value="" disabled>Select an option</option>
                        {incentiveOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                        Additional Comments
                    </label>
                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows="4"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                {status && (
                    <div className={`mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>{status}</div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default IncentiveRequest;
