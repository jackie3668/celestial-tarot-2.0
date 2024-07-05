import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle, doSendEmailVerification } from '../../auth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const RegisterModal = ({ handleSwitchToLogin }) => {
    const { currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [ipAddress, setIpAddress] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };

        fetchIpAddress();
    }, []);

    useEffect(() => {
        if (currentUser && !currentUser.emailVerified) {
            const auth = getAuth();
            const emailVerificationInterval = setInterval(() => {
                onAuthStateChanged(auth, (user) => {
                    if (user && user.emailVerified) {
                        clearInterval(emailVerificationInterval);
                        setIsEmailVerified(true);
                    }
                });
            }, 1000);
            return () => clearInterval(emailVerificationInterval);
        }
    }, [currentUser]);

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
                const { uid, email: userEmail } = userCredential.user;

                // Send email verification request
                await doSendEmailVerification(userCredential.user);

                // Store user data in Firestore
                await addDoc(collection(db, "users"), {
                    uid: uid,
                    email: userEmail,
                    ipAddress: ipAddress,
                    createdAt: serverTimestamp()
                });

                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setErrorMessage('');

                // Initially set to not verified
                setIsEmailVerified(false);

            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('Email already in use');
                } else {
                    setErrorMessage(error.message);
                }
            } finally {
                setIsRegistering(false); // Set registering to false after try-catch block
            }
        }
    };

    const handleSignInWithGoogle = async () => {
        try {
            setIsRegistering(true);
            await doSignInWithGoogle(); // Call Google sign-in function
            setIsRegistering(false);
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
    };

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

                    {/* Verification message */}
                    {currentUser && !isEmailVerified ? (
                        <p>Check your email for the verification link.</p>
                    ) : (
                        <p>Your email is verified. You can close this window now.</p>
                    )}

                </form>
                <div>
                    <p>Or sign up with</p>
                    <button onClick={handleSignInWithGoogle} disabled={isRegistering}>
                        {isRegistering ? 'Signing In with Google...' : 'Sign Up with Google'}
                    </button>
                </div>
                <div>
                    Already have an account? {'   '}
                    <button onClick={handleSwitchToLogin}>Sign In</button>
                </div>
            </main>
        </>
    );
};

export default RegisterModal;
