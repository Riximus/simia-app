import { View, StyleSheet, ScrollView } from 'react-native';
import StockCard, { StockCardProps } from "@/components/stock-card";
import { VStack } from "@/components/ui/vstack";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router"; // or from "@react-navigation/native" if applicable

interface Medication {
    id: string;
    medicationName: string;
    dosage: string;
    description: string;
    medicationType: string;
    currentQuantity: string;
    packageQuantity: string;
    doseAmount: number;
    timesPerDay: number;
    doseTimes: string[];
    mealRelation: string;
    interval: string;
    intervalDays: number[]; // for custom intervals
    startDate: string;
    labelColor: string;
}

// Helper: convert standard interval string to number of days
function getIntervalDays(interval: string): number {
    switch (interval) {
        case 'daily': return 1;
        case 'twoDays': return 2;
        case 'threeDays': return 3;
        case 'weekly': return 7;
        case 'monthly': return 30;
        default: return 1;
    }
}

// For non-custom intervals
function computeRunOutDateStandard(
    startDate: string,
    currentQuantity: number,
    doseAmount: number,
    timesPerDay: number,
    interval: string
): Date {
    const freqDays = getIntervalDays(interval);
    const pillsPerIntake = doseAmount * timesPerDay;
    const scheduledDays = Math.floor(currentQuantity / pillsPerIntake);
    const runOut = new Date(startDate);
    if (scheduledDays > 0) {
        runOut.setDate(runOut.getDate() + (scheduledDays - 1) * freqDays);
    }
    return runOut;
}

// For custom intervals: simulate consumption day by day using custom days (1 = Monday, …, 7 = Sunday)
function computeRunOutDateCustom(
    startDate: string,
    currentQuantity: number,
    doseAmount: number,
    timesPerDay: number,
    customDays: number[]
): Date {
    let remaining = currentQuantity;
    let currentDate = new Date(startDate);
    const dailyDose = doseAmount * timesPerDay;
    while (remaining > 0) {
        // Map JS getDay() (0 = Sunday) so Sunday becomes 7.
        const currentWeekday = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
        if (customDays.includes(currentWeekday)) {
            remaining -= dailyDose;
            if (remaining <= 0) break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return currentDate;
}

export default function Tab() {
    const [medications, setMedications] = useState<Medication[]>([]);

    const refreshMedications = async () => {
        try {
            const storedMedications = await AsyncStorage.getItem('medications');
            if (storedMedications) {
                setMedications(JSON.parse(storedMedications));
            } else {
                setMedications([]);
            }
        } catch (error) {
            console.error("Error loading medications:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const loadMedications = async () => {
                try {
                    const storedMedications = await AsyncStorage.getItem('medications');
                    if (storedMedications) {
                        setMedications(JSON.parse(storedMedications));
                    } else {
                        setMedications([]);
                    }
                } catch (error) {
                    console.error("Error loading medications:", error);
                }
            };
            loadMedications();
        }, [])
    );

    // Deletion logic remains as before.
    const handleDeleteMedication = async (id: string) => {
        try {
            const newMedications = medications.filter(med => med.id !== id);
            setMedications(newMedications);
            await AsyncStorage.setItem('medications', JSON.stringify(newMedications));
        } catch (error) {
            console.error("Error deleting medication:", error);
        }
    };

    // Compute and sort medications by run-out date (closest first)
    const sortedMedications = medications.slice().sort((a, b) => {
        // Parse current quantities as numbers
        const currentA = parseInt(a.currentQuantity, 10);
        const currentB = parseInt(b.currentQuantity, 10);
        const runOutA = a.interval === 'custom' && a.intervalDays && a.intervalDays.length > 0
            ? computeRunOutDateCustom(a.startDate, currentA, a.doseAmount, a.timesPerDay, a.intervalDays)
            : computeRunOutDateStandard(a.startDate, currentA, a.doseAmount, a.timesPerDay, a.interval);
        const runOutB = b.interval === 'custom' && b.intervalDays && b.intervalDays.length > 0
            ? computeRunOutDateCustom(b.startDate, currentB, b.doseAmount, b.timesPerDay, b.intervalDays)
            : computeRunOutDateStandard(b.startDate, currentB, b.doseAmount, b.timesPerDay, b.interval);
        return runOutA.getTime() - runOutB.getTime();
    });

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <VStack space={"md"}>
                    {sortedMedications.map((med) => {
                        const cardProps: StockCardProps = {
                            id: med.id,
                            medicationName: med.medicationName,
                            medicationType: med.medicationType,
                            currentQuantity: med.currentQuantity,
                            packageQuantity: med.packageQuantity,
                            doseAmount: med.doseAmount,
                            timesPerDay: med.timesPerDay,
                            interval: med.interval,
                            startDate: med.startDate,
                            description: med.description,
                            labelColor: med.labelColor,
                            customDays: med.interval === 'custom' ? med.intervalDays : undefined,
                            onDelete: handleDeleteMedication,
                            onRestock: refreshMedications
                        };
                        return <StockCard key={med.id} {...cardProps} />;
                    })}
                </VStack>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8
    },
    scrollView: {
        borderRadius: 8
    }
});
