const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ --- Constants & Types ---[\s\S]*?const EMOTIONS = \[/;
const newContent = `// --- Constants & Types ---

const VOICES = [
  // Female (মেয়ের ভয়েস) - 10
  { name: 'Aoede', style: 'ছোট মেয়ে (মিষ্টি কণ্ঠ)', cat: 'female' },
  { name: 'Kore', style: 'ছোট মেয়ে (কিউট কণ্ঠ)', cat: 'female' },
  { name: 'Leda', style: 'ছোট মেয়ে (দুষ্টু কণ্ঠ)', cat: 'female' },
  { name: 'Callirrhoe', style: 'বড় মেয়ে (স্মার্ট)', cat: 'female' },
  { name: 'Despina', style: 'বড় মেয়ে (শান্ত)', cat: 'female' },
  { name: 'Erinome', style: 'বড় মেয়ে (স্বাভাবিক)', cat: 'female' },
  { name: 'Achird', style: 'বড় মেয়ে (উচ্ছল)', cat: 'female' },
  { name: 'Laomedeia', style: 'বয়স্কা মহিলা (গ গম্ভীর)', cat: 'female' },
  { name: 'Pulcherrima', style: 'বয়স্কা মহিলা (স্নেহময়ী)', cat: 'female' },
  { name: 'Vindemiatrix', style: 'বয়স্কা মহিলা (উপদেশমূলক)', cat: 'female' },

  // Male (ছেলের ভয়েস) - 10
  { name: 'Puck', style: 'ছোট ছেলে (হাস্যকর)', cat: 'male' },
  { name: 'Enceladus', style: 'ছোট ছেলে (চঞ্চল)', cat: 'male' },
  { name: 'Zephyr', style: 'ছোট ছেলে (স্মার্ট)', cat: 'male' },
  { name: 'Umbriel', style: 'বড় ছেলে (স্বাভাবিক)', cat: 'male' },
  { name: 'Algieba', style: 'বড় ছেলে (স্পষ্ট)', cat: 'male' },
  { name: 'Fenrir', style: 'বড় ছেলে (রাগী)', cat: 'male' },
  { name: 'Iapetus', style: 'বড় ছেলে (গভীর)', cat: 'male' },
  { name: 'Charon', style: 'বয়স্ক (গম্ভীর)', cat: 'male' },
  { name: 'Orus', style: 'বয়স্ক (মজার দৈত্য)', cat: 'male' },
  { name: 'Rasalgethi', style: 'বয়স্ক (জ্ঞানী)', cat: 'male' },

  // Voiceover (নেপথ্য কণ্ঠ) - 2
  { name: 'Autonoe', style: 'নেপথ্য কণ্ঠ (মেয়ে)', cat: 'voiceover' },
  { name: 'Algenib', style: 'নেপথ্য কণ্ঠ (ছেলে)', cat: 'voiceover' }
];

const EMOTIONS = [`;

code = code.replace(regex, newContent);

// Fix the mangled ErrorBoundary
const brokenErrorRegex = /className="w-full bg-indigo-500              <button[\s\S]*?className="w-full bg-white\/5 hover:bg-white\/10 text-white font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 font-bengali"const VOICES = \[/g;
const fixedError = `className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 font-bengali"
              >
                <RefreshCw className="w-4 h-4" />
                পুনরায় লোড করুন
              </button>
              <button 
                onClick={this.handleReset}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 font-bengali"
              >
                <Trash2 className="w-4 h-4" />
                ডাটা রিসেট করুন
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

const VOICES = [`;

code = code.replace(brokenErrorRegex, fixedError);
fs.writeFileSync('src/App.tsx', code);
console.log("Done");
