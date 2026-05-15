const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const newVoices = `const VOICES = [
  // Female (মেয়ের ভয়েস) - 16
  { id: 'f_child_1', name: 'রিয়া', voiceId: 'Aoede', style: 'ছোট মেয়ে (শিশু)', cat: 'female' },
  { id: 'f_child_2', name: 'মিম', voiceId: 'Kore', style: 'ছোট মেয়ে (কিউট)', cat: 'female' },
  { id: 'f_child_3', name: 'সুমি', voiceId: 'Leda', style: 'ছোট মেয়ে (দুষ্টু)', cat: 'female' },
  { id: 'f_child_4', name: 'নুসরাত', voiceId: 'Callirrhoe', style: 'ছোট মেয়ে (স্মার্ট)', cat: 'female' },
  
  { id: 'f_young_1', name: 'বৃষ্টি', voiceId: 'Despina', style: 'ইয়াং মেয়ে (শান্ত)', cat: 'female' },
  { id: 'f_young_2', name: 'মেঘলা', voiceId: 'Erinome', style: 'ইয়াং মেয়ে (স্বাভাবিক)', cat: 'female' },
  { id: 'f_young_3', name: 'নদী', voiceId: 'Achird', style: 'ইয়াং মেয়ে (উচ্ছল)', cat: 'female' },
  { id: 'f_young_4', name: 'নিপা', voiceId: 'Zubenelgenubi', style: 'ইয়াং মেয়ে (লাজুক)', cat: 'female' },

  { id: 'f_adult_1', name: 'সালমা', voiceId: 'Sadachbia', style: 'বড় মেয়ে (চটপটে)', cat: 'female' },
  { id: 'f_adult_2', name: 'রিনা', voiceId: 'Laomedeia', style: 'বড় মেয়ে (গম্ভীর)', cat: 'female' },
  { id: 'f_adult_3', name: 'তানিয়া', voiceId: 'Gacrux', style: 'বড় মেয়ে (সাহসী)', cat: 'female' },
  { id: 'f_adult_4', name: 'ফাতেমা', voiceId: 'Achernar', style: 'বড় মেয়ে (নরম কণ্ঠ)', cat: 'female' },

  { id: 'f_old_1', name: 'রহিমা', voiceId: 'Pulcherrima', style: 'বয়স্কা মহিলা (স্নেহময়ী)', cat: 'female' },
  { id: 'f_old_2', name: 'হাজেরা', voiceId: 'Vindemiatrix', style: 'বয়স্কা মহিলা (উপদেশমূলক)', cat: 'female' },
  { id: 'f_old_3', name: 'কুলসুম', voiceId: 'Aoede', style: 'বয়স্কা মহিলা (ধীর)', cat: 'female' },
  { id: 'f_old_4', name: 'আমেনা', voiceId: 'Laomedeia', style: 'বয়স্কা মহিলা (কড়া)', cat: 'female' },

  // Male (ছেলের ভয়েস) - 16
  { id: 'm_child_1', name: 'রবিন', voiceId: 'Puck', style: 'ছোট ছেলে (হাস্যকর)', cat: 'male' },
  { id: 'm_child_2', name: 'সিয়াম', voiceId: 'Enceladus', style: 'ছোট ছেলে (চঞ্চল)', cat: 'male' },
  { id: 'm_child_3', name: 'তামিম', voiceId: 'Zephyr', style: 'ছোট ছেলে (স্মার্ট)', cat: 'male' },
  { id: 'm_child_4', name: 'জিসান', voiceId: 'Sulafat', style: 'ছোট ছেলে (উড়ালচণ্ডী)', cat: 'male' },

  { id: 'm_young_1', name: 'হৃদয়', voiceId: 'Umbriel', style: 'ইয়াং ছেলে (স্বাভাবিক)', cat: 'male' },
  { id: 'm_young_2', name: 'রাজ', voiceId: 'Algieba', style: 'ইয়াং ছেলে (স্পষ্ট)', cat: 'male' },
  { id: 'm_young_3', name: 'আকাশ', voiceId: 'Fenrir', style: 'ইয়াং ছেলে (রাগী)', cat: 'male' },
  { id: 'm_young_4', name: 'রনি', voiceId: 'Alnilam', style: 'ইয়াং ছেলে (হিরো)', cat: 'male' },

  { id: 'm_adult_1', name: 'মনির', voiceId: 'Charon', style: 'বড় ছেলে (গম্ভীর)', cat: 'male' },
  { id: 'm_adult_2', name: 'রফিক', voiceId: 'Iapetus', style: 'বড় ছেলে (গভীর)', cat: 'male' },
  { id: 'm_adult_3', name: 'জামাল', voiceId: 'Schedar', style: 'বড় ছেলে (ভিলেন)', cat: 'male' },
  { id: 'm_adult_4', name: 'কামাল', voiceId: 'Sadaltager', style: 'বড় ছেলে (ধীরস্থির)', cat: 'male' },

  { id: 'm_old_1', name: 'মুসলিম', voiceId: 'Orus', style: 'বয়স্ক (মজার দৈত্য)', cat: 'male' },
  { id: 'm_old_2', name: 'খালেক', voiceId: 'Algenib', style: 'বয়স্ক (ভারী কণ্ঠ)', cat: 'male' },
  { id: 'm_old_3', name: 'জলিল', voiceId: 'Rasalgethi', style: 'বয়স্ক (জ্ঞানী)', cat: 'male' },
  { id: 'm_old_4', name: 'জব্বার', voiceId: 'Charon', style: 'বয়স্ক (কড়া)', cat: 'male' },

  // Voiceover (নেপথ্য কণ্ঠ) - 2
  { id: 'vo_female', name: 'নেপথ্য নারী', voiceId: 'Autonoe', style: 'মেয়ে (নেপথ্য কণ্ঠ)', cat: 'voiceover' },
  { id: 'vo_male', name: 'নেপথ্য পুরুষ', voiceId: 'Algenib', style: 'ছেলে (নেপথ্য কণ্ঠ)', cat: 'voiceover' }
];`;

const startIndex = code.indexOf('const VOICES = [');
const endIndex = code.indexOf('const EMOTIONS = [');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newVoices + '\n\n' + code.substring(endIndex);
}

// Ensure selVoice defaults to f_child_1 instead of Kore
code = code.replace(/const \[selVoice, setSelVoice\] = useState<string>\(\(\) => localStorage\.getItem\('genvoice_voice'\) \|\| 'Kore'\);/, "const [selVoice, setSelVoice] = useState<string>(() => localStorage.getItem('genvoice_voice') || 'f_child_1');");

// In API request:
code = code.replace(/prebuiltVoiceConfig: \{ voiceName: selVoice \}/g, "prebuiltVoiceConfig: { voiceName: VOICES.find(v => v.id === selVoice)?.voiceId || 'Aoede' }");

// Download filename and history recording string replacements:
code = code.replace(/a\.download = \`genvoice_\$\{selVoice\}_\$\{selEmotion\}_\$\{Date\.now\(\)\}\.wav\`;/g, "const selVoiceObj = VOICES.find(v => v.id === selVoice);\n    a.download = `genvoice_${selVoiceObj?.voiceId || 'audio'}_${selEmotion}_${Date.now()}.wav`;");

code = code.replace(/text: \`Listen to this \$\{selEmotion\} speech by \$\{selVoice\}\`/g, "text: `Listen to this ${selEmotion} speech by ${VOICES.find(v => v.id === selVoice)?.name || selVoice}`");
code = code.replace(/navigator\.clipboard\.writeText\(\`GenVoice: \$\{selEmotion\} speech by \$\{selVoice\}\`\)/g, "navigator.clipboard.writeText(`GenVoice: ${selEmotion} speech by ${VOICES.find(v => v.id === selVoice)?.name || selVoice}`)");

// Update JSX map from key={v.name} -> key={v.id}
code = code.replace(/key=\{v\.name\}/g, "key={v.id}");
// Update JSX onClick={...setSelVoice(v.name)} -> onClick={...setSelVoice(v.id)}
code = code.replace(/onClick=\{\(\) => setSelVoice\(v\.name\)\}/g, "onClick={() => setSelVoice(v.id)}");
// Update selVoice === v.name -> selVoice === v.id inside the map block
code = code.replace(/selVoice === v\.name/g, "selVoice === v.id");

// Finally update the voice name display
code = code.replace(/<div className="text-xs font-black text-white tracking-tight">\{selVoice\}<\/div>/, '<div className="text-xs font-black text-white tracking-tight">{VOICES.find(v => v.id === selVoice)?.name || selVoice}</div>');

// Update history voice field mapping.
code = code.replace(/voice: selVoice,/g, "voice: VOICES.find(v => v.id === selVoice)?.name || selVoice,");

fs.writeFileSync('src/App.tsx', code);
