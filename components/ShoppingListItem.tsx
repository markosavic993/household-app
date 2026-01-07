import { ShoppingItem } from "@/types/ShoppingItem";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    item: ShoppingItem;
};

export default function ShoppingListItem({ item }: Props) {
    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.text,
                    item.completed && styles.completed,
                ]}
            >
                {item.quantity} x {item.name}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#25292e',
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#f2f2f2',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#f2f2f2',
  },
});
