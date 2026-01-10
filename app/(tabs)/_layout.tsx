import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
            headerStyle: {
                backgroundColor: '#25292e',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
                backgroundColor: '#25292e',
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Почетна",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home-sharp" : "home-outline"} size={24} color={color} />
                    )
                }} />
            <Tabs.Screen
                name="shoppingList"
                options={{
                    title: "Списак за куповину",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "list-sharp" : "list-outline"} size={24} color={color} />
                    )
                }} />
            <Tabs.Screen
                name="stickerSmash"
                options={{
                    title: "Уређивање слике",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "image-sharp" : "image-outline"} size={24} color={color} />
                    )
                }} />
        </Tabs>
    );
}
