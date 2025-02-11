import { useIncentiveStore } from "../../../store/incentiveStore";
import React, { useEffect } from "react";

const RecognitionLists = () => {
  const { allRecognitionPrograms, fetchAllRecognitionPrograms } = useIncentiveStore();

  useEffect(() => {
    document.title = "Recognition Programs";
    fetchAllRecognitionPrograms();
  }, [fetchAllRecognitionPrograms]);

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl text-center font-semibold mb-6">Recognition Programs Lists</h1>

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
            {Array.isArray(allRecognitionPrograms) && allRecognitionPrograms.length > 0 ? (
              allRecognitionPrograms.map((program, index) => (
                <tr key={index} className="hover:bg-neutral hover:text-white">
                  <td>
                    {program?.employeeId?.firstName ?? "Unknown"} {program?.employeeId?.lastName ?? ""}
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

export default RecognitionLists;
