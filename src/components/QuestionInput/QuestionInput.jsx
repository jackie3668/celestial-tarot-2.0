import React, { useState, useEffect } from 'react';
import arrow from '../../assets/ui/right-arrow.png';
import './QuestionInput.css';

const QuestionInput = ({ question, setQuestion }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState(["Suggestion 1", "Suggestion 2", "Suggestion 3"]);
  const [inputValue, setInputValue] = useState(question); // Initialize inputValue with question prop

  useEffect(() => {
    setInputValue(question); // Update inputValue whenever question prop changes
  }, [question]);

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    setQuestion(inputValue.trim());
    setInputValue(''); // Clear input after submitting
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 500); 
  };
  
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion); 
    setInputValue(suggestion); 
    setIsFocused(false); 
  };

  return (
    <form className='question' onSubmit={handleQuestionSubmit}>
      <div className={`input-container glass ${isFocused ? 'focused' : ''}`}>
        <input
          type="text"
          id="questionInput"
          name="questionInput"
          placeholder="What's on your mind?"
          autoComplete="off"
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <div className="vertical-line"></div>
        <button type="submit">
          <img src={arrow} alt="" />
        </button>
      </div>
      <ul className={`dropdown glass ${isFocused ? 'focused' : ''}`}>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default QuestionInput;
