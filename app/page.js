'use client';
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

const MainPage = () => {
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState('loading'); 

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    setTimeout(() => {
      if (storedUserId) {
        setUserId(storedUserId);
        setView('home'); 
      } else {
        setView('login'); 
      }
    }, 1000); 
  }, []);

  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('userId', id);
    setView('home');
  };

  const handleSignup = () => {
    setView('signup');
  };

  const handleSignupSuccess = () => {
    setView('login');
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
    setView('login');
  };

  if (view === 'loading') {
    return null;
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
