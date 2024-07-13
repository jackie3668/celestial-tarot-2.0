import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from "./authContext";
import AnimatedCursor from "react-animated-cursor";
import Reading from './pages/Reading/Reading';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import LoginModal from './components/Authentication/LoginModal';
import RegisterModal from './components/Authentication/RegisterModal';
import Journal from './pages/Journal/Journal';

function App() {
  const { userLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); 

  const handleSwitchToRegister = () => {
    setShowRegister(true); 
    setShowLogin(false);
};

const handleSwitchToLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
};

const handleCloseAuth = () => {
  setShowLogin(false)
  setShowRegister(false)
}
  return (
    <AuthProvider>
      <Router basename='celestial-tarot-2.0'>
        <AnimatedCursor
          innerSize={8}
          outerSize={12}
          color='255,255,255'
          outerAlpha={0.4}
          innerScale={0.5}
          outerScale={2.5}
          clickables={[
            'a',
            'li',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="number"]',
            'input[type="submit"]',
            'input[type="image"]',
            'label[for]',
            'select',
            'textarea',
            'button',
            '.link',
            {
              target: '.about-section',
              options: {
                innerSize: 100,
                outerSize: 300,
                color: '255,255,255',
                outerAlpha: 0.7,
                innerScale: 0.5,
                outerScale: 3.5
              }
            }
          ]}
        />
        {!userLoggedIn && showLogin && <LoginModal handleSwitchToRegister={handleSwitchToRegister} handleCloseAuth={handleCloseAuth} />}
        {!userLoggedIn && showRegister && <RegisterModal handleSwitchToLogin={handleSwitchToLogin} handleCloseAuth={handleCloseAuth} />}
        <Navbar setShowLogin={setShowLogin} handleSwitchToRegister={handleSwitchToRegister} handleSwitchToLogin={handleSwitchToLogin}/>
        <Routes>
          <Route path='*' element={<Home/>} />
          <Route path='/' element={<Home />} />
          <Route path='/journal' element={<Journal/>} />
          <Route path='/reading' element={<Reading handleSwitchToRegister={handleSwitchToRegister} handleSwitchToLogin={handleSwitchToLogin}/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
