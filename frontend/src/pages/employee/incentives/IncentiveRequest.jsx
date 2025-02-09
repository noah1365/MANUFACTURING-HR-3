import React, { useState, useEffect } from 'react';
import { useIncentiveStore } from '../../../store/incentiveStore';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const IncentiveRequest = () => {
    const [incentiveType, setIncentiveType] = useState('');
    const [comments, setComments] = useState('');
    const { requestIncentive, fetchMyRequestIncentives, incentive } = useIncentiveStore();
    const [requests, setRequests] = useState([]);
    const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        const success = await requestIncentive({ incentiveType, comments });

        if (success) {
            toast.success('Incentive request submitted successfully!');
            setIncentiveType('');
            setComments('');
            fetchRequests(); 
        } else {
            toast.error("Failed to submit incentive request!");
        }

        setLoading(false);
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const fetchedData = await fetchMyRequestIncentives(); 
            if (fetchedData) {
                setRequests(fetchedData);
            }
        } catch (err) {
            toast.error("Error fetching incentive requests!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (incentive) {
            setRequests(incentive); 
        }
    }, [incentive]);

    const truncateComment = (comment) => {
        const words = comment.split(' ');
        return words.length > 20 ? words.slice(0, 20).join(' ') + '...' : comment;
    };

    const handleSeeMoreClick = (index) => {
        setExpandedCommentIndex(expandedCommentIndex === index ? null : index);
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">Approved</span>;
            case 'denied':
                return <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Denied</span>;
            default:
                return <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm">Pending</span>;
        }
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
<div className='flex justify-center'>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white font-bold py-2 px-4 rounded-md ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "btn btn-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-24"
                    }`}
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
                </div>
            </form>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-center">My Incentive Requests</h3>

                {loading ? (
                    <p className="text-center text-gray-500">Loading requests...</p>
                ) : requests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table w-full mb-4">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="border px-4 py-2">Incentive Type</th>
                                    <th className="border px-4 py-2">Comments</th>
                                    <th className="border px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => (
                                    <tr key={index} className="hover:bg-neutral hover:text-white">
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
                                        <td className="px-4 py-2">{getStatusBadge(request.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No incentive requests found.</p>
                )}
            </div>
        </div>
    );
};

export default IncentiveRequest;
