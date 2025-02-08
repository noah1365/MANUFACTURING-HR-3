import React, { useState, useEffect } from 'react';
import { useIncentiveStore } from '../../../store/incentiveStore';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const IncentiveRequest = () => {
    const [incentiveType, setIncentiveType] = useState('');
    const [comments, setComments] = useState('');
    const { requestIncentive, fetchMyRequestIncentives, incentive, error } = useIncentiveStore();
    const [requests, setRequests] = useState([]);
    const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);

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
            toast.success('Incentive request submitted successfully!');
            setIncentiveType('');
            setComments('');
            fetchMyRequestIncentives();
        } else {
            toast.error("Failed to submit incentive request!");
        }
    };

    useEffect(() => {
        fetchMyRequestIncentives();
    }, [fetchMyRequestIncentives]);

    useEffect(() => {
        if (incentive && incentive.length > 0) {
            setRequests(incentive);
        }
    }, [incentive]);

    const truncateComment = (comment) => {
        const words = comment.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return comment;
    };

    const handleSeeMoreClick = (index) => {
        setExpandedCommentIndex(expandedCommentIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <ToastContainer />
            <h2 className="text-2xl font-bold mt-10 mb-4 text-center">Request Incentive</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="incentiveType" className="block text-sm font-medium text-gray-700">
                        Incentive Type
                    </label>
                    <select
                        id="incentiveType"
                        value={incentiveType}
                        onChange={(e) => setIncentiveType(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                    >
                        <option value="" disabled>Select an option</option>
                        {incentiveOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                        Comments
                    </label>
                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows="3"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Submit Request
                </button>
            </form>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-center">My Incentive Requests</h3>
                {requests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Incentive Type</th>
                                    <th className="px-4 py-2 text-left">Comments</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2">{request.incentiveType}</td>
                                        <td className="px-4 py-2">
                                            <div>
                                                {expandedCommentIndex === index ? (
                                                    <p>{request.comments}</p>
                                                ) : (
                                                    <p>{truncateComment(request.comments)}</p>
                                                )}
                                                {request.comments.split(' ').length > 20 && (
                                                    <button
                                                        onClick={() => handleSeeMoreClick(index)}
                                                        className="text-blue-600 text-sm mt-1"
                                                    >
                                                        {expandedCommentIndex === index ? 'See Less' : 'See More'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{request.status || 'Pending'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">No requests found.</p>
                )}
            </div>
        </div>
    );
};

export default IncentiveRequest;
