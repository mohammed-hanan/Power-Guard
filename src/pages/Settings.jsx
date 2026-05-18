import React, { useState, useContext } from 'react';
import { Save, Bell, Moon, Brain, Sun, Palette, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import './Settings.css';

function Settings() {
    const { theme, setTheme, accentColor, setAccentColor } = useContext(ThemeContext);
    const [sensitivity, setSensitivity] = useState(5);
    const [saved, setSaved] = useState(false);

    const getSensitivityLabel = () => {
        if (sensitivity <= 3) return { label: 'Low Sensitivity', desc: 'Only flag extreme anomalies. Fewer false alarms.', color: 'var(--color-success)', icon: <CheckCircle size={16} /> };
        if (sensitivity <= 7) return { label: 'Medium Sensitivity', desc: 'Balanced anomaly detection. Recommended.', color: 'var(--color-primary)', icon: <Zap size={16} /> };
        return { label: 'High Sensitivity', desc: 'Flag subtle deviations. May produce more alerts.', color: 'var(--color-critical)', icon: <AlertTriangle size={16} /> };
    };

    const { label, desc, color, icon } = getSensitivityLabel();

    const contamination = (sensitivity / 100).toFixed(2);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="settings-page fade-in">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Configure your ML model sensitivity and app preferences</p>
            </div>

            <div className="settings-grid">
                {/* ML Sensitivity Panel */}
                <div className="settings-panel card">
                    <div className="panel-header">
                        <Brain size={20} color="var(--color-primary)" />
                        <h2>ML Anomaly Sensitivity</h2>
                    </div>
                    <p className="panel-desc">
                        Your Isolation Forest model automatically learns what is "normal" from your ESP32 data.
                        Adjust how strictly it flags anomalies.
                    </p>

                    {/* Sensitivity Meter */}
                    <div style={{ margin: '1.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Low</span>
                            <span style={{ color: color, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {icon} {label}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>High</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(Number(e.target.value))}
                            style={{
                                width: '100%',
                                accentColor: color,
                                height: '6px',
                                cursor: 'pointer',
                            }}
                        />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.6rem' }}>{desc}</p>
                    </div>

                    {/* Stats Box */}
                    <div style={{
                        background: 'rgba(0,229,255,0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginTop: '0.5rem'
                    }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>Contamination Rate</p>
                            <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem' }}>{contamination}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>Anomaly Tolerance</p>
                            <p style={{ color, fontWeight: 700, fontSize: '1.2rem' }}>{sensitivity}%</p>
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                The model treats the top <strong style={{ color: 'var(--color-primary)' }}>{sensitivity}%</strong> most unusual readings as potential faults.
                                Update <code style={{ color: 'var(--color-primary)' }}>contamination={contamination}</code> in your <code style={{ color: 'var(--color-primary)' }}>ml_backend.py</code> to apply.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="settings-column">
                    {/* Notifications Panel */}
                    <div className="settings-panel card">
                        <div className="panel-header">
                            <Bell size={20} color="var(--color-primary)" />
                            <h2>Notifications</h2>
                        </div>
                        <div className="toggle-group">
                            <div className="toggle-info">
                                <strong>Push Notifications</strong>
                                <span>Receive ML alerts on your device</span>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="toggle-group">
                            <div className="toggle-info">
                                <strong>Email Summaries</strong>
                                <span>Daily digest of energy usage</span>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Appearance Panel */}
                    <div className="settings-panel card">
                        <div className="panel-header">
                            {theme === 'dark' ? <Moon size={20} color="var(--color-primary)" /> : <Sun size={20} color="var(--color-primary)" />}
                            <h2>Appearance</h2>
                        </div>
                        <div className="toggle-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                            <div className="theme-buttons" style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                <button className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setTheme('dark')}>
                                    <Moon size={16} /> Dark
                                </button>
                                <button className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setTheme('light')}>
                                    <Sun size={16} /> Light
                                </button>
                            </div>
                        </div>
                        <div className="toggle-group" style={{ marginTop: '1.5rem' }}>
                            <div className="toggle-info">
                                <strong><Palette size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', color: 'var(--color-primary)' }} /> Accent Color</strong>
                                <span>Choose your glowing theme color</span>
                            </div>
                            <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '50%', cursor: 'pointer', backgroundColor: 'transparent' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
                </button>
            </div>
        </div>
    );
}

export default Settings;
