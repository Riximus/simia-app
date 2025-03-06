import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface GridProps {
    /**
     * Number of columns in the grid.
     * Default is 2.
     */
    columns?: number;
    /**
     * Space (in pixels) between grid items.
     * Default is 8.
     */
    gap?: number;
    /**
     * Optional style for the grid container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Grid items as children.
     */
    children: React.ReactNode;
}

interface GridItemProps {
    /**
     * Optional style for the grid item.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Number of columns this item should span.
     * Default is 1.
     */
    colSpan?: number;
    children: React.ReactNode;
}

/**
 * Grid component that arranges its children in a grid layout.
 * It wraps each child in a view that calculates its width based on the number of columns.
 */
const Grid: React.FC<GridProps> & {
    Item: React.FC<GridItemProps>;
} = ({ columns = 2, gap = 8, style, children }) => {
    // Base container style with explicit types
    const baseContainerStyle: ViewStyle = {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -gap / 2,
        marginVertical: -gap / 2,
    };

    // Combine styles and filter out any falsy values
    const containerStyle = [baseContainerStyle, style].filter(Boolean) as StyleProp<ViewStyle>;

    // Default style applied to each child container; width will be overridden per child if colSpan is specified.
    const defaultChildStyle: ViewStyle = {
        width: `${100 / columns}%`,
        paddingHorizontal: gap / 2,
        paddingVertical: gap / 2,
    };

    return (
        <View style={containerStyle}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // Use colSpan from child props (if provided) to calculate width.
                    const colSpan = child.props.colSpan ?? 1;
                    const itemWidth = `${(100 / columns) * colSpan}%`;
                    return (
                        <View style={[defaultChildStyle, { width: itemWidth as any }]}>
                            {child}
                        </View>

                    );
                }
                return child;
            })}
        </View>
    );
};

/**
 * Grid.Item subcomponent for wrapping individual grid items.
 * It accepts an optional "colSpan" prop to control the width.
 */
Grid.Item = ({ style, children }: GridItemProps) => {
    return <View style={style}>{children}</View>;
};

export default Grid;
