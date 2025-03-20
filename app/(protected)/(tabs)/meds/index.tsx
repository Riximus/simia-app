import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@/components/ui/icon';
import MedsCard from '@/components/meds-card';
import { baseStyles } from "@/styles/base";

import {
    loadMedications,
    isMedScheduledForDate,
    computeDoseScheduleForDate,
    handleTake,
    handleSkip,
    handleUndo,
    initializeMedicationHistory,
    formatDate,
    Medication,
} from '@/services/medicationsService';

export default function Tab() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Determine if selected date is today and compute day difference.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const editable = today.getTime() === selected.getTime();
    const dayDiff = Math.round((selected.getTime() - today.getTime()) / (1000 * 3600 * 24));

    // Load and compute medications data for the selected day.
    const loadData = async () => {
        const meds = await loadMedications();
        const medsForDate = meds
            .filter(med => isMedScheduledForDate(med, selectedDate))
            .map(med => ({
                ...med,
                schedule: computeDoseScheduleForDate(med, selectedDate),
            }));
        setMedications(medsForDate);
    };

    // Initialize persistent history on mount.
    useEffect(() => {
        initializeMedicationHistory().then(() => {
            loadData();
        });
    }, [selectedDate]);

    // Update every minute for near real-time badge updates.
    useEffect(() => {
        const intervalId = setInterval(() => {
            setMedications(prevMeds =>
                prevMeds.map(med => ({
                    ...med,
                    schedule: computeDoseScheduleForDate(med, selectedDate),
                }))
            );
        }, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [selectedDate]);

    const onTake = async (med: Medication, scheduledTime: Date) => {
        if (editable) {
            await handleTake(med, scheduledTime);
            loadData();
        }
    };
    const onSkip = async (med: Medication, scheduledTime: Date) => {
        if (editable) {
            await handleSkip(med, scheduledTime);
            loadData();
        }
    };
    const onUndo = async (med: Medication, scheduledTime: Date) => {
        if (editable) {
            await handleUndo(med, scheduledTime);
            loadData();
        }
    };

    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate()
        );
    };

    return (
        <View className={"mt-4 mx-2"}>
            <VStack space={"lg"}>
                {/* Calendar View */}
                <HStack className="flex justify-between">
                    <Button size={'xl'} className={'rounded-full p-3.5'} variant={'outline'} onPress={goToPreviousDay}>
                        <ButtonIcon as={ChevronLeftIcon} />
                    </Button>
                    <Button
                        size={'xl'}
                        variant={isToday(selectedDate) ? 'solid' : 'outline'}
                        className={'rounded-xl'}
                        onPress={() => setSelectedDate(new Date())} // reset to today
                    >
                        <ButtonIcon as={CalendarDaysIcon} />
                        <ButtonText>{formatDate(selectedDate)}</ButtonText>
                    </Button>
                    <Button size={'xl'} className={'rounded-full p-3.5'} variant={'outline'} onPress={goToNextDay}>
                        <ButtonIcon as={ChevronRightIcon} />
                    </Button>
                </HStack>

                {/* Medication Cards */}
                <ScrollView style={styles.scrollView}>
                    <VStack space={"md"}>
                        {medications.map(med => (
                            <MedsCard
                                key={med.id}
                                medication={med}
                                onTake={onTake}
                                onSkip={onSkip}
                                onUndo={onUndo}
                                editable={editable}
                                dayDiff={dayDiff}
                            />
                        ))}
                    </VStack>
                </ScrollView>
            </VStack>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 120,
        borderRadius: 8,
    },
});
