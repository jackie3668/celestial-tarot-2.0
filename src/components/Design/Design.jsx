import React, { useState } from 'react';
import './Design.css';
import design_1 from '../../assets/designs/design0/0.png';
import design_2 from '../../assets/designs/design1/0.jpg';

const Design = ({ design, setDesign}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);

  const designs = [
    { id: 1, image: design_1 },
    { id: 2, image: design_2 },
  ];

  const handleCardClick = (index) => {
    setSelectedCardIndex(index === selectedCardIndex ? -1 : index); 
    setDesign(index)
  };

  return (
    <div className='design'>
      <div className='card-container'>
        {designs.map((design, index) => (
          <div
            key={design.id}
            className={`card ${index === selectedCardIndex ? 'selected' : ''}`}
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
