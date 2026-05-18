import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { Shield, Bell, Moon, Save } from 'lucide-react-native';

export default function SettingsScreen() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>Configure thresholds and preferences</Text>
            </View>

            <Card style={styles.panel}>
                <View style={styles.panelHeader}>
                    <Shield color={theme.colors.primary} size={20} />
                    <Text style={styles.panelTitle}>Alarm Thresholds</Text>
                </View>
                <Text style={styles.panelDesc}>Set limits for critical alarms (Demo read-only)</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Critical Current Variance (%)</Text>
                    <View style={styles.fakeInput}>
                        <Text style={styles.fakeInputValue}>50</Text>
                        <Text style={styles.suffix}>%</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Critical Voltage Threshold (V)</Text>
                    <View style={styles.fakeInput}>
                        <Text style={styles.fakeInputValue}>250</Text>
                        <Text style={styles.suffix}>V</Text>
                    </View>
                </View>
            </Card>

            <Card style={styles.panel}>
                <View style={styles.panelHeader}>
                    <Bell color={theme.colors.primary} size={20} />
                    <Text style={styles.panelTitle}>Notifications</Text>
                </View>

                <View style={styles.toggleGroup}>
                    <View style={styles.toggleInfo}>
                        <Text style={styles.toggleTitle}>Push Notifications</Text>
                        <Text style={styles.toggleDesc}>Receive alerts on your device</Text>
                    </View>
                    <Switch
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    />
                </View>

                <View style={[styles.toggleGroup, { borderBottomWidth: 0 }]}>
                    <View style={styles.toggleInfo}>
                        <Text style={styles.toggleTitle}>Email Summaries</Text>
                        <Text style={styles.toggleDesc}>Daily digest of energy usage</Text>
                    </View>
                    <Switch
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    />
                </View>
            </Card>

            <Card style={styles.panel}>
                <View style={styles.panelHeader}>
                    <Moon color={theme.colors.primary} size={20} />
                    <Text style={styles.panelTitle}>Appearance</Text>
                </View>

                <View style={[styles.toggleGroup, { borderBottomWidth: 0 }]}>
                    <View style={styles.toggleInfo}>
                        <Text style={styles.toggleTitle}>Dark Mode</Text>
                        <Text style={styles.toggleDesc}>Switch to dark theme (Demo)</Text>
                    </View>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    />
                </View>
            </Card>

            <TouchableOpacity style={styles.saveBtn}>
                <Save color="#fff" size={18} />
                <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
    },
    header: {
        paddingTop: 40,
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
    panel: {
        marginBottom: theme.spacing.lg,
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    panelTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
    panelDesc: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginBottom: theme.spacing.lg,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    inputLabel: {
        fontSize: 14,
        color: theme.colors.textMain,
        marginBottom: 6,
        fontWeight: '500',
    },
    fakeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    fakeInputValue: {
        fontSize: 16,
        color: theme.colors.textMain,
    },
    suffix: {
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    toggleGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    toggleTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.textMain,
        marginBottom: 2,
    },
    toggleDesc: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: theme.borderRadius.md,
        marginBottom: 60,
        gap: 8,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});
