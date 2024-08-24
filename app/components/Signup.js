'use client';
import React, { useState } from 'react';

const Signup = ({ onSignupSuccess, onClose }) => {
  const [step, setStep] = useState(1);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      setError('First Name and Last Name are required.');
    } else if (step === 2 && (!formData.username || !formData.password || !formData.confirmPassword)) {
      setError('Username, Password, and Confirm Password are required.');
    } else if (step === 3 && !formData.email) {
      setError('Email is required.');
    } else if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSignup();
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSignup = async () => {
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
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              type="text"
              name="firstName"
              className="w-full p-2 mb-4 border rounded"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="middleName"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <input
              type="text"
              name="username"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <input
              type="email"
              name="email"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  const progressBarWidth = `${(step / 3) * 100}%`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative shadow-lg">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: progressBarWidth }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {step === 3 ? 'Sign Up' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
