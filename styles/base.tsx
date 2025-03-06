import { StyleSheet } from 'react-native';
import {Colors} from '@/constants/Colors'

export const baseStyles = StyleSheet.create({
    textOpacity: {
        opacity: 0.8
    },
    headingOpacity: {
        opacity: 0.5
    },
    iconOpacity: {
        opacity: 0.8
    },
    success: {
        color: Colors.light.success
    },
    badgeSpacing: {
        padding: 2
    }
})
