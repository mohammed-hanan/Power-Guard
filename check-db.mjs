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

async function test() {
    try {
        const devicesRef = collection(db, 'devices');
        const snap = await getDocs(devicesRef);
        console.log("Devices empty?", snap.empty);
        console.log("Devices count:", snap.size);
        snap.forEach(doc => {
            console.log(doc.id, "=>", doc.data());
        });
        console.log("SUCCESS");
    } catch (e) {
        console.error("ERROR:", e);
    }
}

test();
