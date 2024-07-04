import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { doCreateUserWithEmailAndPassword } from '../../auth';
import { createUserProfile } from '../../firestore';

const RegisterModal = ({ handleSwitchToLogin }) => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        if (!isRegistering) {
            setIsRegistering(true);
            try {
                const userCredential = await doCreateUserWithEmailAndPassword(email, password);
                const { uid } = userCredential.user;
                await createUserProfile(uid, { email });
                // Clear input fields after successful registration
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setErrorMessage('');
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('Email already in use');
                } else {
                    setErrorMessage(error.message);
                }
            } finally {
                setIsRegistering(false);
            }
        }
    };

    if (userLoggedIn) {
        return <Navigate to={'/'} replace={true} />;
    }

    return (
        <>
            <main>
                <form onSubmit={onSubmit}>
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
                            disabled={isRegistering}
                            type="password"
                            autoComplete='new-password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Confirm Password</label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete='off'
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <span>{errorMessage}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isRegistering}
                    >
                        {isRegistering ? 'Signing Up...' : 'Sign Up'}
                    </button>

                </form>
                <div>
                    Already have an account? {'   '}
                    <button onClick={handleSwitchToLogin}>Sign In</button>
                </div>
            </main>
        </>
    );
};

export default RegisterModal;
