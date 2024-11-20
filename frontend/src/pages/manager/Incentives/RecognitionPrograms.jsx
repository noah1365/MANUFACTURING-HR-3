import React, { useEffect, useState } from 'react';

const initialPrograms = [
  { name: 'Borlagdatan John Lloyd', description: 'Award for the most outstanding employee of the month', reward: '₱5000' },
  { name: 'Padit Oliver', description: 'Award for the team with the best performance', reward: '₱10000' },
  { name: 'Canja Abeguel', description: 'Award for the employee with the best innovation', reward: '₱3000' },
];

const RecognitionPrograms = () => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    reward: '',
  });

  useEffect(() => {
    document.title = 'Recognition Programs';
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProgram = () => {
    setPrograms((prev) => [...prev, newProgram]);
    setNewProgram({ name: '', description: '', reward: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl font-semibold mb-6">Recognition Programs</h1>

      <button className="btn btn-primary mb-6" onClick={() => setIsModalOpen(true)}>
        Add New Recognition Program
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Recognition Program</h2>
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={newProgram.name}
                onChange={handleInputChange}
                placeholder="e.g., Name"
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                name="description"
                value={newProgram.description}
                onChange={handleInputChange}
                placeholder="e.g., Award for the most outstanding employee of the month"
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="label">
                <span className="label-text">Reward</span>
              </label>
              <input
                type="text"
                name="reward"
                value={newProgram.reward}
                onChange={handleInputChange}
                placeholder="e.g., ₱0.00"
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn btn-secondary mr-2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddProgram}>
                Add Program
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <table className="table w-full mt-4">
          <thead>
            <tr className='bg-primary text-white'>
              <th>Name</th>
              <th>Description</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr key={index} className='hover:bg-neutral hover:text-white'>
                <td>{program.name}</td>
                <td>{program.description}</td>
                <td>{program.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecognitionPrograms;
