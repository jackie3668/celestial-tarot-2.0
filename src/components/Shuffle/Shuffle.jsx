import React, { useState, useEffect } from 'react';
import './Shuffle.css'; // Import your CSS file for styling
import design0Image from '../../assets/designs/design0/0.png';
import design1Image from '../../assets/designs/design1/0.jpg';

const Shuffle = ({ design }) => {
  const designImage = design === 0 ? design0Image : design1Image;
  const [isCircleAnimationComplete, setIsCircleAnimationComplete] = useState(false);

  useEffect(() => {
    const circleAnimationTimeout = setTimeout(() => {
      setIsCircleAnimationComplete(true);
    }, 3000); 
  
    return () => clearTimeout(circleAnimationTimeout);
  }, []);

  return (
    <div className='card-wrapper'>
      <ul className={`card-list ${isCircleAnimationComplete ? '' : ''}`}>
        {[...Array(30)].map((_, index) => (
          <li key={index} className={`card-list__item ${isCircleAnimationComplete ?'horizontal-layout' : ''}`} style={{ '--angle': `${index * (360 / 30)}deg`, '--x-offset': `${index * (2)}vw` }}>            
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