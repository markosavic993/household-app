import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    completed: boolean;
    addedBy: string;
    createdAt: any;
    updatedAt: any;
}

export const getShoppingListRef = (householdId: string, listId: string = 'default') => {
    return collection(db, 'households', householdId, 'shoppingLists', listId, 'items');
};

export const subscribeToShoppingList = (
    householdId: string,
    listId: string = 'default',
    callback: (items: ShoppingItem[]) => void,
    onError?: (error: Error) => void
) => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    const itemsRef = getShoppingListRef(householdId, listId);
    const q = query(itemsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
        q,
        (snapshot) => {
            const items: ShoppingItem[] = [];
            snapshot.forEach((doc) => {
                items.push({
                    id: doc.id,
                    ...doc.data()
                } as ShoppingItem);
            });
            callback(items);
        },
        (error) => {
            console.error('Error subscribing to shopping list:', error);
            if (onError) onError(error);
        }
    );
};

export const addShoppingItem = async (
    householdId: string,
    name: string,
    quantity: number,
    listId: string = 'default'
): Promise<string> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        const itemsRef = getShoppingListRef(householdId, listId);
        const itemData: Omit<ShoppingItem, 'id'> = {
            name,
            quantity,
            completed: false,
            addedBy: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(itemsRef, itemData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding shopping item:', error);
        throw error;
    }
};

export const toggleShoppingItem = async (
    householdId: string,
    itemId: string,
    completed: boolean,
    listId: string = 'default'
): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        const itemRef = doc(db, 'households', householdId, 'shoppingLists', listId, 'items', itemId);
        await updateDoc(itemRef, {
            completed,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error toggling shopping item:', error);
        throw error;
    }
};

export const deleteShoppingItem = async (
    householdId: string,
    itemId: string,
    listId: string = 'default'
): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        const itemRef = doc(db, 'households', householdId, 'shoppingLists', listId, 'items', itemId);
        await deleteDoc(itemRef);
    } catch (error) {
        console.error('Error deleting shopping item:', error);
        throw error;
    }
};

export const updateShoppingItem = async (
    householdId: string,
    itemId: string,
    updates: Partial<Pick<ShoppingItem, 'name' | 'quantity'>>,
    listId: string = 'default'
): Promise<void> => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
        const itemRef = doc(db, 'households', householdId, 'shoppingLists', listId, 'items', itemId);
        await updateDoc(itemRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating shopping item:', error);
        throw error;
    }
};
