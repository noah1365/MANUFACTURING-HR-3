import React, { useState } from 'react';

const users = [
  {
    id: 1,
    position: 'Reseller',
    lastName: 'Doe',
    firstName: 'John',
    middleName: 'A.',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: {
      street: '123 Main St',
      municipality: 'Cityville',
      province: 'Metro Province',
      postalCode: '12345',
      country: 'Philippines',
    },
    gender: 'Male',
    bDate: '1990-01-01',
    role: 'Employee',
  },
  {
    id: 2,
    position: 'Secretary',
    lastName: 'Smith',
    firstName: 'Jane',
    middleName: 'B.',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    address: {
      street: '456 Oak Rd',
      municipality: 'Townsville',
      province: 'Rural Province',
      postalCode: '67890',
      country: 'Philippines',
    },
    gender: 'Female',
    bDate: '1985-05-12',
    role: 'Admin',
  },
];

const NewUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="container mx-auto p-4">
      {/* User Table */}
      <table className="table w-full mb-4">
        <thead>
          <tr className="bg-primary text-white">
            <th>LastName</th>
            <th>FirstName</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="hover:bg-neutral hover:text-white"
            >
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.position}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Details */}
      {selectedUser && (
        <div className="card w-full bg-base-200 shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-4">User Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-2"><strong>Position:</strong> {selectedUser.position}</div>
            <div className="mb-2"><strong>LastName:</strong> {selectedUser.lastName}</div>
            <div className="mb-2"><strong>FirstName:</strong> {selectedUser.firstName}</div>
            <div className="mb-2"><strong>MiddleName:</strong> {selectedUser.middleName}</div>
            <div className="mb-2"><strong>Email:</strong> {selectedUser.email}</div>
            <div className="mb-2"><strong>PhoneNumber:</strong> {selectedUser.phoneNumber}</div>
            <div className="mb-2"><strong>Address:</strong> {selectedUser.address.street}, {selectedUser.address.municipality}, {selectedUser.address.province}, {selectedUser.address.postalCode}, {selectedUser.address.country}</div>
            <div className="mb-2"><strong>Gender:</strong> {selectedUser.gender}</div>
            <div className="mb-2"><strong>Birthdate:</strong> {selectedUser.bDate}</div>
            <div><strong>Role:</strong> {selectedUser.role}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewUsers;
