// Define the picked time interface
export interface PickedTime {
    hours: number;
    minutes: number;
}

// Define props for the TimePickerField component
export interface TimePickerFieldProps {
    onDelete?: () => void;
    alarmString: string | null;
    onPress: () => void;
    onConfirm: (pickedTime: PickedTime) => void;
    isVisible: (value: boolean | ((prevState: boolean) => boolean)) => void;
    visible: boolean;
    onCancel: () => void;
}
