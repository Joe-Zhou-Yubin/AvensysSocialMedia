import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';
function Admin() {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    // Fetch data from the backend and update the users state
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        const fetchedUsers = response.data;
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    // Reset the search query when switching to a different filter
    if (selectedFilter !== 'role') {
      setSearchQuery('');
    }
  };

  const handleRoleFilterChange = (event) => {
    const selectedRole = event.target.value;
    setFilter('role');
    setSearchQuery(selectedRole);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') {
      return (
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.admin !== undefined && (user.admin ? 'Admin' : 'User').toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else if (filter === 'username') {
      return user.username.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filter === 'email') {
      return user.email.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filter === 'role') {
      return (
        user.admin !== undefined &&
        (user.admin ? 'Admin' : 'User').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });
  

  const handleEdit = (user) => {
    setEditedUser(user);
    setEditedData({ ...user }); // Store a copy of the user data for temporary editing
  };

  const handleSave = async () => {
    try {
      // In a real application, you would send the updated user data to the server.
      // For demonstration purposes, we will update the local state here.
      await axios.post('/updateuser', editedData); // Use editedData instead of editedUser
      setEditedUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setEditedUser(null);
    setEditedData(null); // Discard temporary changes
  };

  const handleInputChange = (event, field) => {
    const { value } = event.target;
  
    // Update the 'admin' field based on the selected value
    const isAdmin = value === 'admin';
    setEditedData((prevData) => ({
      ...prevData,
      [field]: field === 'admin' ? isAdmin : value,
    }));
  };
  
  
  
  const handleDelete = async (user) => {
    // Display a confirm dialog before deleting the user
    const confirmDelete = window.confirm(`Are you sure you want to delete the user "${user.username}"?`);
    if (confirmDelete) {
      try {
        // In a real application, you would send a delete request to the server.
        // For demonstration purposes, we will simply remove the user from the state here.
  
        // Include the 'userId' in the DELETE request
        await axios.delete(`/deleteuser/${user.id}`);
  
        // Reload the page to see the changes
        window.location.reload();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  

  return (
    <div className='container'>
      <h1 style={{ marginTop: '20px' }}>Admin User console</h1>
      <div className="form-group">
      <label htmlFor="filter">Filter by:</label>
      <select
        className="form-control"
        id="filter"
        value={filter}
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        <option value="username">Username</option>
        <option value="email">Email</option>
        <option value="role">Role</option>
      </select>
    </div>
    {filter === 'role' && (
      <div className="form-group">
        <label htmlFor="roleFilter">Role:</label>
        <select
          className="form-control"
          id="roleFilter"
          value={searchQuery}
          onChange={handleRoleFilterChange}
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
    )}
    <div className="form-group">
      <label htmlFor="search">Search:</label>
      <input
        type="text"
        className="form-control"
        id="search"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editedUser === user ? (
                  <input
                    type="text"
                    value={editedData.username}
                    onChange={(event) => handleInputChange(event, 'username')}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editedUser === user ? (
                  <input
                    type="text"
                    value={editedData.email}
                    onChange={(event) => handleInputChange(event, 'email')}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
  {editedUser === user ? (
    <select
      value={editedData.admin ? 'admin' : 'user'} // Update the value attribute here
      onChange={(event) => handleInputChange(event, 'admin')}
    >
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
  ) : (
    user.admin ? 'Admin' : 'User'
  )}
</td>

              <td>
                {editedUser === user ? (
                  <>
                    <button className="btn btn-success" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                )}
              </td>
              <td>
                {/* Conditionally render the Delete button */}
                {!user.loggedIn && ( // If the user is not logged in, show the Delete button
                  <button className="btn btn-danger" onClick={() => handleDelete(user)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
