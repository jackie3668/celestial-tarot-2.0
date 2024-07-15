import React, { useState, useEffect, useRef } from 'react';
import './Shuffle.css';
import design0Image from '../../assets/designs/design0/0.png';
import design1Image from '../../assets/designs/design1/0.jpg';
import spreadData from '../../data/spreadData';
import tarotCards from '../../data/tarotCard';

const Shuffle = ({ cards, setCards, spread, design, selectedCards, setSelectedCards }) => {
  const designImage = design === 0 ? design0Image : design1Image;
  const [isCircleAnimationComplete, setIsCircleAnimationComplete] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const imgRef = useRef(null);

  useEffect(() => {
    const circleAnimationTimeout = setTimeout(() => {
      setIsCircleAnimationComplete(true);
    }, 3000); 

    return () => clearTimeout(circleAnimationTimeout);
  }, []);

  const handleClick = (index) => {
    if (isCircleAnimationComplete) {
      if (selectedCount < spreadData[spread].length) {
        const position = spreadData[spread][selectedCount].position;

        setSelectedCards(prevCards => [
          ...prevCards,
          { index, x: position.x, y: position.y }
        ]);
        setSelectedCount(prevCount => prevCount + 1);
      } else {
        handleFlip(index);
      }
    }
  };

  const handleFlip = (index) => {
    const listItems = document.querySelectorAll('li.card-list__item');
    const target = listItems[index];
  
    // Helper function to check if the card already exists
    const cardExists = (number) => {
      return cards.some(card => card.img === number);
    };
  
    if (target) {
      if (target.classList.contains('click')) {
        let randomNumber = Math.floor(Math.random() * 78) + 1;
  
        // Ensure the random number doesn't already exist
        while (cardExists(randomNumber)) {
          randomNumber = Math.floor(Math.random() * 78) + 1;
        }
  
        const reversal = Math.floor(Math.random() * 2);
        const newCard = {
          id: 1,
          img: randomNumber,
          name: tarotCards[randomNumber],
          reversal: reversal === 1 ? 'reversed' : ''
        };
  
        setCards(prevCards => [...prevCards, newCard]);
  
        target.querySelector('img').classList.add('flip-in-ver-right');
        const newImagePath = design === 0 
          ? require(`../../assets/designs/design${design}/${randomNumber}.png`) 
          : require(`../../assets/designs/design${design}/${randomNumber}.jpg`);
        target.querySelector('img').src = newImagePath;
        target.querySelector('img').classList.add('reversed');
        target.classList.remove('click');
      }
    }
  };
  

  return (
    <div className='card-wrapper'>
      <ul className={`card-list-back ${isCircleAnimationComplete ? '' : ''}`}>
        {[...Array(30)].map((_, index) => (
          <li
            key={index}
            className={`card-list__item-back  ${
              isCircleAnimationComplete ? 'horizontal-layout' : ''
            }`}
            style={{
              '--angle': `${index * (360 / 30)}deg`,
              '--x-offset': `${index * 2}vw`,
            }}
          >
            <div className='card'>
              <img src={designImage} alt={`Design ${design}`} />
            </div>
          </li>
        ))}
      </ul>
      <ul className={`card-list ${isCircleAnimationComplete ? '' : ''}`}>
        {[...Array(30)].map((_, index) => (
          <li
            key={index}
            onClick={() => handleClick(index)}
            className={`card-list__item ${
              selectedCards[index] ? 'fade-out-bottom click' : ''
            } ${
              isCircleAnimationComplete && !selectedCards[index]
                ? 'horizontal-layout'
                : ''
            }`}
            style={{
              '--angle': `${index * (360 / 30)}deg`,
              '--x-offset': `${index * 2}vw`,
              '--x-spread': selectedCards[index] ? selectedCards[index].x : 0,
              '--y-spread': selectedCards[index] ? selectedCards[index].y : 0
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
