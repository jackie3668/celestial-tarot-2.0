import React, { useState } from 'react'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { app } from '../../firebase'
import './Feedback.css'
import arrow from '../../assets/ui/right-arrow.png'

const db = getFirestore(app);

const Feedback = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [ipAddress, setIpAddress] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    experience: '',
    improvement: '',
    enjoyed: '',
  });

  const navigate = useNavigate()

  const questions = [
    'How would you rate your overall experience using the distance visibility tool?',
    'What aspects of the distance visibility tool do you think could be improved?',
    'What did you enjoy most about using the distance visibility tool?'
  ];

  const getClassName = () => {
    switch (questionIndex) {
      case 0:
        return 'one';
      case 1:
        return 'two';
      case 2:
        return 'three';
      default:
        return '';
    }
  };

  const handleScaleClick = (e) => {
    if (e.target.parentNode.querySelector('.active')) {
      e.target.parentNode.querySelector('.active').classList.remove('active');
    }
    e.target.classList.add('active');

    setFeedbackData(prev => ({
      ...prev,
      experience: e.target.innerHTML
    }));
  };

  const handleButtonClick = async () => {
    if (questionIndex < 2) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const ipAddress = await fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip);
  
      const messageData = {
        experience: feedbackData.experience,
        improvement: feedbackData.improvement,
        enjoyed: feedbackData.enjoyed,
        timestamp: serverTimestamp(),
        ipAddress: ipAddress
      };
  
      await addDoc(collection(db, "feedback"), messageData);
  
      setQuestionIndex(questionIndex + 1);
    }
  };
  
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && questionIndex != 0) {
      handleButtonClick();
      if (questionIndex === 1) {
        setFeedbackData(prev => ({
          ...prev,
          improvement: ''
        }));
      } else if (questionIndex === 2) {
        setFeedbackData(prev => ({
          ...prev,
          enjoyed: ''
        }));
      }
    }
  };
  

  const handleChange = (e) => {
    if (questionIndex === 1) {
      setFeedbackData(prev => ({
        ...prev,
        improvement: e.target.value
      }));
    } else if (questionIndex === 2) {
      setFeedbackData(prev => ({
        ...prev,
        enjoyed: e.target.value
      }));
    }
  };
  
  
  return (
    <div className={`feedback-container ${getClassName()}`}>
      {questionIndex !== 3 ? (
      <div className="question-container">
        <div className="question">
          {questions[questionIndex]}
          <div className="number">
            {questionIndex + 1}
            <img src={arrow} alt="" />
          </div>
        </div>
        <div className="answer">
          {questionIndex === 0 ? (
          <ul className="scale">
            <li className="scale-num" onClick={handleScaleClick}>0</li>
            <li className="scale-num" onClick={handleScaleClick}>1</li>
            <li className="scale-num" onClick={handleScaleClick}>2</li>
            <li className="scale-num" onClick={handleScaleClick}>3</li>
            <li className="scale-num" onClick={handleScaleClick}>4</li>
            <li className="scale-num" onClick={handleScaleClick}>5</li>
            <li className="scale-num" onClick={handleScaleClick}>6</li>
            <li className="scale-num" onClick={handleScaleClick}>7</li>
            <li className="scale-num" onClick={handleScaleClick}>8</li>
            <li className="scale-num" onClick={handleScaleClick}>9</li>
            <li className="scale-num" onClick={handleScaleClick}>10</li>
          </ul>
          ) : (
            <input type="text" onKeyDown={handleKeyDown} onChange={handleChange} value={questionIndex === 1 ? feedbackData.improvement : feedbackData.enjoyed} placeholder='Type your answer here...' />
          )}
        </div>
        <button onClick={handleButtonClick}>{questionIndex === 2? 'Submit' : 'Next'}</button>
      </div>
      ) : (
        <div className="finished">
          <h2>
          Thank you for your feedback!
          </h2>
          <button onClick={() => navigate('/')}>Back to home</button>
        </div>
      )}

    </div>
  )
}

export default Feedback