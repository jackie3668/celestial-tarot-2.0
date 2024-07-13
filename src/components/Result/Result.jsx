import React, { useState, useEffect } from 'react';
import loadingGif from '../../assets/images/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faPlus, faTimes, faTag } from '@fortawesome/free-solid-svg-icons'; 
import './Result.css';
import icon from '../../assets/images/reading-icon (1).png'
import star from '../../assets/ui/star.png'

const Result = ({ design, question, cards, isLoading, setIsLoading, result, note, setNote, tags, setTags, images, setImages, handleSaveReading, save }) => {
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [errorMessageTag, setErrorMessageTag] = useState('');
  const [errorMessageNote, setErrorMessageNote] = useState('');
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
        ? require(`../../assets/designs/design0/${card.img}.png`)
        : require(`../../assets/designs/design1/${card.img}.jpg`);
      return imagePath; 
    });

    setImages(imagePaths);
    if (result) {
      setIsLoading(false)
    }
  },[result])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadingIndex(prevIndex => (prevIndex + 1) % headings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const handleScrollDown = () => {
    const contentWrapper = document.querySelector('.content-wrapper');
    console.log(true);
    contentWrapper.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' });
  };

  const splitResult = result ? result.split('\n\n') : [];
  const allExceptLast = splitResult.slice(0, -1);
  const lastItem = splitResult.slice(-1)[0];

  const handleAddTag = () => {
    
    if (newTag.trim() === '') {
      setErrorMessageTag('Please enter a tag.');
      document.querySelector('.save-wrapper .tip').classList.remove('fade-out');
      document.querySelector('.save-wrapper .tip').classList.add('fade-in-fwd');
      setTimeout(() => {
        document.querySelector('.save-wrapper .tip').classList.add('fade-out');
      }, 1500);
      return; 
    }

    if (tags.includes(newTag.trim())) {
      setErrorMessageTag('Tag already exists.');
      document.querySelector('.save-wrapper .tip').classList.remove('fade-out')

      document.querySelector('.save-wrapper .tip').classList.add('fade-in-fwd')
      setTimeout(() => {
        document.querySelector('.save-wrapper .tip').classList.add('fade-out')
      }, 1500); 
      return;
    }
 
    const newTags = newTag.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setTags([...tags, ...newTags]);
    setNewTag('');
    setErrorMessageTag('')
  };
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
      setNewTag('')
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = tags.filter(tag => tag !== tagToDelete);
    setTags(updatedTags);
  };

  const handleAddNote = () => {
    if (note.trim() === '') {
      setErrorMessageNote('Please enter a note.');
      document.querySelector('.save-wrapper .tip-2').classList.remove('fade-out')

      document.querySelector('.save-wrapper .tip-2').classList.add('fade-in-fwd')
      setTimeout(() => {
        document.querySelector('.save-wrapper .tip-2').classList.add('fade-out')
      }, 1500); 
      return;
    } else {
      console.log(note);
      setNote(note)
      setErrorMessageNote('Note saved');
      document.querySelector('.save-wrapper .tip-2').classList.remove('fade-out')

      document.querySelector('.save-wrapper .tip-2').classList.add('fade-in-fwd')
      setTimeout(() => {
        document.querySelector('.save-wrapper .tip-2').classList.add('fade-out')
      }, 1500); 
      setShowNoteInput(false)
      return
    }
  };

  const handleEditNote = () => {
    if (note.trim() === '') {
      setErrorMessageNote('Please enter a note.');
      document.querySelector('.save-wrapper .tip-2').classList.remove('fade-out')

      document.querySelector('.save-wrapper .tip-2').classList.add('fade-in-fwd')
      setTimeout(() => {
        document.querySelector('.save-wrapper .tip-2').classList.add('fade-out')
      }, 1500); 
      return;
    } else {
      setNote(note)
      setErrorMessageNote('Note saved.');
      document.querySelector('.save-wrapper .tip-2').classList.remove('fade-out')

      document.querySelector('.save-wrapper .tip-2').classList.add('fade-in-fwd')
      setTimeout(() => {
        if (document.querySelector('.save-wrapper .tip-2').classList)  {
        document.querySelector('.save-wrapper .tip-2').classList.add('fade-out')
      }
      }, 1500); 
      setShowNoteInput(false)
      return
    }
  };

  const handleRestart = () => {
    window.location.reload(); 
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
            {lastItem ? (
            <>
              <div className="last-item-wrapper">
                <div className='card-text'>
                  <h3><span>{lastItem.split(':')[0]}</span></h3>
                  <p>{lastItem.split(':')[1]}</p>
                </div>
              </div>
              <div className="save-wrapper">
                {save ? <span>Add tags and note to your reading, and save to your journal.</span> : <span>You can view and edit in  your journal.</span>}
                {save ? (                
                <div className="editor">
                  <div className="tags">
                    <div className='header' onClick={() => setShowTagInput(!showTagInput)} ><FontAwesomeIcon icon={faPlus} /><p>Add Tags</p><span>Separate by comma</span></div>
                
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
                    <div className='header' onClick={() => setShowNoteInput(!showNoteInput)} ><FontAwesomeIcon icon={faPlus} /><p>Add Note</p><span>You can edit this later in your journal</span></div>
                  {showNoteInput && (
                    <div className='input-wrapper'>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={note}
                        rows={5}
                      />
                      <div className="button-wrapper">
                        <button onClick={note ? handleEditNote : handleAddNote}>{note ? 'Save Edits' : 'Add Note'}</button>
                      </div>
                    </div>
                    )}
                    <span className="tip-2 fade-out">{errorMessageNote}</span>
                  </div>
                </div>) : <></>}
                <div className='button-wrapper'>
                  {save ? <button className='save' onClick={handleSaveReading} >Save reading</button> : <></>}
                  <button className='restart' onClick={handleRestart}>Restart</button>
                </div>
              </div>
            </>
            ) : (
              <>Sorry. Something went wrong.</>
            )}
          </div>
          <FontAwesomeIcon icon={faAngleDown} onClick={handleScrollDown} className="scroll-down-icon" />
        </div>
      )}
    </div>
  );
  
};

export default Result;
