const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  // Copy PCM data
  const bytes = new Uint8Array(buffer, 44);
  bytes.set(pcmData);`;

const newStr = `  // Copy and amplify PCM data manually
  // Gemini TTS tends to be quiet, applying a 3.0x software gain
  const VOLUME_MULTIPLIER = 3.0;
  for (let i = 0; i < pcmData.length; i += 2) {
    const lowByte = pcmData[i];
    const highByte = pcmData[i + 1];
    
    // Convert Little-Endian to 16-bit signed integer
    let sample = (highByte << 8) | lowByte;
    if (sample >= 32768) sample -= 65536;

    // Apply digital gain
    sample = Math.floor(sample * VOLUME_MULTIPLIER);

    // Hard clip to avoid integer overflow static
    if (sample > 32767) sample = 32767;
    if (sample < -32768) sample = -32768;

    // Convert back to 16-bit unsigned
    let unsignedSample = sample;
    if (unsignedSample < 0) unsignedSample += 65536;

    // Write back into the new ArrayBuffer view directly by bypassing bytes.set
    view.setUint8(44 + i, unsignedSample & 0xFF);
    view.setUint8(44 + i + 1, (unsignedSample >> 8) & 0xFF);
  }`;

if(code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully boosted volume via manual PCM amplification.');
} else {
  console.log('Could not find the target string.')
}
