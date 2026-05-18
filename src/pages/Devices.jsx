import React, { useState, useContext } from 'react';
import { Search, Plus, Activity, Zap, MapPin, Sparkles } from 'lucide-react';
import { EnergyContext } from '../context/EnergyContext';
import AiChatModal from '../components/AiChatModal';
import './Devices.css';

function DeviceCard({ device, onOpenChat }) {
    const [tab, setTab] = useState('statistics');

    return (
        <div className="device-card fade-in">
            <div className="device-header">
                <div className="device-title-group">
                    <h2>{device.name}</h2>
                    <div className={`status-dot ${device.status}`}></div>
                    <span className={`badge badge-${device.status}`}>{device.status}</span>
                </div>
                <div className="device-meta">
                    <span className="meta-item"><Activity size={14} /> {device.category}</span>
                    <span className="meta-item"><MapPin size={14} /> {device.location}</span>
                </div>
                <button
                    style={{
                        marginTop: '12px',
                        width: '100%',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}
                    onClick={() => onOpenChat(device)}
                >
                    <Sparkles size={16} /> Ask AI
                </button>
            </div>

            <div className="device-tabs">
                <button
                    className={`device-tab ${tab === 'statistics' ? 'active' : ''}`}
                    onClick={() => setTab('statistics')}
                >
                    Statistics
                </button>
                <button
                    className={`device-tab ${tab === 'chart' ? 'active' : ''}`}
                    onClick={() => setTab('chart')}
                >
                    Chart
                </button>
            </div>

            {tab === 'statistics' ? (
                <div className="device-stats">
                    <div className="stat-box">
                        <div className="stat-label">
                            <Zap size={14} color="var(--color-primary)" /> Current
                        </div>
                        <div className="stat-value primary">{device.current}A</div>
                        <div className="stat-trend">↗ Above avg</div>
                    </div>
                    <div className="stat-box secondary-bg">
                        <div className="stat-label">
                            <Activity size={14} color="var(--color-success)" /> Power
                        </div>
                        <div className="stat-value success">{device.power}kW</div>
                        <div className="stat-trend muted">{device.voltage}V</div>
                    </div>
                </div>
            ) : (
                <div className="device-chart-placeholder">
                    Linear Chart Simulation...
                </div>
            )}

            <div className="device-footer">
                <div className="footer-row">
                    <span>Average Current</span>
                    <strong>{device.avgCurrent || 0}A</strong>
                </div>
                <div className="footer-row" style={{ color: 'var(--color-primary)' }}>
                    <span>⚡ AI AIowable Max</span>
                    <strong>{device.expectedMax ? `${device.expectedMax}W` : 'Analyzing...'}</strong>
                </div>
                <div className="footer-time">
                    Last updated: {device.lastUpdated}
                </div>
            </div>
        </div>
    );
}

function Devices() {
    const { devices } = useContext(EnergyContext);
    const [searchTerm, setSearchTerm] = useState('');

    // AI Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatDevice, setChatDevice] = useState(null);

    const handleOpenChat = (device) => {
        setChatDevice(device);
        setIsChatOpen(true);
    };

    const filteredDevices = devices.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="devices-page fade-in">
            <div className="page-header devices-header">
                <div>
                    <h1>Devices</h1>
                    <p>Manage and monitor your electrical devices</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={16} /> Add Device
                </button>
            </div>

            <div className="search-bar">
                <Search size={18} color="var(--text-light)" />
                <input
                    type="text"
                    placeholder="Search devices by name or location..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="devices-list">
                {filteredDevices.map(device => (
                    <DeviceCard key={device.id} device={device} onOpenChat={handleOpenChat} />
                ))}
            </div>

            <AiChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                device={chatDevice}
            />
        </div>
    );
}

export default Devices;
