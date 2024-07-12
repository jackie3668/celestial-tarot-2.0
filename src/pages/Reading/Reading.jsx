import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import WaterWave from "react-water-wave";
import './Reading.css'
import background from '../../assets/images/reading.png'
import { doSendEmailVerification } from '../../auth';
import LoginModal from '../../components/Authentication/LoginModal';
import RegisterModal from '../../components/Authentication/RegisterModal';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import PastReadings from '../../components/PastReadings/PastReadings';
import Feedback from '../../components/Feedback/Feedback';
import Design from '../../components/Design/Design';
import Spread from '../../components/Spread/Spread';
import icon1 from '../../assets/images/reading-icon (1).png'
import icon2 from '../../assets/images/reading-icon (2).png'
import icon3 from '../../assets/images/reading-icon (3).png'
import arrow from '../../assets/ui/arrow_cricle.png'
import Shuffle from '../../components/Shuffle/Shuffle';

const Reading = () => {
    const { userLoggedIn, currentUser } = useAuth();
    const [question, setQuestion] = useState('');
    const [design, setDesign] = useState(0);
    const [spread, setSpread] = useState(0);
    const [cards, setCards] = useState([]);
    const [tagsInput, setTagsInput] = useState('');
    const [tags, setTags] = useState([]);
    const [noteInput, setNoteInput] = useState('');
    const [note, setNote] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false); 
    const [editingNote, setEditingNote] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const readingProps = {
        question,
        design,
        spread,
        cards,
        setQuestion,
        setDesign,
        setSpread,
        setCards,
    };

    useEffect(() => {
        setShowLogin(false);
    }, [userLoggedIn]);

    useEffect(() => {
        if (currentUser) {
            setIsEmailVerified(currentUser.emailVerified)
        };
    }, [userLoggedIn]);

    useEffect(() => {
        if (question) {
            document.querySelector('button#get-results').classList = 'floating'
        }
    }, [question, setQuestion])

    const handleGetResult = () => {
        if (question) {
            document.querySelector('.reading-container').classList.add('hide')
        } else {
            document.querySelector('.modal').classList.remove('fade-out')
            document.querySelector('.modal').classList.remove('floating')
            document.querySelector('.modal').classList.add('heartbeat')
            setTimeout(() => {
                document.querySelector('.modal').classList.remove('heartbeat');
                document.querySelector('.modal').classList.add('fade-out')
              }, 1500);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setTags([...tags, tagsInput.trim()]);
            setTagsInput('');
        }
    };

    const handleSaveReading = async () => {
        try {
            if (!currentUser) {
                console.error('User not authenticated.');
                return;
            }

            const docRef = await addDoc(collection(db, "readings"), {
                uid: currentUser.uid,
                question,
                design,
                spread,
                cards,
                result: 'Your result here',
                tags,
                note,
                createdAt: serverTimestamp()
            });

            console.log('Reading added with ID: ', docRef.id);

            setQuestion('');
            setDesign('');
            setSpread('');
            setCards([]);
            setTags([]);
            setTagsInput('');
            setNote('');
            setNoteInput('');
        } catch (error) {
            console.error('Error saving reading to Firestore: ', error);
        }
    };

    // const handleSwitchToRegister = () => {
    //     setShowRegister(true); 
    //     setShowLogin(false);
    // };

    // const handleSwitchToLogin = () => {
    //     setShowLogin(true);
    //     setShowRegister(false);
    // };

    // const handleAddNote = () => {
    //     if (noteInput.trim() !== '') {
    //         setNote(noteInput.trim());
    //         setNoteInput('');
    //     }
    // };

    // const handleEditNote = () => {
    //     setEditingNote(true);
    //     setNoteInput(note);
    // };

    // const handleSaveEditedNote = () => {
    //     setNote(noteInput.trim());
    //     setEditingNote(false);
    // };

    // const handleCancelEditNote = () => {
    //     setEditingNote(false);
    //     setNoteInput('');
    // };

    // const handleRemoveTag = (index) => {
    //     const updatedTags = [...tags];
    //     updatedTags.splice(index, 1);
    //     setTags(updatedTags);
    // };

    return (
        <div className='reading'>
            <WaterWave
                className='ripple-container' 
                imageUrl={background}
                dropRadius={40}
                perturbance={0.01}
                resolution={256}
                interactive={true}
            >
            {({ drop }) => ( 
            <>
            </>
            )}
            </WaterWave>
            {/* <div className="reading-container">
                <div>
                    <div className="heading">
                        <img src={icon1} alt="" />
                        <h1>Question</h1>
                    </div>
                    <QuestionInput {...readingProps} />
                </div>
                <div>
                    <div className="heading">
                        <img src={icon2} alt="" />
                        <h1>Design</h1>
                    </div>
                    <Design  {...readingProps} />
                </div>
                <div>
                    <div className="heading">
                        <img src={icon3} alt="" />
                        <h1>Spread</h1>
                    </div>
                    <Spread  {...readingProps} />
                </div>
                <button onClick={handleGetResult} id='get-results'>
                    CLICK TO BEGIN 
                    <img src={arrow} alt="" />
                    <div className="modal fade-out">Please enter a question</div>
                </button>
            </div> */}
            <div className="shuffle-container">
                <Shuffle {...readingProps}/>
            </div>
            {/* {userLoggedIn && isEmailVerified && <p className='result'>Logged in content here...</p>}
            {!userLoggedIn && showLogin && <LoginModal handleSwitchToRegister={handleSwitchToRegister} />}
            {!userLoggedIn && showRegister && <RegisterModal handleSwitchToLogin={handleSwitchToLogin} />} 
            {userLoggedIn && !isEmailVerified && <p>Verify your email before you continue. A link has been sent</p>}
            <div>
                <label>Tags:</label>
                <div>
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                            <button className="tag-remove" onClick={() => handleRemoveTag(index)}>
                                d
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Press Enter to add tags"
                />
            </div>
            <div>
                <label>Note:</label>
                {editingNote ? (
                    <div>
                        <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Edit note..."
                        />
                        <button onClick={handleSaveEditedNote}>Save Note</button>
                        <button onClick={handleCancelEditNote}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        {note ? (
                            <div>
                                <p>{note}</p>
                                <button onClick={handleEditNote}>Edit Note</button>
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    placeholder="Add a note..."
                                />
                                <button onClick={handleAddNote}>Add Note</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <button onClick={handleSaveReading}>Save Reading</button> */}

        </div>
    );
};

export default Reading;
