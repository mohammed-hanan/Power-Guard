import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { LocalNotifications } from '@capacitor/local-notifications';
import { predictDevicePowerRange } from '../services/aiService';

export const EnergyContext = createContext();

// Track which alerts have already triggered a notification so we don't spam the user on re-renders
const processedAlertIds = new Set();

// AI Tracking variables
const aiCheckedDevices = new Set();
const activeAnomalyDevices = new Set();

export function EnergyProvider({ children }) {
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [mlSystemStatus, setMlSystemStatus] = useState("Initializing...");

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const permStatus = await LocalNotifications.checkPermissions();
                if (permStatus.display !== 'granted') {
                    await LocalNotifications.requestPermissions();
                }
            } catch (err) {
                console.log("LocalNotifications not available:", err);
            }
        };
        checkPermissions();

        // 1. Listen to real-time Device Data from Flask API -> Firestore
        const devicesRef = collection(db, 'devices');
        const unsubscribeDevices = onSnapshot(devicesRef, (snapshot) => {
            const devicesData = [];
            snapshot.forEach((docSnap) => {
                const device = { id: docSnap.id, ...docSnap.data() };
                devicesData.push(device);

                // --- LIVE AI MONITORING ENGINE ---
                // All Anomaly detection is now handled by the Python ML Backend
                // to ensure consistency and prevent redundant alerts.

            });
            setDevices(devicesData);
        }, (error) => {
            console.error("Error fetching devices from Firebase:", error);
            // Fallback for when Firebase isn't configured yet
            if (error.code === 'invalid-argument' || error.message.includes('API key')) {
                setMlSystemStatus("Waiting for Firebase Config...");
            }
        });

        // 2. Listen to real-time Alerts / ML Anomalies from Flask API -> Firestore
        let isFirstLoadAlerts = true;
        const alertsRef = collection(db, 'alerts');
        const unsubscribeAlerts = onSnapshot(alertsRef, (snapshot) => {
            const alertsData = [];

            // First, just grab all the data
            snapshot.forEach((doc) => {
                alertsData.push({ id: doc.id, ...doc.data() });
            });

            // If it's the very first time the app opens, we add all existing alerts 
            // to our tracking Set so they DONT trigger historical notifications
            if (isFirstLoadAlerts) {
                snapshot.forEach((doc) => {
                    processedAlertIds.add(doc.id);
                });
                isFirstLoadAlerts = false;
            } else {
                // If the app is already running, we check for new additions
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const newAlert = change.doc.data();
                        const alertId = change.doc.id;

                        // Only notify if we haven't seen this specific ID before
                        if (newAlert.is_anomaly && !processedAlertIds.has(alertId)) {
                            processedAlertIds.add(alertId);
                            try {
                                LocalNotifications.schedule({
                                    notifications: [
                                        {
                                            title: "PowerGuard ML Anomaly",
                                            body: newAlert.message || "A critical anomaly has been detected.",
                                            id: Math.floor(Math.random() * 1000000),
                                        }
                                    ]
                                });
                            } catch (e) {
                                console.log("Failed to send push notification", e);
                            }
                        }
                    }
                });
            }

            // Sort by descending timestamp (most recent first)
            alertsData.sort((a, b) => {
                const timeA = a.timestamp?.seconds || 0;
                const timeB = b.timestamp?.seconds || 0;
                return timeB - timeA;
            });
            setAlerts(alertsData);

            // Check if ML is actively detecting anomalies
            const hasAnomalies = alertsData.some(a => a.is_anomaly);
            setMlSystemStatus(hasAnomalies ? "Active Monitoring (Anomalies Detected)" : "Active Monitoring");

        }, (error) => {
            console.error("Error fetching alerts from Firebase:", error);
        });

        return () => {
            unsubscribeDevices();
            unsubscribeAlerts();
        };
    }, []);

    const totalPower = devices.reduce((acc, curr) => acc + (curr.power || 0), 0).toFixed(2);
    const activeCount = devices.filter(d => d.status !== 'offline').length;
    const criticalAlertsCount = alerts.filter(a => a.severity === 'critical').length;
    const dailyCost = devices.reduce((acc, curr) => acc + (curr.dailyCost || 0), 0).toFixed(2);

    // Global Alert Management
    const removeAlert = async (alertId) => {
        try {
            await deleteDoc(doc(db, 'alerts', alertId));
            // Let the onSnapshot listener naturally remove it from the React array
        } catch (e) {
            console.error("Failed to delete alert:", e);
        }
    };

    const clearAllAlerts = async () => {
        try {
            const promises = alerts.map(alert => deleteDoc(doc(db, 'alerts', alert.id)));
            await Promise.all(promises);
        } catch (e) {
            console.error("Failed to clear all alerts:", e);
        }
    };

    return (
        <EnergyContext.Provider value={{
            devices, alerts, mlSystemStatus, totalPower, activeCount, criticalAlertsCount, dailyCost,
            removeAlert, clearAllAlerts
        }}>
            {children}
        </EnergyContext.Provider>
    );
}
