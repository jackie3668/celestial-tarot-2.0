import React, { useState, useEffect } from 'react';
import './Shuffle.css'; // Import your CSS file for styling
import design0Image from '../../assets/designs/design0/0.png';
import design1Image from '../../assets/designs/design1/0.jpg';
import spreadData from '../../data/spreadData';

const Shuffle = ({ spread, design, selectedCards, setSelectedCards }) => {
  const designImage = design === 0 ? design0Image : design1Image;
  const [isCircleAnimationComplete, setIsCircleAnimationComplete] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const circleAnimationTimeout = setTimeout(() => {
      setIsCircleAnimationComplete(true);
    }, 3000); 

    return () => clearTimeout(circleAnimationTimeout);
  }, []);

  const handleClick = (index) => {
    console.log(spread);
    if (selectedCount < spreadData[spread].length) {
      const position = spreadData[spread][selectedCount].position;
      
      setSelectedCards(prevCards => [
        ...prevCards,
        { index, x: position.x, y: position.y }  
      ]);

      setSelectedCount(prevCount => prevCount + 1);

      if (selectedCount === spreadData[spread].length) {
        console.log('Stop');
      }
    }
  };


  return (
    <div className='card-wrapper'>

      <ul className={`card-list ${isCircleAnimationComplete ? '' : ''}`}>
        {[...Array(30)].map((_, index) => (
            <li
            key={index}
            onClick={() => handleClick(index)}
            className={`card-list__item ${
              selectedCards[index] ? 'fade-out-bottom' : ''
            } ${
              isCircleAnimationComplete && !selectedCards[index]
                ? 'horizontal-layout'
                : ''
            }`}
            style={{ 
              '--angle': `${index * (360 / 30)}deg`, 
              '--x-offset': `${index * 2}vw`,
              '--x-spread': selectedCards[index] ? selectedCards[index].x : 0, 
              '--y-spread': selectedCards[index] ? selectedCards[index].y : 0  // Set selectedCards[index].y if selected, otherwise ySpread
          }}           
           >                             
            <div className='card'>
              <img src={designImage} alt={`Design ${design}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shuffle;