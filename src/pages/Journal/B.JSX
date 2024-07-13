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
import { faPlus, faTag, faTimes, faArrowLeft, faFilter, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';

const Journal = () => {
  const { currentUser } = useAuth();
  const [readings, setReadings] = useState([]);
  const [allReadings, setAllReadings] = useState([])
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [errorMessageTag, setErrorMessageTag] = useState('');
  const [errorMessageNote, setErrorMessageNote] = useState('');
  const [activeReading, setActiveReading] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOption, setSortOption] = useState('date-desc'); // 'date-asc' or 'date-desc'

  useEffect(() => {
    const fetchReadings = async () => {
      if (currentUser) {
        const q = query(collection(db, 'celestial', currentUser.uid, 'readings'));
        const querySnapshot = await getDocs(q);
        const userReadings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReadings(userReadings);
        setAllReadings(userReadings)

        // Extract tags from all readings
        const allTags = userReadings.reduce((acc, reading) => {
          reading.tags.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []);
        setTags(allTags);
      }
    };
    fetchReadings();
  }, [currentUser]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === '') {
      setErrorMessageTag('Tag cannot be empty.');
      setTimeout(() => setErrorMessageTag(''), 2000);
      return;
    }
    if (tags.includes(trimmedTag)) {
      setErrorMessageTag('Tag already exists.');
      setTimeout(() => setErrorMessageTag(''), 2000);
      return;
    }

    setTags([...tags, trimmedTag]);
    setNewTag('');
    setShowTagInput(false);
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

  const handleToggleTag = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag('');
    } else {
      setSelectedTag(tag);
    }
    filterReadings(tag);
  };

  const handleClearFilters = () => {
    setSelectedTag('');
    setReadings([]);
  };

  const filterReadings = (selectedTag) => {
    console.log(selectedTag);
    if (selectedTag === '') {
      console.log('empty');
      // If no tag is selected, show all readings
      setReadings(allReadings);
    } else {
      // Filter readings based on the selected tag
      const filteredReadings = allReadings.filter(reading =>
        reading.tags.includes(selectedTag)
      );
      setReadings(filteredReadings);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    // Implement sorting logic based on option ('date-asc' or 'date-desc')
    let sortedReadings = [...readings];
    if (option === 'date-asc') {
      sortedReadings.sort((a, b) => new Date(a.createdAt.seconds * 1000) - new Date(b.createdAt.seconds * 1000));
    } else if (option === 'date-desc') {
      sortedReadings.sort((a, b) => new Date(b.createdAt.seconds * 1000) - new Date(a.createdAt.seconds * 1000));
    }
    setReadings(sortedReadings);
  };

  const handleSearch = () => {
    const filteredReadings = readings.filter(reading => {
      const searchText = searchInput.toLowerCase();
      return (
        reading.question.toLowerCase().includes(searchText) ||
        reading.note.toLowerCase().includes(searchText)
      );
    });
    setReadings(filteredReadings);
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return ''; // Handle the case where timestamp is not defined or missing required properties
    }
  
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
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
            <div className="summary-header">
              <h2>Past Readings</h2>
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faFilter} className="icon" />
                <select
                  value={selectedTag}
                  onChange={(e) => handleToggleTag(e.target.value)}
                >
                  <option value="">Select a Tag</option>
                  {tags.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                  ))}
                </select>
                <FontAwesomeIcon icon={faSort} className="icon" />
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="date-asc">Sort by Date (Ascending)</option>
                  <option value="date-desc">Sort by Date (Descending)</option>
                </select>
                <FontAwesomeIcon icon={faSearch} className="icon" onClick={() => setShowSearchBar(!showSearchBar)} />
              </div>
              {showSearchBar && (
                <div className="search-bar">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search results..."
                  />
                  <button onClick={handleSearch}>Search</button>
                </div>
              )}
            </div>
            {readings.length > 0 ? (
              readings.map((reading, index) => (
                <div key={index} className='summary-item' onClick={() => handleReadingClick(index)}>
                  <h1>{reading.question}</h1>
                  <div className="reading-details">
                    <p>Tags: {reading.tags.join(', ')}</p>
                    <p>Date: {formatDate(reading.createdAt)}</p>
                  </div>
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
                                      {tags.map((tag, index) => (
                                        <li key={index}>
                                          <label>
                                            <input
                                              type="radio"
                                              value={tag}
                                              checked={selectedTag === tag}
                                              onChange={() => handleToggleTag(tag)}
                                            />
                                            {tag}
                                          </label>
                                        </li>
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
                                    placeholder="Add a note here..."
                                    rows={5}
                                  />
                                  <div className="button-wrapper">
                                    <button onClick={handleAddNote}>Add Note</button>
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
