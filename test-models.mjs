import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBBCaayxvT0mfmxzhHPupeFknlQ7ocimI8");

async function listModels() {
    try {
        console.log("Fetching models...");
        // the library might not have a direct listModels, but let's see. 
        // Actually, let's try gemini-1.5-flash-latest or gemini-pro
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Model initialized");
    } catch (e) {
        console.log(e);
    }
}
listModels();
