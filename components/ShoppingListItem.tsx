import { useUserName } from "@/hooks/useUserName";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  addedBy?: string;
  createdAt?: any;
  updatedAt?: any;
};

type Props = {
  item: ShoppingItem,
  onToggle: (id: string) => void,
  onDelete: (id: string) => void,
};

export default function ShoppingListItem({ item, onToggle, onDelete }: Props) {
  const { userName, loading } = useUserName(item.addedBy);

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
        {item.addedBy && !loading && (
          <Text style={styles.addedByText}>
            Додао: {userName || 'Непознат'}
          </Text>
        )}
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
    marginBottom: 4,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addedByText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
});
