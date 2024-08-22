'use client';
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

const MainPage = () => {
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('loading'); // 'loading', 'login', 'signup', or 'home'

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    setTimeout(() => {
      if (storedUserId) {
        setUserId(storedUserId);
        setView('home'); // Automatically navigate to home if user is logged in
      } else {
        setView('login'); // Show login form if not logged in
      }
    }, 1000); // Simulated delay of 1 second
  }, []);

  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('userId', id); // Save userId to localStorage
    setView('home'); // Change view to home after successful login
  };

  const handleSignup = () => {
    setView('signup');
  };

  const handleSignupSuccess = () => {
    setView('login');
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId'); // Remove userId from localStorage
    setView('login'); // Reset view to login after logout
  };

  if (view === 'loading') {
    return null; // Just a blank screen during the simulated delay
  }

  return view === 'home' ? (
    <Home userId={userId} onLogout={handleLogout} />
  ) : view === 'signup' ? (
    <Signup onSignupSuccess={handleSignupSuccess} />
  ) : (
    <Login onLogin={handleLogin} onSignup={handleSignup} />
  );
};

export default MainPage;
