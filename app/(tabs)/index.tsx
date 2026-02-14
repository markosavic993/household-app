import { useHousehold } from "@/context/HouseholdContext";
import { getInviteCode, getUserHouseholds, Household } from "@/services/householdService";
import { useUserProfile } from "@/hooks/useUserProfie";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { selectedHouseholdId, clearSelectedHousehold } = useHousehold();
  const { profile } = useUserProfile();
  const [currentHousehold, setCurrentHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);

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

  const handleGetInviteCode = async () => {
    if (!selectedHouseholdId) return;

    setLoadingInvite(true);
    try {
      const code = await getInviteCode(selectedHouseholdId);
      setInviteCode(code);
    } catch (err: any) {
      Alert.alert('Грешка', err.message || 'Није могуће добити код позивнице');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleShareInviteCode = async () => {
    if (!inviteCode || !currentHousehold) return;

    try {
      await Share.share({
        message: `Придружите се домаћинству "${currentHousehold.name}"!\n\nКод позивнице: ${inviteCode}\n\nУнесите овај код у апликацију да се придружите.`,
        title: 'Позовите у домаћинство',
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
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
          <Text style={styles.membersCount}>
            {currentHousehold.members.length} {currentHousehold.members.length === 1 ? 'члан' : 'чланова'}
          </Text>
        </View>
      ) : null}

      <Link href="/shoppingList" style={styles.link}>Списак за куповину</Link>

      {selectedHouseholdId && (
        <View style={styles.inviteSection}>
          {inviteCode ? (
            <>
              <View style={styles.inviteCodeBox}>
                <Text style={styles.inviteCodeLabel}>Код позивнице:</Text>
                <Text style={styles.inviteCodeText}>{inviteCode}</Text>
              </View>
              <Pressable onPress={handleShareInviteCode} style={styles.shareButton}>
                <Text style={styles.shareButtonText}>📤 Подели код</Text>
              </Pressable>
            </>
          ) : (
            <Pressable 
              onPress={handleGetInviteCode} 
              style={[styles.inviteButton, loadingInvite && styles.buttonDisabled]}
              disabled={loadingInvite}>
              {loadingInvite ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.inviteButtonText}>➕ Позови чланове</Text>
              )}
            </Pressable>
          )}
        </View>
      )}

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
    minWidth: 250,
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
    marginBottom: 4,
  },
  membersCount: {
    color: '#999',
    fontSize: 14,
  },
  link: {
    color: '#ffd33d',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  inviteSection: {
    marginVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteCodeBox: {
    backgroundColor: '#464C55',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ffd33d',
    minWidth: 200,
  },
  inviteCodeLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  inviteCodeText: {
    color: '#ffd33d',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  shareButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
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
