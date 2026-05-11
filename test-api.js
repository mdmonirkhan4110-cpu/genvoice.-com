import "dotenv/config";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
    }
  })
}).then(res => res.json()).then(data => console.log("gemini-2.5-flash:", JSON.stringify(data).substring(0, 500))).catch(console.error);
