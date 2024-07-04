import React from 'react';

const QuestionInput = ({ setQuestion }) => {
  const handleQuestionSubmit = (e) => {
    e.preventDefault(); 
    setQuestion(e.target.elements.questionInput.value.trim());
  };

  return (
    <form onSubmit={handleQuestionSubmit}>
      <div>
        <label htmlFor="question">Enter your question:</label>
        <input
          type="text"
          id="questionInput"
          name="questionInput"
          placeholder='Enter your question here'
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default QuestionInput;
