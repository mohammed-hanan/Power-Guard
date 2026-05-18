import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export function Card({ children, style }) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
});
