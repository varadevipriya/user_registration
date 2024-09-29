import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: ''
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/users', formData);

      if (response.status === 201) {
        setMessage('User registered successfully!');
        setFormData({ name: '', street: '', city: '', state: '', country: '' }); 
        fetchUsers();
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setMessage('Error registering user.');
    }
  };

 
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  
  const handleDeleteAddress = async (userId, addressId) => {
    try {
      const response = await axios.delete(`http://localhost:3002/users/${userId}/addresses/${addressId}`);
      if (response.status === 200) {
        setMessage('Address deleted successfully!');
        fetchUsers(); 
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      setMessage('Error deleting address.');
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>User Registration</h1>
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>

        <div id="message" className="message">
          {message}
        </div>

        <h2>Registered Users</h2>
        <div className="users-container">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.name}</h3>
              <div className="addresses">
                {user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div key={addr._id} className="address-card">
                      <p><strong>Street:</strong> {addr.street}</p>
                      <p><strong>City:</strong> {addr.city}</p>
                      <p><strong>State:</strong> {addr.state}</p>
                      <p><strong>Country:</strong> {addr.country}</p>
                      <button className="delete-button" onClick={() => handleDeleteAddress(user._id, addr._id)}>
                        Delete Address
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No address</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
