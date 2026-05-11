const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const translations = {
  'Neutral': ['স্বাভাবিক', 'সাধারণ'],
  'Happy': ['খুশি', 'প্রাণবন্ত'],
  'Sad': ['দুঃখিত', 'ধীর'],
  'Angry': ['রাগী', 'তীব্র'],
  'Excited': ['উত্তেজিত', 'শক্তিপূর্ণ'],
  'Calm': ['শান্ত', 'স্নিগ্ধ'],
  'Fearful': ['ভীত', 'উদ্বিগ্ন'],
  'Surprised': ['অবাক', 'আশ্চর্য'],
  'Whisper': ['ফিসফিস', 'নীরব'],
  'Shout': ['চিৎকার', 'উচ্চস্বর'],
  'Cry': ['কান্না', 'ডুকরে'],
  'Laugh': ['হাসি', 'খিলখিল'],
  'Romantic': ['রোমান্টিক', 'স্নেহপূর্ণ'],
  'Mystery': ['রহস্যময়', 'গোপনীয়'],
  'Sarcastic': ['ব্যঙ্গাত্মক', 'বিদ্রূপ'],
  'Serious': ['গুরুগম্ভীর', 'আনুষ্ঠানিক'],
  'Friendly': ['বন্ধুত্বপূর্ণ', 'উষ্ণ'],
  'Pro': ['পেশাদার', 'কর্মস্থান'],
  'Dramatic': ['নাটকীয়', 'অভিনয়'],
  'Tired': ['ক্লান্ত', 'ঘুমন্ত'],
  'Energy': ['চনমনে', 'দ্রুত'],
  'Confident': ['আত্মবিশ্বাসী', 'দৃঢ়'],
  'Shy': ['লাজুক', 'নীরব'],
  'Hopeful': ['আশাবাদী', 'ইতিবাচক'],
  'Bored': ['বিরক্ত', 'একঘেয়ে'],
  'Anxious': ['উদ্বিগ্ন', 'নার্ভাস'],
  'Proud': ['গর্বিত', 'মহান'],
  'Guilty': ['অপরাধী', 'অনুশোচনা'],
  'Jealous': ['ঈর্ষাকাতর', 'হিংসুটে'],
  'Lonely': ['একা', 'বিচ্ছিন্ন'],
  'Grateful': ['কৃতজ্ঞ', 'ধন্যবাদ'],
  'Curious': ['কৌতূহলী', 'অনুসন্ধিৎসু'],
  'Firm': ['দৃঢ়সংকল্প', 'শক্তিশালী'],
  'Relaxed': ['আরামদায়ক', 'ঠান্ডা'],
  'Worried': ['চিন্তিত', 'অস্থির'],
  'Inspired': ['অনুপ্রাণিত', 'সৃজনশীল'],
  'Silly': ['বোকা', 'মজার'],
  'Grumpy': ['বদমেজাজি', 'রাগী'],
  'Peace': ['শান্তিপূর্ণ', 'প্রশান্ত'],
  'Old': ['স্মৃতিকাতর', 'অতীত'],
  'Brave': ['সাহসী', 'নির্ভয়'],
  'Kind': ['দয়ালু', 'ভদ্র'],
  'Stern': ['ক কঠোর', 'কড়া'],
  'Play': ['খেলোয়াড়', 'মজা'],
  'Elegant': ['মার্জিত', 'শৌখিন'],
  'Robot': ['রোবটিক', 'ফ্ল্যাট'],
  'Ghost': ['ভৌতিক', 'ভয়ানক'],
  'Hero': ['বীরত্বপূর্ণ', 'মহাকাব্যিক'],
  'Evil': ['খলনায়ক', 'অন্ধকার'],
  'Cartoon Joy': ['কার্টুন খুশি', 'অ্যানিমে'],
  'Cartoon Fury': ['কার্টুন রাগী', 'নাটকীয়'],
  'Cartoon Panic': ['কার্টুন ভীত', 'মজার'],
  'Cartoon Crying': ['কার্টুন কান্না', 'দুঃখিত'],
  'Evil Plan': ['শয়তানি বুদ্ধি', 'গোপন'],
  'Hyperactive': ['অতিচঞ্চল', 'দ্রুত'],
  'Sleepyhead': ['ঘুমকাতুরে', 'ক্লান্ত'],
  'Confused': ['বিভ্রান্ত', 'মাথাব্যথা'],
  'Monster': ['দানব', 'পশু'],
  'Child': ['শিশু', 'কিউট'],
  'Alien': ['এলিয়েন', 'অদ্ভুত'],
  'Silly/Funny': ['হাস্যকর', 'পাগলাটে'],
  'Witch/Old': ['ডাইনি', 'ভাঙ্গা কণ্ঠ'],
  'Goofy Giant': ['দৈত্য', 'গভীর'],
  'Mad Scientist': ['পাগল বিজ্ঞানী', 'চঞ্চল'],
  'Crying': ['কান্না', 'আবেগপূর্ণ'],
  'Sneaky': ['গোপন', 'সন্দেহজনক'],
  'Sassy': ['অহংকারী', 'আত্মবিশ্বাসী'],
  'Heroic Hero': ['হিরো', 'সাহসী'],
  'Evil Cackle': ['শয়তানের হাসি', 'উন্মাদ'],
  'Swift Ninja': ['নিনজা', 'তড়িৎ'],
  'Hearty Pirate': ['জলদস্যু', 'কর্কশ'],
  'Tiny Fairy': ['ছোট পরি', 'হালকা'],
  'Fiery Dragon': ['ড্রাগন', 'শক্তিশালী'],
  'Glitchy Bot': ['নষ্ট রোবট', 'ভাঙ্গা']
};

const emotionRe = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*icon:\s*'([^']+)',\s*color:\s*'([^']+)',\s*desc:\s*'([^']+)',\s*prompt:\s*'([^']+)'\s*\}/g;

content = content.replace(emotionRe, (match, id, name, icon, color, desc, prompt) => {
  let [newName, newDesc] = translations[name] || [name, desc];
  
  if(id === 'disappointed') {
    newName = 'হতাশ';
    newDesc = 'দুঃখ';
  }
  
  return `{ id: '${id}', name: '${newName}', icon: '${icon}', color: '${color}', desc: '${newDesc}', prompt: '${prompt}' }`;
});

// Also replace the UI text for "Select Emotion"
content = content.replace(/Select Emotion/g, "ইমোশন নির্বাচন করুন");
content = content.replace(/Type any emotion \(e\.g\. "whispering", "crying"\)/g, "যেকোনো ইমোশন লিখুন (যেমন: \"হাসি\", \"কান্না\")");

fs.writeFileSync('src/App.tsx', content);
