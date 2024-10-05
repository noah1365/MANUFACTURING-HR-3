import React, { useState } from 'react';

const SalaryDetails = () => {
  const [salaries, setSalaries] = useState([
    { id: 1, name: 'John Doe', position: 'Software Engineer', salary: 80000 },
    { id: 2, name: 'Jane Doe', position: 'UX Designer', salary: 70000 },
    { id: 3, name: 'Bob Smith', position: 'Product Manager', salary: 90000 },
  ]);

  const [newSalary, setNewSalary] = useState({
    id: salaries.length + 1,
    name: '',
    position: '',
    salary: 0,
  });

  const handleAddSalary = (e) => {
    e.preventDefault(); // Prevent page refresh
    setSalaries([...salaries, newSalary]);
    setNewSalary({
      id: salaries.length + 2,
      name: '',
      position: '',
      salary: 0,
    });
  };

  const handleDeleteSalary = (id) => {
    setSalaries(salaries.filter((salary) => salary.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Salary Details</h1>
      <table className="w-full table-auto mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Position</th>
            <th className="px-4 py-2 text-left">Salary</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((salary) => (
            <tr key={salary.id}>
              <td className="px-4 py-2">{salary.name}</td>
              <td className="px-4 py-2">{salary.position}</td>
              <td className="px-4 py-2">₱{salary.salary.toLocaleString()}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDeleteSalary(salary.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="flex flex-col mb-4" onSubmit={handleAddSalary}>
        <label className="mb-2" htmlFor="name">
          Name:
        </label>
        <input
          className="p-2 mb-4 border border-gray-400 rounded"
          type="text"
          id="name"
          value={newSalary.name}
          onChange={(e) => setNewSalary({ ...newSalary, name: e.target.value })}
        />
        <label className="mb-2" htmlFor="position">
          Position:
        </label>
        <input
          className="p-2 mb-4 border border-gray-400 rounded"
          type="text"
          id="position"
          value={newSalary.position}
          onChange={(e) => setNewSalary({ ...newSalary, position: e.target.value })}
        />
        <label className="mb-2" htmlFor="salary">
          Salary:
        </label>
        <input
          className="p-2 mb-4 border border-gray-400 rounded"
          type="number"
          id="salary"
          value={newSalary.salary}
          onChange={(e) => setNewSalary({ ...newSalary, salary: parseInt(e.target.value) })}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Add Salary
        </button>
      </form>
    </div>
  );
};

export default SalaryDetails;
