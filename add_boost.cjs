const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the inner loop of createWavBlob
const createWavMatch = `  for (let i = 0; i < pcmData.length; i += 2) {
    view.setUint8(44 + i, pcmData[i]);
    view.setUint8(44 + i + 1, pcmData[i + 1]);
  }`;

const pcmAmplifier = `  // Apply a 3x volume boost to the raw 16-bit PCM data to ensure it's loud enough
  const VOLUME_MULTIPLIER = 3.0;
  for (let i = 0; i < pcmData.length; i += 2) {
    // Reconstruct the 16-bit signed integer (Little Endian)
    const lowByte = pcmData[i];
    const highByte = pcmData[i + 1];
    let sample = (highByte << 8) | lowByte;
    if (sample >= 32768) sample -= 65536; // Convert to signed 16-bit

    // Apply multiplier
    sample *= VOLUME_MULTIPLIER;

    // Clamp to valid 16-bit signed integer range to prevent clipping distortion
    if (sample > 32767) sample = 32767;
    if (sample < -32768) sample = -32768;

    // Convert back to unsigned bytes
    let unsignedSample = sample;
    if (unsignedSample < 0) unsignedSample += 65536;

    view.setUint8(44 + i, unsignedSample & 0xFF);
    view.setUint8(44 + i + 1, (unsignedSample >> 8) & 0xFF);
  }`;

if (code.includes('for (let i = 0; i < pcmData.length; i += 2) {')) {
  code = code.replace(createWavMatch, pcmAmplifier);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Boosted PCM added.");
} else {
  // If it's already there or slightly different
  console.log("Could not find exact PCM writing loop, let's use regex.");
  const pcmLoopRegex = /for\s*\(\s*let\s*i\s*=\s*0;\s*i\s*<\s*pcmData\.length;\s*i\s*\+=\s*2\s*\)\s*\{(?:[^{}]*|)*\}/g;
  code = code.replace(pcmLoopRegex, pcmAmplifier);
  fs.writeFileSync('src/App.tsx', code);
}
