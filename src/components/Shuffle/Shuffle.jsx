import React, { useState, useEffect } from 'react';
import './Shuffle.css'; // Import your CSS file for styling
import design0Image from '../../assets/designs/design0/0.png';
import design1Image from '../../assets/designs/design1/0.jpg';
import spreadData from '../../data/spreadData';

const Shuffle = ({ design }) => {
  const designImage = design === 0 ? design0Image : design1Image;
  const [isCircleAnimationComplete, setIsCircleAnimationComplete] = useState(false);
  const [selectedCards, setSelectedCards] = useState([])
  useEffect(() => {
    const circleAnimationTimeout = setTimeout(() => {
      setIsCircleAnimationComplete(true);
    }, 3000); 
  
    return () => clearTimeout(circleAnimationTimeout);
  }, []);
  const handleClick = (index) => {
    setSelectedCards(prevSelected => {
      if (prevSelected.includes(index)) {

        return prevSelected.filter(cardIndex => cardIndex !== index);
      } else {

        return [...prevSelected, index];
      }
    });
  };
  const xSpread = '200px'; 
  const ySpread = '200px'; 

  return (
    <div className='card-wrapper'>
      <ul className={`card-list ${isCircleAnimationComplete ? '' : ''}`}>
        {[...Array(30)].map((_, index) => (
            <li
            key={index}
            onClick={() => handleClick(index)}
            className={`card-list__item ${selectedCards.includes(index) ? 'fade-out-bottom' : ''} ${isCircleAnimationComplete && !selectedCards.includes(index) ? 'horizontal-layout' : ''}`}
            style={{ 
              '--angle': `${index * (360 / 30)}deg`, 
              '--x-offset': `${index * 2}vw`,
              '--x-spread': xSpread,
              '--y-spread': ySpread
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