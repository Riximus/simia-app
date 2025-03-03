import { Tabs } from 'expo-router';
import {FontAwesome5, FontAwesome6} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'red' }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="meds/index"
                options={{
                    title: 'Medications',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="pills" color={color} />,
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
