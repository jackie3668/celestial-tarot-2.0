import React, { useState, useEffect } from 'react';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import { useAuth } from '../../authContext';
import LoginModal from '../../components/Authentication/LoginModal';
import RegisterModal from '../../components/Authentication/RegisterModal';

const Reading = () => {
    const { userLoggedIn } = useAuth();
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
            {userLoggedIn && <p>Logged in content here...</p>}
            {!userLoggedIn && showLogin && <LoginModal handleSwitchToRegister={handleSwitchToRegister} />}
            {!userLoggedIn && showRegister && <RegisterModal handleSwitchToLogin={handleSwitchToLogin} />}
        </div>
    );
};

export default Reading;
