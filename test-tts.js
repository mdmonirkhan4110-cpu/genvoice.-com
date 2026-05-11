import "dotenv/config";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;

async function test() {
  const res20 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
      }
    })
  });
  const data20 = await res20.json();
  console.log("2.0-flash error?", data20.error ? data20.error.message : "Success!");

  const res25 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
      }
    })
  });
  const data25 = await res25.json();
  console.log("2.5-flash error?", data25.error ? data25.error.message : "Success!");
}
test();
