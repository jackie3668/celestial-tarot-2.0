import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./authContext";
import Reading from './pages/Reading/Reading';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Reading/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
