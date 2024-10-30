import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIncentiveStore } from '../../../store/incentiveStore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IncentivesManagements = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [incentivesName, setincentivesName] = useState("");
    const [incentivesDescription, setincentivesDescription] = useState("");
    const [incentivesType, setincentivesType] = useState("");
    const [editingIncentiveId, setEditingIncentiveId] = useState(null); 
    const { createIncentive, fetchIncentive, incentive: incentives, deleteIncentive, updateIncentive } = useIncentiveStore();

    const handleCreateIncentives = async (e) => {
        e.preventDefault();
        try {
          const result = await createIncentive({incentivesName,incentivesDescription,incentivesType});
      
          if(result.status === false){
            toast.error(result.message);
            return;
          }
      
          toast.success("Benefits created successfully!");
          console.log("Benefits created successfully!", true);
          await fetchIncentive();
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

    const handleDeleteIncentive = async (id) => {
        console.log("Attempting to delete incentive with ID:", id);
        const isConfirmed = window.confirm("Are you sure you want to delete this compensation plan?");
        if(isConfirmed){
        const result = await deleteIncentive(id);
        if (!result) {
            toast.error("Failed to delete incentive");
            console.error("Failed to delete incentive:", result);
        } else {
            toast.success("Incentive deleted successfully!");
            console.log("Incentive deleted successfully!", result);
        }
    }else{
        toast.info("Delete action was canceled!");
    }
    };

    const handleEditIncentive = (incentive) => {
        setincentivesName(incentive.incentivesName);
        setincentivesDescription(incentive.incentivesDescription);
        setincentivesType(incentive.incentivesType);
        setEditingIncentiveId(incentive._id); 
        setIsCreating(true); 
    };

    const handleUpdateIncentive = async (e) => {
        e.preventDefault();
        try {
            if (!incentivesName || !incentivesDescription || !incentivesType) {
                toast.error("All fields required!");
                return;
            } 
            const result = await updateIncentive(editingIncentiveId, { incentivesName, incentivesDescription, incentivesType });
            if (!result) {
                toast.error("Failed to update incentive!");
                return;
            }
            toast.success("Incentive updated successfully!");
            console.log("Incentive updated successfully!", result);
            await fetchIncentive();
            resetForm();
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

    const resetForm = () => {
        setincentivesName("");
        setincentivesDescription("");
        setincentivesType("");
        setEditingIncentiveId(null)
    };

    const toggleCreateForm = () => {
        resetForm(); 
        setIsCreating((prev) => !prev); 
    };

    useEffect(() => {
        fetchIncentive();
    }, [fetchIncentive]);

    useEffect(() => {
        document.title = 'Incentives Management';
    }, []); 

    return (
        <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <ToastContainer/>
            <h1 className="text-3xl font-bold mb-6 text-center">Incentives Management</h1>

            {/* Incentives Overview */}
            <div className="overflow-x-auto">
                <div className="flex items-center mb-4">
                    <button className='btn btn-primary mr-2' onClick={toggleCreateForm}>
                        {isCreating ? "Cancel" : "Create Incentive"}
                    </button>

                    {isCreating && (
                        <form onSubmit={editingIncentiveId ? handleUpdateIncentive : handleCreateIncentives} className="flex items-center">
                            <input
                                type="text"
                                id="incentivesName"
                                placeholder="Enter Incentive name"
                                value={incentivesName}
                                onChange={(e) => setincentivesName(e.target.value)}
                                className="mr-2"
                            />
                            <input
                                type="text"
                                id="incentivesDescription"
                                placeholder="Enter Description"
                                value={incentivesDescription}
                                onChange={(e) => setincentivesDescription(e.target.value)}
                                className="mr-2"
                            />
                            <input
                                type="text"
                                id="incentivesType"
                                placeholder="Enter Type"
                                value={incentivesType}
                                onChange={(e) => setincentivesType(e.target.value)}
                                className="mr-2"
                            />
                            <button type="submit" className='btn btn-success'>
                                {editingIncentiveId ? "Update" : "Create"}
                            </button>
                        </form>
                    )}
                </div>
                 <div className='hidden md:block'>
                <table className="table w-full">
                    <thead>
                        <tr className='bg-primary text-white'>
                            <th className="border px-4 py-2">Incentives Name</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Incentives Type</th>
                            <th colSpan={3} className='justify-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(incentives) && incentives.length > 0 ? (
                            incentives.map((incentive) => (
                                <tr key={`${incentive._id}-${incentive.incentivesName}`} className='hover:bg-neutral hover:text-white'>
                                    <td className="border px-4 py-2">{incentive.incentivesName || 'N/A'}</td>
                                    <td className="border px-4 py-2">{incentive.incentivesDescription || 'N/A'}</td>
                                    <td className="border px-4 py-2">{incentive.incentivesType || 'N/A'}</td>
                                    <td className="border px-4 py-2"><button onClick={() => handleEditIncentive(incentive)} className='btn btn-edit bg-primary text-white'>Edit</button></td>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => handleDeleteIncentive(incentive._id)} className='btn btn-error'>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No incentive found!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden flex flex-col">
                {Array.isArray(incentives) && incentives.length > 0 ? (
                incentives.map((incentive) => (
                    <div key={`${incentive._id}-${incentive.incentivesName}`} className="border mb-4 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg">{incentive.incentivesName || 'N/A'}</h3>
                    <p><strong>Description:</strong> {incentive.incentivesDescription || 'N/A'}</p>
                    <p><strong>Incentives Type:</strong> {incentive.incentivesType || 'N/A'}</p>
                    <div className="mt-2">
                        <button onClick={() => handleEditIncentive(incentive)} className="btn btn-edit bg-primary text-white px-2 py-1 rounded mr-2">
                        Edit
                        </button>
                        <button onClick={() => handleDeleteIncentive(incentive._id)} className="btn btn-error text-white px-2 py-1 rounded">
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
            {/* Management Buttons Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Incentive Request Card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Incentive Request</h2>
                        <p>
                            Manage incentive requests from employee.
                        </p>
                        <Link to="/incentives-request" className="btn btn-primary">
                            <button>Manage Incentive Request</button>
                        </Link>
                    </div>
                </div>

                {/* Sales Commissions Card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Sales Commissions</h2>
                        <p>
                            Manage and review sales commission structures for employee
                        </p>
                        <Link to="/sales-commissions" className="btn btn-primary">
                            <button>Manage Sales Commissions</button>
                        </Link>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Performance Metircs</h2>
                        <p>
                            Manage and review performance of employee
                        </p>
                        <Link to="/performance-metrics" className="btn btn-primary">
                            <button>Manage Performance</button>
                        </Link>
                    </div>
                </div>

                      {/* Recognition Programs Card */}
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                        <h2 className="card-title">Recognition Programs</h2>
                        <p>
                            Manage and add recognition programs.
                        </p>
                        <Link to="/recognition-programs" className="btn btn-primary">
                            <button>View Recognition Programs</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncentivesManagements;
