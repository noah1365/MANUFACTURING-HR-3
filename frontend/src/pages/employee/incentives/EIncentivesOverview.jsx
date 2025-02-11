import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIncentiveStore } from '../../../store/incentiveStore';

const EIncentivesOverview = () => {
    const { fetchIncentive, incentive: incentives } = useIncentiveStore();

    useEffect(() => {
        document.title = "Incentives Overview";
        fetchIncentive();
    }, [fetchIncentive]);

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4">Incentive Overview</h2>

            <table className="table w-full mb-4">
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className='border px-4 py-2'>Incentives Name</th>
                        <th className='border px-4 py-2'>Description</th>
                        <th className='border px-4 py-2'>Incentives Type</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(incentives) && incentives.length > 0 ? (
                        incentives.map((incentive) => (
                            <tr key={`${incentive._id}-${incentive.incentivesName}`}className="hover:bg-neutral hover:text-white">
                                <td className='border px-4 py-2'>{incentive.incentivesName || 'N/A'}</td>
                                <td className='border px-4 py-2'>{incentive.incentivesDescription || 'N/A'}</td>
                                <td className='border px-4 py-2'>{incentive.incentivesType || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No incentive found!</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4 text-center">Incentives Management</h1>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Incentive Requests</h2>
                            <p>Review employee incentive requests.</p>
                            <Link to="/incentive-request" className="btn btn-primary">
                                <button>View Requests</button>
                            </Link>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Sales Commissions</h2>
                            <p>Manage sales commissions for employees.</p>
                            <Link to="/my-commissions" className="btn btn-primary">
                                <button>View Commissions</button>
                            </Link>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Employee Recognitions</h2>
                        <p>See employees recognized for their achievements.</p>
                        <Link to="/recognition-lists" className="btn btn-primary">
                            View Recognitions
                        </Link>
                    </div>
                </div>



                {/*     <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Incentive History</h2>
                            <p>View historical data on incentives.</p>
                            <Link to="/incentive-history" className="btn btn-primary">
                                <button>View History</button>
                            </Link>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default EIncentivesOverview;
