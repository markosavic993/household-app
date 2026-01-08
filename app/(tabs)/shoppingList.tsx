import ShoppingListItem from "@/components/ShoppingListItem";
import { ShoppingItem } from "@/types/ShoppingItem";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: '1', name: 'Mleko', quantity: 1, completed: false },
  { id: '2', name: 'Hleb', quantity: 2, completed: true },
  { id: '3', name: 'Jaja', quantity: 12, completed: false },
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1);

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

  const addItem = () => {
    if (newItemName.trim() === '') return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: newItemQuantity,
      completed: false,
    };
    setItems(prevItems => [newItem, ...prevItems]);
    setNewItemName('');
    setNewItemQuantity(1);
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}>

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

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          placeholder="Додај нову ставку..."
          placeholderTextColor="#f2f2f2"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TextInput
          style={styles.numericInput}
          placeholder="Kоличинa?"
          placeholderTextColor="#f2f2f2"
          keyboardType="numeric"
          value={String(newItemQuantity)}
          onChangeText={text => setNewItemQuantity(Number(text))}
        />
        <Pressable onPress={addItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Додај</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    color: '#f2f2f2'
  },
  numericInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    color: '#f2f2f2',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});