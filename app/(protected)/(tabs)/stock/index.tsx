import { View, Text, StyleSheet } from 'react-native';
import StockCard from "@/components/stock-card";

export default function Tab() {
    return (
        <View className={"mt-2 mx-2"}>
            <StockCard />
        </View>
    );
}
