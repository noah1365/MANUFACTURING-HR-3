import React from 'react';

const EmployeeBenefitStatements = () => {
  const employeeBenefits = [
    {
      title: "Health and Wellness Programs",
      description: "Access to gym memberships, wellness workshops, and mental health support."
    },
    {
      title: "Flexible Work Hours",
      description: "Enjoy a work-life balance with customizable work schedules."
    },
    {
      title: "Professional Development",
      description: "Opportunities for training, certifications, and career advancement."
    },
    {
      title: "Generous Paid Time Off",
      description: "Vacation days, sick leave, and holidays to recharge and relax."
    },
  ];

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Employee Benefits</h2>
      <ul className="space-y-4">
        {employeeBenefits.map((benefit, index) => (
          <li key={index} className="bg-base-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{benefit.title}</h3>
            <p className="text-gray-700">{benefit.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeBenefitStatements;
