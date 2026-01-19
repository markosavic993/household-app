import { useAuth } from "@/context/AuthContext";
import { createHousehold } from "@/services/householdService";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function HouseholdSetupScreen() {
    const { user } = useAuth();
    const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
    const [householdName, setHouseholdName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateHousehold = async () => {
        if (!user) return;
        if (householdName.trim() === '') {
            setError('Унесите назив домаћинства');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createHousehold(householdName, user.uid);
            // Navigation will happen automatically via _layout.tsx watching profile changes
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
            // TODO: Implement join functionality
            setError('Функционалност придруживања још није имплементирана');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'select') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Добродошли!</Text>
                <Text style={styles.subtitle}>Изаберите опцију за почетак</Text>

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
            </View>
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
        justifyContent: 'center',
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
