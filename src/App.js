import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./authContext";
import AnimatedCursor from "react-animated-cursor";
import Reading from './pages/Reading/Reading';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
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
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/reading' element={<Reading/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
