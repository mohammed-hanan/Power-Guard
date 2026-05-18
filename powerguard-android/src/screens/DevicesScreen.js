import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import { EnergyContext } from '../context/EnergyContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function DeviceItem({ device }) {
    return (
        <Card style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
                <View style={styles.titleGroup}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Badge status={device.status} />
                </View>
                <Text style={styles.location}>{device.location}</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statBox, styles.statBoxPrimary]}>
                    <Text style={styles.statLabel}>Current</Text>
                    <Text style={[styles.statValue, { color: theme.colors.primary }]}>{device.current}A</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxSuccess]}>
                    <Text style={styles.statLabel}>Power</Text>
                    <Text style={[styles.statValue, { color: theme.colors.success }]}>{device.power}kW</Text>
                </View>
            </View>

            <View style={styles.footerRow}>
                <Text style={styles.footerText}>Cost: ${device.dailyCost}</Text>
                <Text style={styles.footerText}>Updated: {device.lastUpdated}</Text>
            </View>
        </Card>
    );
}

export default function DevicesScreen() {
    const { devices } = useContext(EnergyContext);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Devices</Text>
                <Text style={styles.subtitle}>Manage electrical devices</Text>
            </View>

            <FlatList
                data={devices}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <DeviceItem device={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
        paddingTop: 60,
        paddingBottom: theme.spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.textMain,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    listContent: {
        padding: theme.spacing.lg,
        paddingTop: 0,
        paddingBottom: 40,
    },
    deviceCard: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    deviceHeader: {
        marginBottom: theme.spacing.md,
    },
    titleGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
    location: {
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    statsRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    statBox: {
        flex: 1,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statBoxPrimary: {
        backgroundColor: '#f8fafc',
    },
    statBoxSuccess: {
        backgroundColor: '#f0fdf4',
        borderColor: '#dcfce7',
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    footerText: {
        fontSize: 12,
        color: theme.colors.textLight,
    }
});
