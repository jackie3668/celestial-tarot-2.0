import React, { useEffect, useState } from 'react';
import WaterWave from 'react-water-wave';
import background from '../../assets/images/reading.png';
import { db } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useAuth } from '../../authContext';
import './Journal.css';
import icon from '../../assets/images/reading-icon (1).png';
import star from '../../assets/ui/star.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTag, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Journal = () => {
  const { currentUser } = useAuth();
  const [readings, setReadings] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [errorMessageTag, setErrorMessageTag] = useState('');
  const [errorMessageNote, setErrorMessageNote] = useState('');
  const [activeReading, setActiveReading] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      if (currentUser) {
        const q = query(collection(db, 'celestial', currentUser.uid, 'readings'));
        const querySnapshot = await getDocs(q);
        const userReadings = querySnapshot.docs.map(doc => doc.data());
        setReadings(userReadings);
      }
    };
    fetchReadings();
  }, [currentUser]);

  const handleAddTag = () => {
    const newTags = newTag.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const uniqueTags = newTags.filter(tag => !tags.includes(tag));

    if (uniqueTags.length === 0) {
      setErrorMessageTag('Tag already exists.');
      setTimeout(() => setErrorMessageTag(''), 2000);
      return;
    }

    setTags([...tags, ...uniqueTags]);
    setNewTag('');
    setShowTagInput(false);
  };

  const handleDeleteTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddNote = () => {
    if (note.trim() === '') {
      setErrorMessageNote('Please enter a note.');
      setTimeout(() => setErrorMessageNote(''), 2000);
      return;
    }

    setShowNoteInput(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleReadingClick = (index) => {
    setActiveReading(index);
  };

  const handleBackToSummary = () => {
    setActiveReading(null);
  };

  return (
    <div className='journal'>
      <WaterWave
        className='ripple-container'
        imageUrl={background}
        dropRadius={40}
        perturbance={0.01}
        resolution={256}
        interactive={true}
      >
        {({ drop }) => (
          <></>
        )}
      </WaterWave>
      <div className="journal-container">
        {activeReading === null ? (
          <div className="summary-view">
            {readings.length > 0 ? (
              readings.map((reading, index) => (
                <div key={index} className='summary-item' onClick={() => handleReadingClick(index)}>
                  <h1>{reading.question}</h1>
                </div>
              ))
            ) : (
              <p>No readings found.</p>
            )}
          </div>
        ) : (
          <div className="detail-view">
            <FontAwesomeIcon icon={faArrowLeft} className="return-icon" onClick={handleBackToSummary} />
            {readings.map((reading, index) => {
              if (index !== activeReading) return null;
              const { question, result, images } = reading;
              const resultArray = result.split('\n\n');
              const allExceptLast = resultArray.slice(0, -1);
              const lastItem = resultArray[resultArray.length - 1];

              return (
                <div key={index} className='result-wrapper'>
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
                      <>
                        <div className="last-item-wrapper">
                          <div className='card-text'>
                            <h3><span>{lastItem.split(':')[0]}</span></h3>
                            <p>{lastItem.split(':')[1]}</p>
                          </div>
                        </div>
                        <div className="save-wrapper">
                          <span>Add tags and note to your reading, and save to your journal.</span>
                          <div className="editor">
                            <div className="tags">
                              <div className='header' onClick={() => setShowTagInput(!showTagInput)}>
                                <FontAwesomeIcon icon={faPlus} /><p>Add Tags</p><span>Separate by comma</span>
                              </div>
                              {showTagInput && (
                                <div className='input-wrapper'>
                                  {tags &&
                                  <ul>
                                  {tags && tags.map((tag, index) => (
                                    <li key={index}><FontAwesomeIcon icon={faTag} />{tag} <FontAwesomeIcon onClick={() => handleDeleteTag(tag)} icon={faTimes} /></li>
                                  ))}
                                  </ul>
                                   }
                                  <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Add tags here"
                                  />
                                  <button onClick={handleAddTag}>Add Tag</button>
                                </div>
                              )}
                              <span className="tip fade-out">{errorMessageTag}</span>
                            </div>
                            <div className="note">
                              <div className='header' onClick={() => setShowNoteInput(!showNoteInput)}>
                                <FontAwesomeIcon icon={faPlus} /><p>Add Note</p><span>You can edit this later in your journal</span>
                              </div>
                            {showNoteInput && (
                              <div className='input-wrapper'>
                                <textarea
                                  value={note}
                                  onChange={(e) => setNote(e.target.value)}
                                  placeholder={note}
                                  rows={5}
                                />
                                <div className="button-wrapper">
                                  <button onClick={handleAddNote}>{'Add Note'}</button>
                                </div>
                              </div>
                              )}
                              <span className="tip-2 fade-out">{errorMessageNote}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
