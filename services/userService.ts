import { db } from './firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

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

// Cache to store user names to avoid repeated Firestore calls
const userNameCache = new Map<string, string>();

export const getUserName = async (userId: string): Promise<string> => {
    // Check cache first
    if (userNameCache.has(userId)) {
        return userNameCache.get(userId)!;
    }

    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const email = userData.email || '';
            // Extract name from email (before @)
            const name = email.split('@')[0];
            
            // Cache the result
            userNameCache.set(userId, name);
            return name;
        }
        
        userNameCache.set(userId, 'Unknown');
        return 'Unknown';
    } catch (error) {
        console.error('Error fetching user name:', error);
        return 'Unknown';
    }
};

export const clearUserNameCache = () => {
    userNameCache.clear();
};