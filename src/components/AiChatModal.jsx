import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader, Cpu } from 'lucide-react';
import { askAiAboutDevice } from '../services/aiService';
import './AiChatModal.css';

function AiChatModal({ isOpen, onClose, device }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial greeting when opening a new device
    useEffect(() => {
        if (isOpen && device) {
            setMessages([
                {
                    role: 'ai',
                    text: `Hello! I'm your AI Power Assistant. I'm currently monitoring your **${device.name}**. What would you like to know about its power consumption or performance?`
                }
            ]);
        }
    }, [isOpen, device]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!isOpen || !device) return null;

    const handleSend = async (customText = null) => {
        const query = customText || input;
        if (!query.trim()) return;

        // Add user msg
        const newMessages = [...messages, { role: 'user', text: query }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Fetch AI reply
        const aiResponse = await askAiAboutDevice(device, query);

        setIsLoading(false);
        setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
    };

    const handleQuickAction = (text) => {
        handleSend(text);
    };

    return (
        <div className="ai-modal-overlay">
            <div className="ai-modal-content fade-in">
                <div className="ai-modal-header">
                    <div className="ai-header-title">
                        <Sparkles size={20} color="var(--color-primary)" />
                        <h3>Ask AI: {device.name}</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="ai-chat-area">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.role}`}>
                            {msg.role === 'ai' && <Cpu size={16} className="ai-icon" />}
                            <div className="bubble-text">{msg.text}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-bubble ai loading-bubble">
                            <Cpu size={16} className="ai-icon" />
                            <Loader size={16} className="spin" />
                            <span>AI is analyzing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompts */}
                {messages.length === 1 && !isLoading && (
                    <div className="quick-actions">
                        <button onClick={() => handleQuickAction("Why is the power usage suddenly so high?")}>Why is power high?</button>
                        <button onClick={() => handleQuickAction("Is this device operating safely right now?")}>Is it safe?</button>
                        <button onClick={() => handleQuickAction("How can I reduce the daily cost of this device?")}>How to save money?</button>
                    </div>
                )}

                <div className="ai-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Ask about ${device.name}...`}
                    />
                    <button
                        className="send-btn"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AiChatModal;
