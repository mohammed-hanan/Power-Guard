import React from 'react';
import { AlertTriangle, Info, ShieldAlert, BrainCircuit } from 'lucide-react';
import './AlertItem.css';

function AlertItem({ deviceName, message, time, severity, isAnomaly }) {
    const getIcon = () => {
        if (isAnomaly) return <BrainCircuit size={18} />;

        switch (severity) {
            case 'critical':
                return <ShieldAlert size={18} />;
            case 'medium':
                return <AlertTriangle size={18} />;
            case 'low':
            default:
                return <Info size={18} />;
        }
    };

    return (
        <div className={`alert-item ${severity} ${isAnomaly ? 'anomaly-glow' : ''}`} style={isAnomaly ? { borderLeft: '4px solid #ff0055', boxShadow: '0 0 15px rgba(255, 0, 85, 0.4)' } : {}}>
            <div className={`alert-icon-wrapper ${severity}`} style={isAnomaly ? { backgroundColor: 'rgba(255, 0, 85, 0.2)', color: '#ff0055' } : {}}>
                {getIcon()}
            </div>
            <div className="alert-content">
                <div className="alert-header">
                    <span className="alert-device">{deviceName}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isAnomaly && <span className="badge" style={{ backgroundColor: '#ff0055', color: 'white' }}>ML Anomaly</span>}
                        <span className={`badge badge-${severity}`}>{severity}</span>
                    </div>
                </div>
                <p className="alert-message">{message}</p>
                <span className="alert-time">{time}</span>
            </div>
        </div>
    );
}

export default AlertItem;
