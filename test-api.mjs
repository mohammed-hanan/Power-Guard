import { predictDevicePowerRange } from "./src/services/aiService.js";

async function testAI() {
    console.log("Testing Gemini API...");
    const result = await predictDevicePowerRange("Nespresso Coffee Maker");
    console.log("Result:", result);
}

testAI();
