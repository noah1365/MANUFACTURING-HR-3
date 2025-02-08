import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBenefitStore } from "../../../store/benefitStore";

const ApplyBenefits = () => {
  const { requestBenefit, fetchBenefit, benefits } = useBenefitStore(); 
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [formData, setFormData] = useState({
    benefitType: "",
    frontIdFile: null,
    backIdFile: null,
  });

  useEffect(() => {
    fetchBenefit();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("benefitsName", formData.benefitType);
    formDataToSend.append("frontId", formData.frontIdFile);
    formDataToSend.append("backId", formData.backIdFile);

    try {
      const success = await requestBenefit(formDataToSend);
      if (success) {
        toast.success("Benefit request submitted successfully!");
        setFormData({ benefitType: "", frontIdFile: null, backIdFile: null }); 
        setFormKey((prevKey) => prevKey + 1);
      } else {
        toast.error("Failed to submit benefit request.");
      }
    } catch (error) {
      toast.error("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-4">Apply for Benefits</h1>

      <form onSubmit={handleSubmit} key={formKey}>
        <div className="mb-4">
          <label className="block font-semibold">Select Benefit</label>
          <select
            name="benefitType"
            value={formData.benefitType}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Choose a benefit</option>
            {benefits.map((benefit) => (
              <option key={benefit._id} value={benefit.benefitsName}>
                {benefit.benefitsName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Upload Front ID</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "frontIdFile")}
            className="file-input file-input-bordered w-full"
            accept="image/*"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Upload Back ID</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "backIdFile")}
            className="file-input file-input-bordered w-full"
            accept="image/*"
            required
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>

      
    </div>
  );
};

export default ApplyBenefits;
