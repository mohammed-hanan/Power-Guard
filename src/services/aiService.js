import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the user's provided key
const genAI = new GoogleGenerativeAI("AIzaSyBBCaayxvT0mfmxzhHPupeFknlQ7ocimI8");

/**
 * predictDevicePowerRange
 * Asks the Gemini AI to estimate the normal operating wattage of a household/industrial device.
 * It enforces a strict JSON output schema.
 * 
 * @param {string} deviceName - The name of the device (e.g., "Air Conditioner", "Television")
 * @returns {Promise<{min: number, max: number}>} - The expected min and max power draw in Watts
 */
export async function predictDevicePowerRange(deviceName) {
    try {
        if (!deviceName) return null;

        // We use the speedy gemini-2.5-flash model for this task
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            // We force the AI to return clean JSON so our app doesn't break parsing it
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `You are an expert electrical engineer. Estimate the minimum and maximum normal operating wattage for a household or industrial device named: "${deviceName}". Your entire response must be a single, valid JSON object with entirely lowercase keys and no markdown backticks. It must contain only two properties: "min" (integer) and "max" (integer). Example: {"min": 50, "max": 150}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the strict JSON returned by Gemini
        const parsedResponse = JSON.parse(responseText.trim());

        if (typeof parsedResponse.min === 'number' && typeof parsedResponse.max === 'number') {
            console.log(`[AI Prediction | ${deviceName}] `, parsedResponse);
            return parsedResponse;
        }

        throw new Error("Invalid format returned from AI.");

    } catch (error) {
        console.error(`AI Prediction Failed for ${deviceName}:`, error);
        return null;
    }
}

/**
 * askAiAboutDevice
 * Allows the user to ask an open-ended question to Gemini about a specific device.
 */
export async function askAiAboutDevice(deviceData, query) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are a helpful and expert AI assistant integrated into a power monitoring app. 
The user is asking you a question about their following device:
Device Name: ${deviceData.name}
Current Power: ${deviceData.power}W
Average Current: ${deviceData.avgCurrent || 0}A
Expected AI Max Power: ${deviceData.expectedMax || 'Unknown'}W
Status: ${deviceData.status}

User Query: "${query}"

Provide a concise, helpful, and insightful response. Keep it under 3 paragraphs. Use plain text or basic markdown.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        console.error("AI Chat Error:", e);
        return "Sorry, I am having trouble connecting to the AI core right now.";
    }
}
