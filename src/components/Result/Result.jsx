import React, { useState, useEffect } from 'react';
import loadingGif from '../../assets/images/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './Result.css'; // Import your CSS for styling

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
            <h1>{question}</h1>
            {result ? (
              result.split('\n\n').map((item, index) => {
                const [cardName, interpretation] = item.split(':');
                return (
                  <div key={index} className="card-container">
                    <div className="card-image">
                      <img src={images[index]} className='card-image' alt="" />
                    </div>
                    <div className='card-text'>
                      <h2>{index}</h2>
                      <h3>{cardName}</h3>
                      <p>{interpretation}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No result available.</p>
            )}
            <FontAwesomeIcon icon={faAngleDown} onClick={handleScrollDown} className="scroll-down-icon" />
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Result;
