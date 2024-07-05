import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { useAuth } from '../../authContext';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const PastReadings = () => {
    const { currentUser } = useAuth();
    const [readings, setReadings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReadings, setFilteredReadings] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [customTagInput, setCustomTagInput] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [editingNoteId, setEditingNoteId] = useState(null); // State to track which note is being edited
    const [editedNote, setEditedNote] = useState(''); // State to store edited note temporarily

    useEffect(() => {
        if (currentUser) {
            fetchPastReadings(currentUser.uid);
        }
    }, [currentUser]);

    useEffect(() => {
        // Generate tag options based on readings
        const tagMap = new Map();
        readings.forEach(reading => {
            reading.tags.forEach(tag => {
                if (tagMap.has(tag)) {
                    tagMap.set(tag, tagMap.get(tag) + 1);
                } else {
                    tagMap.set(tag, 1);
                }
            });
        });

        // Sort tags by frequency (most used tags on top)
        const sortedTags = Array.from(tagMap)
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => tag);

        setTagOptions(sortedTags);
    }, [readings]);

    useEffect(() => {
        // Filter readings based on search term, selected tag, or notes
        let filtered = readings;

        if (searchTerm) {
            filtered = filtered.filter(reading =>
                reading.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reading.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (reading.note && reading.note.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedTag) {
            filtered = filtered.filter(reading =>
                reading.tags.includes(selectedTag)
            );
        }

        setFilteredReadings(filtered);
    }, [searchTerm, readings, selectedTag]);

    const fetchPastReadings = async (userId) => {
        try {
            const q = query(collection(db, "readings"), where("uid", "==", userId), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const readingsData = querySnapshot.docs.map(doc => ({
                id: doc.id, // Use document ID as the unique identifier
                ...doc.data(),
                createdAtFormatted: formatDate(doc.data().createdAt.toDate()) // Format createdAt date
            }));
            setReadings(readingsData);
        } catch (error) {
            console.error('Error fetching past readings:', error);
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleDeleteReading = async (readingId) => {
        try {
            await deleteDoc(doc(db, "readings", readingId));
            setReadings(readings.filter(reading => reading.id !== readingId));
            setFilteredReadings(filteredReadings.filter(reading => reading.id !== readingId));
        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleTagFilter = (tag) => {
        setSelectedTag(tag);
    };

    const handleCustomTagInputChange = (e) => {
        setCustomTagInput(e.target.value);
    };

    const handleAddCustomTag = async (readingId) => {
        try {
            // Update Firestore document to add custom tag
            const readingRef = doc(db, "readings", readingId);
            await updateDoc(readingRef, {
                tags: arrayUnion(customTagInput.trim()) // Add custom tag to existing tags array
            });

            // Update local state to reflect the change
            setReadings(readings.map(reading => {
                if (reading.id === readingId) {
                    return {
                        ...reading,
                        tags: [...reading.tags, customTagInput.trim()]
                    };
                }
                return reading;
            }));

            setCustomTagInput('');
        } catch (error) {
            console.error('Error adding custom tag:', error);
        }
    };

    const handleRemoveTag = async (readingId, tagToRemove) => {
        try {
            // Update Firestore document to remove tag
            const readingRef = doc(db, "readings", readingId);
            await updateDoc(readingRef, {
                tags: arrayRemove(tagToRemove) // Remove tag from existing tags array
            });

            // Update local state to reflect the change
            setReadings(readings.map(reading => {
                if (reading.id === readingId) {
                    return {
                        ...reading,
                        tags: reading.tags.filter(tag => tag !== tagToRemove)
                    };
                }
                return reading;
            }));
        } catch (error) {
            console.error('Error removing tag:', error);
        }
    };

    const handleStartEditNote = (readingId, currentNote) => {
        setEditingNoteId(readingId);
        setEditedNote(currentNote);
    };

    const handleCancelEditNote = () => {
        setEditingNoteId(null);
        setEditedNote('');
    };

    const handleSaveEditedNote = async (readingId) => {
        try {
            // Update Firestore document with edited note
            const readingRef = doc(db, "readings", readingId);
            await updateDoc(readingRef, {
                note: editedNote.trim()
            });

            // Update local state to reflect the change
            setReadings(readings.map(reading => {
                if (reading.id === readingId) {
                    return {
                        ...reading,
                        note: editedNote.trim()
                    };
                }
                return reading;
            }));

            setEditingNoteId(null);
            setEditedNote('');
        } catch (error) {
            console.error('Error saving edited note:', error);
        }
    };

    return (
        <div>
            <div className="reading-controls">
                <input
                    type="text"
                    placeholder="Search by question, result, or note..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div>
                    <h4>Filter by Tags:</h4>
                    <select
                        value={selectedTag}
                        onChange={(e) => handleTagFilter(e.target.value)}
                    >
                        <option value="">Select a tag...</option>
                        {tagOptions.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>
            <h2>Past Readings</h2>
            <ul>
                {filteredReadings.map(reading => (
                    <li key={reading.id}>
                        <p>Question: {reading.question}</p>
                        <p>Result: {reading.result}</p>
                        {editingNoteId === reading.id ? (
                            <div>
                                <textarea
                                    value={editedNote}
                                    onChange={(e) => setEditedNote(e.target.value)}
                                />
                                <button onClick={() => handleSaveEditedNote(reading.id)}>Save Note</button>
                                <button onClick={handleCancelEditNote}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {reading.note && (
                                    <div>
                                        <p>Note: {reading.note}</p>
                                        <button onClick={() => handleStartEditNote(reading.id, reading.note)}>Edit Note</button>
                                    </div>
                                )}
                            </div>
                        )}
                        <p>Design: {reading.design}</p>
                        <p>Spread: {reading.spread}</p>
                        <p>Cards: {reading.cards.join(', ')}</p>
                        <p>Created On: {reading.createdAtFormatted}</p>
                        <div>
                            <p>Tags:</p>
                            {reading.tags.map(tag => (
                                <span key={tag}>
                                    {tag}
                                    <button
                                        className="tag-remove"
                                        onClick={() => handleRemoveTag(reading.id, tag)}
                                    >
                                        d
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Add custom tag..."
                                value={customTagInput}
                                onChange={handleCustomTagInputChange}
                            />
                            <button onClick={() => handleAddCustomTag(reading.id)}>Add Tag</button>
                        </div>
                        <button onClick={() => handleDeleteReading(reading.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PastReadings;
