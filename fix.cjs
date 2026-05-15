const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const emotionsStart = code.indexOf('const EMOTIONS = [');
const emotionsEnd = code.indexOf('];', emotionsStart) + 2;

const newEmotions = `const EMOTIONS = [
  { id: 'neutral', name: 'স্বাভাবিক', icon: '😐', color: 'slate', desc: 'সাধারণ কার্টুন ভয়েস', prompt: 'Speak in a normal, animated cartoon character voice' },
  { id: 'happy', name: 'খুশি/হাস্যকর', icon: '😂', color: 'yellow', desc: 'মজার খিলখিল হাসি', prompt: 'Speak in a very happy, exaggerated funny cartoon character voice with giggles' },
  { id: 'sad', name: 'দুঃখিত/কান্না', icon: '😭', color: 'blue', desc: 'কান্নার সুর', prompt: 'Speak in a very sad, sobbing cartoon character voice, like crying childishly' },
  { id: 'angry', name: 'খুব রাগী', icon: '😡', color: 'red', desc: 'তীব্র রাগ', prompt: 'Speak in an extremely angry, aggressive cartoon character voice' },
  { id: 'excited', name: 'উত্তেজিত', icon: '🤩', color: 'pink', desc: 'লাফালাফি', prompt: 'Speak in an overly energetic and excited cartoon character voice' },
  { id: 'scared', name: 'ভয় পাওয়া', icon: '😨', color: 'purple', desc: 'কাঁপা কাঁপা', prompt: 'Speak in a terrified, trembling cartoon character voice' },
  { id: 'silly', name: 'বোকা/ফানি', icon: '🤪', color: 'orange', desc: 'মজার ভঙ্গি', prompt: 'Speak in a silly, goofy, and comical cartoon character voice' },
  { id: 'arrogant', name: 'অহংকারী', icon: '😎', color: 'cyan', desc: 'গর্বিত ভাব', prompt: 'Speak in a boastful, arrogant, and snooty cartoon character voice' },
  { id: 'mysterious', name: 'রহস্যময়', icon: '🕵️', color: 'violet', desc: 'চুপিচুপি', prompt: 'Speak in a sneaky, mysterious, whispering cartoon character voice' },
  { id: 'heroic', name: 'বীরত্বপূর্ণ', icon: '🦸', color: 'emerald', desc: 'সাহসী সুর', prompt: 'Speak in a brave, heroic, and confident cartoon character voice' },
  { id: 'evil', name: 'ভিলেন/শয়তান', icon: '😈', color: 'rose', desc: 'কুটিল হাসি', prompt: 'Speak in an evil, sinister, villainous cartoon character voice with a wicked tone' },
  { id: 'annoyed', name: 'বিরক্ত', icon: '😒', color: 'lime', desc: 'ঘ্যানঘ্যান', prompt: 'Speak in an annoyed, complaining cartoon character voice' },
];`;

code = code.substring(0, emotionsStart) + newEmotions + code.substring(emotionsEnd);

// Increase volume
code = code.replace(/algorithms: \{[\s\S]*?output_files: \[\{ format: 'wav' \}\]/, `algorithms: {
            denoise: true,
            normloudness: true,
            loudnesstarget: -12,
            dynamic_range_compressor: true,
            highpass_filter: false
          },
          output_files: [{ format: 'wav' }]`);

// Fix gender prompt
const oldPrompt = `let prompt = \`\${emotionInstruction}. \${qualityInstruction}\\n\\nText: \${text}\`;`;
const newPrompt = `const selVoiceObj = VOICES.find(v => v.id === selVoice);
        const characterInfo = selVoiceObj ? \`STRICT INSTRUCTION: You are a \${selVoiceObj.cat} voice actor. Your character profile is: \${selVoiceObj.style}. Your behavior, tone, and GENDER MUST strictly match this profile regardless of the text. Do not accidentally switch gender.\` : '';
        
        let prompt = \`\${characterInfo} \${emotionInstruction}. \${qualityInstruction}\\n\\nText: \${text}\`;`;

code = code.replace(oldPrompt, newPrompt);

const oldPrompt2 = `prompt = \`\${emotionInstruction}. \${cartoonAdvice}. \${qualityInstruction}\\n\\nText: \${text}\`;`;
const newPrompt2 = `prompt = \`\${characterInfo} \${emotionInstruction}. \${cartoonAdvice}. \${qualityInstruction}\\n\\nText: \${text}\`;`;

code = code.replace(oldPrompt2, newPrompt2);

fs.writeFileSync('src/App.tsx', code);
