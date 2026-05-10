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
  Waves,
  ShieldAlert,
  Terminal,
  Database,
  Cpu,
  Lock,
  Unlock,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VOICES, EMOTIONS } from './constants';
import { HistoryItem, LogEntry } from './types';
import { createWavBlob } from './utils';

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
  const [isCartoonMode, setIsCartoonMode] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  
  // Master Control States
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'config' | 'logs' | 'data'>('config');
  const [isMasterLocked, setIsMasterLocked] = useState<boolean>(true);
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
  const [serverStatus, setServerStatus] = useState<{ mode: string, time: string } | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>("ACTING MODE: You are a world-class cartoon voice actor. This is for an animation script. Use extreme vocal range, exaggerated pitch variations, and high character energy. Do not sound like a machine; sound like a living character with personality, quirks, and expressive breath patterns.");

  // ... (inside useEffect or a new one)
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.ok ? await res.json() : null;
          if (data) setServerStatus({ mode: data.mode, time: data.time });
        }
      } catch (e) {
        console.warn("Backend status unavailable - possibly running in pure SPA mode");
      }
    };
    checkStatus();
  }, [showAdminPanel]);
  const [qualityPrompt, setQualityPrompt] = useState<string>("Deliver the speech with a highly natural, human-like, expressive, and conversational tone, avoiding any robotic cadence.");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash-preview-tts");

  const audioRef = useRef<HTMLAudioElement>(null);
  
  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString(),
      type,
      message
    };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
  };

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

    const savedCartoon = localStorage.getItem('genvoice_cartoon_mode');
    if (savedCartoon !== null) setIsCartoonMode(savedCartoon === 'true');

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
    addLog('info', `Starting generation for: "${text.substring(0, 30)}..."`);

    const emotion = EMOTIONS.find(e => e.id === selEmotion);
    let retryCount = 0;
    const maxRetries = apiKeys.filter(k => k.trim()).length;

    const attemptSpeech = async (key: string): Promise<string | null> => {
      try {
        setGenerationStep(2); // Selecting Voice & Emotion
        
        const emotionInstruction = customEmotion.trim() ? `Speak with a ${customEmotion} tone` : (emotion?.prompt || 'Speak naturally');
        
        let prompt = `${emotionInstruction}. ${qualityPrompt}: ${text}`;
        
        if (isCartoonMode) {
          prompt = `${emotionInstruction}. ${systemPrompt}. ${qualityPrompt}: ${text}`;
        }

        setGenerationStep(3); // Synthesizing Audio
        addLog('request', `Sending request to Gemini (${selectedModel})`);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`, {
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
        addLog('response', `Received ${data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ? 'audio data' : 'empty response'}`);
        return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
      } catch (err: any) {
        addLog('error', err.message || 'Unknown API error');
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
      <div className="min-h-screen bg-[#0a0a0a] text-slate-200 selection:bg-indigo-500/30 font-sans sm:pb-0 pb-20 custom-scrollbar">
        <div className="p-3 md:p-8 max-w-6xl mx-auto w-full">
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
          {isInstallable && (
            <button 
              onClick={installApp}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/30 transition-all group shrink-0 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)] animate-pulse hover:animate-none"
              title="Install App"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-bold font-bengali">ইন্সটল অ্যাপ</span>
            </button>
          )}

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
            onClick={() => setShowAdminPanel(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all group shrink-0"
            title="Master Control Center"
          >
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-xs font-bold font-bengali">মাস্টার কন্ট্রোল</span>
          </button>

          <button 
            onClick={() => setShowKeyManager(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[10px] sm:text-xs font-bold">Settings</span>
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            v3.0
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
                  rows={4}
                  placeholder="Type or paste text to synthesize..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none placeholder:text-slate-600 sm:min-h-[200px]"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar p-1">
                  {filteredVoices.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelVoice(v.name)}
                      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 transform ${
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
              className="bg-[#1a1b1e] border border-white/5 max-w-md w-full rounded-[24px] sm:rounded-[32px] shadow-2xl my-auto overflow-hidden"
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

              <div className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
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

      {/* Admin Panel / Master Control Center */}
      <AnimatePresence>
        {showAdminPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[210] p-4 font-sans"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              className="bg-[#0f0f12] border border-white/10 w-full max-w-4xl h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-700" />
              
              {/* Sidebar Tabs */}
              <div className="flex flex-1 overflow-hidden">
                <div className="w-16 sm:w-64 bg-black/40 border-r border-white/5 flex flex-col p-4 sm:p-6 gap-6">
                  <div className="flex items-center gap-3 mb-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                      <Unlock className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <h2 className="text-sm font-black text-white uppercase tracking-widest">Master Node</h2>
                      <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        A1-Authorized
                      </div>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <button 
                      onClick={() => setAdminTab('config')}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold w-full transition-all ${adminTab === 'config' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-500 hover:text-slate-200'}`}
                    >
                      <Cpu className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Engine Config</span>
                    </button>
                    <button 
                      onClick={() => setAdminTab('logs')}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold w-full transition-all ${adminTab === 'logs' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-500 hover:text-slate-200'}`}
                    >
                      <Terminal className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">System Logs</span>
                    </button>
                    <button 
                      onClick={() => setAdminTab('data')}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold w-full transition-all ${adminTab === 'data' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-500 hover:text-slate-200'}`}
                    >
                      <Database className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Data Management</span>
                    </button>
                  </nav>

                  <div className="mt-auto pt-6 border-t border-white/5">
                    <button 
                      onClick={() => setShowAdminPanel(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-bold w-full transition-all"
                    >
                      <X className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">Close Node</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar space-y-8 bg-gradient-to-br from-indigo-500/5 to-transparent">
                  {adminTab === 'config' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <header>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Master Configuration</h1>
                        <p className="text-sm text-slate-400 font-medium">Override system parameters and adjust neural weights.</p>
                      </header>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Engine Settings */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">AI Model Instance</label>
                            <select 
                              value={selectedModel}
                              onChange={(e) => setSelectedModel(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                            >
                              <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash TTS (Preview)</option>
                              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Intelligence)</option>
                              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
                            </select>
                            <p className="text-[8px] text-amber-500 font-bold uppercase ml-1">Note: Only TTS-specific models support direct audio modality.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Neural Quality Instruction</label>
                            <textarea 
                              value={qualityPrompt}
                              onChange={(e) => setQualityPrompt(e.target.value)}
                              rows={4}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
                            />
                          </div>
                        </div>

                        {/* Acting Settings */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Character Performance Instruction (Cartoon)</label>
                            <textarea 
                              value={systemPrompt}
                              onChange={(e) => setSystemPrompt(e.target.value)}
                              rows={7}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {adminTab === 'logs' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <header>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Neural Link Logs</h1>
                        <p className="text-sm text-slate-400 font-medium">Real-time stream of all API activity and system events.</p>
                      </header>
                      
                      <div className="bg-black/60 border border-white/10 rounded-[24px] overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Stream</span>
                          </div>
                          <button 
                            onClick={() => setSystemLogs([])}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                          >
                            Purge
                          </button>
                        </div>
                        <div className="h-[400px] overflow-y-auto p-6 font-mono text-[11px] space-y-3 custom-scrollbar bg-black/40">
                          {systemLogs.length === 0 ? (
                            <div className="text-slate-700 italic flex flex-col items-center justify-center h-full gap-4">
                              <Terminal className="w-8 h-8 opacity-20" />
                              Ambient monitoring active. No packets captured.
                            </div>
                          ) : (
                            systemLogs.map((log) => (
                              <div key={log.id} className="flex gap-4 group">
                                <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                                <span className={`uppercase font-black shrink-0 ${
                                  log.type === 'error' ? 'text-rose-500' :
                                  log.type === 'request' ? 'text-amber-500' :
                                  log.type === 'response' ? 'text-cyan-500' :
                                  'text-indigo-400'
                                }`}>
                                  {log.type}
                                </span>
                                <span className="text-slate-400 break-all group-hover:text-slate-200 transition-colors">{log.message}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {adminTab === 'data' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <header>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Memory Management</h1>
                        <p className="text-sm text-slate-400 font-medium">Export, import, or wipe local application metadata.</p>
                      </header>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 border-white/5 space-y-4">
                          <h3 className="text-xs font-black text-white uppercase tracking-widest">Backup & Export</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">Save all generations, settings, and API configuration to a JSON file for local archival.</p>
                          <button 
                            onClick={() => {
                              const data = {
                                history,
                                apiKeys,
                                auphonicToken,
                                isAuphonicEnabled,
                                isCartoonMode,
                                settings: {
                                  selVoice,
                                  selEmotion,
                                  speed,
                                  pitch,
                                  volumeBoost,
                                  clarity,
                                  warmth,
                                  systemPrompt,
                                  qualityPrompt,
                                  selectedModel
                                }
                              };
                              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `genvoice_backup_${Date.now()}.json`;
                              a.click();
                              showStatus('System backup exported!', 'success');
                            }}
                            className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                          >
                            <Download className="w-4 h-4" /> Download Backup.json
                          </button>
                        </div>

                        <div className="glass-panel p-6 border-white/5 space-y-4">
                          <h3 className="text-xs font-black text-white uppercase tracking-widest">Master Wipe</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">Irreversibly clear all local storage data. This will reset the application to its factory state.</p>
                          <button 
                            onClick={() => {
                              if (window.confirm('IRREVERSIBLE ACTION: Are you absolutely sure you want to WIPE all data?')) {
                                localStorage.clear();
                                window.location.reload();
                              }
                            }}
                            className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 border border-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" /> Factory Reset App
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Data Management Sidebar-like footer for stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                      <div className="text-lg font-black text-white">{history.length}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Records</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                      <div className="text-lg font-black text-white capitalize">{serverStatus?.mode || 'Vite SPA'}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                      <div className="text-lg font-black text-white">{selectedModel.split('-')[1] || 'Flash'}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Tier</div>
                    </div>
                  </div>
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
