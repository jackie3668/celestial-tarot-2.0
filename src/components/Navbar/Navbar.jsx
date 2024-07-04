import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../Authentication/LoginModal';
import RegisterModal from '../Authentication/RegisterModal';
import { useAuth } from '../../authContext';
import { doSignOut } from '../../auth';

const Navbar = () => {
    const { userLoggedIn } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();

    const handleSwitchToRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleSwitchToLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleLogout = () => {
        doSignOut().then(() => {
            navigate('/');
        });
    };

    return (
        <nav>
            <ul>
                {userLoggedIn ? (
                    <>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <button onClick={handleSwitchToLogin}>Login</button>
                        </li>
                        <li>
                            <button onClick={handleSwitchToRegister}>Sign Up</button>
                        </li>
                    </>
                )}
            </ul>

            {!userLoggedIn && showLogin && <LoginModal handleSwitchToRegister={handleSwitchToRegister} />}
            {showRegister && <RegisterModal handleSwitchToLogin={handleSwitchToLogin} />}
        </nav>
    );
};

export default Navbar;
