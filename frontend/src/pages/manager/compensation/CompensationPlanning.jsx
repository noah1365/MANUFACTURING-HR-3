import { useEffect, useState } from "react";
import { useCompensationStore } from "../../../store/compensationStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompensationPlanning = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    position: '',
    hourlyRate: '',
    overTimeRate: '',
    holidayRate: '',
    benefits: [],
    performanceMetrics: [],
    salaryAdjustmentGuidelines: '',
    effectiveDate: '',
    comments: '',
  });


  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  const [benefitName, setBenefitName] = useState('');
  const [benefitDeduction, setBenefitDeduction] = useState('');
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const { getCompensationPlans, compensationPlans = [], createCompensationPlan, deleteCompensationPlan, updateCompensationPlan } = useCompensationStore();

  useEffect(() => {
    document.title = 'Compensation planning'
    getCompensationPlans();
  }, [getCompensationPlans]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleAddBenefit = () => {
    if(benefitName && benefitDeduction) {
      setNewPlan((prevPlan) => ({
        ...prevPlan,
        benefits: [...prevPlan.benefits, { name: benefitName, deduction: Number(benefitDeduction) }],
      }));
      setBenefits([...benefits, { name: benefitName, deduction: Number(benefitDeduction) }]);
      setBenefitName('');
      setBenefitDeduction('');
    } else {
      toast.error("Please provide both benefit name and deduction amount.");
    }
  };

  const handleAddMetric = () => {
    if(metricName && metricValue) {
      setNewPlan((prevPlan) => ({
        ...prevPlan,
        performanceMetrics: [...prevPlan.performanceMetrics, { name: metricName, metrics: Number(metricValue) }],
      }));
      setMetrics([...metrics, { name: metricName, value: Number(metricValue) }]);
      setMetricName('');
      setMetricValue('');
    } else {
      toast.error("Please provide both metric name and value.");
    }
  };

  const handleCancel = () => {
    setNewPlan({
      position: '',
      hourlyRate: '',
      overTimeRate: '',
      holidayRate: '',
      benefits: [],
      performanceMetrics: [],
      salaryAdjustmentGuidelines: '',
      effectiveDate: '',
      comments: '',
    });
    setEditingPlanId(null);
    setIsModalOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { position, hourlyRate, overTimeRate, holidayRate, effectiveDate } = newPlan;
  
    if(!position || !hourlyRate || !overTimeRate || !holidayRate || !effectiveDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    if(hourlyRate <= 0 || overTimeRate <= 0 || holidayRate <= 0) {
      toast.error("Rates should be positive numbers.");
      return;
    }
  
    if(newPlan.benefits.length === 0) {
      toast.error("Please add at least one benefit.");
      return;
    }
  
    if(newPlan.performanceMetrics.length === 0) {
      toast.error("Please add at least one performance metric.");
      return;
    }
  
    const result = editingPlanId 
      ? await updateCompensationPlan(editingPlanId, newPlan) 
      : await createCompensationPlan(newPlan);
    console.log(result);
    
    if(result.success) {
      toast.success(editingPlanId ? "Compensation plan updated successfully!" : "Compensation plan created successfully!");
      clearForm();
      setIsModalOpen(false);
      getCompensationPlans();
    } else {
      toast.error(result.message);
    }
  };
  
  const clearForm = () => {
    setNewPlan({
      position: '',
      hourlyRate: '',
      overTimeRate: '',
      holidayRate: '',
      benefits: [],
      performanceMetrics: [],
      salaryAdjustmentGuidelines: '',
      effectiveDate: '',
      comments: '',
    });
    setBenefits([]);
    setMetrics([]);
    setBenefitName('');
    setBenefitDeduction('');
    setMetricName('');
    setMetricValue('');
  };

  const handleDelete = async (id) => {
    const result = await deleteCompensationPlan(id);
    if(result.success) {
      toast.success("Compensation plan deleted successfully!");
      getCompensationPlans();
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = (plan) => {
    setNewPlan({
      ...plan,
      effectiveDate: formatDate(plan.effectiveDate),
    });
    setBenefits(plan.benefits);
    setMetrics(plan.performanceMetrics);
    setEditingPlanId(plan._id);
    setIsModalOpen(true);
  };

  const removeBenefit = (index) => {
    setNewPlan((prevPlan) => {
      const updatedBenefits = prevPlan.benefits.filter((_, i) => i !== index);
      return { ...prevPlan, benefits: updatedBenefits };
    });
  };

  const removeMetric = (index) => {
    setNewPlan((prevPlan) => {
      const updatedMetrics = prevPlan.performanceMetrics.filter((_, i) => i !== index);
      return { ...prevPlan, performanceMetrics: updatedMetrics };
    });
  };
  
  return (
    <div className="relative max-w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer />
      <div className="mb-4">
        <button className="bg-primary text-white px-4 py-2 rounded mr-10" onClick={() => setIsModalOpen(true)}>
          Add New Plan
        </button>
        <button className="bg-primary text-white px-4 py-2 rounded mr-10">
          Submit to admin
        </button>
        <button className="bg-primary text-white px-4 py-2 rounded">
          Download
        </button>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-100">
              <h2 className="text-xl font-bold mb-4">Add New Compensation Plan</h2>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="position"
                      placeholder="Position"
                      value={newPlan.position}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                    <input
                      type="number"
                      name="hourlyRate"
                      placeholder="Hourly Rate"
                      value={newPlan.hourlyRate}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="overTimeRate"
                      placeholder="OT Rate"
                      value={newPlan.overTimeRate}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                    <input
                      type="number"
                      name="holidayRate"
                      placeholder="Holiday Rate"
                      value={newPlan.holidayRate}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Benefit Name"
                        value={benefitName}
                        onChange={(e) => setBenefitName(e.target.value)}
                        className="border p-2 w-full"
                      />
                      <input
                        type="number"
                        placeholder="Deduction Amount"
                        value={benefitDeduction}
                        onChange={(e) => setBenefitDeduction(e.target.value)}
                        className="border p-2 w-full"
                      />
                    </div>
                      
                    <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <button type="button" className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddBenefit}>
                      Add Benefit
                    </button>
                    <div>
                      <h3 className="font-semibold">Added Benefits:</h3>
                      <ul className="list-disc ml-5">
                      {newPlan.benefits.map((benefit, index) => (
                            <li key={index} className="flex justify-between items-center">
                              {benefit.name} - Deduction: {benefit.deduction}
                              <button type="button" className="text-red-500 ml-2" onClick={() => removeBenefit(index)}>
                                Delete
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>


                  <div className="mb-4">
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Performance Metric Name"
                        value={metricName}
                        onChange={(e) => setMetricName(e.target.value)}
                        className="border p-2 w-full"
                      />
                      <input
                        type="number"
                        placeholder="Metric Value"
                        value={metricValue}
                        onChange={(e) => setMetricValue(e.target.value)}
                        className="border p-2 w-full"
                      />
                    </div>
                    <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <button type="button" className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddMetric}>
                      Add Metric
                    </button>
                    <div>
                      <h3 className="font-semibold">Added Metrics:</h3>
                      <ul className="list-disc ml-5">
                      {newPlan.performanceMetrics.map((metric, index) => (
                            <li key={index} className="flex justify-between items-center">
                              {metric.name} - Value: {metric.metrics}
                              <button type="button" className="text-red-500 ml-2" onClick={() => removeMetric(index)}>
                                Delete
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                </div>
              </div>
            </div>

                  <input
                    type="text"
                    name="salaryAdjustmentGuidelines"
                    placeholder="Salary Adjustment Guidelines"
                    value={newPlan.salaryAdjustmentGuidelines}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                  <input
                    type="date"
                    name="effectiveDate"
                    value={newPlan.effectiveDate}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                  />
                  <textarea
                    name="comments"
                    placeholder="Comments"
                    value={newPlan.comments}
                    onChange={handleInputChange}
                    className="border p-2 mb-4 w-full"
                  />
                  <div className="flex justify-between">
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                      {editingPlanId ? "Update Plan" : "Create Plan"}
                    </button>
                    <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded" onClick={clearForm}>Clear</button>
                    <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}



      <h1 className="text-3xl font-bold mb-4">Compensation Planning</h1>
      <div className="overflow-x-auto">
        <table className="table w-full text-left">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Position</th>
              <th className="border px-4 py-2">Hourly Rate</th>
              <th className="border px-4 py-2">OT Rate</th>
              <th className="border px-4 py-2">Holiday Rate</th>
              <th className="border px-4 py-2">Benefits</th>
              <th className="border px-4 py-2">Metrics</th>
              <th className="border px-4 py-2">Guidelines</th>
              <th className="border px-4 py-2">Effective Date</th>
              <th className="border px-4 py-2">Comments</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
              {Array.isArray(compensationPlans) && compensationPlans.length > 0 ? (
                  compensationPlans.map((plan) => (
                      plan ? (
                          <tr key={plan._id} className="hover:bg-neutral hover:text-white">
                              <td className="border px-4 py-2">{plan.position || 'N/A'}</td>
                              <td className="border px-4 py-2">{plan.hourlyRate || 'N/A'}</td>
                              <td className="border px-4 py-2">{plan.overTimeRate || 'N/A'}</td>
                              <td className="border px-4 py-2">{plan.holidayRate || 'N/A'}</td>
                              <td className="border px-4 py-2">
                                  {plan.benefits && plan.benefits.length > 0 
                                      ? plan.benefits.map(ben => `${ben.name} (${ben.deduction})`).join(', ') 
                                      : 'N/A'}
                              </td>
                              <td className="border px-4 py-2">
                                  {plan.performanceMetrics && plan.performanceMetrics.length > 0 
                                      ? plan.performanceMetrics.map(met => `${met.name} (${met.metrics})`).join(', ') 
                                      : 'N/A'}
                              </td>
                              <td className="border px-4 py-2">{plan.salaryAdjustmentGuidelines || 'N/A'}</td>
                              <td className="border px-4 py-2">{plan.effectiveDate ? formatDate(plan.effectiveDate) : 'N/A'}</td>
                              <td className="border px-4 py-2">{plan.comments || 'N/A'}</td>
                              <td className="border px-4 py-2">
                                  <button onClick={() => handleEdit(plan)} className="bg-primary text-white px-2 py-1 rounded">
                                      Edit
                                  </button>
                                  <button onClick={() => handleDelete(plan._id)} className="bg-error text-white px-2 py-1 rounded">
                                      Delete
                                  </button>
                              </td>
                          </tr>
                      ) : (
                          <tr key={Math.random()}>
                              <td colSpan="10" className="text-center">Invalid data entry found!</td>
                          </tr>
                      )
                  ))
              ) : (
                  <tr>
                      <td colSpan="10" className="text-center">No compensation plans found!</td>
                  </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompensationPlanning
