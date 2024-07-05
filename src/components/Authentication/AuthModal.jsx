import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword } from '../../auth';

const AuthModal = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSwitchToRegister = () => {
        setIsRegistering(true);
        setIsSigningIn(false); // Ensure signing in mode is disabled
        setErrorMessage('');
    };

    const handleSwitchToLogin = () => {
        setIsRegistering(false);
        setIsSigningIn(false); 
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSigningIn && !isRegistering) {
            setIsSigningIn(true);

            try {
                if (isRegistering) {
                    await doCreateUserWithEmailAndPassword(email, password);
                } else {
                    await doSignInWithEmailAndPassword(email, password);
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsSigningIn(false);
                // setIsRegistering(false); // No need to reset this here
            }
        }
    };

    // Redirect if user is already logged in
    if (userLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <main>
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

                    {isRegistering && (
                        <div>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                autoComplete='new-password'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}

                    {errorMessage && (
                        <span>{errorMessage}</span>
                    )}

                    <button type='submit' disabled={isSigningIn}>
                        {isSigningIn ? 'Signing In...' : isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
                <div>
                    {isRegistering ? (
                        <p>Already have an account? <button onClick={handleSwitchToLogin}>Sign In</button></p>
                    ) : (
                        <p>Don't have an account? <button onClick={handleSwitchToRegister}>Register</button></p>
                    )}
                </div>
            </main>
        </>
    );
};

export default AuthModal;
