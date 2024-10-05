import React, { useState } from 'react';

const TaxDocuments = () => {
  const [taxDocuments, setTaxDocuments] = useState([
    { name: 'W-2', income: 50000, deductions: 10000, credits: 2000 },
    { name: '1099', income: 20000, deductions: 5000, credits: 1000 },
  ]);

  const [newTaxDocument, setNewTaxDocument] = useState({
    name: '',
    income: 0,
    deductions: 0,
    credits: 0,
  });

  const handleAddTaxDocument = (event) => {
    event.preventDefault();
    setTaxDocuments([...taxDocuments, newTaxDocument]);
    setNewTaxDocument({ name: '', income: 0, deductions: 0, credits: 0 });
  };

  const handleRemoveTaxDocument = (index) => {
    setTaxDocuments(taxDocuments.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tax Documents</h1>
      <table className="w-full table-auto mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Income (₱)</th>
            <th className="px-4 py-2 text-left">Deductions (₱)</th>
            <th className="px-4 py-2 text-left">Credits (₱)</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxDocuments.map((taxDocument, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-4 py-2">{taxDocument.name}</td>
              <td className="px-4 py-2">₱{taxDocument.income}</td>
              <td className="px-4 py-2">₱{taxDocument.deductions}</td>
              <td className="px-4 py-2">₱{taxDocument.credits}</td>
              <td className="px-4 py-2">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveTaxDocument(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-2xl font-bold mb-4">Add New Tax Document</h2>
      <form className="mb-4" onSubmit={handleAddTaxDocument}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="input input-bordered w-full"
            id="name"
            type="text"
            value={newTaxDocument.name}
            onChange={(e) => setNewTaxDocument({ ...newTaxDocument, name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income">
            Income
          </label>
          <input
            className="input input-bordered w-full"
            id="income"
            type="number"
            value={newTaxDocument.income}
            onChange={(e) => setNewTaxDocument({ ...newTaxDocument, income: parseInt(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deductions">
            Deductions
          </label>
          <input
            className="input input-bordered w-full"
            id="deductions"
            type="number"
            value={newTaxDocument.deductions}
            onChange={(e) => setNewTaxDocument({ ...newTaxDocument, deductions: parseInt(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credits">
            Credits
          </label>
          <input
            className="input input-bordered w-full"
            id="credits"
            type="number"
            value={newTaxDocument.credits}
            onChange={(e) => setNewTaxDocument({ ...newTaxDocument, credits: parseInt(e.target.value) })}
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default TaxDocuments;
