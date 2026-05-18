import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Check localStorage for saved preferences, default to dark and cyan
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');
    const [accentColor, setAccentColor] = useState(localStorage.getItem('appAccentColor') || '#00e5ff');

    // Update the DOM body class whenever the theme changes
    useEffect(() => {
        document.body.className = `theme-${theme}`;
        localStorage.setItem('appTheme', theme);
    }, [theme]);

    // Update CSS Variable globally whenever accent color changes
    useEffect(() => {
        document.documentElement.style.setProperty('--color-primary', accentColor);
        // Calculate a slightly darker version for borders/glows
        document.documentElement.style.setProperty('--border-highlight', `${accentColor}66`);
        document.documentElement.style.setProperty('--border-color', `${accentColor}26`);
        localStorage.setItem('appAccentColor', accentColor);
    }, [accentColor]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}
