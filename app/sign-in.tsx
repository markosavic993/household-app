import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput } from "react-native";


export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        setError(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // Navigation will happen automatically via AuthContext
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>

            <Text style={styles.title}>
                {isLogin ? 'Пријава' : 'Регистрација'}
            </Text>

            <TextInput
                placeholder="Мејл адреса"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Лозинка"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>
                    {isLogin ? 'Пријави се' : 'Региструј се'}
                </Text>
            </Pressable>

            <Pressable onPress={() => setIsLogin((prev) => !prev)}>
                <Text style={styles.toggleText}>
                    {isLogin
                        ? 'Немаш налог? Региструј се'
                        : 'Имаш налог? Пријави се'}
                </Text>
            </Pressable>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    toggleText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#555',
    },
    error: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
});
