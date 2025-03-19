import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "@/components/ui/select";
import {
    ChevronDownIcon,
    CalendarIcon,
    Pencil, ArrowLeftIcon, SaveIcon,
} from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { RadioGroup, Radio, RadioIndicator, RadioLabel } from "@/components/custom/radio";
import { Divider } from "@/components/ui/divider";
import { Checkbox, CheckboxGroup } from "@/components/custom/checkbox";
import { Calendar } from "react-native-calendars";
import { Icon } from "@/components/ui/icon";
import { baseStyles } from "@/styles/base";
import { NumberInput } from "@/components/NumberInput";
import { TimePickerField } from "@/components/time-picker-field";
import { PickedTime } from "@/types/time-picker-field";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

interface MedicationTime {
    id: number;
    time: string;
    showPicker: boolean;
}

export default function EditMedication() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // States for numeric values:
    const [countTimesPerDay, setCountTimesPerDay] = useState(1);
    const [countDoseAmount, setCountDoseAmount] = useState(1);
    const [timeRadio, setTimeRadio] = useState<string>("noTime");
    const [medicationTimes, setMedicationTimes] = useState<MedicationTime[]>([]);
    const [isIntervalCustom, setIsIntervalCustom] = useState(false);
    const [intervalDays, setIntervalDays] = useState<number[]>([]);
    const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [markedDate, setMarkedDate] = useState({});

    const scrollViewRef = useRef<ScrollView>(null);
    const isInitialRender = useRef(true);

    // States for medication fields:
    const [medicationName, setMedicationName] = useState("");
    const [dosage, setDosage] = useState("");
    const [description, setDescription] = useState("");
    const [medicationType, setMedicationType] = useState("");
    const [packageQuantity, setPackageQuantity] = useState("");
    const [currentQuantity, setCurrentQuantity] = useState("");
    const [mealRelation, setMealRelation] = useState("");
    const [interval, setInterval] = useState("");

    // Error states:
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    // Load the existing medication from AsyncStorage using the id
    useEffect(() => {
        const loadMedication = async () => {
            try {
                const storedMedications = await AsyncStorage.getItem("medications");
                if (storedMedications) {
                    const medications = JSON.parse(storedMedications);
                    const med = medications.find((m: any) => m.id === id);
                    if (med) {
                        setMedicationName(med.medicationName);
                        setDosage(med.dosage);
                        setDescription(med.description);
                        setMedicationType(med.medicationType);
                        setPackageQuantity(med.packageQuantity);
                        setCurrentQuantity(med.currentQuantity);
                        setMealRelation(med.mealRelation);
                        setInterval(med.interval);
                        setCountDoseAmount(med.doseAmount);
                        setCountTimesPerDay(med.timesPerDay);
                        if (med.doseTimes && med.doseTimes.length > 0) {
                            setTimeRadio("hasTime");
                            // Create the medicationTimes array from the saved doseTimes
                            const times = med.doseTimes.map((time: string, index: number) => ({
                                id: index,
                                time,
                                showPicker: false,
                            }));
                            setMedicationTimes(times);
                        } else {
                            setTimeRadio("noTime");
                        }
                        if (med.interval === "custom" && med.intervalDays) {
                            setIsIntervalCustom(true);
                            setIntervalDays(med.intervalDays);
                        }
                        setSelectedDateString(med.startDate);
                        if (med.startDate) {
                            setMarkedDate({
                                [med.startDate]: { selected: true, selectedColor: "#2ECC71" },
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading medication:", error);
            }
        };
        loadMedication();
    }, [id]);

    // Update time fields when times per day or timeRadio changes
    useEffect(() => {
        if (timeRadio === "hasTime") {
            const defaultTime = "08:00";
            if (medicationTimes.length < countTimesPerDay) {
                const newTimes = [...medicationTimes];
                for (let i = medicationTimes.length; i < countTimesPerDay; i++) {
                    const hour = Math.floor(8 + (i * (16 / Math.max(countTimesPerDay - 1, 1))));
                    const formattedHour = hour.toString().padStart(2, "0");
                    newTimes.push({
                        id: i,
                        time: i === 0 ? defaultTime : `${formattedHour}:00`,
                        showPicker: false,
                    });
                }
                setMedicationTimes(newTimes);
            } else if (medicationTimes.length > countTimesPerDay) {
                setMedicationTimes(medicationTimes.slice(0, countTimesPerDay));
            }
        }
    }, [countTimesPerDay, timeRadio]);

    // Handler functions
    function increaseTimesPerDay() {
        setCountTimesPerDay((prev) => prev + 1);
    }

    function decreaseTimesPerDay() {
        if (countTimesPerDay > 1) {
            setCountTimesPerDay((prev) => prev - 1);
        }
    }

    function increaseDoseAmount() {
        setCountDoseAmount((prev) => prev + 1);
    }

    function decreaseDoseAmount() {
        if (countDoseAmount > 1) {
            setCountDoseAmount((prev) => prev - 1);
        }
    }

    function handleTimePicker(pickedTime: PickedTime, index: number) {
        const { hours, minutes } = pickedTime;
        const updatedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
        const updatedTimes = [...medicationTimes];
        updatedTimes[index] = { ...updatedTimes[index], time: updatedTime, showPicker: false };
        setMedicationTimes(updatedTimes);
    }

    function toggleTimePicker(index: number, visible: boolean) {
        const updatedTimes = [...medicationTimes];
        updatedTimes[index] = { ...updatedTimes[index], showPicker: visible };
        setMedicationTimes(updatedTimes);
    }

    function handleIntervalChange(value: string) {
        setInterval(value);
        setIsIntervalCustom(value === "custom");
    }

    function handleShowCalendar() {
        setShowCalendar(!showCalendar);
    }

    function handleOnDayPress(day: { dateString: string }) {
        setSelectedDateString(day.dateString);
        setShowCalendar(false);
        setMarkedDate({
            [day.dateString]: { selected: true, selectedColor: "#2ECC71" },
        });
    }

    // Save changes: validate and update the medication in AsyncStorage
    async function handleSave() {
        const newErrors: { [key: string]: boolean } = {};
        let valid = true;
        if (!medicationName.trim()) {
            newErrors.medicationName = true;
            valid = false;
        }
        if (!medicationType) {
            newErrors.medicationType = true;
            valid = false;
        }
        if (!currentQuantity.trim()) {
            newErrors.currentQuantity = true;
            valid = false;
        }
        if (!packageQuantity.trim()) {
            newErrors.packageQuantity = true;
            valid = false;
        }
        if (!mealRelation) {
            newErrors.mealRelation = true;
            valid = false;
        }
        if (!interval) {
            newErrors.interval = true;
            valid = false;
        }
        if (interval === "custom" && intervalDays.length === 0) {
            newErrors.intervalDays = true;
            valid = false;
        }
        if (!selectedDateString) {
            newErrors.startDate = true;
            valid = false;
        }
        if (timeRadio === "hasTime") {
            medicationTimes.forEach((timeSlot, index) => {
                if (!timeSlot.time) {
                    newErrors[`doseTime_${index}`] = true;
                    valid = false;
                }
            });
        }
        setErrors(newErrors);
        if (valid) {
            const updatedMedication = {
                id,
                medicationName,
                dosage,
                description,
                medicationType,
                currentQuantity,
                packageQuantity,
                doseAmount: countDoseAmount,
                timesPerDay: countTimesPerDay,
                doseTimes: timeRadio === "hasTime" ? medicationTimes.map((t) => t.time) : [],
                mealRelation,
                interval,
                intervalDays: interval === "custom" ? intervalDays : [],
                startDate: selectedDateString,
                // Optionally preserve or update the labelColor as needed:
                labelColor: "#4caf50",
            };

            try {
                const storedMedications = await AsyncStorage.getItem("medications");
                if (storedMedications) {
                    let medications = JSON.parse(storedMedications);
                    medications = medications.map((med: any) => (med.id === id ? updatedMedication : med));
                    await AsyncStorage.setItem("medications", JSON.stringify(medications));
                    console.log("Medication updated:", updatedMedication);
                    router.back(); // Navigate back after saving
                }
            } catch (error) {
                console.error("Error updating medication:", error);
            }
        }
    }

    function handleTimePickerDelete(index: number) {
        const updatedTimes = medicationTimes.filter((_, i) => i !== index);
        setMedicationTimes(updatedTimes);
        setCountTimesPerDay(updatedTimes.length);
    }

    return (
        <ScrollView
            className={"mt-2 mx-2"}
            style={styles.scrollView}
            ref={scrollViewRef}
            onContentSizeChange={(contentWidth, contentHeight) => {
                if (isInitialRender.current) {
                    isInitialRender.current = false; // skip scrolling on initial render
                } else {
                    scrollViewRef.current?.scrollTo({ y: contentHeight, animated: true });
                }
            }}
        >
            <VStack space={"md"}>
                {/* Basic Information */}
                <Card size={"lg"} className={"flex gap-4"}>
                    <VStack>
                        <Heading size={"3xl"}>Edit Medication</Heading>
                        <Text>Update the details of your medication</Text>
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Medication Name *
                        </Text>
                        <Input
                            size={"xl"}
                            isRequired={true}
                            style={errors.medicationName ? { borderColor: "red", borderWidth: 1 } : {}}
                        >
                            <InputField
                                placeholder={"e.g. Elvanse"}
                                value={medicationName}
                                onChangeText={setMedicationName}
                            />
                        </Input>
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Dosage
                        </Text>
                        <Input size={"xl"}>
                            <InputField
                                placeholder={"e.g. 50mg"}
                                value={dosage}
                                onChangeText={setDosage}
                            />
                        </Input>
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Description/ Notes
                        </Text>
                        <Textarea size={"xl"}>
                            <TextareaInput
                                placeholder={"Add any notes about this medication"}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </Textarea>
                    </VStack>
                </Card>

                {/* Medication Details */}
                <Card size={"lg"} className={"flex gap-4"}>
                    <VStack>
                        <Heading size={"3xl"}>Medication Details</Heading>
                        <Text>Specify type and quantity</Text>
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Medication Type *
                        </Text>
                        <Select
                            isRequired={true}
                            onValueChange={setMedicationType}
                            style={errors.medicationType ? { borderColor: "red", borderWidth: 1 } : {}}
                        >
                            <SelectTrigger size={"xl"} className={"flex justify-between"}>
                                <SelectInput placeholder={"Select type of medication"} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label={"Pill"} value={"Pill"} />
                                    <SelectItem label={"Capsule"} value={"Capsule"} />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>
                    <HStack space={"sm"}>
                        <VStack className={"flex-1"}>
                            <Text size={"xl"} bold={true}>
                                Current Amount *
                            </Text>
                            <Input
                                size={"xl"}
                                isRequired={true}
                                style={errors.currentQuantity ? { borderColor: "red", borderWidth: 1 } : {}}
                            >
                                <InputField
                                    placeholder={"e.g. 22"}
                                    value={currentQuantity}
                                    onChangeText={(value) => {
                                        const numericValue = value.replace(/[^0-9]/g, "");
                                        setCurrentQuantity(numericValue);
                                    }}
                                />
                            </Input>
                        </VStack>
                        <VStack className={"flex-1"}>
                            <Text size={"xl"} bold={true}>
                                Package Quantity *
                            </Text>
                            <Input
                                size={"xl"}
                                isRequired={true}
                                style={errors.packageQuantity ? { borderColor: "red", borderWidth: 1 } : {}}
                            >
                                <InputField
                                    placeholder={"e.g. 30"}
                                    value={packageQuantity}
                                    onChangeText={(value) => {
                                        const numericValue = value.replace(/[^0-9]/g, "");
                                        setPackageQuantity(numericValue);
                                    }}
                                />
                            </Input>
                        </VStack>
                    </HStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Dose Amount *
                        </Text>
                        <NumberInput
                            count={countDoseAmount}
                            onPressDecrease={decreaseDoseAmount}
                            onPressIncrease={increaseDoseAmount}
                            isReadOnly={true}
                        />
                    </VStack>
                </Card>

                {/* Scheduling */}
                <Card size={"lg"} className={"flex gap-4"}>
                    <VStack>
                        <Heading size={"3xl"}>Scheduling</Heading>
                        <Text>Set up your medication schedule</Text>
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Times Per Day *
                        </Text>
                        <NumberInput
                            count={countTimesPerDay}
                            onPressDecrease={decreaseTimesPerDay}
                            onPressIncrease={increaseTimesPerDay}
                            isReadOnly={true}
                        />
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Dose Times*
                        </Text>
                        <RadioGroup value={timeRadio} onChange={setTimeRadio}>
                            <HStack space={"md"}>
                                <Radio value={"noTime"}>
                                    <RadioIndicator checked={timeRadio === "noTime"} />
                                    <RadioLabel>No time</RadioLabel>
                                </Radio>
                                <Radio value={"hasTime"}>
                                    <RadioIndicator checked={timeRadio === "hasTime"} />
                                    <RadioLabel>Add times</RadioLabel>
                                </Radio>
                            </HStack>
                        </RadioGroup>
                        {timeRadio === "hasTime" && (
                            <VStack space="md">
                                {medicationTimes.map((timeSlot, index) => (
                                    <VStack
                                        key={`time-${index}`}
                                        space="sm"
                                        style={errors[`doseTime_${index}`] ? { borderColor: "red", borderWidth: 1 } : {}}
                                    >
                                        <Text>Dose {index + 1}</Text>
                                        <TimePickerField
                                            alarmString={timeSlot.time}
                                            onPress={() => toggleTimePicker(index, true)}
                                            onConfirm={(pickedTime: PickedTime) => handleTimePicker(pickedTime, index)}
                                            isVisible={(value) =>
                                                toggleTimePicker(
                                                    index,
                                                    typeof value === "function" ? value(timeSlot.showPicker) : value
                                                )
                                            }
                                            visible={timeSlot.showPicker}
                                            onCancel={() => toggleTimePicker(index, false)}
                                            onDelete={
                                                medicationTimes.length > 1 ? () => handleTimePickerDelete(index) : undefined
                                            }
                                        />
                                    </VStack>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Meal Relation *
                        </Text>
                        <Select
                            isRequired={true}
                            onValueChange={setMealRelation}
                            style={errors.mealRelation ? { borderColor: "red", borderWidth: 1 } : {}}
                        >
                            <SelectTrigger size={"xl"} className={"flex justify-between"}>
                                <SelectInput placeholder={"Select relation to meal"} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label={"Not relevant to meals"} value={"notRelevant"} />
                                    <SelectItem label={"Before meal"} value={"beforeMeal"} />
                                    <SelectItem label={"During meal"} value={"duringMeal"} />
                                    <SelectItem label={"After meal"} value={"afterMeal"} />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>
                    <Divider />
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Interval *
                        </Text>
                        <Select
                            isRequired={true}
                            onValueChange={(val) => handleIntervalChange(val)}
                            style={errors.interval ? { borderColor: "red", borderWidth: 1 } : {}}
                        >
                            <SelectTrigger size={"xl"} className={"flex justify-between"}>
                                <SelectInput placeholder={"Select interval"} />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label={"Daily"} value={"daily"} />
                                    <SelectItem label={"Every 2 Days"} value={"twoDays"} />
                                    <SelectItem label={"Every 3 Days"} value={"threeDays"} />
                                    <SelectItem label={"Weekly"} value={"weekly"} />
                                    <SelectItem label={"Monthly"} value={"monthly"} />
                                    <SelectItem label={"Custom"} value={"custom"} />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>
                    {isIntervalCustom && (
                        <VStack>
                            <CheckboxGroup value={intervalDays} onChange={setIntervalDays}>
                                <Checkbox label={"Monday"} value={1} />
                                <Checkbox label={"Tuesday"} value={2} />
                                <Checkbox label={"Wednesday"} value={3} />
                                <Checkbox label={"Thursday"} value={4} />
                                <Checkbox label={"Friday"} value={5} />
                                <Checkbox label={"Saturday"} value={6} />
                                <Checkbox label={"Sunday"} value={7} />
                            </CheckboxGroup>
                        </VStack>
                    )}
                    <VStack>
                        <Text size={"xl"} bold={true}>
                            Start Date *
                        </Text>
                        <Pressable
                            onPress={handleShowCalendar}
                            style={[
                                {
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: 10,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: "#ccc",
                                },
                                errors.startDate ? { borderColor: "red" } : {},
                            ]}
                        >
                            <Text size={"xl"}>{selectedDateString || "No date set"}</Text>
                            <Icon size={"xl"} as={CalendarIcon} style={baseStyles.iconOpacity} />
                        </Pressable>
                        {showCalendar && (
                            <View style={{ alignItems: "center" }}>
                                <Calendar
                                    onDayPress={handleOnDayPress}
                                    minDate={new Date().toISOString().split("T")[0]}
                                    current={new Date().toISOString().split("T")[0]}
                                    style={{ width: 300, height: 300 }}
                                    markedDates={markedDate}
                                />
                            </View>
                        )}
                    </VStack>
                </Card>
                <HStack className={"justify-center"} space={'4xl'}>
                    <Button variant={'outline'} size={"xl"} className={"mt-5"} onPress={() => router.back()}>
                        <ButtonIcon as={ArrowLeftIcon} />
                        <ButtonText size={"xl"}>Back</ButtonText>
                    </Button>
                    <Button size={"xl"} className={"mt-5"} onPress={handleSave}>
                        <ButtonIcon as={SaveIcon} />
                        <ButtonText size={"xl"}>Save</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 5,
        borderRadius: 8,
    },
});
