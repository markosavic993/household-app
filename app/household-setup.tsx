import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/context/HouseholdContext";
import { useUserProfile } from "@/hooks/useUserProfie";
import { createHousehold, getUserHouseholds, Household, joinHousehold } from "@/services/householdService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function HouseholdSetupScreen() {
    const { user } = useAuth();
    const { profile } = useUserProfile();
    const { setSelectedHouseholdId } = useHousehold();
    const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
    const [householdName, setHouseholdName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [households, setHouseholds] = useState<Household[]>([]);
    const [loadingHouseholds, setLoadingHouseholds] = useState(true);

    useEffect(() => {
        const fetchHouseholds = async () => {
            if (!profile?.householdIds || profile.householdIds.length === 0) {
                setLoadingHouseholds(false);
                return;
            }

            try {
                const fetchedHouseholds = await getUserHouseholds(profile.householdIds);
                setHouseholds(fetchedHouseholds);
            } catch (err) {
                console.error('Error fetching households:', err);
            } finally {
                setLoadingHouseholds(false);
            }
        };

        fetchHouseholds();
    }, [profile]);

    const handleSelectHousehold = async (householdId: string) => {
        await setSelectedHouseholdId(householdId);
        router.replace('/(tabs)');
    };

    const handleCreateHousehold = async () => {
        if (!user) return;
        if (householdName.trim() === '') {
            setError('Унесите назив домаћинства');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newHouseholdId = await createHousehold(householdName, user.uid);
            await setSelectedHouseholdId(newHouseholdId);
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinHousehold = async () => {
        if (!user) return;
        if (inviteCode.trim() === '') {
            setError('Унесите код за позивницу');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const householdId = await joinHousehold(inviteCode, user.uid);
            await setSelectedHouseholdId(householdId);
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'select') {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Добродошли!</Text>
                <Text style={styles.subtitle}>
                    {households.length > 0 
                        ? 'Изаберите домаћинство или направите ново'
                        : 'Изаберите опцију за почетак'}
                </Text>

                {loadingHouseholds ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <>
                        {households.length > 0 && (
                            <View style={styles.householdsSection}>
                                <Text style={styles.sectionTitle}>Моја домаћинства</Text>
                                {households.map((household) => (
                                    <Pressable
                                        key={household.id}
                                        style={styles.householdItem}
                                        onPress={() => handleSelectHousehold(household.id)}>
                                        <View style={styles.householdInfo}>
                                            <Text style={styles.householdIcon}>🏠</Text>
                                            <View style={styles.householdDetails}>
                                                <Text style={styles.householdName}>{household.name}</Text>
                                                <Text style={styles.householdMeta}>
                                                    {household.members.length} {household.members.length === 1 ? 'члан' : 'чланова'}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.arrowIcon}>→</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>
                            {households.length > 0 ? 'Или креирајте ново' : 'Изаберите опцију'}
                        </Text>

                        <View style={styles.optionsContainer}>
                            <Pressable
                                style={styles.optionButton}
                                onPress={() => setMode('create')}>
                                <Text style={styles.optionIcon}>🏠</Text>
                                <Text style={styles.optionTitle}>Направи домаћинство</Text>
                                <Text style={styles.optionDescription}>
                                    Креирајте ново домаћинство и позовите чланове
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.optionButton}
                                onPress={() => setMode('join')}>
                                <Text style={styles.optionIcon}>🔗</Text>
                                <Text style={styles.optionTitle}>Придружи се домаћинству</Text>
                                <Text style={styles.optionDescription}>
                                    Унесите код позивнице да се придружите
                                </Text>
                            </Pressable>
                        </View>
                    </>
                )}
            </ScrollView>
        );
    }

    if (mode === 'create') {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>

                <Pressable onPress={() => setMode('select')} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Назад</Text>
                </Pressable>

                <Text style={styles.title}>Направи домаћинство</Text>
                <Text style={styles.subtitle}>Унесите назив вашег домаћинства</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Назив домаћинства"
                    placeholderTextColor="#999"
                    value={householdName}
                    onChangeText={setHouseholdName}
                    autoFocus
                />

                {error && <Text style={styles.error}>{error}</Text>}

                <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleCreateHousehold}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Направи</Text>
                    )}
                </Pressable>
            </KeyboardAvoidingView>
        );
    }

    if (mode === 'join') {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>

                <Pressable onPress={() => setMode('select')} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Назад</Text>
                </Pressable>

                <Text style={styles.title}>Придружи се домаћинству</Text>
                <Text style={styles.subtitle}>Унесите код позивнице</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Код позивнице"
                    placeholderTextColor="#999"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    autoCapitalize="characters"
                    autoFocus
                />

                {error && <Text style={styles.error}>{error}</Text>}

                <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleJoinHousehold}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Придружи се</Text>
                    )}
                </Pressable>
            </KeyboardAvoidingView>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 24,
    },
    scrollContent: {
        paddingVertical: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
        marginBottom: 32,
        textAlign: 'center',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    householdsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 16,
        marginTop: 8,
    },
    householdItem: {
        backgroundColor: '#464C55',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    householdInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    householdIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    householdDetails: {
        flex: 1,
    },
    householdName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    householdMeta: {
        fontSize: 14,
        color: '#999',
    },
    arrowIcon: {
        fontSize: 24,
        color: '#ffd33d',
    },
    optionsContainer: {
        gap: 16,
    },
    optionButton: {
        backgroundColor: '#464C55',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    optionIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    optionDescription: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    backButtonText: {
        color: '#ffd33d',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#464C55',
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    error: {
        color: '#ff6b6b',
        marginBottom: 12,
        textAlign: 'center',
    },
});
