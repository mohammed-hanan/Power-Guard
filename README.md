# PowerGuard: Live Energy Monitoring System ⚡

PowerGuard is a modern, high-fidelity energy monitoring application that alerts users to current spikes and voltage fluctuations. It features a fully responsive React Web application alongside a React Native mobile application for Android.

Built to mimic exactly a premium Figma aesthetic, it features live simulated electrical fluctuations, fully structured UI components, and real-time dashboard analytics.

## Structure

This repository contains two main projects:
1. **React Web App** (Root Directory)
2. **React Native Android App** (`/powerguard-android`)

---

## 💻 1. Web Application (React + Vite)
Built with React, Vite, and highly modular vanilla CSS utilizing CSS Variables for precise theming.

### Features
- **Dashboard:** Real-time electricity stats (Power, Active devices, Alerts count, Cost).
- **Devices:** Sortable list of home appliances with their independent current/voltage metrics.
- **Alerts:** Dynamic alert feed that turns red/yellow/blue based on simulated intensity. Includes mock action buttons.
- **Settings:** Toggle options for customizing threshold behavior.

### Getting Started (Web)
1. Navigate to the root folder:
   ```bash
   cd powerguard-repo-name # (Or whatever directory you cloned into)
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 2. Android Application (React Native + Expo)
A native mobile port of the web app using `react-native` and `expo`. Built to have exact 1:1 parity with the web layout but translated into standard Android UI paradigms (Bottom Tabs, ScrollViews).

### Getting Started (Android)
1. Navigate into the mobile directory:
   ```bash
   cd powerguard-android
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo bundler:
   ```bash
   npx expo start --android
   ```
*Note: You must have Android Studio running an Emulator, or the Expo Go app installed on your physical Android device, to view the project.*

---

## 🧠 Core Logic & Extensions
**Live Simulation (`EnergyContext`)**
Both apps share a nearly identical React Context called `EnergyContext`. This file acts as the "Brain" of the operation. It runs a `setInterval` loop every 3 seconds to randomly micro-fluctuate the Amps and Voltage of the mock devices. Occasionally it forces a "spike" or a "drop" to trigger the `critical` or `warning` alerts dynamically in the UI.

If you are a developer continuing this project:
- Replace `EnergyContext` mock data with standard generic `fetch()` or `WebSocket` calls to your real IoT Backend (e.g., AWS IoT, Google Cloud IoT Core).

## Technologies Used
- React 18
- Vite
- React Router DOM
- React Native
- Expo
- React Navigation
- Lucide Icons
