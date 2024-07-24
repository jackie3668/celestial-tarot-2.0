import React, { useState, useEffect } from 'react';
import './QuestionInput.css';

const QuestionInput = ({ question, setQuestion }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What should I focus on today?",
    "What challenges should I prepare for?",
    "What can I do to improve my relationships?",
    "What do I need to know about my career?",
    "What is the next step in my personal growth?",
    "What should I be aware of in my spiritual journey?"
  ]);

  const [inputValue, setInputValue] = useState(question); // Initialize inputValue with question prop

  useEffect(() => {
    setInputValue(question); 
  }, [question]);

  const handleFocus = () => {
    if (question) {
      return;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 300);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setQuestion(value.trim());
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion);
    setInputValue(suggestion);
    setIsFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  };

  return (
    <form className='question' onSubmit={handleSubmit}>
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
