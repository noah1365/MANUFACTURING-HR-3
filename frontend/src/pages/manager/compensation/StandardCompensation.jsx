import { useEffect, useState } from "react";
import { useCompensationStore } from "../../../store/compensationStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StandardCompensation = () => {
  const { fetchAllStandardCompensations, createStandardCompensation, updateStandardCompensation, standardCompensations = [] ,deleteStandardCompensation} = useCompensationStore();
  const [formData, setFormData] = useState({ standardName: "", standardDescription: "", standardStatus: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    document.title = 'Compensation Planning';
    fetchAllStandardCompensations();
  }, [fetchAllStandardCompensations]);

  const handleCreateOrUpdateCompensation = async () => {
    if (!formData.standardName || !formData.standardDescription) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isEditMode) {
      const response = await updateStandardCompensation(editId, formData);
      
      if (response.success) {
        toast.success(response.message);
        setIsEditMode(false);
        setEditId(null);
      } else {
        toast.error(response.message);
      }
    } else {
      const response = await createStandardCompensation(formData);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }

    setIsModalOpen(false);
    fetchAllStandardCompensations();
  };

  const handleEdit = (standard) => {
    setFormData({
      standardName: standard.standardName,
      standardDescription: standard.standardDescription,
      standardStatus: standard.standardStatus,
    });
    setIsEditMode(true);
    setEditId(standard._id);
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    try {
      const response = await deleteStandardCompensation(id);
  
      if (response && response.success) {
        toast.success(response.message || "Deleted successfully.");
        fetchAllStandardCompensations();
      } else {
        toast.error(response?.message || "Failed to delete compensation.");
      }
    } catch (error) {
      console.error("Error deleting compensation:", error);
      toast.error("An error occurred while deleting.");
    }
  };
  
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Standard Compensation</h1>
      <button onClick={() => { setIsModalOpen(true); setIsEditMode(false); }} className="btn btn-primary text-white px-4 py-2 rounded mb-4">
        Create Standard Compensation
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">{isEditMode ? "Edit" : "Create"} Standard Compensation</h2>

            <input
              type="text"
              placeholder="Standard Name"
              className="border p-2 w-full mb-2"
              value={formData.standardName}
              onChange={(e) => setFormData({ ...formData, standardName: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={formData.standardDescription}
              onChange={(e) => setFormData({ ...formData, standardDescription: e.target.value })}
            />

            <select
              className="border p-2 w-full mb-2"
              value={formData.standardStatus}
              onChange={(e) => setFormData({ ...formData, standardStatus: e.target.value === "true" })}
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>

            <div className="flex justify-between">
              <button onClick={handleCreateOrUpdateCompensation} className="bg-blue-600 text-white px-4 py-2 rounded">
                {isEditMode ? "Update" : "Save"}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full text-left hidden md:table">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border px-4 py-2">Standard Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(standardCompensations) && standardCompensations.length > 0 ? (
              standardCompensations.map((standard) => (
                <tr key={standard._id} className="hover:bg-neutral hover:text-white">
                  <td className="border px-4 py-2">{standard.standardName || 'N/A'}</td>
                  <td className="border px-4 py-2">{standard.standardDescription || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {standard.standardStatus ? 'Available' : 'Not Available'}
                  </td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(standard)} className="bg-primary text-white px-2 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(standard._id)} className="bg-error text-white px-2 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No Standard Compensation found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StandardCompensation;
