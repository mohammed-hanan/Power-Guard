import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Keep ready if you want to use it later

const firebaseConfig = {
    apiKey: "AIzaSyBzMmnZGxc2GUoGPQrX0ruH6_YJRQmDgmo",
    authDomain: "powerguard-2d4ea.firebaseapp.com",
    databaseURL: "https://powerguard-2d4ea-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "powerguard-2d4ea",
    storageBucket: "powerguard-2d4ea.firebasestorage.app",
    messagingSenderId: "709804447696",
    appId: "1:709804447696:web:70b9976278a992ca814bd5",
    measurementId: "G-61X6VP01EB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Keep ready if you want to use it later

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
