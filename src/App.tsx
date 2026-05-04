/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
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
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  { id: 'neutral', name: 'Neutral', icon: '😐', color: 'slate', desc: 'Natural', prompt: 'Speak naturally' },
  { id: 'happy', name: 'Happy', icon: '😊', color: 'yellow', desc: 'Upbeat', prompt: 'Speak cheerfully' },
  { id: 'sad', name: 'Sad', icon: '😢', color: 'blue', desc: 'Slow', prompt: 'Speak sadly' },
  { id: 'angry', name: 'Angry', icon: '😠', color: 'red', desc: 'Intense', prompt: 'Speak angrily' },
  { id: 'excited', name: 'Excited', icon: '🤩', color: 'pink', desc: 'Energetic', prompt: 'Speak excitedly' },
  { id: 'calm', name: 'Calm', icon: '😌', color: 'emerald', desc: 'Soothing', prompt: 'Speak calmly' },
  { id: 'fearful', name: 'Fearful', icon: '😨', color: 'purple', desc: 'Tense', prompt: 'Speak fearfully' },
  { id: 'surprised', name: 'Surprised', icon: '😲', color: 'orange', desc: 'Shocked', prompt: 'Speak with surprise' },
  { id: 'whisper', name: 'Whisper', icon: '🤫', color: 'cyan', desc: 'Quiet', prompt: 'Speak in a whisper' },
  { id: 'shout', name: 'Shout', icon: '📢', color: 'rose', desc: 'Loud', prompt: 'Speak loudly and shouting' },
  { id: 'cry', name: 'Cry', icon: '😭', color: 'indigo', desc: 'Sobbing', prompt: 'Speak as if crying' },
  { id: 'laugh', name: 'Laugh', icon: '😂', color: 'amber', desc: 'Giggling', prompt: 'Speak with laughter' },
  { id: 'romantic', name: 'Romantic', icon: '❤️', color: 'red', desc: 'Loving', prompt: 'Speak romantically' },
  { id: 'mysterious', name: 'Mystery', icon: '🕵️', color: 'violet', desc: 'Secretive', prompt: 'Speak mysteriously' },
  { id: 'sarcastic', name: 'Sarcastic', icon: '🙄', color: 'lime', desc: 'Ironical', prompt: 'Speak sarcastically' },
  { id: 'serious', name: 'Serious', icon: '🧐', color: 'zinc', desc: 'Formal', prompt: 'Speak seriously' },
  { id: 'friendly', name: 'Friendly', icon: '👋', color: 'teal', desc: 'Warm', prompt: 'Speak friendly' },
  { id: 'professional', name: 'Pro', icon: '💼', color: 'blue', desc: 'Business', prompt: 'Speak professionally' },
  { id: 'dramatic', name: 'Dramatic', icon: '🎭', color: 'fuchsia', desc: 'Theatrical', prompt: 'Speak dramatically' },
  { id: 'tired', name: 'Tired', icon: '😴', color: 'stone', desc: 'Sleepy', prompt: 'Speak tiredly' },
  { id: 'energetic', name: 'Energy', icon: '⚡', color: 'yellow', desc: 'Fast', prompt: 'Speak energetically' },
  { id: 'confident', name: 'Confident', icon: '😎', color: 'sky', desc: 'Bold', prompt: 'Speak confidently' },
  { id: 'shy', name: 'Shy', icon: '🥺', color: 'rose', desc: 'Quiet', prompt: 'Speak shyly' },
  { id: 'hopeful', name: 'Hopeful', icon: '✨', color: 'amber', desc: 'Positive', prompt: 'Speak hopefully' },
  { id: 'bored', name: 'Bored', icon: '😑', color: 'neutral', desc: 'Dull', prompt: 'Speak boredly' },
  { id: 'anxious', name: 'Anxious', icon: '😰', color: 'orange', desc: 'Nervous', prompt: 'Speak anxiously' },
  { id: 'proud', name: 'Proud', icon: '🦁', color: 'gold', desc: 'Grand', prompt: 'Speak proudly' },
  { id: 'guilty', name: 'Guilty', icon: '😔', color: 'slate', desc: 'Regretful', prompt: 'Speak guiltily' },
  { id: 'jealous', name: 'Jealous', icon: '😒', color: 'green', desc: 'Envious', prompt: 'Speak jealously' },
  { id: 'lonely', name: 'Lonely', icon: '🏚️', color: 'blue', desc: 'Isolated', prompt: 'Speak lonely' },
  { id: 'grateful', name: 'Grateful', icon: '🙏', color: 'emerald', desc: 'Thankful', prompt: 'Speak gratefully' },
  { id: 'curious', name: 'Curious', icon: '🤔', color: 'cyan', desc: 'Inquisitive', prompt: 'Speak curiously' },
  { id: 'determined', name: 'Firm', icon: '😤', color: 'red', desc: 'Strong', prompt: 'Speak determinedly' },
  { id: 'relaxed', name: 'Relaxed', icon: '🏖️', color: 'teal', desc: 'Chill', prompt: 'Speak relaxed' },
  { id: 'worried', name: 'Worried', icon: '😟', color: 'yellow', desc: 'Uneasy', prompt: 'Speak worriedly' },
  { id: 'disappointed', name: 'Sad', icon: '😞', color: 'slate', desc: 'Let down', prompt: 'Speak disappointedly' },
  { id: 'inspired', name: 'Inspired', icon: '💡', color: 'amber', desc: 'Creative', prompt: 'Speak inspired' },
  { id: 'silly', name: 'Silly', icon: '🤪', color: 'pink', desc: 'Funny', prompt: 'Speak sillily' },
  { id: 'grumpy', name: 'Grumpy', icon: '😡', color: 'orange', desc: 'Crabby', prompt: 'Speak grumpily' },
  { id: 'peaceful', name: 'Peace', icon: '🕊️', color: 'white', desc: 'Serene', prompt: 'Speak peacefully' },
  { id: 'nostalgic', name: 'Old', icon: '📻', color: 'stone', desc: 'Past', prompt: 'Speak nostalgically' },
  { id: 'brave', name: 'Brave', icon: '🛡️', color: 'red', desc: 'Fearless', prompt: 'Speak bravely' },
  { id: 'kind', name: 'Kind', icon: '🤝', color: 'emerald', desc: 'Gentle', prompt: 'Speak kindly' },
  { id: 'stern', name: 'Stern', icon: '🤨', color: 'zinc', desc: 'Strict', prompt: 'Speak sternly' },
  { id: 'playful', name: 'Play', icon: '🎈', color: 'pink', desc: 'Fun', prompt: 'Speak playfully' },
  { id: 'elegant', name: 'Elegant', icon: '💎', color: 'indigo', desc: 'Fancy', prompt: 'Speak elegantly' },
  { id: 'robotic', name: 'Robot', icon: '🤖', color: 'slate', desc: 'Flat', prompt: 'Speak robotically' },
  { id: 'ghostly', name: 'Ghost', icon: '👻', color: 'white', desc: 'Eerie', prompt: 'Speak ghostly' },
  { id: 'heroic', name: 'Hero', icon: '🦸', color: 'blue', desc: 'Epic', prompt: 'Speak heroically' },
  { id: 'villainous', name: 'Evil', icon: '😈', color: 'purple', desc: 'Dark', prompt: 'Speak villainously' }
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
  const [apiKeys, setApiKeys] = useState<string[]>(['']);
  const [auphonicToken, setAuphonicToken] = useState<string>('');
  const [isAuphonicEnabled, setIsAuphonicEnabled] = useState<boolean>(true);
  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(0);
  const [showKeyManager, setShowKeyManager] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [selVoice, setSelVoice] = useState<string>('Kore');
  const [selEmotion, setSelEmotion] = useState<string>('neutral');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [volumeBoost, setVolumeBoost] = useState<number>(1.0);
  const [clarity, setClarity] = useState<number>(50);
  const [warmth, setWarmth] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'bright' | 'calm'>('all');
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [customEmotion, setCustomEmotion] = useState<string>('');
  const [newKeyInput, setNewKeyInput] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement>(null);

  // Load saved data
  useEffect(() => {
    const savedKeys = localStorage.getItem('genvoice_api_keys');
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApiKeys(parsed);
        }
      } catch (e) {
        console.error("Failed to parse keys", e);
      }
    } else {
      const savedKey = localStorage.getItem('genvoice_api_key');
      if (savedKey) {
        setApiKeys([savedKey]);
      } else if (process.env.GEMINI_API_KEY) {
        setApiKeys([process.env.GEMINI_API_KEY]);
      }
    }

    const savedAuphonicToken = localStorage.getItem('genvoice_auphonic_token');
    if (savedAuphonicToken) setAuphonicToken(savedAuphonicToken);

    const savedAuphonicEnabled = localStorage.getItem('genvoice_auphonic_enabled');
    if (savedAuphonicEnabled !== null) setIsAuphonicEnabled(savedAuphonicEnabled === 'true');

    const savedHistory = localStorage.getItem('genvoice_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Load other settings
    const savedVoice = localStorage.getItem('genvoice_voice');
    if (savedVoice) setSelVoice(savedVoice);
    
    const savedEmotion = localStorage.getItem('genvoice_emotion');
    if (savedEmotion) setSelEmotion(savedEmotion);

    const savedSpeed = localStorage.getItem('genvoice_speed');
    if (savedSpeed) setSpeed(parseFloat(savedSpeed));

    const savedPitch = localStorage.getItem('genvoice_pitch');
    if (savedPitch) setPitch(parseInt(savedPitch));

    const savedVolume = localStorage.getItem('genvoice_volume');
    if (savedVolume) setVolumeBoost(parseFloat(savedVolume));

    const savedClarity = localStorage.getItem('genvoice_clarity');
    if (savedClarity) setClarity(parseInt(savedClarity));

    const savedWarmth = localStorage.getItem('genvoice_warmth');
    if (savedWarmth) setWarmth(parseInt(savedWarmth));
  }, []);

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
      villainous: { s: 0.9, p: -6 }
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
    if (validKeys.length === 0) return null;
    
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
            denoise: true,
            normloudness: true,
            dynamic_range_compressor: true,
            highpass_filter: true
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

    const attemptSpeech = async (key: string): Promise<string | null> => {
      try {
        setGenerationStep(2); // Selecting Voice & Emotion
        
        let emotionInstruction = customEmotion.trim() ? `Speak with a ${customEmotion} tone` : (emotion?.prompt || 'Speak naturally');
        const qualityInstruction = "Deliver the speech with a highly natural, human-like, expressive, and conversational tone, avoiding any robotic cadence.";
        const prompt = `${emotionInstruction}. ${qualityInstruction}: ${text}`;

        setGenerationStep(3); // Synthesizing Audio
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
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
        return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
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
      const base64Audio = await attemptSpeech(currentKey);
      
      if (base64Audio) {
        setGenerationStep(4); // Enhancing Audio Quality
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Finalizing
        let finalBlob = createWavBlob(bytes, 24000, 1, 16);

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
      } else {
        await navigator.clipboard.writeText(`GenVoice: ${selEmotion} speech by ${selVoice}`);
        showStatus('Info copied to clipboard', 'success');
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <motion.div 
          whileHover={{ scale: 1.05, rotateY: 10, rotateX: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text tracking-tight">GenVoice</h1>
            <p className="text-sm text-slate-400 font-medium">AI Neural Voice Engine</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowKeyManager(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
          >
            <Settings2 className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-xs font-bold">Settings</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Engine v3.0
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Text Input Panel */}
              <motion.section 
                whileHover={{ rotateY: 1, rotateX: 1, scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-6"
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
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none placeholder:text-slate-600"
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
                className="glass-panel p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Smile className="w-4 h-4 text-pink-400" />
                    Select Emotion
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
                      Type any emotion (e.g. "whispering", "crying")
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {EMOTIONS.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => { handleEmotionChange(e.id); setCustomEmotion(''); }}
                      className={`group relative flex flex-col items-center p-2 rounded-lg border transition-all duration-300 ${
                        selEmotion === e.id && !customEmotion
                        ? `bg-${e.color}-500/10 border-${e.color}-500/50 shadow-lg shadow-${e.color}-500/10` 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{e.icon}</span>
                      <span className={`text-[9px] font-bold truncate w-full text-center ${selEmotion === e.id && !customEmotion ? `text-${e.color}-400` : 'text-slate-400'}`}>
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
                className="glass-panel p-6"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar p-1">
                  {filteredVoices.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelVoice(v.name)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 transform ${
                        selVoice === v.name 
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_8px_20px_rgba(79,70,229,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] scale-[1.02] -translate-y-1 border-t border-indigo-400' 
                        : 'bg-gradient-to-br from-white/10 to-white/5 text-slate-300 border border-white/10 shadow-[0_4px_6px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:scale-[1.01] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 mb-2 shadow-inner">
                        <Mic2 className={`w-4 h-4 ${selVoice === v.name ? 'text-white' : 'text-indigo-400'}`} />
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-black uppercase tracking-wider ${selVoice === v.name ? 'text-white' : 'text-slate-200'}`}>{v.name}</div>
                        <div className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${selVoice === v.name ? 'text-indigo-200' : 'text-slate-500'}`}>{v.style}</div>
                      </div>
                      {selVoice === v.name && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.section>

              {/* Advanced Settings */}
              <motion.section 
                whileHover={{ rotateY: 1, rotateX: 1, scale: 1.005 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-6"
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
                disabled={isGenerating}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all flex items-center justify-center gap-3 group ${
                  isGenerating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:scale-[1.01] active:scale-[0.99] text-white shadow-cyan-500/20'
                }`}
              >
                {isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                )}
                {isGenerating ? 'Synthesizing Audio...' : 'Generate Emotional Speech'}
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
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-start justify-center z-[120] p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1b1e] border border-white/5 max-w-md w-full rounded-[32px] shadow-2xl my-auto overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Settings2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">API Management</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">MULTI-KEY ROTATION SYSTEM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearAllKeys}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all"
                    title="Clear All Keys"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowKeyManager(false)}
                    className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 pb-8 space-y-6">
                {/* Info Box */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-500/90 leading-relaxed">
                      Add up to 10 Gemini API keys. The system will automatically rotate between them.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-500/80 leading-relaxed">
                      Important: Keys from the same project share the same quota. Use different projects for more capacity.
                    </p>
                  </div>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Get API Key from Google AI Studio
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
                  <input 
                    type="password"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="Enter Gemini API Key..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700"
                  />
                  <button 
                    onClick={addApiKey}
                    disabled={!newKeyInput.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="w-5 h-5" />
                    Add API Key
                  </button>
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
      `}</style>
    </div>
  );
}
