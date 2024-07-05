import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { doCreateUserWithEmailAndPassword } from '../../auth';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RegisterModal = ({ handleSwitchToLogin }) => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [ipAddress, setIpAddress] = useState(null);

    useEffect(() => {
      const fetchIpAddress = async () => {
          try {
              const response = await axios.get('https://api.ipify.org?format=json');
              setIpAddress(response.data.ip);
          } catch (error) {
              console.error('Error fetching IP address:', error);
          }
        } 

          fetchIpAddress();
      }, []);

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
