import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBenefitStore } from '../../../store/benefitStore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BenefitsAdministration = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [benefitsName, setBenefitsName] = useState("");
  const [benefitsDescription, setBenefitsDescription] = useState("");
  const [benefitsType, setBenefitsType] = useState("");
  const [requiresRequest, setRequiresRequest] = useState(false);
  const [editingBenefitId, setEditingBenefitId] = useState(null);
  const { createBenefit, fetchBenefit, benefit: benefits, deleteBenefit, updateBenefit } = useBenefitStore();

  useEffect(() => {
    document.title = 'Benefits Administration';
    fetchBenefit();
  }, [fetchBenefit]);

const handleCreateBenefits = async (e) => {
  e.preventDefault();
  try {
    const result = await createBenefit({benefitsName,benefitsDescription,benefitsType,requiresRequest});

    if(result.status === false){
      toast.error(result.message);
      return;
    }

    toast.success("Benefits created successfully!");
    console.log("Benefits created successfully!", true);
    await fetchBenefit();
    resetForm();
  } catch (error) {
    console.log(error);
    if(error.response && error.response.data){
      toast.error(error.response.data.message || "An error occurred");
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};

  const handleDeleteBenefit = async (id) => {
    console.log("Attempting to delete benefit with ID:", id);
    const isConfirmed = window.confirm("Are you sure you want to delete this benefits?");
    if(isConfirmed){
    const result = await deleteBenefit(id);
    if(!result){
      toast.error("Failed to delete benefit");
      console.error("Failed to delete benefit:", result);
    }else{
      toast.success("Benefit  delete successfully!")
      console.log("Benefit deleted successfully!", result);
    }
  }else{
    toast.info("Delete action was canceled!");
  }
  };

  const handleEditBenefit = (benefit) => {
    setBenefitsName(benefit.benefitsName);
    setBenefitsDescription(benefit.benefitsDescription);
    setBenefitsType(benefit.benefitsType);
    setRequiresRequest(benefit.requiresRequest);
    setEditingBenefitId(benefit._id);
    setIsCreating(true);
  };

  const handleUpdateBenefit = async (e) => {
    e.preventDefault();
    try {
      if(!benefitsName || !benefitsDescription || !benefitsType){
        toast.error("All fields required!");
        return;
      }
      const result = await updateBenefit(editingBenefitId, { benefitsName, benefitsDescription, benefitsType, requiresRequest });
      if(!result){
        toast.error("Failed to update benefit!");
        return;
      }
      toast.success("Benefit updated successfully!");
      console.log("Benefit updated successfully!", result);
      await fetchBenefit();
      resetForm();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const resetForm = () => {
    setBenefitsName("");
    setBenefitsDescription("");
    setBenefitsType("");
    setRequiresRequest(false);
    setEditingBenefitId(null);
  };

  const toggleCreateForm = () => {
    resetForm();
    setIsCreating((prev) => !prev);
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4 text-center">Benefits Administration</h1>

      {/* Benefits Overview Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Benefits Overview</h2>
        <div className="flex items-center mb-4">
          <button className='btn btn-primary mr-2' onClick={toggleCreateForm}>
            {isCreating ? "Cancel" : "Create Benefits"}
          </button>

          {isCreating && (
            <form onSubmit={editingBenefitId ? handleUpdateBenefit : handleCreateBenefits} className="flex items-center">
              <input
                type="text"
                id="benefitsName"
                placeholder="Enter Benefit name"
                value={benefitsName}
                onChange={(e) => setBenefitsName(e.target.value)}
                className="mr-2"
              />
              <input
                type="text"
                id="benefitsDescription"
                placeholder="Enter Description"
                value={benefitsDescription}
                onChange={(e) => setBenefitsDescription(e.target.value)}
                className="mr-2"
              />
              <select
                id="benefitsType"
                value={benefitsType}
                onChange={(e) => setBenefitsType(e.target.value)}
                className="mr-2"
              >
                <option value="">Select Type</option>
                <option value="Compensation">Compensation</option>
                <option value="Health">Health</option>
                <option value="Retirement">Retirement</option>
                <option value="Financial">Financial</option>
                <option value="Worklife Balance">Worklife Balance</option>
              </select>
              <label className="mr-2">Requires Request?</label>
              <input 
                type="checkbox" 
                checked={requiresRequest} 
                onChange={(e) => setRequiresRequest(e.target.checked)} 
                className='mr-2'
              />

              <button type="submit" className='btn btn-success'>
                {editingBenefitId ? "Update" : "Create"}
              </button>
            </form>
          )}
        </div>
        <div className="hidden md:block">
        <table className="table w-full mb-4">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Benefits Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Benefits Type</th>
              <th className="border px-4 py-2">Require Request</th>
              <th colSpan={2} className='justify-center border px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(benefits) && benefits.length > 0 ? (
              benefits.map((benefit) => (
                <tr key={`${benefit._id}-${benefit.benefitsName}`} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{benefit.benefitsName || 'N/A'}</td>
                  <td className="border px-4 py-2">{benefit.benefitsDescription || 'N/A'}</td>
                  <td className="border px-4 py-2">{benefit.benefitsType || 'N/A'}</td>
                  <td className="border px-4 py-2">{benefit.requiresRequest ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEditBenefit(benefit)} className='btn btn-edit bg-primary text-white'>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteBenefit(benefit._id)} className='btn btn-error'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No benefits found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col">
          {Array.isArray(benefits) && benefits.length > 0 ? (
          benefits.map((benefit) => (
              <div key={`${benefit._id}-${benefit.benefitsName}`} className="border mb-4 p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg">{benefit.benefitsName || 'N/A'}</h3>
              <p><strong>Description:</strong> {benefit.benefitsDescription || 'N/A'}</p>
              <p><strong>benefits Type:</strong> {benefit.benefitsType || 'N/A'}</p>
              <p><strong>benefits Type:</strong> {benefit.requiresRequest ? 'Yes' : 'No'}</p>
              <div className="mt-2">
                  <button onClick={() => handleEditBenefit(benefit)} className="btn btn-edit bg-primary text-white px-2 py-1 rounded mr-2">
                  Edit
                  </button>
                  <button onClick={() => handleDeleteBenefit(benefit._id)} className="btn btn-error text-white px-2 py-1 rounded">
                  Delete
                  </button>
              </div>
              </div>
          ))
          ) : (
          <div className="text-center">No incentive found!</div>
          )}
      </div>
    </div>
      {/* Other sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Benefit Enrollment requests</h2>
            <p>Manage benefits enrollment requests here.</p>
            <Link to="/benefits-requested" className="btn btn-primary">
              <button>View Enrollment Requests</button>
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Deductions</h2>
            <p>Review and manage employee deductions.</p>
            <Link to="/deductions-management" className="btn btn-primary">
              <button>View Deductions</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsAdministration;
