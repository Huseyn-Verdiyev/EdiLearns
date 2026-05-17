const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCWuDV95wXWsYBneUGq4fpiSmXIDiRxHuc");

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // dummy
        // Actually SDK doesn't have listModels on the main class easily in all versions?
        // Let's try to just fetch the list if possible, or try a standard one.
        // The google-generative-ai SDK has no direct 'listModels' in the master class in some versions.
        // But let's try a direct REST call to be sure.

        const key = process.env.GEMINI_API_KEY || "AIzaSyCWuDV95wXWsYBneUGq4fpiSmXIDiRxHuc";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        console.log("AVAILABLE MODELS:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listModels();
