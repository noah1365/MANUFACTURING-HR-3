import React, { useState } from 'react';

const benefits = [
  { id: 1, name: 'Health Insurance', description: 'Comprehensive health insurance plan', cost: 100 },
  { id: 2, name: 'Dental Insurance', description: 'Comprehensive dental insurance plan', cost: 50 },
  { id: 3, name: 'Vision Insurance', description: 'Comprehensive vision insurance plan', cost: 25 },
  { id: 4, name: '401(k) Plan', description: 'Retirement savings plan', cost: 0 },
  { id: 5, name: 'Life Insurance', description: 'Basic life insurance plan', cost: 25 },
];

const BenefitsEnrollment = () => {
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const handleBenefitSelection = (benefit) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b.id !== benefit.id));
      setTotalCost(totalCost - benefit.cost);
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
      setTotalCost(totalCost + benefit.cost);
    }
  };

  const handleEnrollment = () => {
    alert(`Enrolled in: ${selectedBenefits.map(b => b.name).join(', ')}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-base-200 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Benefits Enrollment</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th className="p-2">Benefit Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Cost</th>
            <th className="p-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {benefits.map((benefit) => (
            <tr key={benefit.id}>
              <td className="p-2">{benefit.name}</td>
              <td className="p-2">{benefit.description}</td>
              <td className="p-2">{benefit.cost * 18} /month</td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedBenefits.includes(benefit)}
                  onChange={() => handleBenefitSelection(benefit)}
                  className="checkbox"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-lg mb-4 mt-4">Total monthly cost: {totalCost * 18}</p>
      <button
        type="button"
        className="btn btn-primary mt-4"
        onClick={handleEnrollment}
      >
        Enroll
      </button>
    </div>
  );
};

export default BenefitsEnrollment;
