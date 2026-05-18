import React from 'react';
import './MetricCard.css';

function MetricCard({ title, value, subtitle, icon, highlightColor }) {
    // Determine if it requires special highlights based on highlightColor prop (e.g. green or red accent)

    return (
        <div className="card metric-card">
            <div className="metric-header">
                <span className="metric-title">{title}</span>
                {icon && <div className="metric-icon" style={{ color: highlightColor || 'var(--color-primary)' }}>{icon}</div>}
            </div>
            <div className="metric-content">
                <h3 className="metric-value">{value}</h3>
            </div>
            {subtitle && (
                <div className="metric-footer">
                    <span className="metric-subtitle">{subtitle}</span>
                </div>
            )}
        </div>
    );
}

export default MetricCard;
