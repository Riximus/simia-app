import { Text } from '@/components/ui/text';
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { StyleSheet } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
    BoxIcon,
    CalendarClockIcon,
    HourglassIcon, Pencil, PillBottleIcon, Plus,
    Trash2,
    TriangleAlertIcon
} from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { baseStyles } from "@/styles/base";
import { VStack } from "@/components/ui/vstack";
import Grid from "@/components/custom/grid";
import { Badge, BadgeIcon, BadgeText } from "@/components/custom/badge";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@/components/ui/modal";
import { useState, useEffect } from "react";
import { Divider } from "@/components/ui/divider";
import { CheckboxGroup } from "@/components/custom/checkbox";
import { Radio, RadioGroup, RadioIndicator, RadioLabel } from "@/components/custom/radio";
import { NumberInput } from "@/components/number-input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

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

export interface StockCardProps {
    id: string;
    medicationName: string;
    medicationType: string;
    currentQuantity: string; // stored as string; will parse to a number
    packageQuantity: string; // stored as string; will parse to a number
    doseAmount: number;
    timesPerDay: number;
    interval: string;
    startDate: string; // date string parseable by Date()
    description: string;
    labelColor: string;
    customDays?: number[]; // used if interval === 'custom'
    onDelete?: (id: string) => void;
    onRestock?: () => void;
}

export default function StockCard(props: StockCardProps) {
    const {
        id,
        medicationName,
        medicationType,
        currentQuantity,
        packageQuantity,
        doseAmount,
        timesPerDay,
        interval,
        startDate,
        description,
        labelColor,
        customDays,
        onDelete,
        onRestock
    } = props;

    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [restockRadio, setRestockRadio] = useState('package');
    const [restockAmount, setRestockAmount] = useState(1);

    // When the restock modal opens, reset the restock amount.
    useEffect(() => {
        if (showRestockModal) {
            setRestockAmount(1);
            setRestockRadio('package');
        }
    }, [showRestockModal]);

    // Parse current quantity as a number.
    const curQty = parseInt(currentQuantity, 10);
    let runOutDateObj: Date;
    if (interval === 'custom' && customDays && customDays.length > 0) {
        runOutDateObj = computeRunOutDateCustom(startDate, curQty, doseAmount, timesPerDay, customDays);
    } else {
        runOutDateObj = computeRunOutDateStandard(startDate, curQty, doseAmount, timesPerDay, interval);
    }

    const today = new Date();
    const options: Intl.DateTimeFormatOptions =
        runOutDateObj.getFullYear() === today.getFullYear()
            ? { month: 'short', day: 'numeric' }
            : { month: 'short', day: 'numeric', year: 'numeric' };

    const runOutDateString = runOutDateObj.toLocaleDateString(undefined, options);
    const diffDays = (runOutDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    const runningLow = diffDays <= 7;

    // Map day numbers to abbreviated names.
    const dayMapping: { [key: number]: string } = {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        7: 'Sun'
    };

    const intervalDisplay = interval === 'custom'
        ? (customDays && customDays.length > 0
            ? customDays.sort((a, b) => a - b).map(day => dayMapping[day]).join(', ')
            : 'Custom')
        : interval === 'daily'
            ? 'Daily'
            : interval === 'twoDays'
                ? 'Every 2 Days'
                : interval === 'threeDays'
                    ? 'Every 3 Days'
                    : interval === 'weekly'
                        ? 'Weekly'
                        : interval === 'monthly'
                            ? 'Monthly'
                            : interval;

    // Delete logic
    function handleMedicationDelete() {
        if (onDelete) {
            onDelete(id);
        }
        setShowDeleteModal(false);
    }

    // Restock logic: update the currentQuantity based on the selected mode.
    async function handleRestockConfirm() {
        const current = parseInt(currentQuantity, 10);
        let newQuantity: number;
        if (restockRadio === 'package') {
            const pkgSize = parseInt(packageQuantity, 10);
            newQuantity = current + (restockAmount * pkgSize);
        } else {
            newQuantity = current + restockAmount;
        }
        try {
            const storedMedications = await AsyncStorage.getItem('medications');
            let meds = storedMedications ? JSON.parse(storedMedications) : [];
            meds = meds.map((med: any) => {
                if (med.id === id) {
                    return { ...med, currentQuantity: newQuantity.toString() };
                }
                return med;
            });
            await AsyncStorage.setItem('medications', JSON.stringify(meds));
            console.log("Medication restocked:", id, "New quantity:", newQuantity);
            if (onRestock) {
                onRestock();
            }
        } catch (error) {
            console.error("Error restocking medication:", error);
        }
        setShowRestockModal(false);
    }

    return (
        <Card size={'lg'} className={'gap-4 border'} style={runningLow ? styles.cardWarning : styles.card}>
            <HStack space={'sm'} className={'items-center justify-between'}>
                <HStack space={'sm'} className={'items-center'}>
                    <Heading
                        size={'xl'}
                        className={'shrink max-w-48'}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {medicationName}
                    </Heading>
                    {runningLow && (
                        <Badge size={'lg'} variant={'solid'} action={'warning'}>
                            <BadgeIcon>
                                <Icon as={TriangleAlertIcon} size={'xs'} style={baseStyles.iconOpacity} />
                            </BadgeIcon>
                            <BadgeText>Running low</BadgeText>
                        </Badge>
                    )}
                </HStack>
                <Button variant="link" onPress={() => setShowDeleteModal(true)}>
                    <ButtonIcon as={Trash2} color={'red'} style={baseStyles.iconOpacity} />
                </Button>
                <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <ModalBackdrop />
                    <ModalContent>
                        <ModalHeader>
                            <Heading>Deleting {medicationName}</Heading>
                            <ModalCloseButton>
                                <Icon as={CloseIcon} />
                            </ModalCloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <Text>
                                Are you sure you want to delete {medicationName}? This action cannot be undone.
                            </Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant={'outline'} onPress={() => setShowDeleteModal(false)}>
                                <ButtonText>Cancel</ButtonText>
                            </Button>
                            <Button variant={'solid'} onPress={handleMedicationDelete}>
                                <ButtonText>Delete</ButtonText>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </HStack>
            <Grid columns={2} gap={20}>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={BoxIcon} style={baseStyles.iconOpacity} />
                    <Text bold={true} size={'lg'}>
                        {curQty} {curQty === 1 ? medicationType : medicationType + 's'}
                    </Text>
                </HStack>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={CalendarClockIcon} style={baseStyles.iconOpacity} />
                    <Text bold={true} size={'lg'}>{runOutDateString}</Text>
                </HStack>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={PillBottleIcon} style={baseStyles.iconOpacity} />
                    <Text bold={true} size={'lg'}>{doseAmount} per Dose</Text>
                </HStack>
                <HStack className={'items-center'} space={'xs'}>
                    <Icon size={'sm'} as={HourglassIcon} style={baseStyles.iconOpacity} />
                    <Text bold={true} size={'lg'}>{intervalDisplay}</Text>
                </HStack>
            </Grid>
            {description ? (
                <VStack>
                    <Text bold={true}>Notes</Text>
                    <Text>{description}</Text>
                </VStack>
            ) : null}
            <HStack space={'md'} className={'justify-end mt-3'}>
                <Button
                    variant={'outline'}
                    onPress={() => router.push({
                        pathname: "/(protected)/edit-med/[id]",
                        params: { id },
                    })
                    }
                >
                    <ButtonIcon as={Pencil} />
                    <ButtonText size={'xl'}>Edit</ButtonText>
                </Button>
                <Button onPress={() => setShowRestockModal(true)}>
                    <ButtonIcon as={Plus} />
                    <ButtonText size={'xl'}>Restock</ButtonText>
                </Button>
            </HStack>

            <Modal size={'lg'} isOpen={showRestockModal} onClose={() => setShowRestockModal(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size={'xl'}>Restock {medicationName}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <RadioGroup value={restockRadio} onChange={setRestockRadio}>
                            <HStack space={'md'} className={'items-center'}>
                                <Radio value={'package'}>
                                    <RadioIndicator checked={restockRadio === 'package'} />
                                    <RadioLabel>Package</RadioLabel>
                                </Radio>
                                <Radio value={'quantity'}>
                                    <RadioIndicator checked={restockRadio === 'quantity'} />
                                    <RadioLabel>Quantity</RadioLabel>
                                </Radio>
                            </HStack>
                        </RadioGroup>
                        {restockRadio === 'package' ? (
                            <VStack space={'md'} className={'mt-5'}>
                                <Text size={'xl'}>How many <Text size={'xl'} bold={true}>packages</Text> would you like to add?</Text>
                                <NumberInput
                                    count={restockAmount}
                                    isReadOnly={true}
                                    onPressIncrease={() => setRestockAmount(prev => prev + 1)}
                                    onPressDecrease={() => {
                                        if (restockAmount > 1) {
                                            setRestockAmount(prev => prev - 1);
                                        }
                                    }}
                                />
                            </VStack>
                        ) : (
                            <VStack space={'md'} className={'mt-5'}>
                                <Text size={'xl'}>How many <Text size={'xl'} bold={true}>individual</Text> {medicationType.toLowerCase()}s would you like to add?</Text>
                                <NumberInput
                                    count={restockAmount}
                                    isReadOnly={true}
                                    onPressIncrease={() => setRestockAmount(prev => prev + 1)}
                                    onPressDecrease={() => {
                                        if (restockAmount > 1) {
                                            setRestockAmount(prev => prev - 1);
                                        }
                                    }}
                                />
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter className={'mt-5'}>
                        <Button variant={'outline'} onPress={() => setShowRestockModal(false)}>
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button variant={'solid'} onPress={handleRestockConfirm}>
                            <ButtonText>Restock</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderLeftWidth: 4,
        gap: 20,
        borderColor: '#4caf50'
    },
    cardWarning: {
        borderColor: '#f44336',
        borderLeftWidth: 4
    }
});
