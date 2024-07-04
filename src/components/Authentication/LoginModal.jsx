import React, { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../../auth';
import { useAuth } from '../../authContext';

const LoginModal = ({ handleSwitchToRegister }) => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
                setEmail('');
                setPassword('');
                setErrorMessage('');
                setIsSigningIn(false);
            } catch (error) {
                if (error.code === 'auth/invalid-credential') {
                    setErrorMessage('The email or password entered is incorrect.');
                } else {
                    setErrorMessage(error.message);
                }
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        autoComplete='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        autoComplete='current-password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {errorMessage && (
                    <span>{errorMessage}</span>
                )}

                <button type='submit' disabled={isSigningIn}>
                    {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            <p>Don't have an account? <button onClick={handleSwitchToRegister}>Register</button></p>
        </div>
    );
};

export default LoginModal;
