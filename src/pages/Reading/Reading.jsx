import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Reading.css'
import LoginModal from '../../components/Authentication/LoginModal';
import RegisterModal from '../../components/Authentication/RegisterModal';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import PastReadings from '../../components/PastReadings/PastReadings';
import Feedback from '../../components/Feedback/Feedback';
import { doSendEmailVerification } from '../../auth';

const Reading = () => {
    const { userLoggedIn, currentUser } = useAuth();
    const [question, setQuestion] = useState('');
    const [design, setDesign] = useState('');
    const [spread, setSpread] = useState('');
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

    const handleGetResult = () => {
        if (!userLoggedIn) {
            setShowLogin(true);
        } else if (!isEmailVerified) {
            doSendEmailVerification(currentUser)
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

    const handleSwitchToRegister = () => {
        setShowRegister(true); 
        setShowLogin(false);
    };

    const handleSwitchToLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleAddNote = () => {
        if (noteInput.trim() !== '') {
            setNote(noteInput.trim());
            setNoteInput('');
        }
    };

    const handleEditNote = () => {
        setEditingNote(true);
        setNoteInput(note);
    };

    const handleSaveEditedNote = () => {
        setNote(noteInput.trim());
        setEditingNote(false);
    };

    const handleCancelEditNote = () => {
        setEditingNote(false);
        setNoteInput('');
    };

    const handleRemoveTag = (index) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
    };

    return (
        <div className='reading-container container'>
            <h1>Reading</h1>
            <QuestionInput {...readingProps} />
            {question && <p>{question}</p>}
            <button onClick={handleGetResult}>Get result</button>
            {userLoggedIn && isEmailVerified && <p className='result'>Logged in content here...</p>}
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
            <button onClick={handleSaveReading}>Save Reading</button>
        </div>
    );
};

export default Reading;
