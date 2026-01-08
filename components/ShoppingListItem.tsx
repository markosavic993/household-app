import { ShoppingItem } from "@/types/ShoppingItem";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: ShoppingItem,
  onToggle: (id: string) => void,
  onDelete: (id: string) => void,
};

export default function ShoppingListItem({ item, onToggle, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onToggle(item.id)}
        style={styles.textWrapper}>
        <Text
          style={[
            styles.text,
            item.completed && styles.completed,
          ]}
        >
          {item.quantity} x {item.name}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}>
        <Text>🗑️</Text>
      </Pressable>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#25292e',
    borderRadius: 8,
    marginBottom: 8,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#f2f2f2',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#f2f2f2',
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
});
