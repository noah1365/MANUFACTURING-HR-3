import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EmployeeSurvey = () => {
  const [feedback, setFeedback] = useState("");
  const [satisfactionScore, setSatisfactionScore] = useState(0);
  const [salaryScores, setSalaryScores] = useState([0, 0, 0]); 
  const [benefitsScores, setBenefitsScores] = useState([0, 0, 0]);
  const [incentivesScores, setIncentivesScore] = useState(0);
  const [compensationScores, setCompensationScore] = useState(0);
  const [surveyList, setSurveyList] = useState([]);

  const handleSurveySubmit = (e) => {
    e.preventDefault();

    if (feedback.trim() === "") {
      toast.error("Please provide your feedback!");
      return;
    }

    const newSurvey = {
      id: Date.now(),
      feedback,
      satisfactionScore: satisfactionScore > 0 ? satisfactionScore : undefined,
      salaryScores: salaryScores.map(score => score > 0 ? score : undefined),
      benefitsScores: benefitsScores.map(score => score > 0 ? score : undefined),
      incentivesScores: incentivesScores.map(score => score > 0 ? score : undefined),
      compensationScores: compensationScores.map(score => score > 0 ? score : undefined),
    };

    setSurveyList((prevList) => [...prevList, newSurvey]);

    setFeedback("");
    setSatisfactionScore(0);
    setSalaryScores([0, 0, 0]);
    setBenefitsScores([0, 0, 0]);
    setIncentivesScore(0);
    setCompensationScore(0);
    toast.success("Survey submitted successfully!");
  };

  const handleRatingChange = (setter, index) => (event) => {
    const updatedScores = [...setter];
    updatedScores[index] = Number(event.target.value);
    setter(updatedScores);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Employee Satisfaction Survey</h2>

        <form onSubmit={handleSurveySubmit}>
          <h3 className="font-semibold mb-4">1. Please provide your feedback on your overall work experience:</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            className="textarea textarea-bordered w-full mb-4"
            rows="4"
          />

          <h3 className="font-semibold mb-4">2. Rate your satisfaction with the following:</h3>

          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 font-semibold">Criteria</th>
                <th className="px-4 py-2 font-semibold">Rating (1-5)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">Satisfaction with Work Environment</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="satisfactionScore"
                          value={rating}
                          checked={satisfactionScore === rating}
                          onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Salary Satisfaction with 3 questions */}
              <h2>Salary</h2>
              <tr>
                <td className="px-4 py-2">Is your salary competitive with industry standards?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="salaryScore1"
                          value={rating}
                          checked={salaryScores[0] === rating}
                          onChange={handleRatingChange(setSalaryScores, 0)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Are you satisfied with the salary increase process?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="salaryScore2"
                          value={rating}
                          checked={salaryScores[1] === rating}
                          onChange={handleRatingChange(setSalaryScores, 1)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Is your salary aligned with your responsibilities?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="salaryScore3"
                          value={rating}
                          checked={salaryScores[2] === rating}
                          onChange={handleRatingChange(setSalaryScores, 2)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Benefits Satisfaction with 3 questions */}
              <h2>Benefits</h2>
              <tr>
                <td className="px-4 py-2">Are you satisfied with the health benefits?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="benefitsScore1"
                          value={rating}
                          checked={benefitsScores[0] === rating}
                          onChange={handleRatingChange(setBenefitsScores, 0)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Are you satisfied with the benefits plan options?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="benefitsScore2"
                          value={rating}
                          checked={benefitsScores[1] === rating}
                          onChange={handleRatingChange(setBenefitsScores, 1)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Are you satisfied with other company benefits (e.g., wellness, insurance)?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="benefitsScore3"
                          value={rating}
                          checked={benefitsScores[2] === rating}
                          onChange={handleRatingChange(setBenefitsScores, 2)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Incentives Satisfaction */}
              <h2>Incentives</h2>
              <tr>
                <td className="px-4 py-2">Are you satisfied with the incentives and rewards program?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="incentivesScores"
                          value={rating}
                          checked={incentivesScores === rating}
                          onChange={(e) => setIncentivesScore(Number(e.target.value))}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>

              <h2>Compensation</h2>
              
              <tr>
                
                <td className="px-4 py-2">Are you satisfied with the overall compensation package?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="compensationScore1"
                          value={rating}
                          checked={salaryScores[0] === rating}
                          onChange={handleRatingChange(setSalaryScores, 0)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Do you feel your compensation reflects your contributions to the company?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="compensationScore2"
                          value={rating}
                          checked={salaryScores[1] === rating}
                          onChange={handleRatingChange(setSalaryScores, 1)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Are you satisfied with the frequency of compensation reviews (annual, bi-annual)?</td>
                <td className="px-4 py-2">
                  <div className="flex justify-start">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer mr-2">
                        <input
                          type="radio"
                          name="compensationScore3"
                          value={rating}
                          checked={salaryScores[2] === rating}
                          onChange={handleRatingChange(setSalaryScores, 2)}
                          className="radio"
                        />
                        {rating}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeSurvey;
