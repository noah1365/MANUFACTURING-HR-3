import React from 'react';

const RetirementPlanOverview = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-primary mb-4">Retirement Plan Overview</h1>
      <section className="mb-6">
        <p className="text-lg">
          Planning for retirement is essential to ensure financial stability in your later years. Below are key components of an effective retirement plan.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-2">Savings Goals</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Determine how much you need to retire comfortably.</li>
          <li>Set a timeline for your savings goals.</li>
          <li>Consider additional expenses like healthcare and travel.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-2">Investment Options</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>401(k) plans and employer-sponsored retirement accounts.</li>
          <li>Individual Retirement Accounts (IRAs).</li>
          <li>Stocks, bonds, and mutual funds.</li>
          <li>Real estate and other alternative investments.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-2">Retirement Timeline</h2>
        <p>It's never too early to start planning. Here's a suggested timeline:</p>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>20s-30s:</strong> Start saving early, take advantage of employer matches.</li>
          <li><strong>40s:</strong> Re-evaluate your savings plan, increase contributions.</li>
          <li><strong>50s:</strong> Maximize retirement contributions, consider catch-up contributions.</li>
          <li><strong>60s:</strong> Plan for withdrawal strategies and evaluate your retirement income.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-secondary mb-2">Retirement Income Sources</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-left">Source</th>
              <th className="text-left">Description</th>
              <th className="text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Social Security</td>
              <td>Monthly payments from the government based on earnings history.</td>
              <td>Benefits may vary based on retirement age.</td>
            </tr>
            <tr>
              <td>Pension Plans</td>
              <td>Employer-sponsored retirement plans that provide fixed payouts.</td>
              <td>Not all employers offer this option.</td>
            </tr>
            <tr>
              <td>Personal Savings</td>
              <td>Funds saved in individual accounts, including IRAs.</td>
              <td>Can be withdrawn at your discretion.</td>
            </tr>
            <tr>
              <td>Investments</td>
              <td>Income generated from stocks, bonds, and other assets.</td>
              <td>Risk varies based on investment type.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer className="text-center mt-8">
        <p className="text-lg font-semibold">Start planning today for a secure and enjoyable retirement!</p>
      </footer>
    </div>
  );
};

export default RetirementPlanOverview;
