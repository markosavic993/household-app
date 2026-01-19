import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface Household {
    name: string;
    members: string[];
    createdAt: any;
    updatedAt: any;
}

export const createHousehold = async (
    name: string,
    userId: string
): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        const householdData: Household = {
            name,
            members: [userId],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
            collection(db, 'households'),
            householdData
        );

        await setDoc(doc(db, 'users', userId), {
            householdIds: [docRef.id],
            createdAt: serverTimestamp(),
        }, { merge: true });

        return docRef.id;
    } catch (error) {
        console.error('Error creating household:', error);
        throw error;
    }
};