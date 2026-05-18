import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { EnergyProvider } from './src/context/EnergyContext';
import BottomTabs from './src/navigation/BottomTabs';

export default function App() {
    return (
        <EnergyProvider>
            <NavigationContainer>
                <BottomTabs />
            </NavigationContainer>
        </EnergyProvider>
    );
}
