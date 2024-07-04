
import { firestore } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const createUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(firestore, 'users', uid), userData);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};
