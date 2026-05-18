import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';
import { EnergyContext } from '../context/EnergyContext';
import { MetricCard } from '../components/MetricCard';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Zap, Activity, AlertTriangle, TrendingUp } from 'lucide-react-native';

export default function DashboardScreen() {
    const { totalPower, activeCount, criticalAlertsCount, dailyCost, devices, alerts } = useContext(EnergyContext);
    const recentAlerts = alerts.slice(0, 5);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Monitor your devices and electricity consumption</Text>
            </View>

            <View style={styles.metricsGrid}>
                <MetricCard
                    title="Total Power"
                    value={`${totalPower} kW`}
                    subtitle="Real-time"
                    icon={<Zap />}
                    highlightColor={theme.colors.primary}
                />
                <MetricCard
                    title="Active"
                    value={`${activeCount}/${devices.length}`}
                    subtitle="Devices"
                    icon={<Activity />}
                    highlightColor={theme.colors.success}
                />
                <MetricCard
                    title="Alerts"
                    value={criticalAlertsCount.toString()}
                    subtitle="Critical"
                    icon={<AlertTriangle />}
                    highlightColor={theme.colors.critical}
                />
                <MetricCard
                    title="Daily Cost"
                    value={`$${dailyCost}`}
                    subtitle="Estimated"
                    icon={<TrendingUp />}
                    highlightColor={theme.colors.primary}
                />
            </View>

            <Card style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Real-time Monitoring</Text>
                <Text style={styles.subtitle}>Live electricity consumption data</Text>
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.chartText}>Chart visualization placeholder...</Text>
                </View>
            </Card>

            <View style={styles.alertsSection}>
                <Text style={styles.sectionTitle}>Recent Alerts</Text>
                <Text style={[styles.subtitle, { marginBottom: theme.spacing.md }]}>Latest system notifications</Text>

                {recentAlerts.map(alert => (
                    <Card key={alert.id} style={[styles.alertCard, alert.severity === 'critical' ? styles.alertCritical : alert.severity === 'medium' ? styles.alertWarning : styles.alertLow]}>
                        <View style={styles.alertHeader}>
                            <Text style={styles.alertDevice}>{alert.device}</Text>
                            <Badge status={alert.severity} />
                        </View>
                        <Text style={styles.alertMessage}>{alert.message}</Text>
                        <Text style={styles.alertTime}>{alert.time}</Text>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        paddingTop: 60, // Safe area replacement
    },
    header: {
        marginBottom: theme.spacing.lg,
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
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    chartContainer: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textMain,
        marginBottom: theme.spacing.xs,
    },
    chartPlaceholder: {
        height: 200,
        marginTop: theme.spacing.md,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderStyle: 'dashed',
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartText: {
        color: theme.colors.textLight,
    },
    alertsSection: {
        marginBottom: theme.spacing.xl,
    },
    alertCard: {
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.md,
    },
    alertCritical: { borderLeftWidth: 4, borderLeftColor: theme.colors.critical },
    alertWarning: { borderLeftWidth: 4, borderLeftColor: theme.colors.warning },
    alertLow: { borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    alertDevice: {
        fontWeight: '600',
        fontSize: 15,
        color: theme.colors.textMain,
    },
    alertMessage: {
        color: theme.colors.textMuted,
        fontSize: 13,
        marginBottom: theme.spacing.xs,
    },
    alertTime: {
        color: theme.colors.textLight,
        fontSize: 11,
    }
});
