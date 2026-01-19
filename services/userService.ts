import { db } from './firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  householdIds: string[];
  createdAt: Timestamp;
}

export const createUserInFirestore = async (userId: string, email: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userData: Omit<User, 'id'> = {
      email,
      householdIds: [],
      createdAt: Timestamp.now(),
    };
    
    await setDoc(userRef, userData);
    console.log('User created in Firestore:', userId);
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
};