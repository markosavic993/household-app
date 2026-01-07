import { ShoppingItem } from "@/types/ShoppingItem";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: '1', name: 'Mleko', quantity: 1, completed: false },
  { id: '2', name: 'Hleb', quantity: 2, completed: true },
  { id: '3', name: 'Jaja', quantity: 12, completed: false },
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Списак за куповину</Text>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text
              style={[
                styles.itemText,
                item.completed && styles.completed,
              ]}
            >
              {item.quantity} x {item.name}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#f2f2f2',
  },
  item: {
    padding: 12,
    backgroundColor: '#25292e',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#f2f2f2',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#f2f2f2',
  },
});