import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Medication {
    id: string;
    medicationName: string;
    dosage: string;
    description: string;
    medicationType: string;
    currentQuantity: number;
    packageQuantity: number;
    doseAmount: number;
    timesPerDay: number;
    doseTimes: string[];
    mealRelation: string;
    interval: string;
    intervalDays: number[]; // for custom intervals, these are day numbers 1 (Mon) to 7 (Sun)
    startDate: string; // YYYY-MM-DD
    labelColor: string;
    schedule?: Dose[];
}

export interface Dose {
    scheduledTime: Date;
    displayTime: string;
    status: 'pending' | 'taken' | 'skipped' | 'overdue';
    badgeText: string;
    actionTime?: string;
    canUndo: boolean;
    icon: 'Clock' | 'AlarmClock';
}

// New interface for history records.
export interface MedicationHistoryRecord {
    medicationId: string;
    scheduledTime: string; // ISO string of scheduled dose time
    action: 'taken' | 'skipped';
    actionTimestamp: string; // ISO string timestamp of when action occurred
}

// We still keep an in‑memory map for fast lookups (optional).
let doseActions: Record<string, MedicationHistoryRecord> = {};

// -----------------------
// INITIALIZATION: Load persistent history into in-memory doseActions
// -----------------------

export async function initializeMedicationHistory(): Promise<void> {
    const history = await loadMedicationHistory();
    Object.keys(history).forEach(dateKey => {
        history[dateKey].forEach((record: MedicationHistoryRecord) => {
            const compositeKey = `${record.medicationId}-${record.scheduledTime}`;
            doseActions[compositeKey] = record;
        });
    });
}


// -----------------------
// PERSISTENT HISTORY HELPERS
// -----------------------

// Key used to store medication history.
const HISTORY_KEY = 'medicationHistory';

// Load the full medication history from AsyncStorage.
export async function loadMedicationHistory(): Promise<Record<string, MedicationHistoryRecord[]>> {
    const historyString = await AsyncStorage.getItem(HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : {};
}

// Save the given history object back to AsyncStorage.
async function saveMedicationHistory(history: Record<string, MedicationHistoryRecord[]>): Promise<void> {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Add a new history record to the persistent store.
async function addMedicationHistoryRecord(record: MedicationHistoryRecord): Promise<void> {
    const history = await loadMedicationHistory();
    const dateKey = record.scheduledTime.substring(0, 10); // YYYY-MM-DD portion
    if (history[dateKey]) {
        history[dateKey].push(record);
    } else {
        history[dateKey] = [record];
    }
    await saveMedicationHistory(history);
    // Also update in-memory doseActions.
    const compositeKey = `${record.medicationId}-${record.scheduledTime}`;
    doseActions[compositeKey] = record;
}

// Remove a history record (used in undo).
async function removeMedicationHistoryRecord(medicationId: string, scheduledTime: Date): Promise<void> {
    const compositeKey = `${medicationId}-${scheduledTime.toISOString()}`;
    const history = await loadMedicationHistory();
    const dateKey = scheduledTime.toISOString().substring(0, 10);
    if (history[dateKey]) {
        history[dateKey] = history[dateKey].filter(rec => !(rec.medicationId === medicationId && rec.scheduledTime === scheduledTime.toISOString()));
        await saveMedicationHistory(history);
    }
    delete doseActions[compositeKey];
}

// -----------------------
// CORE MEDICATION FUNCTIONS
// -----------------------

export async function loadMedications(): Promise<Medication[]> {
    const medsString = await AsyncStorage.getItem('medications');
    if (medsString) {
        const meds = JSON.parse(medsString);
        return meds.map((m: any) => ({
            ...m,
            currentQuantity: Number(m.currentQuantity),
            doseAmount: Number(m.doseAmount),
        }));
    }
    return [];
}

async function updateMedicationInStorage(updatedMedication: Medication): Promise<void> {
    const medsString = await AsyncStorage.getItem('medications');
    if (medsString) {
        const meds = JSON.parse(medsString);
        const newMeds = meds.map((m: any) =>
            m.id === updatedMedication.id
                ? { ...m, currentQuantity: updatedMedication.currentQuantity }
                : m
        );
        await AsyncStorage.setItem('medications', JSON.stringify(newMeds));
    }
}

export function isMedScheduledForDate(med: Medication, date: Date): boolean {
    // Create copies with the time set to midnight.
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const startDate = new Date(med.startDate);
    startDate.setHours(0, 0, 0, 0);

    // If the selected date is before the start date, do not show the medication.
    if (selectedDate.getTime() < startDate.getTime()) return false;

    const diffDays = Math.floor((selectedDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    if (med.interval === 'twoDays') {
        return diffDays % 2 === 0;
    } else if (med.interval === 'threeDays') {
        return diffDays % 3 === 0;
    } else if (med.interval === 'monthly') {
        return selectedDate.getDate() === startDate.getDate();
    } else if (med.interval === 'custom' && med.intervalDays && med.intervalDays.length > 0) {
        // Convert selectedDate's day from 0 (Sun) to 7 so that Monday=1, ... Sunday=7.
        const dayNumber = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();
        return med.intervalDays.includes(dayNumber);
    }
    // Default is daily.
    return true;
}



function parseTimeStringForDate(timeStr: string, date: Date): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
}

export function computeDoseScheduleForDate(med: Medication, date: Date): Dose[] {
    const schedule: Dose[] = [];
    let times: string[] = med.doseTimes && med.doseTimes.length ? med.doseTimes : [];
    if (!times.length) {
        if (med.timesPerDay === 1) times = ['08:00'];
        if (med.timesPerDay === 2) times = ['08:00', '20:00'];
        if (med.timesPerDay === 3) times = ['08:00', '14:00', '20:00'];
    }
    times.forEach(timeStr => {
        const scheduled = parseTimeStringForDate(timeStr, date);
        let status: Dose['status'] = 'pending';
        const now = new Date();
        let badgeText = `in ${Math.max(0, Math.floor((scheduled.getTime() - now.getTime()) / 60000))}m`;
        let icon: 'Clock' | 'AlarmClock' = 'AlarmClock';
        const compositeKey = `${med.id}-${scheduled.toISOString()}`;
        // Check if we have a persistent history record in our in-memory doseActions.
        if (doseActions[compositeKey]) {
            const record = doseActions[compositeKey];
            if (record.action === 'taken') {
                status = 'taken';
                badgeText = `Taken ${formatTime(new Date(record.actionTimestamp))}`;
            } else {
                status = 'skipped';
                badgeText = `Skipped ${formatTime(new Date(record.actionTimestamp))}`;
            }
            icon = 'Clock';
        } else {
            const diffMinutes = (scheduled.getTime() - now.getTime()) / 60000;
            if (diffMinutes < -10) {
                status = 'overdue';
                badgeText = 'Overdue';
                icon = 'Clock';
            } else if (diffMinutes <= 60) {
                // Only if within 60 minutes, show "Now" or "in Xm"
                badgeText = diffMinutes <= 0 ? 'Now' : `in ${Math.floor(diffMinutes)}m`;
                status = 'pending';
                icon = 'AlarmClock';
            } else {
                // More than 60 minutes away – no badge text.
                badgeText = '';
            }
        }
        schedule.push({
            scheduledTime: scheduled,
            displayTime: formatTime(scheduled),
            status,
            badgeText,
            canUndo: !!doseActions[compositeKey],
            icon,
        });
    });
    return schedule;
}

function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function getDisplayInterval(med: Medication): string {
    if (med.interval === 'custom' && med.intervalDays && med.intervalDays.length > 0) {
        const dayNames: { [key: number]: string } = {
            1: 'Mon',
            2: 'Tue',
            3: 'Wed',
            4: 'Thu',
            5: 'Fri',
            6: 'Sat',
            7: 'Sun'
        };
        return med.intervalDays.map((d: number) => dayNames[d]).join(', ');
    } else if (med.interval === 'twoDays') {
        return '2 Days';
    } else if (med.interval === 'threeDays') {
        return '3 Days';
    } else if (med.interval === 'monthly') {
        return 'Monthly';
    }
    return 'Daily';
}

export function getDisplayMealRelation(mealRelation: string): string {
    const mapping: Record<string, string> = {
        beforeMeal: 'Before Meal',
        duringMeal: 'During Meal',
        afterMeal: 'After Meal',
        notRelevant: 'Not Relevant'
    };
    return mapping[mealRelation] || mealRelation;
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {weekday:'long', month: 'short', day: 'numeric', year: 'numeric' });
}

// -----------------------
// ACTION HANDLERS (persisting history)
// -----------------------

export async function handleTake(med: Medication, scheduledTime: Date): Promise<void> {
    const compositeKey = `${med.id}-${scheduledTime.toISOString()}`;
    if (med.currentQuantity >= med.doseAmount) {
        med.currentQuantity -= med.doseAmount;
    }
    // Create a history record.
    const record: MedicationHistoryRecord = {
        medicationId: med.id,
        scheduledTime: scheduledTime.toISOString(),
        action: 'taken',
        actionTimestamp: new Date().toISOString(),
    };
    doseActions[compositeKey] = record;
    await updateMedicationInStorage(med);
    await addMedicationHistoryRecord(record);
}

export async function handleSkip(med: Medication, scheduledTime: Date): Promise<void> {
    const compositeKey = `${med.id}-${scheduledTime.toISOString()}`;
    const record: MedicationHistoryRecord = {
        medicationId: med.id,
        scheduledTime: scheduledTime.toISOString(),
        action: 'skipped',
        actionTimestamp: new Date().toISOString(),
    };
    doseActions[compositeKey] = record;
    await updateMedicationInStorage(med);
    await addMedicationHistoryRecord(record);
}

export async function handleUndo(med: Medication, scheduledTime: Date): Promise<void> {
    const compositeKey = `${med.id}-${scheduledTime.toISOString()}`;
    const record = doseActions[compositeKey];
    if (record) {
        if (record.action === 'taken') {
            med.currentQuantity += med.doseAmount;
        }
        delete doseActions[compositeKey];
    }
    await updateMedicationInStorage(med);
    await removeMedicationHistoryRecord(med.id, scheduledTime);
}
