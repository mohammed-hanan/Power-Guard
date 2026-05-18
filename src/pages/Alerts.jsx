import React, { useState, useContext } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, PowerOff, Clock, Search, Filter, Trash2 } from 'lucide-react';
import { EnergyContext } from '../context/EnergyContext';
import './Alerts.css';

function Alerts() {
    const [filter, setFilter] = useState('all');
    const { alerts, removeAlert, clearAllAlerts } = useContext(EnergyContext);

    const filteredAlerts = alerts;

    const getIcon = (severity) => {
        switch (severity) {
            case 'critical': return <ShieldAlert size={24} />;
            case 'medium': return <AlertTriangle size={24} />;
            case 'low': return <CheckCircle size={24} />;
            default: return <AlertTriangle size={24} />;
        }
    };

    return (
        <div className="alerts-page fade-in">
            <div className="page-header alerts-header">
                <div>
                    <h1>Alerts History</h1>
                    <p>Review and manage system notifications and fluctuations</p>
                </div>
            </div>

            <div className="alerts-toolbar">
                <div className="search-bar alerts-search">
                    <Search size={18} color="var(--text-light)" />
                    <input type="text" placeholder="Search alerts..." className="search-input" />
                </div>
                <div className="filter-group">
                    <button className="btn btn-secondary" onClick={clearAllAlerts}><Trash2 size={16} /> Clear All</button>
                    <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
                </div>
            </div>

            <div className="alerts-container">
                {filteredAlerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No alerts generated yet. Waiting for simulation spikes...
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <div key={alert.id} className={`alert-card ${alert.severity} ${alert.status === 'resolved' ? 'resolved' : ''}`}>
                            <div className={`alert-card-icon ${alert.severity}`}>
                                {getIcon(alert.severity)}
                            </div>
                            <div className="alert-card-content">
                                <div className="alert-card-header">
                                    <h3>{alert.device || alert.device_id}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {alert.is_anomaly && <span className="badge" style={{ backgroundColor: '#ff0055', color: 'white' }}>ML Anomaly</span>}
                                        <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                                    </div>
                                </div>
                                <p className="alert-card-message">{alert.message}</p>
                                <span className="alert-card-time">
                                    {alert.timestamp ? new Date(alert.timestamp.seconds * 1000).toLocaleTimeString() : "Just now"}
                                </span>
                            </div>

                            {alert.status !== 'resolved' && (
                                <div className="alert-card-actions">
                                    {alert.severity === 'critical' && (
                                        <button className="btn btn-danger btn-sm">
                                            <PowerOff size={14} /> Power Off
                                        </button>
                                    )}
                                    <button className="btn btn-secondary btn-sm" onClick={() => removeAlert(alert.id)}>
                                        <Trash2 size={14} /> Dismiss
                                    </button>
                                    <button className="btn btn-secondary btn-sm">
                                        <CheckCircle size={14} /> Ack
                                    </button>
                                </div>
                            )}
                            {alert.status === 'resolved' && (
                                <div className="alert-card-actions">
                                    <div className="alert-card-status">
                                        <span className="resolved-text"><CheckCircle size={14} /> Resolved</span>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" onClick={() => removeAlert(alert.id)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Alerts;
