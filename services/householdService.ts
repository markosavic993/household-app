import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

        // Use updateDoc with arrayUnion to properly manage multiple households
        await updateDoc(doc(db, 'users', userId), {
            householdIds: arrayUnion(docRef.id),
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating household:', error);
        throw error;
    }
};

export const joinHousehold = async (
    inviteCode: string,
    userId: string
): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        // TODO: Implement invite code validation and household lookup
        // For now, this is a placeholder
        throw new Error('Join household functionality not yet implemented');
    } catch (error) {
        console.error('Error joining household:', error);
        throw error;
    }
};