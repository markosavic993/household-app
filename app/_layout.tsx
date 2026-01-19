import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfie";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inHouseholdSetup = segments[0] === 'household-setup';

    if (!user && inAuthGroup) {
      // Not authenticated, redirect to sign-in
      router.replace('/sign-in');
    } else if (user && !inAuthGroup && !inHouseholdSetup) {
      // User is authenticated, check if they have households
      if (profile && profile.householdIds && profile.householdIds.length > 0) {
        // Has households, go to tabs
        router.replace('/(tabs)');
      } else {
        // No households, go to setup
        router.replace('/household-setup');
      }
    } else if (user && inHouseholdSetup && profile?.householdIds && profile.householdIds.length > 0) {
      // User completed household setup, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, authLoading, profile, profileLoading, segments, router]);

  if (authLoading || profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#25292e' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="household-setup" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
