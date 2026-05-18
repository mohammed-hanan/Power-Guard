import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCXW5xXWinLR-CvmGiqRDtx2BU3PtuUg9w",
    authDomain: "powerguard-2d4ea.firebaseapp.com",
    projectId: "powerguard-2d4ea",
    storageBucket: "powerguard-2d4ea.firebasestorage.app",
    messagingSenderId: "188494014708",
    appId: "1:188494014708:web:6b2f1c85c927c3daff96a1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestDevice() {
    try {
        console.log("Adding Coffee Maker to Firebase...");
        await addDoc(collection(db, "devices"), {
            name: "Nespresso Coffee Maker",
            power: 0, // Starts at 0W
            status: "online",
            dailyCost: 0,
            timestamp: serverTimestamp()
        });
        console.log("Device added successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Error adding device: ", e);
        process.exit(1);
    }
}

addTestDevice();
