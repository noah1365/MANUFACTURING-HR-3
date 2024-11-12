import React, { useEffect, useState } from 'react';

const MyPaySlip = () => {
    const payrollData = [
        {
            month: "September 2024",
            payPeriod: "September 1 - September 30, 2024",
            grossSalary: 24000,
            bonus: 5000,
            deductions: {
                sss: 950,
                philhealth: 480,
                pagIbig: 200,
            },
        },
        {
            month: "October 2024",
            payPeriod: "October 1 - October 31, 2024",
            grossSalary: 25000,
            bonus: 0,
            deductions: {
                sss: 1000,
                philhealth: 500,
                pagIbig: 200,
            },
        },
        {
            month: "November 2024",
            payPeriod: "November 1 - November 30, 2024",
            grossSalary: 24000,
            bonus: 5000,
            deductions: {
                sss: 950,
                philhealth: 480,
                pagIbig: 200,
            },
        },
        {
            month: "December 2024",
            payPeriod: "December 1 - December 31, 2024",
            grossSalary: 26000,
            bonus: 0,
            deductions: {
                sss: 1000,
                philhealth: 500,
                pagIbig: 200,
            },
        },
    ];

    const [expandedData, setExpandedData] = useState(null);

    const toggleDetails = (data) => {
        setExpandedData(data);
    };

    const closeModal = () => {
        setExpandedData(null);
    };

    useEffect(() => {
        document.title = "My Payslip";
    }, []);

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Payroll Slips</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {payrollData.map((data, index) => {
                    return (
                        <div 
                            key={index} 
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
                        >
                            <h2 
                                className="text-xl font-semibold text-gray-700 cursor-pointer" 
                                onClick={() => toggleDetails(data)}
                            >
                                {data.month}
                            </h2>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {expandedData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                        <button 
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            X {/* Close button */}
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-4">{expandedData.month}</h2>
                        <p className="text-gray-600 mb-2"><strong>Pay Period:</strong> {expandedData.payPeriod}</p>

                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-700">Earnings</h3>
                            <p className="text-gray-600"><strong>Gross Salary:</strong> ₱{expandedData.grossSalary.toLocaleString()}</p>
                            {expandedData.bonus > 0 && (
                                <p className="text-gray-600"><strong>Bonus:</strong> ₱{expandedData.bonus.toLocaleString()}</p>
                            )}
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-700">Deductions</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                <li>SSS: ₱{expandedData.deductions.sss.toLocaleString()}</li>
                                <li>PhilHealth: ₱{expandedData.deductions.philhealth.toLocaleString()}</li>
                                <li>PAG-IBIG: ₱{expandedData.deductions.pagIbig.toLocaleString()}</li>
                            </ul>
                            <p className="font-bold text-gray-700 mt-2">
                                Total Deductions: ₱{Object.values(expandedData.deductions).reduce((acc, val) => acc + val, 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-700">Net Salary</h3>
                            <p className="text-2xl font-bold text-green-600">
                                ₱{
                                    (expandedData.grossSalary + expandedData.bonus - 
                                    Object.values(expandedData.deductions).reduce((acc, val) => acc + val, 0))
                                    .toLocaleString()
                                }
                            </p>
                        </div>

                        {/* Download Slip Button */}
                        <div className="mt-6 flex justify-center">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Download Slip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPaySlip;
