import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export function Badge({ status, label }) {
    let backgroundColor = theme.colors.textMain;
    let textColor = '#fff';

    if (status === 'warning') {
        backgroundColor = theme.colors.warningBg;
        textColor = theme.colors.warning;
    } else if (status === 'critical') {
        backgroundColor = theme.colors.critical;
        textColor = '#fff';
    } else if (status === 'low') {
        backgroundColor = '#f1f5f9';
        textColor = theme.colors.textMuted;
    }

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>
                {label || status}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});
