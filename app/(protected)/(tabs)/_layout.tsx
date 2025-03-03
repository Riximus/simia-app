import { Tabs } from 'expo-router';
import {FontAwesome5, FontAwesome6} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'red' }}>
            <Tabs.Screen
                name="meds/index"
                options={{
                    title: 'Medications',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="pills" color={color} />,
                }}
            />
            <Tabs.Screen
                name="stock/index"
                options={{
                    title: 'Stock',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="boxes-stacked" color={color} />,
                }}
            />
            <Tabs.Screen
                name="todos/index"
                options={{
                    title: 'Todos',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="pen-to-square" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="cog" color={color} />,
                }}
            />
        </Tabs>
    );
}
