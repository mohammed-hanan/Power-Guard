import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate authentication
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-logo-icon">
                        <Zap size={32} color="#fff" fill="#fff" />
                    </div>
                    <h1>PowerGuard</h1>
                    <p>Smart Electricity Monitoring System</p>
                </div>

                <div className="login-card card">
                    <div className="login-card-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to monitor your devices</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="your@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary login-submit-btn">
                            Sign In
                        </button>

                        <div className="login-footer">
                            Don't have an account? <a href="#" className="link-primary">Sign up</a>
                        </div>
                    </form>
                </div>
                <p className="login-demo-text">Demo: Use any email and password to login</p>
            </div>
        </div>
    );
}

export default Login;
