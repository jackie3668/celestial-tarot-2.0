import React, { useState, useEffect } from 'react';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import { useAuth } from '../../authContext';
import LoginModal from '../../components/Authentication/LoginModal';
import RegisterModal from '../../components/Authentication/RegisterModal';
import { db } from '../../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import PastReadings from '../../components/PastReadings/PastReadings';

const Reading = () => {
    const { userLoggedIn, currentUser } = useAuth();
    const [question, setQuestion] = useState('');
    const [design, setDesign] = useState('');
    const [spread, setSpread] = useState('');
    const [cards, setCards] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const readingProps = {
        question,
        design,
        spread,
        cards,
        setQuestion,
        setDesign,
        setSpread,
        setCards,
    };

    useEffect(() => {
        setShowLogin(false);
    }, [userLoggedIn]);

    const handleGetResult = () => {
        if (!userLoggedIn) {
            setShowLogin(true);
        } else {
            // Perform actions on "Get result" click
            // For example, show a result or perform other actions
        }
    };

    const handleSaveReading = async () => {
        try {
            // Check if user is logged in
            if (!currentUser) {
                console.error('User not authenticated.');
                return;
            }

            await addDoc(collection(db, "readings"), {
                uid: currentUser.uid,
                question,
                design,
                spread,
                cards,
                createdAt: serverTimestamp()
            });

            setQuestion('');
            setDesign('');
            setSpread('');
            setCards([]);
        } catch (error) {
            console.error('Error saving reading to Firestore: ', error);
        }
    };

    const handleSwitchToRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleSwitchToLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    return (
        <div>
            <h1>Reading</h1>
            <QuestionInput {...readingProps} />
            {question && <p>{question}</p>}
            <button onClick={handleGetResult}>Get result</button>
            {userLoggedIn && <p className='result'>Logged in content here...</p>}
            {!userLoggedIn && showLogin && <LoginModal handleSwitchToRegister={handleSwitchToRegister} />}
            {!userLoggedIn && showRegister && <RegisterModal handleSwitchToLogin={handleSwitchToLogin} />}
            <button onClick={handleSaveReading}>Save Reading</button>
            <PastReadings />
        </div>
    );
};

export default Reading;
