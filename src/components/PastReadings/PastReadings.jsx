import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { useAuth } from '../../authContext';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

const PastReadings = () => {
    const { currentUser } = useAuth();
    const [readings, setReadings] = useState([]);

    useEffect(() => {
        if (currentUser) {
            fetchPastReadings(currentUser.uid);
        }
    }, [currentUser]);

    const fetchPastReadings = async (userId) => {
        try {
            const q = query(collection(db, "readings"), where("uid", "==", userId), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const readingsData = querySnapshot.docs.map(doc => ({
                id: doc.id, // Use document ID as the unique identifier
                ...doc.data()
            }));
            setReadings(readingsData);
        } catch (error) {
            console.error('Error fetching past readings:', error);
        }
    };

    const handleDeleteReading = async (readingId) => {
        try {
            await deleteDoc(doc(db, "readings", readingId));
            setReadings(readings.filter(reading => reading.id !== readingId));
        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    };

    return (
        <div>
            <h2>Past Readings</h2>
            <ul>
                {readings.map(reading => (
                    <li key={reading.id}>
                        <p>Question: {reading.question}</p>
                        <p>Design: {reading.design}</p>
                        <p>Spread: {reading.spread}</p>
                        <p>Cards: {reading.cards.join(', ')}</p>
                        <button onClick={() => handleDeleteReading(reading.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PastReadings;
