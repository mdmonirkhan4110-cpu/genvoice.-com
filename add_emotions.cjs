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
  { id: 'surprised', name: 'অবাক', icon: '😲', color: 'indigo', desc: 'বিস্মিত', prompt: 'Speak in a highly surprised, gasping cartoon character voice' },
  { id: 'shy', name: 'লাজুক', icon: '😳', color: 'rose', desc: 'লজ্জা পাওয়া', prompt: 'Speak in a shy, timid, hesitant cartoon character voice' },
  { id: 'tired', name: 'ক্লান্ত', icon: '😫', color: 'stone', desc: 'হাঁপানো', prompt: 'Speak in an exhausted, tired cartoon character voice, panting slightly' },
  { id: 'sleepy', name: 'ঘুমন্ত', icon: '😴', color: 'slate', desc: 'হাই তোলা', prompt: 'Speak in a sleepy, yawning, and drowsy cartoon character voice' },
  { id: 'confident', name: 'আত্মবিশ্বাসী', icon: '😏', color: 'sky', desc: 'দৃঢ়', prompt: 'Speak in a very confident, self-assured cartoon character voice' },
  { id: 'confused', name: 'দ্বিধাগ্রস্ত', icon: '😵', color: 'amber', desc: 'এলোমেলো ভাব', prompt: 'Speak in a confused, unsure, dazed cartoon character voice' },
  { id: 'rushed', name: 'তাড়াহুড়ো', icon: '🏃', color: 'blue', desc: 'দ্রুত কথা', prompt: 'Speak in a very fast, panicked, rushed cartoon character voice' },
  { id: 'cautious', name: 'সতর্ক', icon: '🤫', color: 'teal', desc: 'সাবধানী', prompt: 'Speak in a cautious, whispering, careful cartoon character voice' },
  { id: 'sarcastic', name: 'ব্যঙ্গাত্মক', icon: '🙄', color: 'lime', desc: 'বাঁকা কথা', prompt: 'Speak in a mocking, sarcastic, rolling-eyes cartoon character voice' },
  { id: 'worried', name: 'চিন্তিত', icon: '😟', color: 'cyan', desc: 'উদ্বিগ্ন', prompt: 'Speak in an anxious, worried, fretful cartoon character voice' },
  { id: 'pain', name: 'ব্যথাতুর', icon: '🤕', color: 'red', desc: 'আহ উহ করা', prompt: 'Speak in a cartoon character voice that is in physical pain, saying ouch or groaning' },
  { id: 'pouting', name: 'অভিমানী', icon: '😠', color: 'pink', desc: 'গাল ফোলানো', prompt: 'Speak in a childishly pouting, stubbornly upset cartoon character voice' },
  { id: 'frustrated', name: 'হতাশ', icon: '😤', color: 'orange', desc: 'দীর্ঘশ্বাস', prompt: 'Speak in a highly frustrated, groaning cartoon character voice' },
  { id: 'stubborn', name: 'জেদি', icon: '😠', color: 'rose', desc: 'একগুঁয়ে', prompt: 'Speak in a grumpy, rebellious, and stubborn cartoon character voice' },
  { id: 'romantic', name: 'প্রেমময়', icon: '😍', color: 'purple', desc: 'আদুরে', prompt: 'Speak in a dreamy, romantic, lovestruck cartoon character voice' },
  { id: 'jealous', name: 'ঈর্ষান্বিত', icon: '😒', color: 'emerald', desc: 'হিংসুটে', prompt: 'Speak in a jealous, envious, bitter cartoon character voice' },
  { id: 'curious', name: 'কৌতূহলী', icon: '🤔', color: 'blue', desc: 'প্রশ্ন করার সুর', prompt: 'Speak in a highly curious, inquisitive cartoon character voice' },
  { id: 'sly', name: 'চতুর', icon: '🦊', color: 'amber', desc: 'ধূর্ত ফাঁদ', prompt: 'Speak in a sly, crafty, cunning cartoon character voice' },
  { id: 'derpy', name: 'বোকাটে', icon: '🥴', color: 'lime', desc: 'গর্দভ', prompt: 'Speak in an incredibly dumb, dull-witted, derpy cartoon character voice' },
  { id: 'shouting', name: 'চিৎকার', icon: '📢', color: 'red', desc: 'অনেক জোরে', prompt: 'Speak by loudly shouting and screaming in a cartoon character voice' },
  { id: 'whisper', name: 'ফিসফিস', icon: '🤫', color: 'slate', desc: 'খুব আস্তে', prompt: 'Speak in a completely quiet, secretive whisper in a cartoon character voice' },
  { id: 'robotic', name: 'রোবোটিক', icon: '🤖', color: 'zinc', desc: 'যান্ত্রিক', prompt: 'Speak like a glitching, monotone cartoon robot' },
  { id: 'magical', name: 'জাদুকরী', icon: '✨', color: 'indigo', desc: 'মায়াবী', prompt: 'Speak in an ethereal, magical, mystical cartoon character voice' },
  { id: 'monster', name: 'রাক্ষস', icon: '👹', color: 'red', desc: 'ভয়ানক শব্দ', prompt: 'Speak like a big, scary, grunting cartoon monster' },
  { id: 'stammering', name: 'তোতলা', icon: '😰', color: 'yellow', desc: 'আটকে যাওয়া', prompt: 'Speak in a nervous, stammering, stuttering cartoon character voice' },
  { id: 'sick', name: 'অসুস্থ', icon: '🤧', color: 'emerald', desc: 'হাঁচি কাশি', prompt: 'Speak in a sick cartoon character voice, sneezing and coughing' },
  { id: 'cold', name: 'শীত পাওয়া', icon: '🥶', color: 'cyan', desc: 'দাঁতে দাঁত লাগা', prompt: 'Speak in a freezing, shivering, teeth-chattering cartoon character voice' },
  { id: 'crazy', name: 'পাগল', icon: '🤪', color: 'rose', desc: 'উন্মাদ', prompt: 'Speak in an insane, unhinged, crazy, laughing cartoon character voice' },
  { id: 'posh', name: 'রাজকীয়', icon: '👑', color: 'yellow', desc: 'বড়লোকী স্টাইল', prompt: 'Speak in a snobby, posh, aristocratic, upper-class cartoon character voice' },
  { id: 'solemn', name: 'গুরুগম্ভীর', icon: '🗿', color: 'stone', desc: 'উপদেশ দেয়া', prompt: 'Speak in a very serious, deeply solemn, wise old cartoon character voice' },
  { id: 'whiny', name: 'ঘ্যানঘ্যান', icon: '😫', color: 'pink', desc: 'কান্না করা', prompt: 'Speak in an extremely whiny, annoying, complaining cartoon character voice' },
  { id: 'zombie', name: 'জম্বি', icon: '🧟', color: 'emerald', desc: 'গোঙানি', prompt: 'Speak like a braindead, groaning, moaning cartoon zombie' },
  { id: 'spooky', name: 'ভুতুড়ে', icon: '👻', color: 'slate', desc: 'ভীতিকর', prompt: 'Speak in a spooky, ghostly, haunting cartoon character voice' },
  { id: 'alien', name: 'এলিয়েন', icon: '👽', color: 'lime', desc: 'ভিনগ্রহের', prompt: 'Speak in a weird, bizarre, extra-terrestrial alien cartoon character voice' },
  { id: 'animal', name: 'পশুপাখির মতো', icon: '🐶', color: 'amber', desc: 'নকল করা', prompt: 'Speak with animal-like grunts, squeaks, and noises in a cartoon character voice' },
  { id: 'overdramatic', name: 'অতি নাটকীয়', icon: '🎭', color: 'purple', desc: 'অভিনয়', prompt: 'Speak in an overly dramatic, theatrical, Shakespearean cartoon character voice' },
  { id: 'bored', name: 'উদাসীন', icon: '🥱', color: 'slate', desc: 'বিরক্তি নিয়ে', prompt: 'Speak in an extremely bored, apathetic, monotone cartoon character voice' },
  { id: 'epic', name: 'এপিক', icon: '⚔️', color: 'orange', desc: 'যোদ্ধার গলার স্বর', prompt: 'Speak in an epic, legendary, battle-ready cartoon character voice' }
];`;

code = code.substring(0, emotionsStart) + newEmotions + code.substring(emotionsEnd);
fs.writeFileSync('src/App.tsx', code);
