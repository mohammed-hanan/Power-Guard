import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function checkFirebase() {
    try {
        console.log("--- DEVICES ---");
        const devSnapshot = await getDocs(collection(db, "devices"));
        devSnapshot.forEach(doc => {
            console.log(doc.id, "=>", doc.data());
        });

        console.log("\n--- ALERTS ---");
        const altSnapshot = await getDocs(collection(db, "alerts"));
        altSnapshot.forEach(doc => {
            console.log(doc.id, "=>", doc.data());
        });

        process.exit(0);
    } catch (e) {
        console.error("Error reading DB:", e);
        process.exit(1);
    }
}

checkFirebase();
