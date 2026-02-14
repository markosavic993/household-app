import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
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
        const normalizedCode = inviteCode.trim().toUpperCase();

        // 1. Read invite (you have permission)
        const inviteDoc = await getDoc(doc(db, 'invites', normalizedCode));
        if (!inviteDoc.exists()) {
            throw new Error('Неважећи код позивнице');
        }

        const inviteData = inviteDoc.data();
        const householdId = inviteData.householdId;

        // 2. Skip reading household - just try to update directly
        // If user is already a member, arrayUnion will be idempotent (safe)
        // If household doesn't exist, updateDoc will fail
        
        try {
            await updateDoc(doc(db, 'households', householdId), {
                members: arrayUnion(userId),
                updatedAt: serverTimestamp(),
            });
        } catch (error: any) {
            if (error.code === 'not-found') {
                throw new Error('Домаћинство не постоји');
            }
            throw error;
        }

        // 3. Update user
        await updateDoc(doc(db, 'users', userId), {
            householdIds: arrayUnion(householdId),
        });

        return householdId;
    } catch (error) {
        console.error('Error joining household:', error);
        throw error;
    }
};

// Generate a random 6-character invite code
const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Create an invite code for a household
export const createInviteCode = async (householdId: string): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        // Generate unique code
        let inviteCode = generateInviteCode();
        let exists = true;

        // Keep generating until we find a unique code
        while (exists) {
            const inviteDoc = await getDoc(doc(db, 'invites', inviteCode));
            if (!inviteDoc.exists()) {
                exists = false;
            } else {
                inviteCode = generateInviteCode();
            }
        }

        // Store invite code
        console.log('Creating invite code:', inviteCode, 'for household:', householdId);
        await setDoc(doc(db, 'invites', inviteCode), {
            householdId,
            createdAt: serverTimestamp(),
            createdBy: auth.currentUser.uid,
        }, { merge: true });

        return inviteCode;
    } catch (error) {
        console.error('Error creating invite code:', error);
        throw error;
    }
};

// Get invite code for a household (creates if doesn't exist)
export const getInviteCode = async (householdId: string): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        // Check if household already has an invite code
        const householdDoc = await getDoc(doc(db, 'households', householdId));
        if (!householdDoc.exists()) {
            throw new Error('Домаћинство не постоји');
        }

        const householdData = householdDoc.data();
        
        // If household has an invite code stored, return it
        if (householdData.inviteCode) {
            return householdData.inviteCode;
        }

        // Otherwise, create a new one
        const inviteCode = await createInviteCode(householdId);
        
        // Store it in the household document for easy retrieval
        await updateDoc(doc(db, 'households', householdId), {
            inviteCode,
        });

        return inviteCode;
    } catch (error) {
        console.error('Error getting invite code:', error);
        throw error;
    }
};