import ShoppingListItem from "@/components/ShoppingListItem";
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
  const toggleItem = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }
  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Списак за куповину</Text>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ShoppingListItem 
          item={item} 
          onToggle={toggleItem}
          onDelete={deleteItem}
          />
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
});