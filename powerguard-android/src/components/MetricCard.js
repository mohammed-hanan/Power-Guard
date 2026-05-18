import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export function MetricCard({ title, value, subtitle, icon, highlightColor }) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {icon && (
                    <View style={styles.iconContainer}>
                        {React.cloneElement(icon, { color: highlightColor || theme.colors.primary, size: 20 })}
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.value}>{value}</Text>
            </View>

            {subtitle && (
                <View style={styles.footer}>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            )}
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
        minWidth: 140, // For grid layouts
        flex: 1,
        ...theme.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    title: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.textMain,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        color: theme.colors.textLight,
        fontSize: 12,
    },
});
