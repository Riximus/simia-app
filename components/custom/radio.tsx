// CustomRadio.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';

/**
 * Context to share the radio group state (selected value and onChange handler)
 */
type RadioGroupContextType = {
    value: string;
    onChange: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

/**
 * RadioGroup Props
 */
interface RadioGroupProps {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
}

/**
 * RadioGroup Component
 * Provides context for the radios and renders them inside a container.
 */
export const RadioGroup = ({ value, onChange, children }: RadioGroupProps) => {
    return (
        <RadioGroupContext.Provider value={{ value, onChange }}>
            <View style={styles.group}>{children}</View>
        </RadioGroupContext.Provider>
    );
};

/**
 * Radio Props
 */
interface RadioProps {
    value: string;
    isDisabled?: boolean;
    children: ReactNode;
    style?: any;
    onPress?: (event: GestureResponderEvent) => void;
}

/**
 * Radio Component
 * Renders a single radio button. It uses context from RadioGroup to determine
 * whether it’s checked and to trigger onChange when pressed.
 */
export const Radio = ({ value, isDisabled, children, style, onPress }: RadioProps) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
        throw new Error("Radio must be used within a RadioGroup");
    }
    const { value: groupValue, onChange } = context;
    const checked = groupValue === value;

    const handlePress = (event: GestureResponderEvent) => {
        if (!isDisabled) {
            onChange(value);
            if (onPress) onPress(event);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={[
                styles.radio,
                checked && styles.radioChecked,
                isDisabled && styles.radioDisabled,
                style,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked, disabled: isDisabled }}
        >
            {children}
        </Pressable>
    );
};

/**
 * RadioIndicator Props
 */
interface RadioIndicatorProps {
    checked: boolean;
}

/**
 * RadioIndicator Component
 * Renders the inner filled circle when the radio is selected.
 */
export const RadioIndicator = ({ checked }: RadioIndicatorProps) => {
    return (
        <View style={[styles.indicator, checked && styles.indicatorChecked]} />
    );
};

/**
 * RadioLabel Component
 * Renders the label text for a radio button.
 */
interface RadioLabelProps {
    children: ReactNode;
}

export const RadioLabel = ({ children }: RadioLabelProps) => {
    return <Text style={styles.label}>{children}</Text>;
};

/**
 * Example: (Optional) RadioIcon Component
 * You can use this to render an icon instead of (or in addition to) the default indicator.
 */
interface RadioIconProps {
    checked: boolean;
}

export const RadioIcon = ({ checked }: RadioIconProps) => {
    // For demonstration, simply render a circle with a border.
    return (
        <View style={[styles.icon, checked && styles.iconChecked]} />
    );
};

/**
 * Styles for the components.
 */
const styles = StyleSheet.create({
    group: {
        flexDirection: 'column',
    },
    radio: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 4,
        marginVertical: 4,
    },
    radioChecked: {
        borderColor: '#007bff',
    },
    radioDisabled: {
        opacity: 0.6,
    },
    indicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 8,
    },
    indicatorChecked: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    icon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 8,
    },
    iconChecked: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
});
