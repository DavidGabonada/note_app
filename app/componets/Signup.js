'use client';
import React, { useState } from 'react';

const Signup = ({ onSignupSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost/hugot/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Signup successful! You can now log in.');
        setError('');
        onSignupSuccess();
      } else {
        setError(data.message);
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      zIndex: '50',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
          }}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#333',
          textAlign: 'center',
          letterSpacing: '1px'
        }}>Create Your Account</h1>
        {error && <p style={{ color: '#EF4444', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: '#10B981', marginBottom: '15px', textAlign: 'center' }}>{success}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <input
            type="text"
            name="firstName"
            style={inputStyle}
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="middleName"
            style={inputStyle}
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          name="lastName"
          style={inputStyle}
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          style={inputStyle}
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          style={inputStyle}
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <input
            type="tel"
            name="phone"
            style={inputStyle}
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            style={inputStyle}
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <input
            type="password"
            name="password"
            style={inputStyle}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            style={inputStyle}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSignup}
          style={{
            width: '100%',
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
            fontSize: '16px',
            fontWeight: '600',
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderColor: '#D1D5DB',
  borderRadius: '5px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

export default Signup;
