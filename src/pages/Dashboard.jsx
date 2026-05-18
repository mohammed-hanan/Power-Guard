import React, { useState, useEffect, useContext } from 'react';
import { Zap, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../components/MetricCard';
import AlertItem from '../components/AlertItem';
import { EnergyContext } from '../context/EnergyContext';
import './Dashboard.css';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('current');
    const [chartData, setChartData] = useState(() => {
        const saved = localStorage.getItem('powerguard_chart_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [lastUpdated, setLastUpdated] = useState(null);
    const { alerts, mlSystemStatus, totalPower, activeCount, criticalAlertsCount, dailyCost, devices } = useContext(EnergyContext);

    const recentAlerts = alerts.slice(0, 5);

    // Track real-time metric history for the chart
    useEffect(() => {
        if (devices.length === 0) return;

        const now = new Date();
        setLastUpdated(now.toLocaleTimeString());
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const currentTotal = devices.reduce((sum, d) => sum + (Number(d.current) || 0), 0);
        const powerTotal = devices.reduce((sum, d) => sum + (Number(d.power) || 0), 0);
        const voltageAvg = devices.length > 0
            ? devices.reduce((sum, d) => sum + (Number(d.voltage) || 0), 0) / devices.filter(d => d.voltage).length || 0
            : 0;

        const newDataPoint = {
            time: timeString,
            current: parseFloat(currentTotal.toFixed(2)),
            power: parseFloat(powerTotal.toFixed(2)),
            voltage: parseFloat(voltageAvg.toFixed(2))
        };

        setChartData(prevData => {
            const newData = [...prevData, newDataPoint];
            // Keep last 40 data points (approx 3-4 mins of history)
            const slicedData = newData.length > 40 ? newData.slice(newData.length - 40) : newData;
            localStorage.setItem('powerguard_chart_history', JSON.stringify(slicedData));
            return slicedData;
        });

    }, [devices]);

    // Graph configuration based on active tab
    const getChartConfig = () => {
        switch (activeTab) {
            case 'power':
                return { dataKey: 'power', color: 'var(--color-primary)', unit: 'kW' };
            case 'voltage':
                return { dataKey: 'voltage', color: 'var(--color-warning, #ffb300)', unit: 'V' };
            case 'current':
            default:
                return { dataKey: 'current', color: 'var(--color-success)', unit: 'A' };
        }
    };

    const chartConfig = getChartConfig();

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'rgba(11, 12, 16, 0.9)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: chartConfig.color, fontWeight: 'bold' }}>
                        {payload[0].value} {chartConfig.unit}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-page fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Monitor your devices and electricity consumption</p>
                </div>
                <div style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: mlSystemStatus.includes('Anomalies') ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 229, 255, 0.1)',
                    border: `1px solid ${mlSystemStatus.includes('Anomalies') ? 'var(--color-critical)' : 'var(--color-primary)'}`,
                    borderRadius: '8px',
                    color: mlSystemStatus.includes('Anomalies') ? 'var(--color-critical)' : 'var(--color-primary)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    boxShadow: mlSystemStatus.includes('Anomalies') ? '0 0 10px rgba(255, 0, 85, 0.2)' : '0 0 10px rgba(0, 229, 255, 0.2)'
                }}>
                    ML Status: {mlSystemStatus}
                </div>
            </div>

            <div className="ai-training-banner card" style={{
                marginBottom: '1rem',
                borderLeft: '4px solid var(--color-primary)',
                background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.05), transparent)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>🧠 AI Self-Learning Range</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                            The system calculates limits based on your device behavior.
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                            {devices.find(d => d.id === 'esp32_sensor_01')?.expectedMin || '---'}W - {devices.find(d => d.id === 'esp32_sensor_01')?.expectedMax || '---'}W
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>AI-Learned Monitoring Range</div>
                    </div>
                </div>
            </div>

            <div className="metrics-grid">
                <MetricCard
                    title="Total Power"
                    value={`${totalPower} kW`}
                    subtitle={`${(Number(totalPower) * 1000).toFixed(1)} Watts`}
                    icon={<Zap size={20} />}
                    highlightColor="var(--color-primary)"
                />
                <MetricCard
                    title="Active"
                    value={`${activeCount}/${devices.length}`}
                    subtitle="Devices"
                    icon={<Activity size={20} />}
                    highlightColor="var(--color-success)"
                />
                <MetricCard
                    title="Alerts"
                    value={criticalAlertsCount.toString()}
                    subtitle="Critical"
                    icon={<AlertTriangle size={20} />}
                    highlightColor="var(--color-critical)"
                />
            </div>

            <div className="dashboard-content">
                <div className="monitoring-section card">
                    <div className="section-header">
                        <h2>Real-time Monitoring</h2>
                        <div className="status-meta" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="live-badge" style={{
                                backgroundColor: 'rgba(57, 255, 20, 0.15)',
                                color: '#39FF14',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                border: '1px solid rgba(57, 255, 20, 0.3)'
                            }}>LIVE</span>
                            {lastUpdated && <span className="last-sync" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated: {lastUpdated}</span>}
                        </div>
                    </div>

                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
                            onClick={() => setActiveTab('current')}
                        >
                            Current (A)
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'power' ? 'active' : ''}`}
                            onClick={() => setActiveTab('power')}
                        >
                            Power (kW)
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'voltage' ? 'active' : ''}`}
                            onClick={() => setActiveTab('voltage')}
                        >
                            Voltage (V)
                        </button>
                    </div>

                    <div className="chart-container" style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id={`gradient_${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="time"
                                        stroke="var(--text-muted)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="var(--text-muted)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['auto', 'auto']}
                                        allowDataOverflow={false}
                                        padding={{ top: 20, bottom: 20 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey={chartConfig.dataKey}
                                        stroke={chartConfig.color}
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill={`url(#gradient_${activeTab})`}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-placeholder">
                                <div className="chart-info">Waiting for live data...</div>
                            </div>
                        )}
                    </div>
                </div >

                <div className="alerts-section card">
                    <div className="section-header">
                        <h3>Recent Alerts</h3>
                        <p>Latest system notifications</p>
                    </div>
                    <div className="alerts-list">
                        {recentAlerts.map(alert => (
                            <AlertItem
                                key={alert.id}
                                deviceName={alert.device || alert.device_id}
                                message={alert.message}
                                time={alert.timestamp ? new Date(alert.timestamp.seconds * 1000).toLocaleTimeString() : "Just now"}
                                severity={alert.severity}
                                isAnomaly={alert.is_anomaly}
                            />
                        ))}
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Dashboard;
