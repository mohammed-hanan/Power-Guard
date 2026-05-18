import React, { createContext, useState, useEffect } from 'react';

export const EnergyContext = createContext();

export function EnergyProvider({ children }) {
    const [devices, setDevices] = useState([
        {
            id: 1,
            name: "Air Conditioner",
            status: "active",
            category: "HVAC",
            location: "Living Room",
            current: 12.40,
            power: 2.88,
            voltage: 230,
            avgCurrent: 11.80,
            dailyCost: 8.29,
            lastUpdated: new Date().toLocaleTimeString()
        },
        {
            id: 2,
            name: "Refrigerator",
            status: "active",
            category: "Appliance",
            location: "Kitchen",
            current: 4.50,
            power: 1.03,
            voltage: 228,
            avgCurrent: 4.20,
            dailyCost: 2.50,
            lastUpdated: new Date().toLocaleTimeString()
        },
        {
            id: 3,
            name: "Washing Machine",
            status: "active",
            category: "Appliance",
            location: "Laundry Room",
            current: 0.0,
            power: 0.0,
            voltage: 230,
            avgCurrent: 15.00,
            dailyCost: 0.0,
            lastUpdated: new Date().toLocaleTimeString()
        }
    ]);

    const [alerts, setAlerts] = useState([]);

    // Simulation logic runs every 3 seconds to update metrics naturally
    useEffect(() => {
        const interval = setInterval(() => {
            setDevices(prevDevices => {
                let alertsToGenerate = [];

                const updated = prevDevices.map(device => {
                    if (device.status !== "active" && device.status !== "warning" && device.status !== "critical") return device;

                    // random small fluctuation algorithm
                    let fluctuation = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2 change in amps
                    let newCurrent = Math.max(0, device.current + fluctuation);

                    // Occasional Spikes (Simulation)
                    const spikeChance = Math.random();
                    if (spikeChance > 0.95 && device.name === "Washing Machine" && newCurrent < 5) {
                        newCurrent += 18; // Huge spike
                        alertsToGenerate.push({
                            id: Date.now(),
                            device: device.name,
                            message: `Critical current spike detected: ${newCurrent.toFixed(2)}A`,
                            time: new Date().toLocaleTimeString(),
                            severity: "critical",
                            status: "unresolved"
                        });
                    }

                    let newVoltage = 230 + ((Math.random() * 4) - 2); // 228 to 232V
                    if (spikeChance < 0.05 && device.name === "Refrigerator") {
                        newVoltage = 215; // Drop
                        alertsToGenerate.push({
                            id: Date.now() + 1,
                            device: device.name,
                            message: `Voltage fluctuation detected: ${Math.round(newVoltage)}V (below optimal)`,
                            time: new Date().toLocaleTimeString(),
                            severity: "medium",
                            status: "unresolved"
                        });
                    }

                    let newPower = (newCurrent * newVoltage) / 1000;

                    // Determine status dot color
                    let newStatus = "active";
                    if (newCurrent > device.avgCurrent * 1.5) newStatus = "critical";
                    else if (newCurrent > device.avgCurrent * 1.1) newStatus = "warning";

                    return {
                        ...device,
                        current: parseFloat(newCurrent.toFixed(2)),
                        voltage: Math.round(newVoltage),
                        power: parseFloat(newPower.toFixed(2)),
                        status: newStatus,
                        lastUpdated: new Date().toLocaleTimeString()
                    };
                });

                if (alertsToGenerate.length > 0) {
                    setAlerts(prev => [...alertsToGenerate, ...prev]);
                }
                return updated;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const totalPower = devices.reduce((acc, curr) => acc + curr.power, 0).toFixed(2);
    const activeCount = devices.filter(d => d.status !== 'offline').length;
    const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && a.status === 'unresolved').length;
    const dailyCost = devices.reduce((acc, curr) => acc + curr.dailyCost, 0).toFixed(2);

    return (
        <EnergyContext.Provider value={{ devices, alerts, totalPower, activeCount, criticalAlertsCount, dailyCost }}>
            {children}
        </EnergyContext.Provider>
    );
}
