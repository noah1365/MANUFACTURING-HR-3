import React, { useState, useEffect } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { useAuthStore } from '../store/authStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCompensationStore } from '../store/compensationStore';
import NewUsers from './public/NewUsers';

const EmployeeList = () => {
  const { registerUser } = useEmployeeStore();
  const {fetchUsers,users} = useAuthStore();
  const {fetchCompensationPositions,compensationPositions} = useCompensationStore();

  
  useEffect(() => {
    document.title = 'Employee List';
    const fetchUserData = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error('Failed to load user data. Please try again.');
      }
    };

    fetchUserData();
    fetchCompensationPositions();
    const intervalId = setInterval(fetchUserData, 5000);
    return () => clearInterval(intervalId);
    
  }, [fetchUsers, fetchCompensationPositions]);


  const [formData, setFormData] = useState({
    position: '',
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      municipality: '',
      province: '',
      postalCode: '',
      country: '',
    },
    gender: '',
    bDate: '',
    role: ''
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRoleDisabled, setIsRoleDisabled] = useState(false);

  useEffect(() => {

    const storedMessage = localStorage.getItem('successMessage');
    if(storedMessage){
      toast.success(storedMessage);
      localStorage.removeItem('successMessage');
    }
  }, []);

  const handleInputChange = (e) => {
    const {name,value} = e.target;
    if(name === 'position'){
      setFormData((prev) =>({
        ...prev,
        position: value,
        role: value === 'Admin' ? 'Admin' : prev.role,
      }));
      setIsRoleDisabled(value.includes('Admin'));
    }else if(name.includes('address')){
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let validationErrors = [];

    if(!formData.lastName) validationErrors.push("Lastname is required!");
    if(!formData.firstName) validationErrors.push("Firstname is required!");
    if(!formData.middleName) validationErrors.push("Middle name is required!");
    if(!formData.email){
      validationErrors.push("Email is required!");
  }else if(!/\S+@\S+\.\S+/.test(formData.email)){
      validationErrors.push("Invalid email address!");
  }else if(formData.email.length > 40){ 
      validationErrors.push("Email address must not exceed 40 characters!");
  }
    if(!formData.phoneNumber){
      validationErrors.push("Phone Number is required!");
    }else if(!/^(09|\+639)\d{9}$/.test(formData.phoneNumber)){
      validationErrors.push("Invalid phone format!");
    }
    if(!formData.address.street) validationErrors.push("Street is required!");
    if(!formData.address.municipality) validationErrors.push("Municipality is required!");
    if(!formData.address.province) validationErrors.push("Province is required!");
    if(!formData.address.postalCode) validationErrors.push("Postal code is required!");
    if(!formData.address.country) validationErrors.push("Country is required!");
    if(!['Male', 'Female'].includes(formData.gender)) {
      validationErrors.push("Invalid gender value!");
    }
    if(!formData.bDate){
      validationErrors.push("Birth date is required!");
    } else if(isNaN(Date.parse(formData.bDate))){
      validationErrors.push("Invalid birthdate format!");
    } else{
      const birthDate = new Date(formData.bDate);
      const today = new Date();
      if(birthDate > today) {
        validationErrors.push("Birth date cannot be a future date!");
    }else{
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
            age--;
        }
        if(age < 18 || age > 60){
            validationErrors.push("Age must be between 18 to 60 years!");
        }
      }
    }
  return validationErrors;
};

const generatePassword = () => {
  const password = `#${formData.lastName.charAt(0).toUpperCase()}${formData.lastName.charAt(1).toLowerCase()}HR3`;
  setGeneratedPassword(password);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(' '));
      return;
    }


    generatePassword();

    const dataToSubmit = { ...formData, password: generatedPassword };
    setLoading(true);


    try {
      const result = await registerUser(dataToSubmit);
      if (result) {
        toast.success(`${formData.position} registered successfully!`);
        setFormData({
          position: '',
          lastName: '',
          firstName: '',
          middleName: '',
          email: '',
          phoneNumber: '',
          address: {
            street: '',
            municipality: '',
            province: '',
            postalCode: '',
            country: '',
          },
          gender: '',
          bDate: '',
          role: ''
        });
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  useEffect(() => {
    let filtered = users;
  
    if (selectedPosition) {
      filtered = filtered.filter(user => user.position === selectedPosition);
    }
  
    if (selectedStatus) {
      const isVerified = selectedStatus === "true";
      filtered = filtered.filter(user => user.verified === isVerified);
    }
  
    setFilteredUsers(filtered);
  }, [selectedPosition, selectedStatus, users]);
  
  const handlePositionFilterChange = (e) => {
    setSelectedPosition(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  
  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
      <ToastContainer />
      <NewUsers/>
      <h2 className='text-3xl mb-5 text-center'>Employee List</h2>

            <div className="flex justify-center gap-6">
            <select
                className="select select-bordered w-1/2"
                value={selectedPosition}
                onChange={handlePositionFilterChange}
              >
            <option value="">Select Position</option>
            {compensationPositions.map((position) => (
              <option key={position._id} value={position.position}>
                {position.position}
              </option>
            ))}
              </select>

              <select
                className="select select-bordered w-1/2"
                value={selectedStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="">Select one</option>
                <option value="true">Verified</option>
                <option value="false">Not</option>
              </select>

            </div>
      <div className="mb-4">
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table w-full mb-4">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="border px-4 py-2">Lastname</th>
                    <th className="border px-4 py-2">Firstname</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Position</th>
                    <th className="border px-4 py-2">Role</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-neutral hover:text-white">
                        <td className="border px-4 py-2">{user.lastName || 'N/A'}</td>
                        <td className="border px-4 py-2">{user.firstName || 'N/A'}</td>
                        <td className="border px-4 py-2">{user.email || 'N/A'}</td>
                        <td className="border px-4 py-2">{user.position || 'N/A'}</td>
                        <td className="border px-4 py-2">{user.role || 'N/A'}</td>
                        <td className="border px-4 py-2">
                        {user.verified ? (
                          <span className="text-green-600 font-semibold">
                            <i className="fas fa-check-circle"></i> Verified
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            <i className="fas fa-times-circle"></i> Not
                          </span>
                        )}
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No employees found!</td>
                    </tr>
                  )}                
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen((prev) => !prev)}
        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        {isModalOpen ?"Cancel" :  "Register new User"}
      </button>

      {isModalOpen && (
        <div>
      <h2 className="text-3xl font-bold mb-6 text-center">Register User</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Positioning Fields */}
        <div className="flex gap-6">
        <div className="form-control w-1/2">
          <label className="label">Position</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select Position</option>
            {compensationPositions.map((position) => (
              <option key={position._id} value={position.position}>
                {position.position}
              </option>
            ))}
          </select>
          </div>

        <div className="form-control w-1/2">
          <label className="label">Role</label>
          <select name="role" className="select select-bordered w-full" required onChange={handleInputChange} disabled={isRoleDisabled} value={formData.role}>
            <option value="">Select Role</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        </div>

        {/* Name Fields */}
        <div className="flex gap-6">
          <div className="form-control w-1/3">
            <label className="label">Last Name</label>
            <input name="lastName" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.lastName}/>
          </div>
          <div className="form-control w-1/3">
            <label className="label">First Name</label>
            <input name="firstName" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.firstName}/>
          </div>
          <div className="form-control w-1/3">
            <label className="label">Middle Name</label>
            <input name="middleName" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.middleName}/>
          </div>
        </div>

        {/* Email and Phone Number */}
        <div className="flex gap-6">
          <div className="form-control w-1/2">
            <label className="label">Email</label>
            <input name="email" type="email" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.email}/>
          </div>
          <div className="form-control w-1/2">
            <label className="label">Phone Number</label>
            <input name="phoneNumber" type="tel" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.phoneNumber}/>
          </div>
        </div>

        {/* Gender */}
        <div className="flex gap-6">
        <div className="form-control w-1/2">
          <label className="label">Gender</label>
          <select name="gender" className="select select-bordered w-full" required onChange={handleInputChange} value={formData.gender}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>


        {/* Birth Date */}
        <div className="form-control w-1/2">
          <label className="label">Birth Date</label>
          <input name="bDate" type="date" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.bDate}/>
        </div>
        </div>

        {/* Address Fields */}
        <div className="flex gap-6">
          <div className="form-control w-1/2">
            <label className="label">Street</label>
            <input name="address.street" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.address.street}/>
          </div>
          <div className="form-control w-1/2">
            <label className="label">Municipality</label>
            <input name="address.municipality" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.address.municipality}/>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="form-control w-1/2">
            <label className="label">Province</label>
            <input name="address.province" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.address.province}/>
          </div>
          <div className="form-control w-1/2">
            <label className="label">Postal Code</label>
            <input name="address.postalCode" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.address.postalCode}/>
          </div>
        </div>

        <div className="form-control">
          <label className="label">Country</label>
          <input name="address.country" type="text" className="input input-bordered w-full" required onChange={handleInputChange} value={formData.address.country}/>
        </div>

        <div className='flex justify-center items-center'>
        <button type="submit" className={`btn btn-primary w-72 ${loading ? 'loading' : ''}`}>Register</button>
        </div>
      </form>
    </div>
  )}
  </div>
    
  );
};

export default EmployeeList;
