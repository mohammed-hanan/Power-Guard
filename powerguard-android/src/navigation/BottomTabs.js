import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Cpu, Bell, Settings } from 'lucide-react-native';
import { theme } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import DevicesScreen from '../screens/DevicesScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textLight,
                tabBarStyle: {
                    backgroundColor: theme.colors.cardBackground,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Devices"
                component={DevicesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Cpu color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Alerts"
                component={AlertsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}
