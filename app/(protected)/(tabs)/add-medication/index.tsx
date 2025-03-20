import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import {Text} from "@/components/ui/text";
import {Card} from "@/components/ui/card";
import {Heading} from "@/components/ui/heading";
import {VStack} from "@/components/ui/vstack";
import {Input, InputField, InputIcon, InputSlot} from "@/components/ui/input";
import {Textarea, TextareaInput} from "@/components/ui/textarea";
import {
    Select,
    SelectBackdrop, SelectContent, SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput, SelectItem,
    SelectPortal,
    SelectTrigger
} from "@/components/ui/select";
import {
    AlarmClockPlusIcon, CalendarIcon,
    ChevronDownIcon, CircleCheckIcon,
    CircleIcon,
    ClockIcon,
    MinusIcon,
    PlusIcon, ShieldAlertIcon, TriangleAlertIcon
} from "lucide-react-native";
import {HStack} from "@/components/ui/hstack";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import {TimerPickerModal} from "react-native-timer-picker";
import {LinearGradient} from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {Badge, BadgeIcon, BadgeText} from "@/components/custom/badge";
import {CheckIcon, Icon} from "@/components/ui/icon";
import {Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel} from "@/components/custom/radio";
import {TimePickerField} from "@/components/time-picker-field";
import {PickedTime} from "@/types/time-picker-field";
import {Divider} from "@/components/ui/divider";
import {Checkbox, CheckboxGroup} from "@/components/custom/checkbox";
import {baseStyles} from "@/styles/base";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {Box} from "@/components/ui/box";
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NumberInput} from "@/components/number-input";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";


interface MedicationTime {
    id: number;
    time: string;
    showPicker: boolean;
}

export default function Index() {
    const toast = useToast();
    // States for numeric values already exist:
    const [countTimesPerDay, setCountTimesPerDay] = useState(1);
    const [countDoseAmount, setCountDoseAmount] = useState(1);
    const [timeRadio, setTimeRadio] = useState<string>('noTime');
    const [medicationTimes, setMedicationTimes] = useState<MedicationTime[]>([]);
    const [isIntervalCustom, setIsIntervalCustom] = useState(false);
    const [intervalDays, setIntervalDays] = useState<number[]>([]);
    const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [markedDate, setMarkedDate] = useState({}); // Calendar marked dates
    const scrollViewRef = useRef<ScrollView>(null);
    const isInitialRender = useRef(true);

    // New state for input values
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [description, setDescription] = useState('');
    const [medicationType, setMedicationType] = useState('');
    const [packageQuantity, setPackageQuantity] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState('');
    const [mealRelation, setMealRelation] = useState('');
    const [interval, setInterval] = useState('');

    // Object to store errors for required fields
    const [errors, setErrors] = useState<{
        medicationName?: boolean;
        medicationType?: boolean;
        packageQuantity?: boolean;
        mealRelation?: boolean;
        interval?: boolean;
        startDate?: boolean;
        // You can also add doseTimes errors if needed:
        [key: string]: boolean | undefined;
    }>({});

    useEffect(() => {
        if (timeRadio === 'hasTime') {
            const defaultTime = "08:00";
            if (medicationTimes.length < countTimesPerDay) {
                const newTimes = [...medicationTimes];
                // Add new time slots with default times spread throughout the day
                for (let i = medicationTimes.length; i < countTimesPerDay; i++) {
                    // Calculate time based on position (evenly distribute throughout the day)
                    const hour = Math.floor(8 + (i * (16 / Math.max(countTimesPerDay - 1, 1))));
                    const formattedHour = hour.toString().padStart(2, "0");
                    newTimes.push({
                        id: i,
                        time: i === 0 ? defaultTime : `${formattedHour}:00`,
                        showPicker: false
                    });
                }
                setMedicationTimes(newTimes);
            } else if (medicationTimes.length > countTimesPerDay) {
                setMedicationTimes(medicationTimes.slice(0, countTimesPerDay));
            }
        }
    }, [countTimesPerDay, timeRadio]);

    function increaseTimesPerDay() {
        setCountTimesPerDay((prevState) => prevState + 1);
    }

    function decreaseTimesPerDay() {
        if (countTimesPerDay > 1) {
            setCountTimesPerDay((prevState) => prevState - 1);
        }
    }

    function increaseDoseAmount() {
        setCountDoseAmount((prevState) => prevState + 1);
    }

    function decreaseDoseAmount() {
        if (countDoseAmount > 1) {
            setCountDoseAmount((prevState) => prevState - 1);
        }
    }

    function handleTimePicker(pickedTime: PickedTime, index: number) {
        const {hours, minutes} = pickedTime;
        const updatedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        const updatedTimes = [...medicationTimes];
        updatedTimes[index] = {
            ...updatedTimes[index],
            time: updatedTime,
            showPicker: false
        };
        setMedicationTimes(updatedTimes);
    }

    function toggleTimePicker(index: number, visible: boolean) {
        const updatedTimes = [...medicationTimes];
        updatedTimes[index] = {
            ...updatedTimes[index],
            showPicker: visible
        };
        setMedicationTimes(updatedTimes);
    }

    function handleIntervalChange(value: string) {
        setIsIntervalCustom(value === 'custom');
    }

    function handleShowCalendar() {
        setShowCalendar(!showCalendar);
    }

    function handleOnDayPress(day: { dateString: string }) {
        setSelectedDateString(day.dateString);
        setShowCalendar(false);
        setMarkedDate({
            [day.dateString]: {selected: true, selectedColor: '#2ECC71'}
        });
    }

    // Save button handler: validate required fields, save to AsyncStorage, and print object
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
        if (interval === 'custom' && intervalDays.length === 0) {
            newErrors.intervalDays = true;
            valid = false;
        }
        if (!selectedDateString) {
            newErrors.startDate = true;
            valid = false;
        }
        if (timeRadio === 'hasTime') {
            medicationTimes.forEach((timeSlot, index) => {
                if (!timeSlot.time) {
                    newErrors[`doseTime_${index}`] = true;
                    valid = false;
                }
            });
        }
        setErrors(newErrors);

        // If validation fails, show a warning toast.
        if (!valid) {
            toast.show({
                placement: 'top',
                duration: 3000,
                render: ({ id }) => {
                    const uniqueToastId = "toast-" + id;
                    return (
                        <Toast action="warning" variant="outline" nativeID={uniqueToastId} className="bg-orange-200 items-center p-4 gap-6 w-full shadow-hard-5 max-w-[443px] flex-row justify-between">
                            <Icon as={TriangleAlertIcon} />
                            <VStack>
                                <ToastTitle>Missing Information</ToastTitle>
                                <ToastDescription>Please fill all required fields.</ToastDescription>
                            </VStack>
                        </Toast>
                    );
                },
            });
            return;
        }

        // Build medication data object
        const medicationData = {
            medicationName,
            dosage,
            description,
            medicationType,
            currentQuantity,
            packageQuantity,
            doseAmount: countDoseAmount,
            timesPerDay: countTimesPerDay,
            doseTimes: timeRadio === 'hasTime' ? medicationTimes.map(t => t.time) : [],
            mealRelation,
            interval,
            intervalDays: interval === 'custom' ? intervalDays : [],
            startDate: selectedDateString,
        };
        const id = uuid.v4();
        const newMedication = { id, ...medicationData };

        try {
            const storedMedications = await AsyncStorage.getItem('medications');
            const medications = storedMedications ? JSON.parse(storedMedications) : [];
            medications.push(newMedication);
            await AsyncStorage.setItem('medications', JSON.stringify(medications));
            console.log("Medication saved:", medications);

            // Show success toast
            toast.show({
                placement: 'top',
                duration: 3000,
                render: ({ id }) => {
                    const uniqueToastId = "toast-" + id;
                    return (
                        <Toast action="success" variant="solid" nativeID={uniqueToastId} className="bg-lime-700 items-center p-4 gap-6 w-full shadow-hard-5 max-w-[443px] flex-row justify-between">
                            <Icon as={CircleCheckIcon} color={'#fff'}/>
                            <VStack>
                                <ToastTitle>Saving Successful!</ToastTitle>
                                <ToastDescription>Your medication has been saved.</ToastDescription>
                            </VStack>
                        </Toast>
                    );
                },
            });
            // Clear all form data
            clearForm();
        } catch (error) {
            // Show error toast if saving fails
            toast.show({
                placement: 'top',
                duration: 3000,
                render: ({ id }) => {
                    const uniqueToastId = "toast-" + id;
                    return (
                        <Toast action="error" variant="outline" nativeID={uniqueToastId} className="bg-red-400 items-center p-4 gap-6 w-full shadow-hard-5 max-w-[443px] flex-row justify-between">
                            <Icon as={ShieldAlertIcon} />
                            <VStack>
                                <ToastTitle>Error Saving!</ToastTitle>
                                <ToastDescription>There was an error while saving your medication.</ToastDescription>
                            </VStack>
                        </Toast>
                    );
                },
            });
            console.error("Error saving medication:", error);
        }
    }

    function clearForm() {
        setMedicationName('');
        setDosage('');
        setDescription('');
        setMedicationType('');
        setCurrentQuantity('');
        setPackageQuantity('');
        setMealRelation('');
        setInterval('');
        setSelectedDateString(null);
        setMarkedDate({});
        setMedicationTimes([]);
        setCountTimesPerDay(1);
        setCountDoseAmount(1);
        setIntervalDays([]);
        setErrors({});
    }




    function handleTimePickerDelete(index: number) {
        // Remove the time at the specified index
        const updatedTimes = medicationTimes.filter((_, i) => i !== index);
        setMedicationTimes(updatedTimes);
        // Also update countTimesPerDay accordingly
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
                <Card size={'lg'} className={'flex gap-4'}>
                    <VStack>
                        <Heading size={'3xl'}>Basic Information</Heading>
                        <Text>Enter the details of your medication</Text>
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Medication Name *</Text>
                        <Input size={'xl'} isRequired={true}
                               style={errors.medicationName ? { borderColor: 'red', borderWidth: 1 } : {}}
                        >
                            <InputField
                                placeholder={'e.g. Elvanse'}
                                value={medicationName}
                                onChangeText={setMedicationName}
                            />
                        </Input>
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Dosage</Text>
                        <Input size={'xl'}>
                            <InputField
                                placeholder={'e.g. 50mg'}
                                value={dosage}
                                onChangeText={setDosage}
                            />
                        </Input>
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Description/ Notes</Text>
                        <Textarea size={'xl'}>
                            <TextareaInput
                                placeholder={'Add any notes about this medication'}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </Textarea>
                    </VStack>
                </Card>

                {/* Medication Details */}
                <Card size={'lg'} className={'flex gap-4'}>
                    <VStack>
                        <Heading size={'3xl'}>Medication Details</Heading>
                        <Text>Specify type and quantity</Text>
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Medication Type *</Text>
                        <Select isRequired={true}
                                onValueChange={setMedicationType}
                                style={errors.medicationType ? { borderColor: 'red', borderWidth: 1 } : {}}
                        >
                            <SelectTrigger size={'xl'} className={'flex justify-between'}>
                                <SelectInput placeholder={'Select type of medication'}/>
                                <SelectIcon className="mr-3" as={ChevronDownIcon}/>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop/>
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator/>
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label={'Pill'} value={'Pill'}/>
                                    <SelectItem label={'Capsule'} value={'Capsule'}/>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>
                    <HStack space={'sm'}>
                        <VStack className={'flex-1'}>
                            <Text size={'xl'} bold={true}>Current Amount *</Text>
                            <Input size={'xl'} isRequired={true}
                                   style={errors.packageQuantity ? { borderColor: 'red', borderWidth: 1 } : {}}
                            >
                                <InputField
                                    placeholder={'e.g. 22'}
                                    value={currentQuantity}
                                    onChangeText={(value) => {
                                        // Remove non-numeric characters
                                        const numericValue = value.replace(/[^0-9]/g, '');
                                        setCurrentQuantity(numericValue);
                                    }}
                                />
                            </Input>
                        </VStack>
                        <VStack className={'flex-1'}>
                            <Text size={'xl'} bold={true}>Package Quantity *</Text>
                            <Input size={'xl'} isRequired={true}
                                   style={errors.packageQuantity ? { borderColor: 'red', borderWidth: 1 } : {}}
                            >
                                <InputField
                                    placeholder={'e.g. 30'}
                                    value={packageQuantity}
                                    onChangeText={(value) => {
                                        // Remove non-numeric characters
                                        const numericValue = value.replace(/[^0-9]/g, '');
                                        setPackageQuantity(numericValue);
                                    }}
                                />
                            </Input>
                        </VStack>
                    </HStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Dose Amount *</Text>
                        <NumberInput count={countDoseAmount} onPressDecrease={decreaseDoseAmount}
                                     onPressIncrease={increaseDoseAmount} isReadOnly={true}/>
                    </VStack>
                </Card>

                {/* Scheduling */}
                <Card size={'lg'} className={'flex gap-4'}>
                    <VStack>
                        <Heading size={'3xl'}>Scheduling</Heading>
                        <Text>Set up your medication schedule</Text>
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Times Per Day *</Text>
                        <NumberInput count={countTimesPerDay} onPressDecrease={decreaseTimesPerDay}
                                     onPressIncrease={increaseTimesPerDay} isReadOnly={true}/>
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Dose Times*</Text>
                        <RadioGroup value={timeRadio} onChange={setTimeRadio}>
                            <HStack space={'md'}>
                                <Radio value={'noTime'}>
                                    <RadioIndicator checked={timeRadio === 'noTime'}/>
                                    <RadioLabel>No time</RadioLabel>
                                </Radio>
                                <Radio value={'hasTime'}>
                                    <RadioIndicator checked={timeRadio === 'hasTime'}/>
                                    <RadioLabel>Add times</RadioLabel>
                                </Radio>
                            </HStack>
                        </RadioGroup>
                        {timeRadio === 'hasTime' && (
                            <VStack space="md">
                                {medicationTimes.map((timeSlot, index) => (
                                    <VStack key={`time-${index}`} space="sm"
                                            style={errors[`doseTime_${index}`] ? { borderColor: 'red', borderWidth: 1 } : {}}
                                    >
                                        <Text>Dose {index + 1}</Text>
                                        <TimePickerField
                                            alarmString={timeSlot.time}
                                            onPress={() => toggleTimePicker(index, true)}
                                            onConfirm={(pickedTime: PickedTime) => handleTimePicker(pickedTime, index)}
                                            isVisible={(value) => toggleTimePicker(index, typeof value === 'function' ? value(timeSlot.showPicker) : value)}
                                            visible={timeSlot.showPicker}
                                            onCancel={() => toggleTimePicker(index, false)}
                                            onDelete={medicationTimes.length > 1 ? () => handleTimePickerDelete(index) : undefined}
                                        />
                                    </VStack>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                    <VStack>
                        <Text size={'xl'} bold={true}>Meal Relation *</Text>
                        <Select isRequired={true}
                                onValueChange={setMealRelation}
                                style={errors.mealRelation ? { borderColor: 'red', borderWidth: 1 } : {}}
                        >
                            <SelectTrigger size={'xl'} className={'flex justify-between'}>
                                <SelectInput placeholder={'Select relation to meal'}/>
                                <SelectIcon className="mr-3" as={ChevronDownIcon}/>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop/>
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator/>
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label={'Not relevant to meals'} value={'notRelevant'}/>
                                    <SelectItem label={'Before meal'} value={'beforeMeal'}/>
                                    <SelectItem label={'During meal'} value={'duringMeal'}/>
                                    <SelectItem label={'After meal'} value={'afterMeal'}/>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>
                    <Divider/>
                    <VStack>
                        <Text size={'xl'} bold={true}>Interval *</Text>
                        <Select isRequired={true}
                                onValueChange={(val) => {
                                    setInterval(val);
                                    handleIntervalChange(val);
                                }}
                                style={errors.interval ? { borderColor: 'red', borderWidth: 1 } : {}}
                        >
                            <SelectTrigger size={'xl'} className={'flex justify-between'}>
                                <SelectInput placeholder={'Select interval'}/>
                                <SelectIcon className="mr-3" as={ChevronDownIcon}/>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop/>
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator/>
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label={'Daily'} value={'daily'}/>
                                    <SelectItem label={'Every 2 Days'} value={'twoDays'}/>
                                    <SelectItem label={'Every 3 Days'} value={'threeDays'}/>
                                    <SelectItem label={'Weekly'} value={'weekly'}/>
                                    <SelectItem label={'Monthly'} value={'monthly'}/>
                                    <SelectItem label={'Custom'} value={'custom'}/>
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </VStack>
                    {isIntervalCustom ? (
                        <VStack>
                            <CheckboxGroup value={intervalDays} onChange={setIntervalDays}>
                                <Checkbox label={'Monday'} value={1} />
                                <Checkbox label={'Tuesday'} value={2} />
                                <Checkbox label={'Wednesday'} value={3} />
                                <Checkbox label={'Thursday'} value={4} />
                                <Checkbox label={'Friday'} value={5} />
                                <Checkbox label={'Saturday'} value={6} />
                                <Checkbox label={'Sunday'} value={7} />
                            </CheckboxGroup>
                        </VStack>
                    ) : null}
                    <VStack>
                        <Text size={'xl'} bold={true}>Start Date *</Text>
                        <Pressable onPress={handleShowCalendar}
                                   style={[
                                       {
                                           flexDirection: 'row',
                                           justifyContent: 'space-between',
                                           alignItems: 'center',
                                           padding: 10,
                                           borderRadius: 8,
                                           borderWidth: 1,
                                           borderColor: '#ccc'
                                       },
                                       errors.startDate ? { borderColor: 'red' } : {}
                                   ]}
                        >
                            <Text size={'xl'}>{selectedDateString || "No date set"}</Text>
                            <Icon size={'xl'} as={CalendarIcon} style={baseStyles.iconOpacity}/>
                        </Pressable>
                        {showCalendar ? (
                            <Box className={'items-center'}>
                                <Calendar
                                    onDayPress={handleOnDayPress}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    current={new Date().toISOString().split('T')[0]}
                                    style={{
                                        width: 300,
                                        height: 300,
                                    }}
                                    markedDates={markedDate}
                                />
                            </Box>
                        ) : null}
                    </VStack>
                </Card>
                <Button size={'xl'} className={'mt-5'} onPress={handleSave}>
                    <ButtonIcon as={PlusIcon}/>
                    <ButtonText>Add Medication</ButtonText>
                </Button>
            </VStack>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginBottom: 5,
        borderRadius: 8
    }
});
