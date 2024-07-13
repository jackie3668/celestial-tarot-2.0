import React, { useState, useEffect } from 'react';
import loadingGif from '../../assets/images/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './Result.css';
import icon from '../../assets/images/reading-icon (1).png'
import star from '../../assets/ui/star.png'

const Result = ({ design, question, cards, isLoading, setIsLoading, result }) => {
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [images, setImages] = useState([])
  const headings = [
    'Channeling the Spirit...',
    'Calling the Divine...',
    'Unlocking Mystical Insights...',
    'Seeking Guidance from the Stars...',
    'Harmonizing Mind and Soul...',
    'Awakening Your True Self...'
  ];

  useEffect(()=> {
    const imagePaths = cards.map((card) => {
      const imagePath = design === 0
        ? require(`../../assets/designs/design0/0.png`)
        : require(`../../assets/designs/design1/${card.img}.jpg`);
      return imagePath; 
    });

    setImages(imagePaths);
  },[result])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadingIndex(prevIndex => (prevIndex + 1) % headings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const handleScrollDown = () => {
    // Smooth scroll to the bottom of result-wrapper
    const resultWrapper = document.querySelector('.result-wrapper');
    resultWrapper.scrollIntoView({ behavior: 'smooth' });
  };

  const splitResult = result ? result.split('\n\n') : [];
  const allExceptLast = splitResult.slice(0, -1);
  const lastItem = splitResult.slice(-1)[0];


  return (
    <div className='result'>
      {isLoading ? (
        <div className="loading-animation">
          {headings.map((text, index) => (
            <div key={index} className={`${index === currentHeadingIndex ? '' : 'hidden'}`}>
              <h2 className='tracking-expand-contract'>{text}</h2>
            </div>
          ))}
          <img className='loading' src={loadingGif} alt="Loading..." />
        </div>
      ) : (
        <div className='result-wrapper'>
          <div className="content-wrapper">
            <h1><img src={icon} alt="" />{question}</h1>
            {allExceptLast.map((item, index) => {
              const [cardName, interpretation] = item.split(':');
              return (
                <div key={index} className="card-container">
                  <div className="card-image">
                    <img src={images[index]} className='card-image' alt="" />
                  </div>
                  <div className='card-text'>
                    <h3><img src={star} alt="" /><span>{cardName}</span></h3>
                    <p>{interpretation}</p>
                  </div>
                </div>
              );
            })}
            {lastItem && (
              <div className="last-item-wrapper">
                <div className='card-text'>
                  <h3><span>{lastItem.split(':')[0]}</span></h3>
                  <p>{lastItem.split(':')[1]}</p>
                </div>
              </div>
            )}
          </div>
          <FontAwesomeIcon icon={faAngleDown} onClick={handleScrollDown} className="scroll-down-icon" />
        </div>
      )}
    </div>
  );
  
};

export default Result;
