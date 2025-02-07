import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBenefitStore } from '../../../store/benefitStore';

const EBenefitsOverview = () => {
  const { fetchBenefit ,benefit:benefits } = useBenefitStore();

  useEffect(() => {
    document.title = 'Benefits Administration';
    fetchBenefit();
  }, [fetchBenefit]);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Benefits Overview</h1>

      <div className="mb-4">
        <table className="table w-full mb-4">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Benefits Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Benefits Type</th>
              <th className="border px-4 py-2">Require Request</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(benefits) && benefits.length > 0 ? (
              benefits.map((benefit) => (
                <tr key={`${benefit._id}-${benefit.benefitsName}`} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{benefit.benefitsName || 'N/A'}</td>
                  <td className="border px-4 py-2">{benefit.benefitsDescription || 'N/A'}</td>
                  <td className="border px-4 py-2">{benefit.benefitsType || 'N/A'}</td>
                  <td className="border px-4 py-2">{benefit.requiresRequest ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No benefits found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
<hr />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Apply Benefit</h2>
            <p>Submit and manage your benefits enrollment requests</p>
            <Link to="/apply-benefits" className="btn btn-primary">
              <button>Apply benefit</button>
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Deductions</h2>
            <p>Review and manage my deductions.</p>
            <Link to="/my-deductions" className="btn btn-primary">
              <button>View Deductions</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBenefitsOverview;
