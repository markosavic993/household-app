import ShoppingListItem from "@/components/ShoppingListItem";
import { useHousehold } from "@/context/HouseholdContext";
import {
  addShoppingItem,
  deleteShoppingItem,
  ShoppingItem,
  subscribeToShoppingList,
  toggleShoppingItem,
} from "@/services/shoppingListService";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ShoppingListScreen() {
  const { selectedHouseholdId } = useHousehold();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!selectedHouseholdId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToShoppingList(
      selectedHouseholdId,
      "default",
      (fetchedItems) => {
        setItems(fetchedItems);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError("Грешка при учитавању");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [selectedHouseholdId]);

  const toggleItem = async (id: string) => {
    if (!selectedHouseholdId) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      await toggleShoppingItem(selectedHouseholdId, id, !item.completed);
    } catch (err) {
      console.error("Error toggling item:", err);
    }
  };

  const deleteItem = async (id: string) => {
    if (!selectedHouseholdId) return;

    try {
      await deleteShoppingItem(selectedHouseholdId, id);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const addItem = async () => {
    if (!selectedHouseholdId) return;
    if (newItemName.trim() === "") return;

    setAdding(true);
    try {
      await addShoppingItem(selectedHouseholdId, newItemName, newItemQuantity);
      setNewItemName("");
      setNewItemQuantity(1);
    } catch (err) {
      console.error("Error adding item:", err);
    } finally {
      setAdding(false);
    }
  };

  if (!selectedHouseholdId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Изаберите домаћинство</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "height" : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0}
    >
      <Text style={styles.title}>🛒 Списак за куповину</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ShoppingListItem
              item={item}
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Нема ставки. Додајте нову!</Text>
          }
        />
      )}

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          placeholder="Додај нову ставку..."
          placeholderTextColor="#f2f2f2"
          value={newItemName}
          onChangeText={setNewItemName}
          editable={!adding}
        />
        <TextInput
          style={styles.numericInput}
          placeholder="Кол."
          placeholderTextColor="#f2f2f2"
          keyboardType="numeric"
          value={String(newItemQuantity)}
          onChangeText={(text) => setNewItemQuantity(Number(text) || 1)}
          editable={!adding}
        />
        <Pressable
          onPress={addItem}
          style={[styles.addButton, adding && styles.addButtonDisabled]}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Додај</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#f2f2f2",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 3,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    color: "#f2f2f2",
  },
  numericInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    color: "#f2f2f2",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
