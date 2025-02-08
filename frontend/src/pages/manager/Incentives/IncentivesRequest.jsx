import React, { useEffect, useState } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const IncentivesRequest = () => {
  const { incentives, fetchAllRequestIncentives, updateRequestIncentiveStatus } = useIncentiveStore();
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);

  useEffect(() => {
    document.title = "Incentives Request";
    fetchAllRequestIncentives();
  }, []);

  const handleAction = async (id, status) => {
    try {
      console.log(`Updating incentive ${id} to ${status}`);
      await updateRequestIncentiveStatus(id, status);
      fetchAllRequestIncentives();
    } catch (error) {
      console.error("Failed to update incentive:", error);
    }
  };

  const truncateComment = (comment, index) => {
    if (!comment) return "N/A";
    if (expandedCommentIndex === index) return comment;

    const words = comment.split(" ");
    return words.length > 20 ? words.slice(0, 10).join(" ") + "..." : comment;
  };

  const handleSeeMoreClick = (index) => {
    setExpandedCommentIndex(expandedCommentIndex === index ? null : index);
  };
  const sortedIncentives = incentives
  ? [...incentives].sort((a, b) => (a.status === "Pending" ? -1 : 1))
  : [];
  return (
    <div className="relative max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl font-semibold mb-6">Incentives Request</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Incentives for Approval</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-3 border">Lastname</th>
              <th className="p-3 border">Firstname</th>
              <th className="p-3 border">Incentive Type</th>
              <th className="p-3 border">Comment</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
  {sortedIncentives.length > 0 ? (
    sortedIncentives.map((incentive, index) => (
      <tr key={incentive._id} className="hover:bg-neutral hover:text-white transition">
        <td className="p-3 border">{incentive.employeeId?.lastName || "N/A"}</td>
        <td className="p-3 border">{incentive.employeeId?.firstName || "N/A"}</td>
        <td className="p-3 border">{incentive.incentiveType}</td>
        <td className="p-3 border">
          {truncateComment(incentive.comments, index)}
          {incentive.comments?.split(" ").length > 20 && (
            <button
              onClick={() => handleSeeMoreClick(index)}
              className="ml-2 text-blue-500 underline focus:outline-none"
            >
              {expandedCommentIndex === index ? "See Less" : "See More"}
            </button>
          )}
        </td>
        <td className="p-3 border text-center">
          {incentive.status === "Pending" ? (
            <>
              <button
                onClick={() => handleAction(incentive._id, "approved")}
                className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600 transition"
                aria-label="Approve Incentive"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(incentive._id, "denied")}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                aria-label="Deny Incentive"
              >
                Deny
              </button>
            </>
          ) : (
            <span
              className={`px-4 py-2 rounded-md font-semibold ${
                incentive.status === "approved" ? "text-green-600" : "text-red-600"
              }`}
            >
              {incentive.status.charAt(0).toUpperCase() + incentive.status.slice(1)}
            </span>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center p-4 border">
        No pending incentives.
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default IncentivesRequest;
