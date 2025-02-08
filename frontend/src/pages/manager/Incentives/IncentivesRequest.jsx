import React, { useEffect, useState } from "react";
import { useIncentiveStore } from "../../../store/incentiveStore";

const IncentivesRequest = () => {
  const { incentives, fetchAllRequestIncentives } = useIncentiveStore();
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);

  useEffect(() => {
    document.title = "Incentives Request";
    fetchAllRequestIncentives();
  }, []);

  const truncateComment = (comment, index) => {
    if (!comment) return "N/A";
    if (expandedCommentIndex === index) return comment;

    const words = comment.split(" ");
    if (words.length > 20) {
      return words.slice(0, 5).join(" ") + "...";
    }
    return comment;
  };

  const handleSeeMoreClick = (index) => {
    setExpandedCommentIndex(expandedCommentIndex === index ? null : index);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl font-semibold mb-6">Incentives Request</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Incentives for Approval</h2>
        <table className="table w-full">
          <thead>
            <tr className="bg-primary text-white">
              <th>Lastname</th>
              <th>Firstname</th>
              <th>Incentive Type</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incentives.length > 0 ? (
              incentives.map((incentive, index) => (
                <tr key={incentive._id} className="hover:bg-neutral hover:text-white">
                  <td>{incentive.employeeId?.lastName || "N/A"}</td>
                  <td>{incentive.employeeId?.firstName || "N/A"}</td>
                  <td>{incentive.incentiveType}</td>
                  <td>
                    {truncateComment(incentive.comments, index)}
                    {incentive.comments?.split(" ").length > 20 && (
                      <button
                        onClick={() => handleSeeMoreClick(index)}
                        className="ml-2 text-blue-500 underline"
                      >
                        {expandedCommentIndex === index ? "See Less" : "See More"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
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
