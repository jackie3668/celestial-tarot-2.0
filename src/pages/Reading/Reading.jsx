import React, { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, updateDoc, deleteField } from 'firebase/firestore';
import LoginModal from '../../components/Authentication/LoginModal';
import RegisterModal from '../../components/Authentication/RegisterModal';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import PastReadings from '../../components/PastReadings/PastReadings';

const Reading = () => {
    const { userLoggedIn, currentUser } = useAuth();
    const [question, setQuestion] = useState('');
    const [design, setDesign] = useState('');
    const [spread, setSpread] = useState('');
    const [cards, setCards] = useState([]);
    const [tagsInput, setTagsInput] = useState(''); // State for tags input field
    const [tags, setTags] = useState([]); // State for tags array
    const [noteInput, setNoteInput] = useState(''); // State for note input field
    const [note, setNote] = useState(''); // State for saved note
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [editingNote, setEditingNote] = useState(false); // State to track if editing note

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

    const handleGetResult = () => {
        if (!userLoggedIn) {
            setShowLogin(true);
        } else {
            // Perform actions on "Get result" click
            // For example, show a result or perform other actions
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Add tag from input to tags array
            setTags([...tags, tagsInput.trim()]);
            setTagsInput('');
        }
    };

    const handleSaveReading = async () => {
        try {
            // Check if user is logged in
            if (!currentUser) {
                console.error('User not authenticated.');
                return;
            }

            // Save reading to Firestore
            const docRef = await addDoc(collection(db, "readings"), {
                uid: currentUser.uid,
                question,
                design,
                spread,
                cards,
                result: 'Your result here', // Placeholder for result
                tags, // Tags field as an array of strings
                note, // Single note field as a string
                createdAt: serverTimestamp()
            });

            console.log('Reading added with ID: ', docRef.id);

            // Clear form fields after saving
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
        setEditingNote(true); // Set editing mode to true
        setNoteInput(note); // Set note input to current saved note for editing
    };

    const handleSaveEditedNote = () => {
        setNote(noteInput.trim()); // Update saved note with edited note
        setEditingNote(false); // Exit editing mode
    };

    const handleCancelEditNote = () => {
        setEditingNote(false); // Exit editing mode without saving
        setNoteInput(''); // Clear note input field
    };

    const handleRemoveTag = (index) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
    };

    return (
        <div>
            <h1>Reading</h1>
            <QuestionInput {...readingProps} />
            {question && <p>{question}</p>}
            <button onClick={handleGetResult}>Get result</button>
            {userLoggedIn && <p className='result'>Logged in content here...</p>}
            {!userLoggedIn && showLogin && <LoginModal handleSwitchToRegister={handleSwitchToRegister} />}
            {!userLoggedIn && showRegister && <RegisterModal handleSwitchToLogin={handleSwitchToLogin} />}
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
            <PastReadings />
        </div>
    );
};

export default Reading;
