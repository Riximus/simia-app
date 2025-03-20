import React from 'react';
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Badge, BadgeIcon, BadgeText } from "@/components/custom/badge";
import { StyleSheet } from "react-native";
import {
    AlarmClock,
    Clock,
    Utensils,
    Info,
    TriangleAlert,
    SkipForward,
    Undo,
    Check,
    EllipsisVertical,
    BoxIcon,
} from "lucide-react-native";
import { baseStyles } from "@/styles/base";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Medication, Dose, getDisplayInterval, getDisplayMealRelation } from '@/services/medicationsService';

interface MedsCardProps {
    medication: Medication;
    onTake: (med: Medication, scheduledTime: Date) => void;
    onSkip: (med: Medication, scheduledTime: Date) => void;
    onUndo: (med: Medication, scheduledTime: Date) => void;
    editable: boolean;
    dayDiff: number;
}

export default function MedsCard({ medication, onTake, onSkip, onUndo, editable, dayDiff }: MedsCardProps) {
    const now = new Date();

    // Find the next upcoming dose that is strictly pending (not taken, skipped or overdue)
    const upcomingDose = medication.schedule?.find(
        dose => dose.status === 'pending' && (dose.scheduledTime.getTime() - now.getTime() > 0)
    );

    // Show header badge only if the upcoming pending dose is 30 minutes or less away.
    let headerBadgeText = '';
    if (upcomingDose) {
        const diffMinutes = Math.floor((upcomingDose.scheduledTime.getTime() - now.getTime()) / 60000);
        if (diffMinutes <= 30) {
            headerBadgeText = `Next dose in ${diffMinutes}m`;
        }
    }

    return (
        <Card size={"lg"} className={'flex gap-4 border border-gray-400'}>
            {/* Header */}
            <VStack>
                <HStack className={'flex items-center justify-between'}>
                    <HStack space={'sm'} className={'items-center'}>
                        <Heading
                            size={'xl'}
                            className={'shrink max-w-48'}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {medication.medicationName}
                        </Heading>
                        {headerBadgeText !== '' && editable && (
                            <Badge action={'warning'} variant={'solid'} size={'md'}>
                                <BadgeIcon>
                                    <Icon as={TriangleAlert} size={'xs'} style={baseStyles.iconOpacity} />
                                </BadgeIcon>
                                <BadgeText>{headerBadgeText}</BadgeText>
                            </Badge>
                        )}
                    </HStack>
                </HStack>
                <HStack space={'xs'} className={'items-center'} style={baseStyles.textOpacity}>
                    <Text>{medication.medicationType}</Text>
                    <Text>•</Text>
                    <Text>{getDisplayInterval(medication)}</Text>
                    <Text>•</Text>
                    <Text>{`${medication.doseAmount} per dose`}</Text>
                    {medication.dosage?.trim() ? (
                        <>
                            <Text>•</Text>
                            <Text>{medication.dosage}</Text>
                        </>
                    ) : null}
                </HStack>
            </VStack>

            {/* Content */}
            <HStack className={'justify-between'}>
                <HStack space={'xs'} className={'items-center'} style={baseStyles.textOpacity}>
                    <Icon as={AlarmClock} size={'sm'} style={baseStyles.iconOpacity} />
                    {/* Always show the time of the next upcoming dose (skipping overdue ones) */}
                    <Text>{upcomingDose ? upcomingDose.displayTime : '-'}</Text>
                </HStack>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={Utensils} size={'sm'} style={baseStyles.iconOpacity} />
                    <Text>{getDisplayMealRelation(medication.mealRelation)}</Text>
                </HStack>
                <HStack space={'xs'} className={'items-center'}>
                    <Icon as={BoxIcon} size={'sm'} style={baseStyles.iconOpacity} />
                    <Text>{`${medication.currentQuantity} remaining`}</Text>
                </HStack>
            </HStack>

            {/* Notes */}
            {medication.description?.trim() ? (
                <VStack>
                    <Text bold={true}>{'Notes'}</Text>
                    <Text>{medication.description}</Text>
                </VStack>
            ) : null}

            <Divider />

            {/* Doses */}
            <VStack space={'sm'}>
                {medication.schedule?.map((dose: Dose, index: number) => (
                    <HStack key={index} className={'flex flex-row justify-between'} style={styles.padding}>
                        <HStack space={'xs'} className={'items-center'}>
                            <Icon as={dose.icon === 'Clock' ? Clock : AlarmClock} size={'sm'} style={baseStyles.iconOpacity} />
                            <Text>{dose.displayTime}</Text>
                            {dose.badgeText !== '' && (
                                <Badge
                                    size={"sm"}
                                    action={
                                        dose.status === 'overdue'
                                            ? "error"
                                            : dose.status === 'taken'
                                                ? "success"
                                                : dose.status === 'skipped'
                                                    ? "muted"
                                                    : "info"
                                    }
                                >
                                    <BadgeIcon>
                                        <Icon
                                            as={
                                                dose.status === 'overdue'
                                                    ? TriangleAlert
                                                    : dose.status === 'taken'
                                                        ? Check
                                                        : dose.status === 'skipped'
                                                            ? SkipForward
                                                            : Info
                                            }
                                        />
                                    </BadgeIcon>
                                    <BadgeText>{dose.badgeText}</BadgeText>
                                </Badge>
                            )}
                        </HStack>
                        {editable ? (
                            dose.canUndo ? (
                                <Button variant={'link'} onPress={() => onUndo(medication, dose.scheduledTime)}>
                                    <ButtonIcon as={Undo} />
                                    <ButtonText>Undo</ButtonText>
                                </Button>
                            ) : (
                                <HStack space={'md'}>
                                    <Button variant={'outline'} size={'sm'} onPress={() => onSkip(medication, dose.scheduledTime)}>
                                        <ButtonIcon as={SkipForward} />
                                        <ButtonText size={'md'}>Skip</ButtonText>
                                    </Button>
                                    <Button size={'sm'} onPress={() => onTake(medication, dose.scheduledTime)}>
                                        <ButtonIcon as={Check} />
                                        <ButtonText size={'md'}>Take</ButtonText>
                                    </Button>
                                </HStack>
                            )
                        ) : (
                            // If not editable, show a label indicating availability.
                            <Text style={{ fontStyle: 'italic', color: '#777' }}>
                                {dayDiff > 0
                                    ? `Available in ${dayDiff} day${dayDiff > 1 ? 's' : ''}`
                                    : dayDiff < 0
                                        ? 'Past Day'
                                        : ''}
                            </Text>
                        )}
                    </HStack>
                ))}
            </VStack>
        </Card>
    );
}

const styles = StyleSheet.create({
    padding: {
        padding: 4,
    },
});
