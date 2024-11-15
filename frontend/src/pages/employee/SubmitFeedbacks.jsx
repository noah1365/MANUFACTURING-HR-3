import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SubmitFeedbacks = () => {
  const [feedbackType, setFeedbackType] = useState("Salary Feedback");
  const [place, setPlace] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [position, setPosition] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    if(place.trim() === "" || feedback.trim() === "" ||(feedbackType === "Salary Feedback" && (hourlyRate.trim() === "" || position.trim() === ""))){
      toast.error("Please fill in all fields!");
      return;
    }
    

    const newFeedback = {
      id: Date.now(),
      feedbackType,
      place,
      feedback,
      ...(feedbackType === "Salary Feedback" && { hourlyRate, position }),
      ...(feedbackType === "Incentives Feedback"),
    };

    setFeedbackList((prevList) => [...prevList, newFeedback]);

    setPlace("");
    setHourlyRate("");
    setPosition("");
    setFeedback("");
    toast.success("Feedback submitted successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Feedback Page</h2>
        
        <div className="mb-4">
          <label className="block font-semibold mb-2">Feedback Type</label>
          <select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="Salary Feedback">Salary Feedback</option>
            <option value="Incentives Feedback">Incentives Feedback</option>
          </select>
        </div>

        <form onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback..."
            className="textarea textarea-bordered w-full mb-4"
            rows="4"
          />
          
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter the place"
            className="input input-bordered w-full mb-4"
          />

          {feedbackType === "Salary Feedback" && (
            <>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Enter the hourly rate"
                className="input input-bordered w-full mb-4"
              />
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="select select-bordered w-full mb-4"
              >
                <option value="">Select Position</option>
                {["CEO", "Secretary", "Production Head", "Resellers Sales Head", "Reseller", "Manager"].map(
                  (positionItem) => (
                    <option key={positionItem} value={positionItem}>
                      {positionItem}
                    </option>
                  )
                )}
              </select>
            </>
          )}


          <button type="submit" className="btn btn-primary w-full">
            Submit Feedback
          </button>
        </form>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Submitted Feedback:</h3>
          {feedbackList.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {feedbackList.map((feedbackItem) => (
                <li
                  key={feedbackItem.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <p><strong>Feedback Type:</strong> {feedbackItem.feedbackType}</p>
                  <p><strong>Place:</strong> {feedbackItem.place}</p>
                  <p><strong>Feedback:</strong> {feedbackItem.feedback}</p>
                  {feedbackItem.hourlyRate && (
                    <p><strong>Hourly Rate:</strong> {feedbackItem.hourlyRate}</p>
                  )}
                  {feedbackItem.position && (
                    <p><strong>Position:</strong> {feedbackItem.position}</p>
                  )}

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedbacks;
