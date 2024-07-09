import React, { useState } from 'react';
import './Design.css';
import design_1 from '../../assets/designs/design-1/0.png';
import design_2 from '../../assets/designs/design-2/0.jpg';

const Design = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1); // Start with no card selected

  const designs = [
    { id: 1, image: design_1 },
    { id: 2, image: design_2 },
  ];

  const handleCardClick = (index) => {
    setSelectedCardIndex(index === selectedCardIndex ? -1 : index); 
  };

  return (
    <div className='design'>
      <div className='card-container'>
        {designs.map((design, index) => (
          <div
            key={design.id}
            className={`card ${index === selectedCardIndex ? 'selected floating' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <img src={design.image} alt={`Design ${design.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Design;
