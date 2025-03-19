import { Tabs } from 'expo-router';
import {FontAwesome5, FontAwesome6} from "@expo/vector-icons";
import {Icon} from "@/components/ui/icon";
import {Boxes, ListTodo, PlusCircleIcon} from "lucide-react-native";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'red' }}>
            <Tabs.Screen
                name="meds/index"
                options={{
                    title: 'Medications',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={18} name="pills" color={color} />,
                }}
            />
            <Tabs.Screen
                name="stock/index"
                options={{
                    title: 'Stock',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color }) => <Icon size={'xl'} as={Boxes} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add-medication/index"
                options={{
                    title: 'Add Medication',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color }) => <Icon size={'xl'} as={PlusCircleIcon} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    headerTitleAlign: 'center',
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={18} name="cog" color={color} />,
                }}
            />
        </Tabs>
    );
}
