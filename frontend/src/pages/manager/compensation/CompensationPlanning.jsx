import { useEffect, useState } from "react";
import { useCompensationStore } from "../../../store/compensationStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StandardCompensation from "./StandardCompensation";

const CompensationPlanning = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStandardOpn, setIsStandardOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    position: '',
    hourlyRate: '',
    overTimeRate: '',
    holidayRate: '',
    allowances:[],
  });


/*   const formatDate = (date) => {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
  
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }; */
  
  
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

  const handleCancel = () => {
    setNewPlan({
      position: '',
      hourlyRate: '',
      overTimeRate: '',
      holidayRate: '',
      allowances:[],
    });
    setEditingPlanId(null);
    setIsModalOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { position, hourlyRate, overTimeRate, holidayRate, allowances} = newPlan;
  
    if(!position || !hourlyRate || !overTimeRate || !holidayRate ||!allowances) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    if(hourlyRate <= 0 || overTimeRate <= 0 || holidayRate <= 0) {
      toast.error("Rates should be positive numbers.");
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
      allowances:[],
 /*      effectiveDate: '', */
    });
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this compensation plan?");
  if(isConfirmed){
    const result = await deleteCompensationPlan(id);
    if(result.success) {
      toast.success("Compensation plan deleted successfully!");
      getCompensationPlans();
    } else {
      toast.error(result.message);
    }
  }else{
    toast.info("Delete action was canceled!");
  }
  };

  const handleEdit = (plan) => {
    setNewPlan({
      ...plan,
      /* effectiveDate: formatDate(plan.effectiveDate), */
    });
    setEditingPlanId(plan._id);
    setIsModalOpen(true);
  };

  const handleAllowanceChange = (index, field, value) => {
  const updatedAllowances = [...newPlan.allowances];
  updatedAllowances[index][field] = value;
  setNewPlan({ ...newPlan, allowances: updatedAllowances });
};

const addAllowance = () => {
  setNewPlan({
    ...newPlan,
    allowances: [...newPlan.allowances, { type: "", amount: "" }],
  });
};

const removeAllowance = (index) => {
  const updatedAllowances = [...newPlan.allowances];
  updatedAllowances.splice(index, 1);
  setNewPlan({ ...newPlan, allowances: updatedAllowances });
};

  return (
    <div className="relative max-w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer />
      <div className="mb-4">
        <button className="bg-primary text-white px-4 py-2 rounded mr-10" onClick={() => setIsModalOpen(true)}>
          Add New Plan
        </button>
      </div>
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-100">
      <h2 className="text-xl font-bold mb-4">
        {editingPlanId ? "Edit Compensation Plan" : "Add New Compensation Plan"}
      </h2>
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

          {/* Allowances Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Allowances</h3>
            {newPlan.allowances.map((allowance, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type (e.g. Transportation, Meal)"
                  value={allowance.type}
                  onChange={(e) => handleAllowanceChange(index, "type", e.target.value)}
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={allowance.amount}
                  onChange={(e) => handleAllowanceChange(index, "amount", e.target.value)}
                  className="border p-2 w-full"
                  required
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeAllowance(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={addAllowance}
            >
              + Add Allowance
            </button>
          </div>

          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
              {editingPlanId ? "Update Plan" : "Create Plan"}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded"
              onClick={clearForm}
            >
              Clear
            </button>
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}


      <h1 className="text-3xl font-bold mb-4">Compensation Planning</h1>
      <div className="overflow-x-auto">
        <table className="table w-full text-left hidden md:table">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Position</th>
              <th className="border px-4 py-2">Hourly Rate</th>
              <th className="border px-4 py-2">OT Rate</th>
              <th className="border px-4 py-2">Holiday Rate</th>
              <th className="border px-4 py-2">Allowances</th>
              {/* <th className="border px-4 py-2">Effective Date</th> */}
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
                              {plan.allowances && plan.allowances.length > 0 ? (
                                <ul>
                                  {plan.allowances.map((allowance, index) => (
                                    <li key={index}>{allowance.type}: ₱{allowance.amount}</li>
                                  ))}
                                </ul>
                              ) : 'N/A'}
                            </td>
                              {/* <td className="border px-4 py-2">{plan.effectiveDate ? formatDate(plan.effectiveDate) : 'N/A'}</td> */}
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
        <StandardCompensation/>
      </div>

    
    </div>
  );
}

export default CompensationPlanning
