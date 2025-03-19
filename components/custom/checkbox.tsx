import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Define the props for a single Checkbox. Only label and value are required.
export interface CheckboxProps {
    label: string;
    value: any;
    isChecked?: boolean;
    onToggle?: (value: any, newChecked: boolean) => void;
    disabled?: boolean;
    size?: number;
    style?: ViewStyle;
    labelStyle?: TextStyle;
}

// The Checkbox component renders a box with a checkmark (✓) when checked.
export const Checkbox: React.FC<CheckboxProps> = ({
                                                      label,
                                                      value,
                                                      isChecked,
                                                      onToggle,
                                                      disabled = false,
                                                      size = 24,
                                                      style,
                                                      labelStyle,
                                                  }) => {
    const handlePress = () => {
        if (disabled) return;
        onToggle && onToggle(value, !isChecked);
    };

    return (
        <Pressable onPress={handlePress} style={[styles.checkboxContainer, style]}>
            <View
                style={[
                    styles.box,
                    { width: size, height: size },
                    isChecked && styles.checked,
                    disabled && styles.disabled,
                ]}
            >
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.label, disabled && styles.disabledLabel, labelStyle]}>
                {label}
            </Text>
        </Pressable>
    );
};

// Define the props for the CheckboxGroup.
export interface CheckboxGroupProps {
    value: any[];
    onChange: (values: any[]) => void;
    children: React.ReactNode;
}

// The CheckboxGroup manages an array of selected values.
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
                                                                children,
                                                                value: groupValue,
                                                                onChange,
                                                            }) => {
    // For uncontrolled usage, maintain internal state.
    const [selectedValues, setSelectedValues] = useState<any[]>([]);
    const isControlled = groupValue !== undefined;
    const currentValues = isControlled ? groupValue : selectedValues;

    // Toggle the checkbox value in the group.
    const toggleValue = (value: any, newValue: boolean) => {
        let newSelected;
        if (newValue) {
            newSelected = [...currentValues, value];
        } else {
            newSelected = currentValues.filter((item) => item !== value);
        }
        if (isControlled) {
            onChange && onChange(newSelected);
        } else {
            setSelectedValues(newSelected);
            onChange && onChange(newSelected);
        }
    };

    // Clone each Checkbox child and inject the isChecked and onToggle props.
    const childrenWithProps = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const childProps = child.props as CheckboxProps;
        const isChecked = currentValues.includes(childProps.value);
        return React.cloneElement(child, { isChecked, onToggle: toggleValue });
    });

    return <View style={styles.groupContainer}>{childrenWithProps}</View>;
};

const styles = StyleSheet.create({
    groupContainer: {
        flexDirection: 'column', // You can change this to 'row' for horizontal layout.
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    box: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    checkmark: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    disabled: {
        opacity: 0.5,
    },
    disabledLabel: {
        color: '#999',
    },
});
