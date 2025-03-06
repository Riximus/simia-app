import React, { createContext, useContext } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

export type ProgressOrientation = 'horizontal' | 'vertical';
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ProgressContextProps {
    value: number;
    orientation: ProgressOrientation;
    size: ProgressSize;
}

// Create a context to share progress props with the filled track.
const ProgressContext = createContext<ProgressContextProps>({
    value: 0,
    orientation: 'horizontal',
    size: 'md',
});

export interface ProgressProps {
    /**
     * The current progress value (0–100).
     */
    value: number;
    /**
     * Orientation of the progress bar.
     * @default horizontal
     */
    orientation?: ProgressOrientation;
    /**
     * Thickness of the progress bar.
     * @default md
     */
    size?: ProgressSize;
    /**
     * Style overrides for the progress track.
     */
    style?: ViewStyle;
    /**
     * The child component should be a ProgressFilledTrack.
     */
    children: React.ReactNode;
}

export const Progress: React.FC<ProgressProps> = ({
                                                      value,
                                                      orientation = 'horizontal',
                                                      size = 'md',
                                                      style,
                                                      children,
                                                  }) => {
    // Define thickness based on size.
    const sizeMapping: Record<ProgressSize, number> = {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 12,
    };

    // For horizontal orientation, the track’s height is determined by the size.
    // For vertical, the width is determined by the size.
    const containerStyle: ViewStyle =
        orientation === 'horizontal'
            ? { height: sizeMapping[size], backgroundColor: '#e0e0e0' }
            : { width: sizeMapping[size], backgroundColor: '#e0e0e0' };

    return (
        <ProgressContext.Provider value={{ value, orientation, size }}>
            <View style={[styles.container, containerStyle, style]}>{children}</View>
        </ProgressContext.Provider>
    );
};

export interface ProgressFilledTrackProps {
    /**
     * Style overrides for the filled portion.
     */
    style?: ViewStyle;
}

export const ProgressFilledTrack: React.FC<ProgressFilledTrackProps> = ({ style }) => {
    const { value, orientation } = useContext(ProgressContext);

    // Calculate the filled track style based on orientation and progress value.
    const fillStyle: ViewStyle =
        orientation === 'horizontal'
            ? { width: `${value}%`, height: '100%', backgroundColor: '#007bff' }
            : { height: `${value}%`, width: '100%', backgroundColor: '#007bff' };

    return <View style={[fillStyle, style]} />;
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        overflow: 'hidden',
    },
});
