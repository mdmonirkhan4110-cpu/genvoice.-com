const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldPrompt1 = `const qualityInstruction = "CRITICAL AUDIO REQUIREMENT: The output MUST be pristine, broadcast-level studio quality. ZERO background noise, ZERO static, ZERO metallic or robotic artifacts, and absolutely NO audio clipping or distortion. Speak clearly with perfect articulation and professional microphone etiquette.";`;
const newPrompt1 = `const qualityInstruction = "CRITICAL AUDIO REQUIREMENT: The output MUST be pristine, broadcast-level studio quality. Speak LOUDLY and CLEARLY with high audio volume. ZERO background noise, ZERO static. Ensure the audio volume output is fully maximized and perfectly audible. Maintain strict GENDER consistency based on your character profile.";`;

code = code.replace(oldPrompt1, newPrompt1);
fs.writeFileSync('src/App.tsx', code);
