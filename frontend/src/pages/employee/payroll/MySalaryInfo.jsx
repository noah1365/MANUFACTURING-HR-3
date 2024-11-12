import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MySalaryInfo = () => {
    useEffect(() => {
        document.title = "My Salary Info";
      });
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">Salary Information</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card bg-base-100 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                    <div className="card-body">
                        <h2 className="card-title text-lg sm:text-xl font-semibold">Salary Structure</h2>
                        <p className="text-sm sm:text-base text-gray-600">View the Salary Structure</p>
                        <Link to="/my-salary-structure" className="btn btn-primary mt-4">
                            View Structure
                        </Link>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                    <div className="card-body">
                        <h2 className="card-title text-lg sm:text-xl font-semibold">Salary Distribution Request</h2>
                        <p className="text-sm sm:text-base text-gray-600">Choose your preferred method for salary distribution, either as Cash or through GCash, and submit your details for processing.</p>
                        <Link to="/salary-request" className="btn btn-primary mt-4">
                            View Requests
                        </Link>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                    <div className="card-body">
                        <h2 className="card-title text-lg sm:text-xl font-semibold">Payroll Slip</h2>
                        <p className="text-sm sm:text-base text-gray-600">Access your payroll slips for verification.</p>
                        <Link to="/my-pay-slip" className="btn btn-primary mt-4">
                            View Slips
                        </Link>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg rounded-lg transition-transform transform hover:scale-105">
                    <div className="card-body">
                        <h2 className="card-title text-lg sm:text-xl font-semibold">Overtime & Bonuses</h2>
                        <p className="text-sm sm:text-base text-gray-600">Track your overtime payments and bonuses earned.</p>
                        <Link to="/my-overtime-bonuses" className="btn btn-primary mt-4">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySalaryInfo;
