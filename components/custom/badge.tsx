import React, { createContext, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
} from 'react-native';

// Types for action, variant, and size.
export type BadgeAction = 'error' | 'warning' | 'success' | 'info' | 'muted';
export type BadgeVariant = 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl';

// Context to pass parent badge props down to BadgeText and BadgeIcon.
interface BadgeContextProps {
    action: BadgeAction;
    variant: BadgeVariant;
    size: BadgeSize;
}
const BadgeContext = createContext<BadgeContextProps>({
    action: 'muted',
    variant: 'solid',
    size: 'md',
});

//
// Badge component
//
interface BadgeProps {
    /**
     * Action determines the color scheme.
     * @default "muted"
     */
    action?: BadgeAction;
    /**
     * Variant controls whether the badge is filled (solid) or outlined.
     * @default "solid"
     */
    variant?: BadgeVariant;
    /**
     * Size adjusts padding and text/icon sizes.
     * @default "md"
     */
    size?: BadgeSize;
    /**
     * If provided, the badge becomes touchable.
     */
    onPress?: (event: GestureResponderEvent) => void;
    /**
     * Additional style for the badge container.
     */
    style?: ViewStyle;
    /**
     * Children elements (typically BadgeText and BadgeIcon).
     */
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
                                         action = 'muted',
                                         variant = 'solid',
                                         size = 'md',
                                         onPress,
                                         style,
                                         children,
                                     }) => {
    // Colors inspired by gluestack-ui
    const actionColors: Record<BadgeAction, { background: string; border: string; text: string }> = {
        error: { background: '#FEE2E2', border: '#FCA5A5', text: '#B91C1C' },
        warning: { background: '#FEF9C3', border: '#FDE68A', text: '#92400E' },
        success: { background: '#DCFCE7', border: '#86EFAC', text: '#15803D' },
        info: { background: '#DBEAFE', border: '#93C5FD', text: '#1D4ED8' },
        muted: { background: '#F3F4F6', border: '#D1D5DB', text: '#4B5563' },
    };

    const colors = actionColors[action];

    // Define padding mappings for each size.
    const paddingMapping: Record<BadgeSize, { vertical: number; horizontal: number }> = {
        sm: { vertical: 2, horizontal: 4 },
        md: { vertical: 4, horizontal: 8 },
        lg: { vertical: 6, horizontal: 12 },
        xl: { vertical: 8, horizontal: 16 },
    };

    const { vertical: paddingVertical, horizontal: paddingHorizontal } = paddingMapping[size];

    // Container style
    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical,
        paddingHorizontal,
        borderRadius: 4,
        backgroundColor: variant === 'solid' ? colors.background : 'transparent',
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: colors.border,
    };

    const Component = onPress ? TouchableOpacity : View;

    return (
        <BadgeContext.Provider value={{ action, variant, size }}>
            <Component onPress={onPress} style={[containerStyle, style]}>
                {children}
            </Component>
        </BadgeContext.Provider>
    );
};

//
// BadgeText component
//
interface BadgeTextProps {
    /**
     * Additional text style.
     */
    style?: TextStyle;
    /**
     * If true, text appears bold.
     */
    bold?: boolean;
    /**
     * Underline the text.
     */
    underline?: boolean;
    /**
     * Italic text.
     */
    italic?: boolean;
    /**
     * Content to display.
     */
    children: React.ReactNode;
}

const BadgeText = React.forwardRef<Text, BadgeTextProps>(
    ({ style, bold, underline, italic, children }, ref) => {
        // Consume parent's badge context.
        const { action, size } = useContext(BadgeContext);

        const actionColors: Record<BadgeAction, { text: string }> = {
            error: { text: '#B91C1C' },
            warning: { text: '#92400E' },
            success: { text: '#15803D' },
            info: { text: '#1D4ED8' },
            muted: { text: '#4B5563' },
        };
        const colors = actionColors[action];

        // Define font size mapping.
        const fontMapping: Record<BadgeSize, number> = {
            sm: 10,
            md: 12,
            lg: 14,
            xl: 16,
        };

        const fontSize = fontMapping[size];

        const textStyle: TextStyle = {
            color: colors.text,
            fontSize,
            // textTransform: 'uppercase',
            fontWeight: bold ? 'bold' : '500',
            textDecorationLine: underline ? 'underline' : 'none',
            fontStyle: italic ? 'italic' : 'normal',
        };

        return (
            <Text ref={ref} style={[textStyle, style]}>
                {children}
            </Text>
        );
    }
);

//
// BadgeIcon component
//
interface BadgeIconProps {
    /**
     * Additional style for the icon container.
     */
    style?: ViewStyle;
    /**
     * The icon element to render.
     */
    children: React.ReactNode;
}

const BadgeIcon = React.forwardRef<View, BadgeIconProps>(({ style, children }, ref) => {
    const { action, size } = useContext(BadgeContext);

    // Define icon size mapping.
    const iconMapping: Record<BadgeSize, number> = {
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
    };
    const iconSize = iconMapping[size];

    const actionColors: Record<BadgeAction, { text: string }> = {
        error: { text: '#B91C1C' },
        warning: { text: '#92400E' },
        success: { text: '#15803D' },
        info: { text: '#1D4ED8' },
        muted: { text: '#4B5563' },
    };
    const colors = actionColors[action];

    return (
        <View
            ref={ref}
            style={[
                { justifyContent: 'center', alignItems: 'center', marginRight: 4 },
                style,
            ]}
        >
            {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement, { color: colors.text, size: iconSize })
                : children}
        </View>
    );
});

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';
BadgeIcon.displayName = 'BadgeIcon';

export { Badge, BadgeText, BadgeIcon };
