import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Compass, HelpCircle, CornerDownLeft, ShieldCheck, Calculator, LineChart, ShieldAlert } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "What does my birth date reveal about my business and career path?",
  "Calculate my Vedic Mulank and explain my ruling planet.",
  "Which planetary transit is affecting my personal growth right now?",
  "How can I align my daily schedule with my destiny number?"
];

// Numerology information dataset for Mulank 1-9
const MULANK_INFO = {
  1: { ruler: "Sun (Surya)", element: "Fire", type: "Leadership & Sovereignty", businessSuitability: 95, personalEmpathy: 65, spiritualDepth: 75, creativeDrive: 90, desc: "You are driven by individuality, vision, and pioneering actions. You excel in authoritative or entrepreneurial environments where decision-making lies with you. Avoid impatience and unnecessary pride." },
  2: { ruler: "Moon (Chandra)", element: "Water", type: "Intuition & Synchronization", businessSuitability: 70, personalEmpathy: 95, spiritualDepth: 85, creativeDrive: 80, desc: "A reflective, collaborative, and peace-seeking path. You are highly receptive and possess a deep emotional understanding, making you excellent in negotiations, design, and counsel. Build mental boundaries to prevent emotional fatigue." },
  3: { ruler: "Jupiter (Guru)", element: "Ether / Space", type: "Wisdom & Expansion", businessSuitability: 85, personalEmpathy: 80, spiritualDepth: 95, creativeDrive: 85, desc: "Your path is aligned with knowledge, teaching, and structured growth. You are a natural educator and advisor who seeks high-level philosophical understanding. Avoid dispersing your energies across too many tasks." },
  4: { ruler: "Rahu", element: "Shadow Element", type: "Disruption & Structure", businessSuitability: 90, personalEmpathy: 60, spiritualDepth: 70, creativeDrive: 95, desc: "Associated with sudden transformations, logical breakthroughs, and non-conformist actions. You excel in technical, digital, or structural innovation. Learn to anchor yourself to prevent erratic decision cycles." },
  5: { ruler: "Mercury (Budha)", element: "Air", type: "Commerce & Transduction", businessSuitability: 98, personalEmpathy: 75, spiritualDepth: 70, creativeDrive: 88, desc: "The ultimate business, communication, and trading configuration. You process details fast and adapt to shifts with ease. Your talent lies in networking and marketing. Watch out for restlessness." },
  6: { ruler: "Venus (Shukra)", element: "Water / Earth", type: "Harmony & Refinement", businessSuitability: 80, personalEmpathy: 90, spiritualDepth: 80, creativeDrive: 95, desc: "Focuses on comfort, art, hospitality, and relational values. You possess a strong eye for aesthetics and design. In business, you succeed in service-oriented sectors. Be cautious of over-indulgence." },
  7: { ruler: "Ketu", element: "Shadow Element", type: "Analysis & Mysticism", businessSuitability: 60, personalEmpathy: 80, spiritualDepth: 98, creativeDrive: 75, desc: "The path of the researcher, programmer, and mystic. You are inclined toward solitary investigation and analytical depth. You find success in specialized technical fields or spiritual work. Stay connected to your community." },
  8: { ruler: "Saturn (Shani)", element: "Earth / Air", type: "Resilience & Consolidation", businessSuitability: 92, personalEmpathy: 70, spiritualDepth: 90, creativeDrive: 70, desc: "Calculates to a path of heavy responsibilities, structured systems, and delayed but massive gains. You succeed in construction, heavy industries, or managing complex organizations. Patience is your greatest tool." },
  9: { ruler: "Mars (Mangal)", element: "Fire", type: "Operation & Strategy", businessSuitability: 88, personalEmpathy: 80, spiritualDepth: 80, creativeDrive: 85, desc: "Driven by physical endurance, strategic vision, and operations. You are highly energetic and protect the structures you care about. Excel in project management and leadership. Direct your temper constructly." }
};

// Zodiac Finder
const getZodiacSign = (dateStr) => {
  if (!dateStr) return 'Aries';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return 'Aries';
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) return 'Aries';
  
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

export default function OracleChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'oracle',
      text: "Greetings, seeker. I am the Aura Oracle. By studying the current planetary transits and natal calculations, I can offer professional-grade clarity on your career, relationships, or personal cycles. What cosmic guidance do you seek today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSign, setSelectedSign] = useState('Aries');
  
  // Birth details state inside chat for calculation
  const [showBirthForm, setShowBirthForm] = useState(false);
  const [birthDetails, setBirthDetails] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [computedData, setComputedData] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Numerology reducers
  const getMulank = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[2], 10);
    
    const reduceNum = (n) => {
      let sum = n;
      while (sum > 9) {
        sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
      }
      return sum;
    };
    return reduceNum(day);
  };

  const getBhagyank = (dateStr) => {
    if (!dateStr) return null;
    const numbers = dateStr.replace(/[^0-9]/g, '');
    let sum = numbers.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
    return sum;
  };

  const handleBirthFormSubmit = (e) => {
    e.preventDefault();
    if (!birthDetails.birthDate) return;

    const mVal = getMulank(birthDetails.birthDate);
    const bVal = getBhagyank(birthDetails.birthDate);
    const zSign = getZodiacSign(birthDetails.birthDate);

    const calculated = {
      mulank: mVal,
      bhagyank: bVal,
      zodiac: zSign,
      ...MULANK_INFO[mVal]
    };

    setComputedData(calculated);
    setSelectedSign(zSign);
    setShowBirthForm(false);

    // Add user message indicating details submitted
    const userMsg = {
      id: `user-birth-${Date.now()}`,
      sender: 'user',
      text: `Calculations updated for ${birthDetails.name || 'Seeker'}. Born on ${birthDetails.birthDate} at ${birthDetails.birthTime || 'unknown time'} in ${birthDetails.birthPlace || 'unknown place'}.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const visualMsg = {
        id: `oracle-report-${Date.now()}`,
        sender: 'oracle',
        isVisual: true,
        visualData: {
          name: birthDetails.name || 'Seeker',
          mulank: mVal,
          bhagyank: bVal,
          zodiac: zSign,
          ruler: MULANK_INFO[mVal].ruler,
          element: MULANK_INFO[mVal].element,
          type: MULANK_INFO[mVal].type,
          businessSuitability: MULANK_INFO[mVal].businessSuitability,
          personalEmpathy: MULANK_INFO[mVal].personalEmpathy,
          spiritualDepth: MULANK_INFO[mVal].spiritualDepth,
          creativeDrive: MULANK_INFO[mVal].creativeDrive,
          desc: MULANK_INFO[mVal].desc
        },
        timestamp: new Date()
      };
      setMessages(prev => [...prev, visualMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let responseKey = 'default';

      // Check if user is asking for numerology/mulank
      const isNumerologyQuery = lowerText.includes('mulank') || lowerText.includes('numerology') || lowerText.includes('birth number') || lowerText.includes('destiny number') || lowerText.includes('bhagyank');
      
      let replyMessage = {};

      if (isNumerologyQuery && computedData) {
        // Customize reply using actual computed numerology data!
        replyMessage = {
          id: `oracle-${Date.now()}`,
          sender: 'oracle',
          text: `Based on your computed birth details, your Mulank is ${computedData.mulank} (ruled by ${computedData.ruler}) and your Bhagyank is ${computedData.bhagyank}. This indicates a primary life focus on "${computedData.type}". In business environments, your suitability rating is approximately ${computedData.businessSuitability}%, meaning you operate best when utilizing ${computedData.ruler === 'Mercury (Budha)' ? 'analytical communication and commerce.' : 'your natural planetary focus.'} Let me know if you would like me to detail how this squares with your ${computedData.zodiac} zodiac elements.`,
          timestamp: new Date()
        };
      } else if (isNumerologyQuery && !computedData) {
        replyMessage = {
          id: `oracle-${Date.now()}`,
          sender: 'oracle',
          text: "To accurately calculate your Mulank (birth number) and Bhagyank (destiny number), please click the 'Numerology & Chart Calc' button in the sidebar panel to calibrate your coordinates first. Once calibrated, I can present a precise reading.",
          timestamp: new Date()
        };
      } else {
        // Standard transit responses
        if (lowerText.includes('career') || lowerText.includes('job') || lowerText.includes('work') || lowerText.includes('money') || lowerText.includes('business')) {
          responseKey = 'career';
        } else if (lowerText.includes('retrograde') || lowerText.includes('mercury') || lowerText.includes('delay') || lowerText.includes('communication')) {
          responseKey = 'retrograde';
        } else if (lowerText.includes('relationship') || lowerText.includes('love') || lowerText.includes('marry') || lowerText.includes('compatibility') || lowerText.includes('partner')) {
          responseKey = 'compatibility';
        } else if (lowerText.includes('spiritual') || lowerText.includes('moon') || lowerText.includes('meditation') || lowerText.includes('phase') || lowerText.includes('ritual')) {
          responseKey = 'spiritual';
        }

        const match = { ...RESPONSES[responseKey] };
        
        // Inject computed zodiac details if they exist to make the reply feel custom
        if (computedData) {
          match.introduction = `For a ${computedData.zodiac} sun with Mulank ${computedData.mulank}, ` + match.introduction.toLowerCase();
        }

        replyMessage = {
          id: `oracle-${Date.now()}`,
          sender: 'oracle',
          isStructured: true,
          structuredData: match,
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, replyMessage]);
      setIsTyping(false);
    }, 1800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const RESPONSES = {
    career: {
      title: "Career & Business Directional Synthesis",
      planetaryAlignment: computedData ? `Mulank ${computedData.mulank} aligned with Solar Transits` : "Saturn square Midheaven & Jupiter in Taurus",
      introduction: "In professional matters, the cosmos suggests a period of structural consolidation.",
      analysis: computedData 
        ? `Your computed Mulank (${computedData.mulank}) gives you a ruling drive of ${computedData.ruler}. In business sectors, this activates a ${computedData.businessSuitability}% suitability index. Your path calls for organizing resources. When Mercury transits are active, prioritize contract review.`
        : "Your professional sector is undergoing a necessary refinement. If you have been feeling friction or delay, this is not a denial of progress, but a cosmic quality control check. You are being forced to build systems that scale rather than relying on short-term enthusiasm.",
      practicalAdvice: [
        "Review operations and contracts for hidden details.",
        "Focus on skill acquisition rather than chasing instant validation.",
        "Set strict boundaries in partnerships to maintain strategic control."
      ]
    },
    retrograde: {
      title: "Mercury Retrograde Logistics Calibration",
      planetaryAlignment: "Mercury stationary retrograde in Earth sign opposition",
      introduction: "Retrogrades are vital cosmic cycles designed for calibration, reflection, and technical refinement.",
      analysis: "This cycle targets concrete logistics: schedule structures, communications, and digital transfers. Misunderstandings are high. Pushing harder will only increase delays; instead, review files, reorganize data structures, and draft communications thoughtfully.",
      practicalAdvice: [
        "Backup critical files and delay purchasing complex machinery.",
        "Practice a delay rule before executing long-term agreements.",
        "Revisit ideas that were shelved during the previous fiscal quarter."
      ]
    },
    compatibility: {
      title: "Relational Synastry & Dynamic Alignment",
      planetaryAlignment: "Venus trine Mars, activating 7th House boundaries",
      introduction: "Relational calculations are about understanding the balance lines between two energetic blueprints.",
      analysis: "Your zodiac profile indicates tension between the desire for independence and the search for deep collaboration. Long-term harmony is built on structured communication and shared values, rather than temporary sparks. Honor each other's cycles to prevent Saturnian friction in your shared house.",
      practicalAdvice: [
        "Schedule clear communication routines to prevent silent assumptions.",
        "Respect personal space as a critical element of relational longevity.",
        "Align on long-term values (business, security) before merging assets."
      ]
    },
    spiritual: {
      title: "Lunar Phases & Daily Calibration",
      planetaryAlignment: "Waning Moon transit opposing natal solar placements",
      introduction: "Aligning your daily schedule with celestial phases is an ancient method of energy management.",
      analysis: "During waning lunar cycles, energy is naturally drawing inward. Pushing for high performance or launching expansion projects is swimming against the tide. This is the optimal window to clean your workspace, review errors, and engage in reflective studies.",
      practicalAdvice: [
        "Dedicate time to sorting and archiving outdated tasks.",
        "Engage in restorative, quiet observation before beginning screens work.",
        "Note recurring symbols or structural blocks that appear in your morning notes."
      ]
    },
    default: {
      title: "General Planetary Aspect Analysis",
      planetaryAlignment: "Transit of House rulers in aspect with Natal Nodes",
      introduction: "Planetary coordinates are reflecting your active focus.",
      analysis: "Your query highlights a desire for structural alignment. Currently, calculations point to a transition. You are being guided to verify details and rely on systematic logic rather than external promises. Revisit your calculations to anchor your next choices.",
      practicalAdvice: [
        "Dedicate 10 minutes to planning coordinates before starting projects.",
        "Trace metrics, numbers, or themes that recur in your daily schedule.",
        "Consult concrete logs or data tables when facing career decisions."
      ]
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Astrologer Information, Calibration & Forms */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Info */}
          <div className="glass-panel p-6 border-slate-900 text-left space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-[1.5px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                  <Compass className="h-6 w-6 text-amber-400 animate-spin-slow" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">Aura AI Oracle</h3>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Transit Feed
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Our Oracle is trained on professional astrological methodologies, natal synthesis rules, and historical ephemerides. It avoids generic fortune-telling and focuses on psychological growth and alignment.
            </p>

            <div className="flex flex-col gap-2 border-t border-slate-900 pt-4">
              <button
                onClick={() => setShowBirthForm(!showBirthForm)}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900/60 px-3 py-2 text-xs font-semibold text-amber-400 transition-colors"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Numerology & Chart Calc</span>
              </button>
            </div>

            {computedData && (
              <div className="rounded-xl bg-slate-950/80 border border-slate-900 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-1.5 text-slate-400">
                  <span>Computed Mulank:</span>
                  <span className="font-bold text-amber-400">{computedData.mulank}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5 text-slate-400">
                  <span>Destiny Bhagyank:</span>
                  <span className="font-bold text-purple-400">{computedData.bhagyank}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sun Sign:</span>
                  <span className="font-bold text-slate-200">{computedData.zodiac}</span>
                </div>
              </div>
            )}
          </div>

          {/* Form inside Sidebar when requested */}
          {showBirthForm && (
            <div className="glass-panel p-5 border-amber-500/20 bg-slate-950/80 text-left space-y-4 animate-fade-in">
              <h4 className="font-serif text-sm font-bold text-slate-200">Calibrate Birth Vector</h4>
              <form onSubmit={handleBirthFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={birthDetails.name}
                    onChange={(e) => setBirthDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    placeholder="Seeker Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Birth Date</label>
                  <input
                    type="date"
                    required
                    value={birthDetails.birthDate}
                    onChange={(e) => setBirthDetails(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Birth Time</label>
                    <input
                      type="time"
                      value={birthDetails.birthTime}
                      onChange={(e) => setBirthDetails(prev => ({ ...prev, birthTime: e.target.value }))}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Birth Place</label>
                    <input
                      type="text"
                      value={birthDetails.birthPlace}
                      onChange={(e) => setBirthDetails(prev => ({ ...prev, birthPlace: e.target.value }))}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 py-2 text-xs font-semibold text-slate-950 transition-all hover:opacity-95"
                >
                  Verify & Connect
                </button>
              </form>
            </div>
          )}

          {/* Quick Prompts Panel */}
          <div className="glass-panel p-5 border-slate-900 text-left space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
              Suggested Consultations
            </h4>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left rounded-lg border border-slate-900/60 bg-slate-950/40 p-2.5 text-xs text-slate-350 transition-all hover:bg-slate-900 hover:border-amber-500/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Chat Area */}
        <div className="lg:col-span-8 flex flex-col h-[600px] glass-panel border-slate-900 overflow-hidden bg-slate-950/20">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-900 bg-slate-950/60 px-6 py-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold tracking-wide text-slate-200">Consultation Session</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              Zodiac Calibration: <span className="text-amber-400 font-medium">{selectedSign}</span>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-slate-900 border-slate-800 text-slate-300' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3.5 text-sm text-left ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium'
                      : 'bg-slate-950/80 border border-slate-900/60 text-slate-300 shadow-inner'
                  }`}>
                    
                    {/* Visual Card Response Option */}
                    {msg.isVisual ? (
                      <div className="space-y-4 w-full min-w-[280px] sm:min-w-[400px]">
                        <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Vedic Numerology Analysis</span>
                            <h4 className="font-serif text-lg font-bold text-slate-100 tracking-wide">
                              Vector Profile: {msg.visualData.name}
                            </h4>
                          </div>
                          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs text-amber-400 font-bold">
                            Mulank {msg.visualData.mulank}
                          </span>
                        </div>

                        {/* Numeric stats cards */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-lg bg-slate-900/60 border border-slate-900 p-2">
                            <span className="text-[8px] uppercase tracking-wider text-slate-500">Destiny (Bhagyank)</span>
                            <p className="font-bold text-purple-400 mt-0.5">{msg.visualData.bhagyank}</p>
                          </div>
                          <div className="rounded-lg bg-slate-900/60 border border-slate-900 p-2">
                            <span className="text-[8px] uppercase tracking-wider text-slate-500">Ruling Sphere</span>
                            <p className="font-bold text-amber-400 mt-0.5">{msg.visualData.ruler}</p>
                          </div>
                          <div className="rounded-lg bg-slate-900/60 border border-slate-900 p-2">
                            <span className="text-[8px] uppercase tracking-wider text-slate-500">Zodiac Element</span>
                            <p className="font-bold text-emerald-400 mt-0.5">{msg.visualData.element}</p>
                          </div>
                        </div>

                        {/* Suitability Bars (Visual reply element) */}
                        <div className="space-y-2.5 pt-2">
                          <h5 className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Path Compatibility Indices</h5>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Business & Operations</span>
                              <span>{msg.visualData.businessSuitability}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${msg.visualData.businessSuitability}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Personal & Collaboration</span>
                              <span>{msg.visualData.personalEmpathy}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${msg.visualData.personalEmpathy}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Spiritual Depth</span>
                              <span>{msg.visualData.spiritualDepth}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${msg.visualData.spiritualDepth}%` }} />
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-350 leading-relaxed border-t border-slate-900 pt-3">
                          <strong>Synthesis:</strong> {msg.visualData.desc}
                        </p>
                      </div>
                    ) : !msg.isStructured ? (
                      <p className="leading-relaxed">{msg.text}</p>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-serif text-base font-bold text-amber-400 tracking-wide text-glow-gold">
                            {msg.structuredData.title}
                          </h4>
                          <span className="inline-block mt-1 text-[10px] bg-purple-950/60 text-purple-300 border border-purple-500/20 rounded-md px-2 py-0.5 uppercase tracking-wide">
                            {msg.structuredData.planetaryAlignment}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-slate-900 pl-3 italic">
                          {msg.structuredData.introduction}
                        </p>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {msg.structuredData.analysis}
                        </p>

                        <div className="space-y-2 border-t border-slate-900 pt-3">
                          <h5 className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                            Practical Astrological Practices:
                          </h5>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
                            {msg.structuredData.practicalAdvice.map((step, idx) => (
                              <li key={idx} className="leading-relaxed">{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-amber-500/10 border-amber-500/20 text-amber-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-slate-950/60 border border-slate-905 px-4 py-3 flex space-x-1.5 items-center h-10 shadow-inner">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer */}
          <div className="border-t border-slate-900 bg-slate-950/60 p-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={computedData ? `Ask about your Mulank ${computedData.mulank} or zodiac elements...` : `Ask, or calibrate your birth details first...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full rounded-xl border border-slate-900 bg-slate-950 py-3.5 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-650 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-2.5 rounded-lg bg-amber-500 p-2 text-slate-950 transition-all hover:bg-amber-400 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 px-1">
              <span>Press Enter to consult the stars</span>
              <span className="flex items-center gap-1 text-emerald-500/80">
                <ShieldAlert className="h-3 w-3" />
                Vedic calculations calibrated
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
