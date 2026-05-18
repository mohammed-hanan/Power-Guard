import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { EnergyContext } from '../context/EnergyContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { ShieldAlert, AlertTriangle, CheckCircle, PowerOff, Clock } from 'lucide-react-native';

export default function AlertsScreen() {
    const { alerts } = useContext(EnergyContext);

    const getIcon = (severity) => {
        const size = 24;
        switch (severity) {
            case 'critical': return <ShieldAlert color={theme.colors.critical} size={size} />;
            case 'medium': return <AlertTriangle color={theme.colors.warning} size={size} />;
            case 'low': return <CheckCircle color={theme.colors.primary} size={size} />;
            default: return <AlertTriangle color={theme.colors.warning} size={size} />;
        }
    };

    const renderAlert = ({ item: alert }) => {
        const isResolved = alert.status === 'resolved';

        return (
            <View style={[styles.alertContainer, isResolved && styles.resolvedAlert]}>
                <View style={[styles.iconBox, styles[`iconBox${alert.severity}`]]}>
                    {getIcon(alert.severity)}
                </View>

                <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                        <Text style={styles.deviceTitle}>{alert.device}</Text>
                        <Badge status={alert.severity} />
                    </View>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>

                    {!isResolved ? (
                        <View style={styles.actionsBox}>
                            {alert.severity === 'critical' && (
                                <TouchableOpacity style={[styles.btn, styles.btnDanger]}>
                                    <PowerOff color="#fff" size={14} />
                                    <Text style={styles.btnTextWhite}>Turn Off</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
                                <Clock color={theme.colors.textMain} size={14} />
                                <Text style={styles.btnText}>Snooze</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
                                <CheckCircle color={theme.colors.textMain} size={14} />
                                <Text style={styles.btnText}>Acknowledge</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.resolvedStatusBox}>
                            <CheckCircle color={theme.colors.success} size={14} />
                            <Text style={styles.resolvedText}>Resolved</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Alerts History</Text>
                <Text style={styles.subtitle}>Review system notifications and fluctuations</Text>
            </View>

            {alerts.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No alerts generated yet. Waiting for simulation...</Text>
                </View>
            ) : (
                <FlatList
                    data={alerts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderAlert}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
        padding: theme.spacing.md,
        paddingTop: 0,
        paddingBottom: 40,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    emptyText: {
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
    alertContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    resolvedAlert: {
        opacity: 0.7,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    iconBoxcritical: { backgroundColor: theme.colors.criticalBg },
    iconBoxmedium: { backgroundColor: theme.colors.warningBg },
    iconBoxlow: { backgroundColor: '#eff6ff' },
    alertContent: {
        flex: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    deviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
    alertMessage: {
        fontSize: 14,
        color: theme.colors.textMuted,
        lineHeight: 20,
        marginBottom: 6,
    },
    alertTime: {
        fontSize: 12,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.md,
    },
    actionsBox: {
        flexDirection: 'column',
        gap: 8,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: theme.borderRadius.md,
        gap: 6,
    },
    btnDanger: {
        backgroundColor: theme.colors.critical,
    },
    btnSecondary: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    btnTextWhite: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    btnText: {
        color: theme.colors.textMain,
        fontWeight: '600',
        fontSize: 13,
    },
    resolvedStatusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.successBg,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        gap: 6,
    },
    resolvedText: {
        color: theme.colors.success,
        fontWeight: '600',
        fontSize: 13,
    }
});
