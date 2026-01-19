import { useHousehold } from "@/context/HouseholdContext";
import { getUserHouseholds, Household } from "@/services/householdService";
import { useUserProfile } from "@/hooks/useUserProfie";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { selectedHouseholdId, clearSelectedHousehold } = useHousehold();
  const { profile } = useUserProfile();
  const [currentHousehold, setCurrentHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentHousehold = async () => {
      if (!selectedHouseholdId || !profile?.householdIds) {
        setLoading(false);
        return;
      }

      try {
        const households = await getUserHouseholds([selectedHouseholdId]);
        if (households.length > 0) {
          setCurrentHousehold(households[0]);
        }
      } catch (err) {
        console.error('Error fetching current household:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentHousehold();
  }, [selectedHouseholdId, profile]);

  const handleSwitchHousehold = async () => {
    await clearSelectedHousehold();
    router.replace('/household-setup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добродошли у нашу апликацију!</Text>
      
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : currentHousehold ? (
        <View style={styles.householdInfo}>
          <Text style={styles.householdLabel}>Тренутно домаћинство:</Text>
          <Text style={styles.householdName}>🏠 {currentHousehold.name}</Text>
        </View>
      ) : null}

      <Link href="/shoppingList" style={styles.link}>Списак за куповину</Link>

      <Pressable onPress={handleSwitchHousehold} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>Промени домаћинство</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  householdInfo: {
    backgroundColor: '#464C55',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  householdLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  householdName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#ffd33d',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  switchButton: {
    backgroundColor: '#464C55',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  switchButtonText: {
    color: '#ffd33d',
    fontSize: 16,
    fontWeight: '600',
  },
});
