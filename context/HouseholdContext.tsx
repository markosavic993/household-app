import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

type HouseholdContextType = {
    selectedHouseholdId: string | null;
    setSelectedHouseholdId: (id: string) => Promise<void>;
    clearSelectedHousehold: () => Promise<void>;
    loading: boolean;
};

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

const STORAGE_KEY = '@selected_household_id';

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
    const [selectedHouseholdId, setSelectedHouseholdIdState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSelectedHousehold();
    }, []);

    const loadSelectedHousehold = async () => {
        try {
            const storedId = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedId) {
                setSelectedHouseholdIdState(storedId);
            }
        } catch (error) {
            console.error('Error loading selected household:', error);
        } finally {
            setLoading(false);
        }
    };

    const setSelectedHouseholdId = async (id: string) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, id);
            setSelectedHouseholdIdState(id);
        } catch (error) {
            console.error('Error saving selected household:', error);
        }
    };

    const clearSelectedHousehold = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setSelectedHouseholdIdState(null);
        } catch (error) {
            console.error('Error clearing selected household:', error);
        }
    };

    return (
        <HouseholdContext.Provider 
            value={{ 
                selectedHouseholdId, 
                setSelectedHouseholdId, 
                clearSelectedHousehold,
                loading 
            }}>
            {children}
        </HouseholdContext.Provider>
    );
}

export function useHousehold() {
    const context = useContext(HouseholdContext);
    if (!context) {
        throw new Error('useHousehold must be used within HouseholdProvider');
    }
    return context;
}
