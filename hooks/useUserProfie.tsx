import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';

type UserProfile = {
    householdIds: string[];
};

export function useUserProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const ref = doc(db, 'users', user.uid);

        const unsub = onSnapshot(
            ref,
            (snap) => {
                if (snap.exists()) {
                    setProfile(snap.data() as UserProfile);
                } else {
                    setProfile(null);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error fetching user profile:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [user]);

    return { profile, loading, error };
}
