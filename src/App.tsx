/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ChangeEvent, Component, ErrorInfo, ReactNode } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Activity, 
  Key, 
  Trash2, 
  Save, 
  ShieldCheck, 
  Info, 
  Wand2, 
  PlayCircle, 
  Download, 
  Share2, 
  History,
  Music,
  Volume2,
  Settings2,
  Smile,
  Frown,
  Angry,
  Zap,
  Coffee,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  ExternalLink,
  Plus,
  Mic2,
  ChevronDown,
  RefreshCw,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Crash caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-6 z-[9999]">
          <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-bengali">দুঃখিত, অ্যাপ্লিকেশনটি ক্র্যাশ করেছে!</h1>
              <p className="text-sm text-slate-400 leading-relaxed font-bengali">
                একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে। নিচের বাটনে ক্লিক করে পুনরায় চেষ্টা করুন। এরপরও সমস্যা হলে ডাটা রিসেট করতে পারেন।
              </p>
            </div>
            
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left overflow-auto max-h-32">
              <code className="text-[10px] text-red-400 font-mono break-all">
                {this.state.error?.message || "Unknown error"}
              </code>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 font-bengali"
              >
                <RefreshCw className="w-4 h-4" />
                পুনরায় লোড করুন
              </button>
              <button 
                onClick={this.handleReset}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl text-xs transition-all border border-white/5 font-bengali"
              >
                ডাটা রিসেট করুন (ফ্যাক্টরি রিসেট)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Constants & Types ---

const VOICES = [
  { name: 'Zephyr', style: 'Bright', cat: 'bright' },
  { name: 'Puck', style: 'Cheerful', cat: 'bright' },
  { name: 'Charon', style: 'Informative', cat: 'calm' },
  { name: 'Kore', style: 'Firm', cat: 'calm' },
  { name: 'Fenrir', style: 'Excitable', cat: 'bright' },
  { name: 'Leda', style: 'Youthful', cat: 'bright' },
  { name: 'Orus', style: 'Corporate', cat: 'calm' },
  { name: 'Aoede', style: 'Breezy', cat: 'calm' },
  { name: 'Callirrhoe', style: 'Easygoing', cat: 'calm' },
  { name: 'Autonoe', style: 'Bright', cat: 'bright' },
  { name: 'Enceladus', style: 'Breathy', cat: 'calm' },
  { name: 'Iapetus', style: 'Clear', cat: 'calm' },
  { name: 'Umbriel', style: 'Easygoing', cat: 'calm' },
  { name: 'Algieba', style: 'Smooth', cat: 'calm' },
  { name: 'Despina', style: 'Smooth', cat: 'calm' },
  { name: 'Erinome', style: 'Clear', cat: 'calm' },
  { name: 'Algenib', style: 'Gravelly', cat: 'calm' },
  { name: 'Rasalgethi', style: 'Informative', cat: 'calm' },
  { name: 'Laomedeia', style: 'Cheerful', cat: 'bright' },
  { name: 'Achernar', style: 'Soft', cat: 'calm' },
  { name: 'Alnilam', style: 'Firm', cat: 'calm' },
  { name: 'Schedar', style: 'Even', cat: 'calm' },
  { name: 'Gacrux', style: 'Mature', cat: 'calm' },
  { name: 'Pulcherrima', style: 'Forward', cat: 'bright' },
  { name: 'Achird', style: 'Friendly', cat: 'bright' },
  { name: 'Zubenelgenubi', style: 'Casual', cat: 'calm' },
  { name: 'Vindemiatrix', style: 'Gentle', cat: 'calm' },
  { name: 'Sadachbia', style: 'Lively', cat: 'bright' },
  { name: 'Sadaltager', style: 'Knowledgeable', cat: 'calm' },
  { name: 'Sulafat', style: 'Raised', cat: 'bright' }
];

const EMOTIONS = [
  { id: 'neutral', name: 'স্বাভাবিক', icon: '😐', color: 'slate', desc: 'সাধারণ', prompt: 'Speak naturally' },
  { id: 'happy', name: 'খুশি', icon: '😊', color: 'yellow', desc: 'প্রাণবন্ত', prompt: 'Speak cheerfully' },
  { id: 'sad', name: 'দুঃখিত', icon: '😢', color: 'blue', desc: 'ধীর', prompt: 'Speak sadly' },
  { id: 'angry', name: 'রাগী', icon: '😠', color: 'red', desc: 'তীব্র', prompt: 'Speak angrily' },
  { id: 'excited', name: 'উত্তেজিত', icon: '🤩', color: 'pink', desc: 'শক্তিপূর্ণ', prompt: 'Speak excitedly' },
  { id: 'calm', name: 'শান্ত', icon: '😌', color: 'emerald', desc: 'স্নিগ্ধ', prompt: 'Speak calmly' },
  { id: 'fearful', name: 'ভীত', icon: '😨', color: 'purple', desc: 'উদ্বিগ্ন', prompt: 'Speak fearfully' },
  { id: 'surprised', name: 'অবাক', icon: '😲', color: 'orange', desc: 'আশ্চর্য', prompt: 'Speak with surprise' },
  { id: 'whisper', name: 'ফিসফিস', icon: '🤫', color: 'cyan', desc: 'নীরব', prompt: 'Speak in a whisper' },
  { id: 'shout', name: 'চিৎকার', icon: '📢', color: 'rose', desc: 'উচ্চস্বর', prompt: 'Speak loudly and shouting' },
  { id: 'cry', name: 'কান্না', icon: '😭', color: 'indigo', desc: 'ডুকরে', prompt: 'Speak as if crying' },
  { id: 'laugh', name: 'হাসি', icon: '😂', color: 'amber', desc: 'খিলখিল', prompt: 'Speak with laughter' },
  { id: 'romantic', name: 'রোমান্টিক', icon: '❤️', color: 'red', desc: 'স্নেহপূর্ণ', prompt: 'Speak romantically' },
  { id: 'mysterious', name: 'রহস্যময়', icon: '🕵️', color: 'violet', desc: 'গোপনীয়', prompt: 'Speak mysteriously' },
  { id: 'sarcastic', name: 'ব্যঙ্গাত্মক', icon: '🙄', color: 'lime', desc: 'বিদ্রূপ', prompt: 'Speak sarcastically' },
  { id: 'serious', name: 'গুরুগম্ভীর', icon: '🧐', color: 'zinc', desc: 'আনুষ্ঠানিক', prompt: 'Speak seriously' },
  { id: 'friendly', name: 'বন্ধুত্বপূর্ণ', icon: '👋', color: 'teal', desc: 'উষ্ণ', prompt: 'Speak friendly' },
  { id: 'professional', name: 'পেশাদার', icon: '💼', color: 'blue', desc: 'কর্মস্থান', prompt: 'Speak professionally' },
  { id: 'dramatic', name: 'নাটকীয়', icon: '🎭', color: 'fuchsia', desc: 'অভিনয়', prompt: 'Speak dramatically' },
  { id: 'tired', name: 'ক্লান্ত', icon: '😴', color: 'stone', desc: 'ঘুমন্ত', prompt: 'Speak tiredly' },
  { id: 'energetic', name: 'চনমনে', icon: '⚡', color: 'yellow', desc: 'দ্রুত', prompt: 'Speak energetically' },
  { id: 'confident', name: 'আত্মবিশ্বাসী', icon: '😎', color: 'sky', desc: 'দৃঢ়', prompt: 'Speak confidently' },
  { id: 'shy', name: 'লাজুক', icon: '🥺', color: 'rose', desc: 'নীরব', prompt: 'Speak shyly' },
  { id: 'hopeful', name: 'আশাবাদী', icon: '✨', color: 'amber', desc: 'ইতিবাচক', prompt: 'Speak hopefully' },
  { id: 'bored', name: 'বিরক্ত', icon: '😑', color: 'neutral', desc: 'একঘেয়ে', prompt: 'Speak boredly' },
  { id: 'anxious', name: 'উদ্বিগ্ন', icon: '😰', color: 'orange', desc: 'নার্ভাস', prompt: 'Speak anxiously' },
  { id: 'proud', name: 'গর্বিত', icon: '🦁', color: 'gold', desc: 'মহান', prompt: 'Speak proudly' },
  { id: 'guilty', name: 'অপরাধী', icon: '😔', color: 'slate', desc: 'অনুশোচনা', prompt: 'Speak guiltily' },
  { id: 'jealous', name: 'ঈর্ষাকাতর', icon: '😒', color: 'green', desc: 'হিংসুটে', prompt: 'Speak jealously' },
  { id: 'lonely', name: 'একা', icon: '🏚️', color: 'blue', desc: 'বিচ্ছিন্ন', prompt: 'Speak lonely' },
  { id: 'grateful', name: 'কৃতজ্ঞ', icon: '🙏', color: 'emerald', desc: 'ধন্যবাদ', prompt: 'Speak gratefully' },
  { id: 'curious', name: 'কৌতূহলী', icon: '🤔', color: 'cyan', desc: 'অনুসন্ধিৎসু', prompt: 'Speak curiously' },
  { id: 'determined', name: 'দৃঢ়সংকল্প', icon: '😤', color: 'red', desc: 'শক্তিশালী', prompt: 'Speak determinedly' },
  { id: 'relaxed', name: 'আরামদায়ক', icon: '🏖️', color: 'teal', desc: 'ঠান্ডা', prompt: 'Speak relaxed' },
  { id: 'worried', name: 'চিন্তিত', icon: '😟', color: 'yellow', desc: 'অস্থির', prompt: 'Speak worriedly' },
  { id: 'disappointed', name: 'হতাশ', icon: '😞', color: 'slate', desc: 'দুঃখ', prompt: 'Speak disappointedly' },
  { id: 'inspired', name: 'অনুপ্রাণিত', icon: '💡', color: 'amber', desc: 'সৃজনশীল', prompt: 'Speak inspired' },
  { id: 'silly', name: 'বোকা', icon: '🤪', color: 'pink', desc: 'মজার', prompt: 'Speak sillily' },
  { id: 'grumpy', name: 'বদমেজাজি', icon: '😡', color: 'orange', desc: 'রাগী', prompt: 'Speak grumpily' },
  { id: 'peaceful', name: 'শান্তিপূর্ণ', icon: '🕊️', color: 'white', desc: 'প্রশান্ত', prompt: 'Speak peacefully' },
  { id: 'nostalgic', name: 'স্মৃতিকাতর', icon: '📻', color: 'stone', desc: 'অতীত', prompt: 'Speak nostalgically' },
  { id: 'brave', name: 'সাহসী', icon: '🛡️', color: 'red', desc: 'নির্ভয়', prompt: 'Speak bravely' },
  { id: 'kind', name: 'দয়ালু', icon: '🤝', color: 'emerald', desc: 'ভদ্র', prompt: 'Speak kindly' },
  { id: 'stern', name: 'ক কঠোর', icon: '🤨', color: 'zinc', desc: 'কড়া', prompt: 'Speak sternly' },
  { id: 'playful', name: 'খেলোয়াড়', icon: '🎈', color: 'pink', desc: 'মজা', prompt: 'Speak playfully' },
  { id: 'elegant', name: 'মার্জিত', icon: '💎', color: 'indigo', desc: 'শৌখিন', prompt: 'Speak elegantly' },
  { id: 'robotic', name: 'রোবটিক', icon: '🤖', color: 'slate', desc: 'ফ্ল্যাট', prompt: 'Speak robotically' },
  { id: 'ghostly', name: 'ভৌতিক', icon: '👻', color: 'white', desc: 'ভয়ানক', prompt: 'Speak ghostly' },
  { id: 'heroic', name: 'বীরত্বপূর্ণ', icon: '🦸', color: 'blue', desc: 'মহাকাব্যিক', prompt: 'Speak heroically' },
  { id: 'villainous', name: 'খলনায়ক', icon: '😈', color: 'purple', desc: 'অন্ধকার', prompt: 'Speak villainously' },
  { id: 'cartoon_happy', name: 'কার্টুন খুশি', icon: '🐣', color: 'yellow', desc: 'অ্যানিমে', prompt: 'Speak with an exaggerated, high-pitched, bubbly cartoon character voice. Be very expressive.' },
  { id: 'cartoon_angry', name: 'কার্টুন রাগী', icon: '👹', color: 'red', desc: 'নাটকীয়', prompt: 'Speak like a funny cartoon villain who is very angry. Use exaggerated emphasis on words.' },
  { id: 'cartoon_scared', name: 'কার্টুন ভীত', icon: '👻', color: 'purple', desc: 'মজার', prompt: 'Speak like a cartoon character who is completely panicking and trembling. High energy and jittery.' },
  { id: 'cartoon_crying', name: 'কার্টুন কান্না', icon: '😭', color: 'blue', desc: 'দুঃখিত', prompt: 'Speak like a cartoon character crying uncontrollably with dramatic sobs and wails.' },
  { id: 'cartoon_evil_plan', name: 'শয়তানি বুদ্ধি', icon: '😈', color: 'indigo', desc: 'গোপন', prompt: 'Speak like a cartoon villain explaining their brilliant, evil master plan in a low, sneaky voice.' },
  { id: 'cartoon_hyper', name: 'অতিচঞ্চল', icon: '⚡', color: 'yellow', desc: 'দ্রুত', prompt: 'Speak like an extremely hyperactive cartoon character. Talk very fast with boundless energy.' },
  { id: 'cartoon_sleepy', name: 'ঘুমকাতুরে', icon: '😴', color: 'slate', desc: 'ক্লান্ত', prompt: 'Speak like a cartoon character struggling to stay awake, yawning frequently.' },
  { id: 'cartoon_confused', name: 'বিভ্রান্ত', icon: '😵‍💫', color: 'fuchsia', desc: 'মাথাব্যথা', prompt: 'Speak like a cartoon character who just got hit on the head and is completely confused and dizzy.' },
  { id: 'monster', name: 'দানব', icon: '👹', color: 'red', desc: 'পশু', prompt: 'Speak with a deep, growling, monstrous voice. Very low pitch and terrifying.' },
  { id: 'child', name: 'শিশু', icon: '👶', color: 'sky', desc: 'কিউট', prompt: 'Speak with a high-pitched, innocent, and sweet child voice. Pure and soft.' },
  { id: 'alien', name: 'এলিয়েন', icon: '👽', color: 'lime', desc: 'অদ্ভুত', prompt: 'Speak with a strange, warbling, extraterrestrial voice. Use unusual inflections.' },
  { id: 'cartoon_silly', name: 'হাস্যকর', icon: '🤡', color: 'orange', desc: 'পাগলাটে', prompt: 'Speak like a goofy, silly cartoon sidekick. Use funny inflections and high energy. Be extremely entertaining.' },
  { id: 'witch', name: 'ডাইনি', icon: '🧙‍♀️', color: 'indigo', desc: 'ভাঙ্গা কণ্ঠ', prompt: 'Speak like a mysterious old witch or an eccentric older character. Use a crackly, aged, and slightly rasping voice.' },
  { id: 'giant', name: 'দৈত্য', icon: '🧱', color: 'stone', desc: 'গভীর', prompt: 'Speak like a slow-witted, large, and friendly giant. Use a very deep, slow, and resonant voice.' },
  { id: 'scientist', name: 'পাগল বিজ্ঞানী', icon: '🧪', color: 'emerald', desc: 'চঞ্চল', prompt: 'Speak like an eccentric, high-strung mad scientist. Use erratic pacing and sudden bursts of energy.' },
  { id: 'crying', name: 'কান্না', icon: '😭', color: 'blue', desc: 'আবেগপূর্ণ', prompt: 'Speak while sobbing and being completely heartbroken. The voice should tremble and break with sadness.' },
  { id: 'sneaky', name: 'গোপন', icon: '👣', color: 'slate', desc: 'সন্দেহজনক', prompt: 'Speak in a low, conspiratorial whisper. Like you are a spy or a thief hiding in the shadows.' },
  { id: 'sassy', name: 'অহংকারী', icon: '💅', color: 'pink', desc: 'আত্মবিশ্বাসী', prompt: 'Speak with a sharp, witty, and confident sassy attitude. Use lots of personality and emphasis.' },
  { id: 'cartoon_hero', name: 'হিরো', icon: '🦸‍♂️', color: 'blue', desc: 'সাহসী', prompt: 'Speak like a classic, noble cartoon superhero. Deep, confident, and inspiring voice.' },
  { id: 'cartoon_villain_laugh', name: 'শয়তানের হাসি', icon: '🦹', color: 'purple', desc: 'উন্মাদ', prompt: 'Speak like a villain having a maniacal laughing fit. Very expressive and slightly unhinged.' },
  { id: 'cartoon_ninja', name: 'নিনজা', icon: '🥷', color: 'slate', desc: 'তড়িৎ', prompt: 'Speak in a fast, focused, and disciplined ninja voice. Sharp and precise delivery.' },
  { id: 'cartoon_pirate', name: 'জলদস্যু', icon: '🏴‍☠️', color: 'orange', desc: 'কর্কশ', prompt: 'Speak like a classic cartoon pirate. Gruff, hearty, and full of seafaring slang.' },
  { id: 'cartoon_fairy', name: 'ছোট পরি', icon: '🧚', color: 'pink', desc: 'হালকা', prompt: 'Speak with a very high-pitched, delicate, and tinkling fairy voice. Soft and magical.' },
  { id: 'cartoon_dragon', name: 'ড্রাগন', icon: '🐲', color: 'red', desc: 'শক্তিশালী', prompt: 'Speak with a deep, rumbling, and powerful dragon voice. Slightly smoky and intimidating.' },
  { id: 'cartoon_robot_glitch', name: 'নষ্ট রোবট', icon: '📟', color: 'cyan', desc: 'ভাঙ্গা', prompt: 'Speak like a robot that is malfunctioning or glitching. Use stuttered delivery and variable pitch.' },
  { id: 'cartoon_detective', name: 'Noir Sleuth', icon: '🕵️‍♂️', color: 'zinc', desc: 'Cool', prompt: 'Speak in a gravelly, cool, and mysterious noir detective voice. Very rhythmic and moody.' },
  { id: 'cartoon_explorer', name: 'Brave Scout', icon: '🏕️', color: 'emerald', desc: 'Eager', prompt: 'Speak with an enthusiastic, high-energy, and adventurous young explorer voice.' },
  { id: 'cartoon_king', name: 'Pompous King', icon: '👑', color: 'gold', desc: 'Royal', prompt: 'Speak with a very posh, slightly arrogant, and commanding royal voice.' },
  { id: 'cartoon_jester', name: 'Wild Jester', icon: '🃏', color: 'yellow', desc: 'Funny', prompt: 'Speak with an erratic, high-pitched, and playful jester voice. Lots of giggles and jumps.' },
  { id: 'cartoon_warrior', name: 'Battle Grunt', icon: '⚔️', color: 'red', desc: 'Strong', prompt: 'Speak like a powerful warrior in the heat of battle. Gravelly, breathless, and intense.' },
  { id: 'cartoon_space', name: 'Star Captain', icon: '🚀', color: 'indigo', desc: 'Epic', prompt: 'Speak with a dramatic, booming, and authoritative space captain voice. Very theatrical.' },
  { id: 'cartoon_zombie', name: 'Funny Zombie', icon: '🧟', color: 'green', desc: 'Dazed', prompt: 'Speak like a cartoon zombie that is slow, dazed, and groaning words out.' },
  { id: 'cartoon_ghost_friendly', name: 'Pudge Ghost', icon: '👻', color: 'sky', desc: 'Sweet', prompt: 'Speak with a soft, breathy, and friendly ghost voice. Very cute and gentle.' },
  { id: 'cartoon_cowboy', name: 'Lone Rider', icon: '🤠', color: 'amber', desc: 'Drawl', prompt: 'Speak with a slow, Southern cowboy drawl. Cool, calm, and collected.' },
  { id: 'cartoon_mermaid', name: 'Sea Singer', icon: '🧜‍♀️', color: 'blue', desc: 'Dreamy', prompt: 'Speak with a dreamy, melodic, and slightly echoing underwater voice.' },
  { id: 'cartoon_dwarf', name: 'Grumpy Miner', icon: '⚒️', color: 'stone', desc: 'Gravel', prompt: 'Speak with a deep, gravelly, and grumpy dwarf-like voice. Strong accent.' },
  { id: 'cartoon_elf', name: 'Swift Elf', icon: '🧝', color: 'forest', desc: 'Elegant', prompt: 'Speak with a light, graceful, and highly articulate elven voice.' },
  { id: 'cartoon_alien_cute', name: 'Bip-Bop', icon: '👾', color: 'lime', desc: 'Small', prompt: 'Speak with a very high-pitched, chirpy, and adorable small alien voice.' }
];

interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  emotion: string;
  color: string;
  speed: number;
  pitch: number;
  time: string;
  audioUrl: string;
}

// --- Helper Functions ---

function createWavBlob(pcmData: Uint8Array, sampleRate: number, channels: number, bitsPerSample: number) {
  const headerSize = 44;
  const dataSize = pcmData.length;
  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bitsPerSample / 8, true); // ByteRate
  view.setUint16(32, channels * bitsPerSample / 8, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true);
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Copy PCM data
  const bytes = new Uint8Array(buffer, 44);
  bytes.set(pcmData);
  
  return new Blob([buffer], { type: 'audio/wav' });
}

// --- Main Component ---

export default function App() {
  const [apiKeys, setApiKeys] = useState<string[]>(() => {
    try {
      const savedKeys = localStorage.getItem('genvoice_api_keys');
      if (savedKeys) {
        const parsed = JSON.parse(savedKeys);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] !== '') return parsed;
      }
      const savedKey = localStorage.getItem('genvoice_api_key');
      if (savedKey) return [savedKey];
    } catch (e) {}
    // Vite env variable check
    const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : '';
    return envKey ? [envKey] : [''];
  });
  
  const [apiDomain, setApiDomain] = useState<string>(() => {
    return localStorage.getItem('genvoice_api_domain') || 'generativelanguage.googleapis.com';
  });
  
  useEffect(() => {
    localStorage.setItem('genvoice_api_domain', apiDomain);
  }, [apiDomain]);

  const [auphonicToken, setAuphonicToken] = useState<string>(() => localStorage.getItem('genvoice_auphonic_token') || '');
  const [isAuphonicEnabled, setIsAuphonicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('genvoice_auphonic_enabled');
    return saved !== null ? saved === 'true' : false;
  });
  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(0);
  const [showKeyManager, setShowKeyManager] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [selVoice, setSelVoice] = useState<string>(() => localStorage.getItem('genvoice_voice') || 'Kore');
  const [selEmotion, setSelEmotion] = useState<string>(() => localStorage.getItem('genvoice_emotion') || 'neutral');
  const [speed, setSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('genvoice_speed');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [pitch, setPitch] = useState<number>(() => {
    const saved = localStorage.getItem('genvoice_pitch');
    return saved ? parseInt(saved) : 0;
  });
  const [volumeBoost, setVolumeBoost] = useState<number>(() => {
    const saved = localStorage.getItem('genvoice_volume');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [clarity, setClarity] = useState<number>(() => {
    const saved = localStorage.getItem('genvoice_clarity');
    return saved ? parseInt(saved) : 50;
  });
  const [warmth, setWarmth] = useState<number>(() => {
    const saved = localStorage.getItem('genvoice_warmth');
    return saved ? parseInt(saved) : 50;
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('genvoice_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'bright' | 'calm'>('all');
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [customEmotion, setCustomEmotion] = useState<string>('');
  const [newKeyInput, setNewKeyInput] = useState<string>('');
  const [isCartoonMode, setIsCartoonMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('genvoice_cartoon_mode');
    return saved !== null ? saved === 'true' : true;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Load saved data - handled in initial state
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Signal app initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      (window as any).appInitialized = true;
      document.body.classList.add('app-ready');
      const loading = document.getElementById('loading-screen');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 500);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('genvoice_history', JSON.stringify(history.slice(0, 20)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('genvoice_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('genvoice_auphonic_token', auphonicToken);
  }, [auphonicToken]);

  useEffect(() => {
    localStorage.setItem('genvoice_auphonic_enabled', isAuphonicEnabled.toString());
  }, [isAuphonicEnabled]);

  useEffect(() => {
    localStorage.setItem('genvoice_cartoon_mode', isCartoonMode.toString());
  }, [isCartoonMode]);

  useEffect(() => {
    localStorage.setItem('genvoice_voice', selVoice);
  }, [selVoice]);

  useEffect(() => {
    localStorage.setItem('genvoice_emotion', selEmotion);
  }, [selEmotion]);

  useEffect(() => {
    localStorage.setItem('genvoice_speed', speed.toString());
  }, [speed]);

  useEffect(() => {
    localStorage.setItem('genvoice_pitch', pitch.toString());
  }, [pitch]);

  useEffect(() => {
    localStorage.setItem('genvoice_volume', volumeBoost.toString());
  }, [volumeBoost]);

  useEffect(() => {
    localStorage.setItem('genvoice_clarity', clarity.toString());
  }, [clarity]);

  useEffect(() => {
    localStorage.setItem('genvoice_warmth', warmth.toString());
  }, [warmth]);

  const showStatus = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleEmotionChange = (id: string) => {
    setSelEmotion(id);
    const emotion = EMOTIONS.find(e => e.id === id);
    if (emotion) {
      showStatus(`Tone set to ${emotion.name}`, 'info');
    }
    
    // Restore presets
    const presets: Record<string, { s: number, p: number }> = {
      neutral: { s: 1.0, p: 0 },
      happy: { s: 1.1, p: 2 },
      sad: { s: 0.8, p: -3 },
      angry: { s: 1.2, p: 4 },
      excited: { s: 1.3, p: 3 },
      calm: { s: 0.9, p: -2 },
      fearful: { s: 1.0, p: 1 },
      surprised: { s: 1.2, p: 5 },
      whisper: { s: 0.7, p: -2 },
      shout: { s: 1.4, p: 6 },
      cry: { s: 0.6, p: -4 },
      laugh: { s: 1.2, p: 3 },
      romantic: { s: 0.9, p: -1 },
      mysterious: { s: 0.8, p: -5 },
      sarcastic: { s: 1.1, p: 2 },
      serious: { s: 1.0, p: 0 },
      friendly: { s: 1.1, p: 1 },
      professional: { s: 1.0, p: 0 },
      dramatic: { s: 0.9, p: 4 },
      tired: { s: 0.7, p: -3 },
      energetic: { s: 1.3, p: 2 },
      confident: { s: 1.1, p: 1 },
      shy: { s: 0.8, p: -1 },
      hopeful: { s: 1.1, p: 2 },
      bored: { s: 0.8, p: -2 },
      anxious: { s: 1.2, p: 3 },
      proud: { s: 1.1, p: 2 },
      guilty: { s: 0.8, p: -2 },
      jealous: { s: 1.1, p: 1 },
      lonely: { s: 0.7, p: -4 },
      grateful: { s: 1.0, p: 1 },
      curious: { s: 1.1, p: 2 },
      determined: { s: 1.2, p: 1 },
      relaxed: { s: 0.9, p: -1 },
      worried: { s: 1.1, p: 2 },
      disappointed: { s: 0.8, p: -2 },
      inspired: { s: 1.2, p: 3 },
      silly: { s: 1.3, p: 4 },
      grumpy: { s: 1.1, p: 1 },
      peaceful: { s: 0.8, p: -1 },
      nostalgic: { s: 0.9, p: -2 },
      brave: { s: 1.2, p: 2 },
      kind: { s: 1.0, p: 1 },
      stern: { s: 1.1, p: 0 },
      playful: { s: 1.2, p: 3 },
      elegant: { s: 0.9, p: 1 },
      robotic: { s: 1.0, p: -10 },
      ghostly: { s: 0.7, p: -8 },
      heroic: { s: 1.2, p: 4 },
      villainous: { s: 0.9, p: -6 },
      cartoon_happy: { s: 1.2, p: 8 },
      cartoon_angry: { s: 1.1, p: 5 },
      cartoon_scared: { s: 1.3, p: 7 },
      monster: { s: 0.8, p: -15 },
      child: { s: 1.1, p: 10 },
      alien: { s: 1.5, p: 5 },
      cartoon_silly: { s: 1.3, p: 12 },
      witch: { s: 0.9, p: -5 },
      giant: { s: 0.7, p: -18 },
      scientist: { s: 1.4, p: 6 },
      crying: { s: 0.8, p: 4 },
      sneaky: { s: 1.0, p: -2 },
      sassy: { s: 1.1, p: 5 },
      cartoon_hero: { s: 1.2, p: 4 },
      cartoon_villain_laugh: { s: 1.4, p: 8 },
      cartoon_ninja: { s: 1.5, p: 2 },
      cartoon_pirate: { s: 0.9, p: -8 },
      cartoon_fairy: { s: 1.4, p: 15 },
      cartoon_dragon: { s: 0.8, p: -12 },
      cartoon_robot_glitch: { s: 1.1, p: -5 },
      cartoon_detective: { s: 0.8, p: -6 },
      cartoon_explorer: { s: 1.3, p: 6 },
      cartoon_king: { s: 1.0, p: 2 },
      cartoon_jester: { s: 1.4, p: 12 },
      cartoon_warrior: { s: 1.2, p: -4 },
      cartoon_space: { s: 1.1, p: 5 },
      cartoon_zombie: { s: 0.6, p: -10 },
      cartoon_ghost_friendly: { s: 1.1, p: 6 },
      cartoon_cowboy: { s: 0.8, p: -4 },
      cartoon_mermaid: { s: 0.9, p: 8 },
      cartoon_dwarf: { s: 0.9, p: -12 },
      cartoon_elf: { s: 1.2, p: 10 },
      cartoon_alien_cute: { s: 1.6, p: 14 }
    };
    const preset = presets[id];
    if (preset) {
      setSpeed(preset.s);
      setPitch(preset.p);
    }
  };

  const rotateKey = () => {
    const validKeys = apiKeys.filter(k => k.trim());
    if (validKeys.length === 0) return { key: null, index: -1 };
    
    const currentKey = apiKeys[activeKeyIndex];
    const currentValidIndex = validKeys.indexOf(currentKey);
    const nextValidIndex = (currentValidIndex + 1) % validKeys.length;
    const nextKey = validKeys[nextValidIndex];
    
    const originalIndex = apiKeys.indexOf(nextKey);
    if (originalIndex !== -1) {
      setActiveKeyIndex(originalIndex);
      return { key: nextKey, index: originalIndex };
    }
    return { key: nextKey, index: nextValidIndex };
  };

  const getValidKey = () => {
    const validKeys = apiKeys.filter(k => k.trim());
    const sysKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (validKeys.length === 0) return sysKey || null;
    
    const currentKey = apiKeys[activeKeyIndex];
    if (!currentKey || currentKey.trim() === '') {
      const firstValidIndex = apiKeys.findIndex(k => k.trim() !== '');
      if (firstValidIndex !== -1) {
        setActiveKeyIndex(firstValidIndex);
        return apiKeys[firstValidIndex];
      }
      return null;
    }
    
    return currentKey;
  };

  const processWithAuphonic = async (wavBlob: Blob): Promise<Blob> => {
    if (!isAuphonicEnabled || !auphonicToken) return wavBlob;

    try {
      setGenerationStep(6); // Auphonic Processing
      
      // 1. Create Production
      const createResponse = await fetch('https://auphonic.com/api/productions.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auphonicToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: { title: `GenVoice_${Date.now()}` },
          algorithms: {
            denoise: false,
            normloudness: true,
            dynamic_range_compressor: true,
            highpass_filter: false
          },
          output_files: [{ format: 'wav' }]
        })
      });

      if (!createResponse.ok) throw new Error(`Auphonic Create failed: ${createResponse.statusText}`);
      const createData = await createResponse.json();
      const uuid = createData.data.uuid;

      // 2. Upload File
      const formData = new FormData();
      formData.append('input_file', wavBlob, 'input.wav');
      
      const uploadResponse = await fetch(`https://auphonic.com/api/production/${uuid}/upload.json`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auphonicToken}` },
        body: formData
      });

      if (!uploadResponse.ok) throw new Error(`Auphonic Upload failed: ${uploadResponse.statusText}`);

      // 3. Start Production
      const startResponse = await fetch(`https://auphonic.com/api/production/${uuid}/start.json`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auphonicToken}` }
      });

      if (!startResponse.ok) throw new Error(`Auphonic Start failed: ${startResponse.statusText}`);

      // 4. Poll for completion
      let status = 'started';
      let resultUrl = '';
      
      while (status !== 'done' && status !== 'error') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const statusResponse = await fetch(`https://auphonic.com/api/production/${uuid}.json`, {
          headers: { 'Authorization': `Bearer ${auphonicToken}` }
        });
        const statusData = await statusResponse.json();
        status = statusData.data.status_string.toLowerCase();
        if (status === 'done') {
          resultUrl = statusData.data.output_files[0].download_url;
        }
        if (status === 'error') throw new Error('Auphonic processing error');
      }

      // 5. Download Result
      const downloadResponse = await fetch(resultUrl, {
        headers: { 'Authorization': `Bearer ${auphonicToken}` }
      });
      return await downloadResponse.blob();
    } catch (err) {
      console.error("Auphonic processing failed", err);
      showStatus("Auphonic processing failed, using original audio.", "error");
      return wavBlob;
    }
  };

  const handleGenerate = async () => {
    const now = Date.now();
    if (now - lastRequestTime < 2000) {
      return showStatus('দয়া করে একটু অপেক্ষা করুন।', 'info');
    }
    if (!text.trim()) return showStatus('Please enter some text', 'error');
    
    const currentKey = getValidKey();
    if (!currentKey) return showStatus('Please enter at least one Gemini API Key', 'error');

    setIsGenerating(true);
    setGenerationStep(1); // Analyzing Text
    setLastRequestTime(now);

    const emotion = EMOTIONS.find(e => e.id === selEmotion);
    let retryCount = 0;
    const maxRetries = apiKeys.filter(k => k.trim()).length;

    const attemptSpeech = async (key: string): Promise<{ data: string, mimeType: string } | null> => {
      try {
        setGenerationStep(2); // Selecting Voice & Emotion
        
        let emotionInstruction = customEmotion.trim() ? `Speak with a ${customEmotion} tone` : (emotion?.prompt || 'Speak naturally');
        const qualityInstruction = "CRITICAL AUDIO REQUIREMENT: The output MUST be pristine, broadcast-level studio quality. ZERO background noise, ZERO static, ZERO metallic or robotic artifacts, and absolutely NO audio clipping or distortion. Speak clearly with perfect articulation and professional microphone etiquette.";
        
        let prompt = `${emotionInstruction}. ${qualityInstruction}\n\nText: ${text}`;
        
        if (isCartoonMode) {
          const cartoonAdvice = "ACTING DIRECTIVE: You are a professional cartoon voice actor in a premium soundproof studio. Deliver the line with vivid, animated character personality. DO NOT over-modulate, scream, or clip the audio. The voice MUST be ultra-clean, smooth, and instantly ready for a cinematic animation without post-processing.";
          prompt = `${emotionInstruction}. ${cartoonAdvice}. ${qualityInstruction}\n\nText: ${text}`;
        }

        setGenerationStep(3); // Synthesizing Audio
        
        const cleanDomain = apiDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
        const response = await fetch(`https://${cleanDomain}/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: selVoice }
                }
              }
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.promptFeedback?.blockReason) {
            throw new Error(`Content Blocked by AI Safety: ${data.promptFeedback.blockReason}`);
        }
        if (data.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("Content Blocked: The generated audio triggered safety filters.");
        }

        const partWithAudio = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        const inlineData = partWithAudio?.inlineData;
        if (inlineData && inlineData.data) {
          return { data: inlineData.data, mimeType: inlineData.mimeType || '' };
        }
        return null;
      } catch (err: any) {
        // Retry logic for transient errors
        if (retryCount < maxRetries - 1) {
          retryCount++;
          const { key: nextKey, index } = rotateKey();
          if (nextKey) {
            showStatus(`Retrying with API Key #${index + 1}...`, 'info');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay before retry
            return attemptSpeech(nextKey);
          }
        }
        throw err;
      }
    };

    try {
      const audioResult = await attemptSpeech(currentKey);
      
      if (audioResult) {
        setGenerationStep(4); // Enhancing Audio Quality
        const base64Audio = audioResult.data;
        const mimeType = audioResult.mimeType || '';
        
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Finalizing
        let finalBlob;
        
        // Prevent audio corruption/gurgling by checking the actual bytes and MIME type
        // If data starts with 'RIFF', it's already a WAV PCM file, do not prepend headers!
        const isWavBytes = bytes.length > 4 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70; 
        const isMp3Bytes = bytes.length > 3 && bytes[0] === 73 && bytes[1] === 68 && bytes[2] === 51;

        if (isWavBytes || mimeType.includes('wav')) {
           finalBlob = new Blob([bytes], { type: 'audio/wav' });
        } else if (isMp3Bytes || mimeType.includes('mp3')) {
           finalBlob = new Blob([bytes], { type: 'audio/mp3' });
        } else {
           // Fallback to manually prepending WAV headers if it is raw PCM
           finalBlob = createWavBlob(bytes, 24000, 1, 16);
        }

        // Auphonic Integration
        if (isAuphonicEnabled && auphonicToken) {
          finalBlob = await processWithAuphonic(finalBlob);
        }
        
        const url = URL.createObjectURL(finalBlob);
        setAudioUrl(url);
        
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          text: text.length > 50 ? text.substring(0, 50) + '...' : text,
          voice: selVoice,
          emotion: customEmotion.trim() || (emotion?.name || 'Neutral'),
          color: emotion?.color || 'slate',
          speed,
          pitch,
          time: new Date().toLocaleTimeString(),
          audioUrl: url
        };

        setHistory(prev => [newItem, ...prev]);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }
        showStatus('Audio synthesized successfully!', 'success');
      } else {
        throw new Error("No audio data received from Gemini");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        showStatus('Google API-র লিমিট শেষ হয়ে গেছে। দয়া করে ১ মিনিট অপেক্ষা করে আবার চেষ্টা করুন।', 'error');
      } else {
        showStatus(err.message || 'Failed to generate speech', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `genvoice_${selVoice}_${selEmotion}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!audioUrl) return;
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const file = new File([blob], 'speech.wav', { type: 'audio/wav' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'GenVoice Audio',
          text: `Listen to this ${selEmotion} speech by ${selVoice}`,
          files: [file]
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`GenVoice: ${selEmotion} speech by ${selVoice}`);
        showStatus('Info copied to clipboard', 'success');
      } else {
        showStatus('Sharing not supported on this device', 'info');
      }
    } catch (e) {
      showStatus('Sharing failed', 'error');
    }
  };

  const filteredVoices = VOICES.filter(v => voiceFilter === 'all' || v.cat === voiceFilter);

  const addApiKey = () => {
    if (!newKeyInput.trim()) return;
    if (apiKeys.length >= 10 && apiKeys[0] !== '') {
      showStatus('Maximum 10 keys allowed', 'error');
      return;
    }
    
    setApiKeys(prev => {
      const filtered = prev.filter(k => k.trim() !== '');
      if (filtered.length >= 10) return prev;
      return [...filtered, newKeyInput.trim()];
    });
    setNewKeyInput('');
    showStatus('API Key added successfully', 'success');
  };

  const removeApiKey = (index: number) => {
    setApiKeys(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length === 0 ? [''] : updated;
    });
  };

  const clearAllKeys = () => {
    if (window.confirm('Are you sure you want to clear all API keys?')) {
      setApiKeys(['']);
      showStatus('All keys cleared', 'info');
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '********';
    return `${key.substring(0, 8)}........${key.substring(key.length - 4)}`;
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-[#070709] text-slate-200 selection:bg-indigo-500/30 font-sans sm:pb-0 pb-20 custom-scrollbar overflow-x-hidden">
        {/* Ambient background glows */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="fixed top-[40%] left-[80%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 p-3 md:p-8 max-w-6xl mx-auto w-full overflow-x-hidden pt-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <motion.div 
          whileHover={{ scale: 1.05, rotateY: 10, rotateX: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex items-center gap-4 cursor-pointer w-full sm:w-auto"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Activity className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text tracking-tight truncate">GenVoice</h1>
            <p className="text-[10px] sm:text-sm text-slate-400 font-medium truncate">Cartoon Optimized Voice Engine</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <button 
            onClick={() => setIsCartoonMode(!isCartoonMode)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all group shrink-0 ${
              isCartoonMode 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={isCartoonMode ? "Cartoon Mode Active" : "Enable Cartoon Mode"}
          >
            <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCartoonMode ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] sm:text-xs font-bold">{isCartoonMode ? 'Cartoon Active' : 'Standard'}</span>
          </button>
          
          <button 
            onClick={() => setShowKeyManager(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[10px] sm:text-xs font-bold">Settings</span>
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2.5 Flash TTS
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* API Key Status Notice */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col sm:flex-row items-center justify-between p-3 rounded-2xl border ${
              apiKeys.filter(k => k.trim() !== '').length > 0
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/5 border-amber-500/20 text-amber-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <div className={`p-1.5 rounded-lg ${
                apiKeys.filter(k => k.trim() !== '').length > 0
                ? 'bg-emerald-500/20' 
                : 'bg-amber-500/20'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider leading-none mb-1">
                  {apiKeys.filter(k => k.trim() !== '').length > 0
                    ? 'Premium Status: Your Keys Active' 
                    : 'Limited Status: System Key Missing'}
                </p>
                <p className="text-[10px] opacity-70 font-bengali leading-none mt-1">
                  {apiKeys.filter(k => k.trim() !== '').length > 0
                    ? 'আপনার এপিআই কী সেট করা আছে। আনলিমিটেড ভয়েস জেনারেট করতে পারবেন।'
                    : 'সঠিক এপিআই কী দেওয়া নেই। সেটিংস থেকে আপনার নিজের এপিআই কী যুক্ত করুন।'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowKeyManager(true)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                apiKeys.filter(k => k.trim() !== '').length > 0
                ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-500 animate-pulse'
              }`}
            >
              Manage Keys
            </button>
          </motion.div>

          {/* Text Input Panel */}
              <motion.section 
                whileHover={{ rotateY: 1, rotateX: 1, scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    Text to Speech
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setText('')}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setText("Hello! This is a demonstration of Gemini Text-to-Speech technology with natural voice synthesis.")}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors"
                    >
                      Sample
                    </button>
                  </div>
                </div>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  placeholder="Type or paste text to synthesize..."
                  className="w-full bg-[#111114] border border-white/5 rounded-2xl p-5 text-[15px] focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-600 shadow-inner custom-scrollbar"
                />
                <div className="flex justify-between mt-3 text-[11px] font-medium text-slate-500">
                  <span>{text.length} characters</span>
                  <span className="text-cyan-500/70">
                    {/[\u0980-\u09FF]/.test(text) ? 'Bengali Detected' : 'English Detected'}
                  </span>
                </div>
              </motion.section>

              {/* Emotions Panel */}
              <motion.section 
                whileHover={{ rotateY: 1, rotateX: 1, scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Smile className="w-4 h-4 text-pink-400" />
                    ইমোশন নির্বাচন করুন
                  </label>
                  <div className="relative group">
                    <input 
                      type="text"
                      value={customEmotion}
                      onChange={(e) => setCustomEmotion(e.target.value)}
                      placeholder="Custom Emotion..."
                      className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all placeholder:text-slate-600 w-32 sm:w-48"
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-[8px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/5">
                      যেকোনো ইমোশন লিখুন (যেমন: "হাসি", "কান্না")
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-1.5 sm:gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {EMOTIONS.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => { handleEmotionChange(e.id); setCustomEmotion(''); }}
                      className={`group relative flex flex-col items-center p-1.5 sm:p-2 rounded-lg border transition-all duration-300 ${
                        selEmotion === e.id && !customEmotion
                        ? `bg-${e.color}-500/10 border-${e.color}-500/50 shadow-lg shadow-${e.color}-500/10` 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg sm:text-xl mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform">{e.icon}</span>
                      <span className={`text-[8px] sm:text-[9px] font-bold truncate w-full text-center ${selEmotion === e.id && !customEmotion ? `text-${e.color}-400` : 'text-slate-400'}`}>
                        {e.name}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Voices Panel */}
              <motion.section 
                whileHover={{ rotateY: 1, rotateX: 1, scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Music className="w-4 h-4 text-indigo-400" />
                    Voice Selection
                  </label>
                  <div className="flex p-1 rounded-lg bg-black/40 border border-white/5">
                    {(['all', 'bright', 'calm'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setVoiceFilter(f)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                          voiceFilter === f ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar p-1">
                  {filteredVoices.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelVoice(v.name)}
                      className={`relative overflow-hidden flex flex-col items-start p-3 rounded-2xl transition-all duration-300 border backdrop-blur-md ${
                        selVoice === v.name 
                        ? 'bg-gradient-to-br from-indigo-500/80 via-purple-500/80 to-indigo-600/80 text-white border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.3)] ring-1 ring-white/30' 
                        : 'bg-[#1a1a24] text-slate-300 border-white/5 hover:bg-[#232332] hover:border-white/10 hover:shadow-lg'
                      }`}
                    >
                      {selVoice === v.name && (
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.1),transparent)] -translate-x-[150%] animate-[shimmer_2.5s_infinite] pointer-events-none"></div>
                      )}
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className={`p-1.5 rounded-xl ${selVoice === v.name ? 'bg-white/20 text-white shadow-inner' : 'bg-black/40 text-indigo-400'}`}>
                          <Mic2 className="w-3.5 h-3.5" />
                        </div>
                        {selVoice === v.name && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse" />
                        )}
                      </div>
                      <div className="text-left w-full">
                        <div className={`text-[11px] font-black tracking-wide truncate ${selVoice === v.name ? 'text-white' : 'text-slate-100'}`}>{v.name}</div>
                        <div className={`text-[8px] font-medium uppercase tracking-widest mt-0.5 truncate ${selVoice === v.name ? 'text-indigo-200' : 'text-slate-500'}`}>{v.style}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Advanced Settings */}
              <motion.section 
                whileHover={{ rotateY: 1, rotateX: 1, scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-emerald-400" />
                      Audio Processing
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setIsAuphonicEnabled(!isAuphonicEnabled)}
                      className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-all w-full sm:w-auto ${
                        isAuphonicEnabled 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'bg-white/5 text-slate-500 border border-white/5'
                      }`}
                    >
                      <Waves className={`w-3.5 h-3.5 ${isAuphonicEnabled ? 'animate-pulse' : ''}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {isAuphonicEnabled ? 'Auphonic ON' : 'Auphonic OFF'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.section>

              {/* Generate Button */}
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className={`relative group w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-black tracking-wide transition-all duration-500 overflow-hidden ${
                  isGenerating || !text.trim()
                  ? 'bg-[#111114] text-slate-600 border border-white/5 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 text-white shadow-[0_0_50px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]'
                }`}
              >
                {!isGenerating && !!text.trim() && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
                )}
                {!isGenerating && !!text.trim() && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>
                )}
                
                <div className="relative flex items-center justify-center gap-3">
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  ) : (
                    <div className={`${text.trim() ? 'bg-white/20' : 'bg-white/5'} p-1.5 rounded-full group-hover:rotate-[15deg] group-hover:scale-110 transition-transform duration-300`}>
                       <Wand2 className={`w-5 h-5 ${text.trim() ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                  )}
                  <span className={`${text.trim() ? 'font-bengali' : 'font-bengali opacity-60'}`}>
                    {isGenerating ? 'ভয়েস তৈরি হচ্ছে...' : 'ভয়েস জেনারেট করুন'}
                  </span>
                </div>
              </button>
            </div>

        {/* Right Column: Preview & History */}
        <div className="space-y-6">
          {/* Preview Panel */}
          {audioUrl && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02, z: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-4 sticky top-8 perspective-[1000px] transform-gpu shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/20"
            >
              <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                Live Preview
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="bg-black/60 rounded-xl p-3 border border-white/10 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                          <Music className="text-cyan-400 w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white tracking-tight">{selVoice}</div>
                          <div className={`text-[8px] font-bold uppercase tracking-widest text-${EMOTIONS.find(e => e.id === selEmotion)?.color}-400`}>
                            {EMOTIONS.find(e => e.id === selEmotion)?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map(i => (
                          <motion.div 
                            key={i} 
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-0.5 bg-cyan-400 rounded-full" 
                          />
                        ))}
                      </div>
                    </div>
                    <audio ref={audioRef} controls className="w-full h-8 filter invert opacity-70 scale-90 origin-left" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.section>
          )}

          {/* History Section */}
          <section className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    Recent
                  </h3>
                  {history.length > 0 && (
                    <button 
                      onClick={() => setHistory([])}
                      className="text-[10px] font-bold uppercase tracking-widest text-rose-500/70 hover:text-rose-500 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {history.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-600 font-medium italic">Your history is empty</p>
                  ) : (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (audioRef.current) {
                            audioRef.current.src = item.audioUrl;
                            audioRef.current.play().catch(() => {
                              showStatus('Audio expired or invalid. Please regenerate.', 'error');
                            });
                          }
                        }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-${item.color}-500/10 text-${item.color}-400`}>
                            {item.emotion}
                          </span>
                          <span className="text-[9px] text-slate-600 font-mono">{item.time}</span>
                        </div>
                        <div className="text-[11px] text-indigo-400 font-bold mb-1">{item.voice} • {item.speed}x • P:{item.pitch}</div>
                        <div className="text-xs text-slate-400 truncate group-hover:text-slate-200 transition-colors">{item.text}</div>
                      </button>
                    ))
                  )}
                </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="glass-panel p-4 text-center border-white/5">
                  <div className="text-2xl font-bold text-cyan-400">{history.length}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Synthesized</div>
                </div>
                <div className="glass-panel p-4 text-center border-white/5">
                  <div className="text-2xl font-bold text-indigo-400">{VOICES.length}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Voices</div>
                </div>
              </div>
            </section>
          </div>
        </div>

      {/* Status Toasts */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              statusMsg.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
              'bg-slate-800/80 border-white/10 text-white'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
             statusMsg.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
             <Info className="w-5 h-5" />}
            <span className="text-sm font-bold">{statusMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Loading Overlay */}
      {/* Generation Overlay with 3D Look */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[200] perspective-[1000px]"
          >
            <motion.div 
              initial={{ rotateX: 20, y: 50, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              exit={{ rotateX: -20, y: -50, opacity: 0 }}
              className="relative bg-[#1a1b1e] border border-white/10 p-10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-sm w-full text-center overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <div className="relative w-32 h-32 mb-8 mx-auto">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-b-2 border-cyan-500 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-t-2 border-purple-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-10 h-10 text-cyan-400" />
                    </motion.div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Synthesizing Voice</h2>
                
                {/* Progress Steps */}
                <div className="space-y-4 text-left">
                  {[
                    { id: 1, label: 'Analyzing Text Input' },
                    { id: 2, label: 'Selecting Voice Profile' },
                    { id: 3, label: 'AI Neural Synthesis' },
                    { id: 4, label: 'Enhancing Audio Quality' },
                    { id: 5, label: 'Finalizing Audio File' },
                    ...(isAuphonicEnabled ? [{ id: 6, label: 'Auphonic Post-Processing' }] : [])
                  ].map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
                        generationStep >= step.id 
                        ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                        : 'bg-white/5 text-slate-600 border border-white/5'
                      }`}>
                        {generationStep > step.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                      </div>
                      <span className={`text-xs font-bold transition-all duration-500 ${
                        generationStep === step.id ? 'text-cyan-400' : 
                        generationStep > step.id ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {step.label}
                      </span>
                      {generationStep === step.id && (
                        <motion.div 
                          layoutId="activeStep"
                          className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKeyManager && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-start justify-center z-[120] p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1b1e] border border-white/5 max-w-md w-full rounded-[24px] sm:rounded-[32px] shadow-2xl relative my-8 overflow-hidden shrink-0"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">API Management</h2>
                    <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] truncate">KEY ROTATION SYSTEM</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button 
                    onClick={clearAllKeys}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all shrink-0"
                    title="Clear All Keys"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => setShowKeyManager(false)}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* PWA Install Hub */}
                {!isStandalone && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-white/10 rounded-3xl p-6 space-y-4"
                  >
                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
                    <div className="flex gap-4 relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                        <Download className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">এপপ্স ডাউনলোড করুন</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-bengali">
                          এটি একটি উন্নত প্রযুক্তির এপ যা আপনি সরাসরি আপনার ফোনে বা পিসিতে "Install" করতে পারেন। এটি ব্রাউজার ছাড়াই সরাসরি কাজ করবে।
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 relative z-10">
                      {isInstallable ? (
                        <button 
                          onClick={installApp}
                          className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 font-bengali"
                        >
                          <Plus className="w-4 h-4" />
                          অ্যাপ ইনস্টল করুন
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowInstallHelp(true)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-white/10 font-bengali"
                        >
                          <Info className="w-4 h-4" />
                          কীভাবে ইনস্টল করবেন?
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Info Box */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-500 mb-1">এপিআই কী (API Key) সেট আপ</h4>
                      <p className="text-[11px] text-emerald-500/80 leading-relaxed font-bengali">
                        আপনি এখানে সর্বোচ্চ ১০টি Gemini API Key যুক্ত করতে পারেন। সিস্টেম অটোমেটিক একটি কী শেষ হলে অন্যটি ব্যবহার করবে।
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-500/80 leading-relaxed font-bengali">
                      মনে রাখবেন: একই প্রজেক্টের কী ব্যবহার করলে কোটা (Quota) কম পাওয়া যায়। বেশি ব্যবহারের জন্য আলাদা আলাদা প্রজেক্টের কী ব্যবহার করুন।
                    </p>
                  </div>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-1 font-bengali"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Google AI Studio থেকে আপনার Free API Key নিন
                  </a>
                </div>

                {/* Auphonic Token Section */}
                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <Waves className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-cyan-500/90 font-bold">Auphonic Integration</p>
                      <p className="text-[10px] text-cyan-500/70 leading-relaxed">
                        Advanced noise reduction and loudness normalization.
                      </p>
                    </div>
                  </div>
                  <input 
                    type="password"
                    value={auphonicToken}
                    onChange={(e) => setAuphonicToken(e.target.value)}
                    placeholder="Enter Auphonic Access Token..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700"
                  />
                  <a 
                    href="https://auphonic.com/api/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Get Token from Auphonic
                  </a>
                </div>

                {/* Input Section */}
                <div className="space-y-3">
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="password"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                      placeholder="এখানে API Key পেস্ট করুন..."
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700 font-mono"
                    />
                  </div>
                  <button 
                    onClick={addApiKey}
                    disabled={!newKeyInput.trim()}
                    className="relative w-full group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-400 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:cursor-not-allowed text-emerald-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(52,211,153,0.2)] hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95 border border-emerald-400/30 disabled:border-slate-800 font-bengali"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <div className="bg-emerald-950/20 p-1 rounded-full group-hover:rotate-90 transition-transform duration-300">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[15px] tracking-wide">নতুন API Key যুক্ত করুন</span>
                    </div>
                  </button>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <label className="text-xs font-bold text-slate-400 font-bengali block">কাস্টম এপিআই ডোমেইন (Custom API Domain)</label>
                    <input 
                      type="text"
                      value={apiDomain}
                      onChange={(e) => setApiDomain(e.target.value)}
                      placeholder="generativelanguage.googleapis.com"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-300 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 font-bengali">যদি আপনি কোনো Proxy ব্যবহার করেন, তাহলে এখানে ডোমেইন দিন। ডিফল্ট: generativelanguage.googleapis.com</p>
                  </div>
                </div>

                {/* Key List Title */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                  <span>আপনার সেট করা কী গুলো</span>
                  <span>{apiKeys.filter(k => k.trim() !== '').length}/10</span>
                </div>

                {/* Key List */}
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {apiKeys.filter(k => k.trim() !== '').map((key, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-2xl group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white/5">
                        {i + 1}
                      </div>
                      <div className="flex-1 font-mono text-[11px] text-slate-400 tracking-wider">
                        {maskKey(key)}
                      </div>
                      <Sparkles className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                      <button 
                        onClick={() => removeApiKey(i)}
                        className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {apiKeys.filter(k => k.trim() !== '').length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                      <p className="text-xs text-slate-600 font-medium">No API keys added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Help Modal */}
      <AnimatePresence>
        {showInstallHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstallHelp(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass-panel p-6 space-y-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setShowInstallHelp(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ইনস্টলেশন গাইড</h3>
                  <p className="text-xs text-slate-400">GenVoice Setup</p>
                </div>
              </div>

              <div className="space-y-4 font-bengali">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">১</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    আপনার ফোনের ব্রাউজার (Chrome) এর উপরে ডান দিকে থাকা <span className="text-white font-bold">৩টি বিন্দু (Menu)</span>-তে ক্লিক করুন।
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">২</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    সেখান থেকে <span className="text-cyan-400 font-bold">"Install App"</span> বা <span className="text-cyan-400 font-bold">"ইনস্টল করুন"</span> অপশনটি খুঁজে বের করুন।
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">৩</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ব্যাস! এখন আপনার ফোনে এটি একটি স্বতন্ত্র অ্যাপ হিসেবে ডাউনলোড হয়ে যাবে এবং আপনি এটি অ্যাপ ড্রয়ার থেকে যেকোনো সময় ব্যবহার করতে পারবেন।
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowInstallHelp(false)}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all border border-white/10 font-bengali"
              >
                ঠিক আছে, বুঝেছি
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom CSS for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .glass-panel {
          background: rgba(15, 15, 25, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          width: 100%;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      </div>
    </div>
  </ErrorBoundary>
  );
}
