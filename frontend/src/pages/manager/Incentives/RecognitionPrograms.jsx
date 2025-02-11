import { useAuthStore } from "../../../store/authStore";
import { useIncentiveStore } from "../../../store/incentiveStore";
import React, { useEffect, useState } from "react";

const RecognitionPrograms = () => {
  const { fetchUsers, users } = useAuthStore();
  const {
    allRecognitionPrograms,
    fetchAllRecognitionPrograms,
    createRecognitionPrograms,
  } = useIncentiveStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    employeeId: "",
    awardName: "",
    description: "",
    rewardType: "",
    rewardValue: "",
  });

  useEffect(() => {
    document.title = "Recognition Programs";

    const fetchData = async () => {
      try {
        await fetchAllRecognitionPrograms();
        await fetchUsers();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchAllRecognitionPrograms, fetchUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting new recognition program:", newProgram);
    try {
      const success = await createRecognitionPrograms(newProgram);
      if (success) {
        await fetchAllRecognitionPrograms();
        setIsModalOpen(false);
        setNewProgram({
          employeeId: "",
          awardName: "",
          description: "",
          rewardType: "",
          rewardValue: "",
        });
      }
    } catch (error) {
      console.error("Error submitting recognition program:", error);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl font-semibold mb-6">Recognition Programs</h1>

      <button
        className="btn btn-primary mb-6"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Recognition Program
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">
              Add New Recognition Program
            </h2>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Select Employee</span>
              </label>
              <select
                name="employeeId"
                value={newProgram.employeeId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Employee</option>
                {users.length > 0 &&
                  users.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Award Name</span>
              </label>
              <input
                type="text"
                name="awardName"
                value={newProgram.awardName}
                onChange={handleInputChange}
                placeholder="e.g., Employee of the Month"
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
                placeholder="e.g., Award for outstanding performance"
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-4">
              <label className="label">
                <span className="label-text">Reward Type</span>
              </label>
              <select
                name="rewardType"
                value={newProgram.rewardType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Reward Type</option>
                <option value="Bonus">Bonus</option>
                <option value="Gift">Gift</option>
                <option value="Promotion">Promotion</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {(newProgram.rewardType === "Bonus" ||
              newProgram.rewardType === "Cash") && (
              <div className="mb-4">
                <label className="label">
                  <span className="label-text">Reward Value</span>
                </label>
                <input
                  type="number"
                  name="rewardValue"
                  value={newProgram.rewardValue}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  className="input input-bordered w-full"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <table className="table w-full mt-4">
          <thead>
            <tr className="bg-primary text-white">
              <th>Employee</th>
              <th>Award Name</th>
              <th>Description</th>
              <th>Reward Type</th>
              <th>Reward Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(allRecognitionPrograms) &&
            allRecognitionPrograms.length > 0 ? (
              allRecognitionPrograms.map((program, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td>
                    {program?.employeeId?.firstName ?? "Unknown"}{" "}
                    {program?.employeeId?.lastName ?? ""}
                  </td>
                  <td>{program?.awardName ?? "N/A"}</td>
                  <td>{program?.description ?? "N/A"}</td>
                  <td>{program?.rewardType ?? "N/A"}</td>
                  <td>{program?.rewardValue ?? "0"}</td>
                  <td>{program?.status ?? "Pending"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500">
                  No recognition programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecognitionPrograms;
