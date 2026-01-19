import { AuthProvider, useAuth } from "@/context/AuthContext";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { useUserProfile } from "@/hooks/useUserProfie";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { selectedHouseholdId, loading: householdLoading } = useHousehold();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading || householdLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inHouseholdSetup = segments[0] === 'household-setup';

    if (!user && (inAuthGroup || inHouseholdSetup)) {
      // Not authenticated, redirect to sign-in
      router.replace('/sign-in');
    } else if (user && !inAuthGroup && !inHouseholdSetup) {
      // User is authenticated, always show household setup first
      router.replace('/household-setup');
    } else if (user && inAuthGroup && !selectedHouseholdId) {
      // User is in tabs but no household selected, go back to setup
      router.replace('/household-setup');
    }
  }, [user, authLoading, profile, profileLoading, selectedHouseholdId, householdLoading, segments, router]);

  if (authLoading || profileLoading || householdLoading) {
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
      <HouseholdProvider>
        <RootLayoutNav />
      </HouseholdProvider>
    </AuthProvider>
  );
}
