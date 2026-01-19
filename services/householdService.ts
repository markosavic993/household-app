import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface Household {
    id: string;
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
        const householdData: Omit<Household, 'id'> = {
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

export const getUserHouseholds = async (householdIds: string[]): Promise<Household[]> => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    if (!householdIds || householdIds.length === 0) return [];

    try {
        const households: Household[] = [];
        
        for (const householdId of householdIds) {
            const householdDoc = await getDoc(doc(db, 'households', householdId));
            if (householdDoc.exists()) {
                households.push({
                    id: householdDoc.id,
                    ...householdDoc.data()
                } as Household);
            }
        }

        return households;
    } catch (error) {
        console.error('Error fetching households:', error);
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