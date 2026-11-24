import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, Sparkles, ArrowLeft, Calculator,
  Clock, ChevronRight, Table, List, MessageSquare, Compass, MapPin
} from 'lucide-react';
import { processMessage } from '../engine/oracle.js';
import { getMulank, getBhagyank, getNameNumber, RASHIS } from '../engine/knowledge.js';
import { findCity, getUTCBirthDate, getSiderealSunLongitude, getSiderealMoonLongitude, getSiderealAscendant } from '../engine/astronomy.js';

const TIMEZONES = [
  { value: '-12', label: 'UTC-12:00 (Baker Island)' },
  { value: '-11', label: 'UTC-11:00 (Samoa)' },
  { value: '-10', label: 'UTC-10:00 (Hawaii)' },
  { value: '-9', label: 'UTC-09:00 (Alaska)' },
  { value: '-8', label: 'UTC-08:00 (Pacific Time)' },
  { value: '-7', label: 'UTC-07:00 (Mountain Time)' },
  { value: '-6', label: 'UTC-06:00 (Central Time)' },
  { value: '-5', label: 'UTC-05:00 (Eastern Time)' },
  { value: '-4', label: 'UTC-04:00 (Atlantic Time)' },
  { value: '-3', label: 'UTC-03:00 (Buenos Aires)' },
  { value: '-2', label: 'UTC-02:00 (Mid-Atlantic)' },
  { value: '-1', label: 'UTC-01:00 (Azores)' },
  { value: '0', label: 'UTC+00:00 (London/GMT)' },
  { value: '1', label: 'UTC+01:00 (Paris/Berlin)' },
  { value: '2', label: 'UTC+02:00 (Cairo/South Africa)' },
  { value: '3', label: 'UTC+03:00 (Moscow/East Africa)' },
  { value: '3.5', label: 'UTC+03:30 (Tehran)' },
  { value: '4', label: 'UTC+04:00 (Dubai/Samara)' },
  { value: '4.5', label: 'UTC+04:30 (Kabul)' },
  { value: '5', label: 'UTC+05:00 (Karachi/Tashkent)' },
  { value: '5.5', label: 'UTC+05:30 (India/Standard)' },
  { value: '5.75', label: 'UTC+05:45 (Kathmandu)' },
  { value: '6', label: 'UTC+06:00 (Dhaka/Almaty)' },
  { value: '6.5', label: 'UTC+06:30 (Yangon)' },
  { value: '7', label: 'UTC+07:00 (Bangkok/Jakarta)' },
  { value: '8', label: 'UTC+08:00 (Singapore/Beijing)' },
  { value: '9', label: 'UTC+09:00 (Tokyo/Seoul)' },
  { value: '9.5', label: 'UTC+09:30 (Adelaide)' },
  { value: '10', label: 'UTC+10:00 (Sydney/Vladivostok)' },
  { value: '11', label: 'UTC+11:00 (Solomon Islands)' },
  { value: '12', label: 'UTC+12:00 (Fiji/New Zealand)' },
  { value: '13', label: 'UTC+13:00 (Tonga)' },
  { value: '14', label: 'UTC+14:00 (Line Islands)' }
];


const QUICK_ACTIONS = [
  { label: 'My Numerology', query: 'Calculate my Vedic Mulank and explain my ruling planet' },
  { label: 'Career Advice', query: 'What career path suits me based on my numbers?' },
  { label: 'Today\'s Guidance', query: 'Give me my daily guidance for today' },
  { label: 'Compatibility', query: 'Show me my compatibility numbers' },
  { label: 'Health', query: 'What are my health tendencies?' },
  { label: 'Gemstone', query: 'Which gemstone should I wear?' },
  { label: 'Spiritual Practice', query: 'What spiritual practices suit my profile?' },
  { label: 'Education', query: 'Guide me on my learning style and study approach' },
];

// ─── Structured Message Renderer ───────────────────────────────────────────
function StructuredResponse({ data }) {
  return (
    <div className="space-y-4 w-full">
      {/* Title */}
      <h3 className="font-serif text-base font-bold text-amber-400 tracking-wide border-b border-slate-800/60 pb-2">
        {data.title}
      </h3>

      {data.sections?.map((section, i) => (
        <div key={i} className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {section.heading}
          </h4>

          {/* Cards row */}
          {section.cards && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {section.cards.map((card, j) => (
                <div key={j} className="rounded-lg bg-slate-950/80 border border-slate-800/60 p-3 text-center">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">{card.label}</span>
                  <span className="text-lg font-bold text-amber-400 font-serif block mt-0.5">{card.value}</span>
                  <span className="text-[10px] text-slate-500 block">{card.sub}</span>
                </div>
              ))}
            </div>
          )}

          {/* Content paragraph */}
          {section.content && (
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          )}

          {/* List */}
          {section.list && (
            <ul className="space-y-1 text-xs text-slate-400 pl-1">
              {section.list.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 text-amber-500/60 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Table */}
          {section.table && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    {section.table.headers.map((h, j) => (
                      <th key={j} className="py-1.5 pr-4 text-[10px] uppercase tracking-wider text-slate-500 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, j) => (
                    <tr key={j} className="border-b border-slate-900/40">
                      {row.map((cell, k) => (
                        <td key={k} className="py-1.5 pr-4 text-slate-400">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Chat Page ────────────────────────────────────────────────────────
export default function ChatPage({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'oracle',
      type: 'text',
      text: 'Welcome to Aura Oracle. I provide guidance based on Vedic numerology and zodiac analysis.\n\nTo begin, share your birth date in any format (e.g., "15 March 1995"). Once calibrated, you can ask about career, relationships, health, education, gemstones, daily forecasts, and more.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(null);

  // Birth form state
  const [showCalibrate, setShowCalibrate] = useState(false);
  const [formData, setFormData] = useState({ name: '', birthDate: '', birthTime: '', birthPlace: '', tzOffset: '5.5' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'birthPlace') {
        const detected = findCity(value);
        if (detected) {
          updated.tzOffset = String(detected.tz);
        }
      }
      return updated;
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCalibrate = (e) => {
    e.preventDefault();
    if (!formData.birthDate) return;

    const cityInfo = findCity(formData.birthPlace) || { name: formData.birthPlace, lat: 28.61, lng: 77.20, tz: 5.5 };
    const tz = parseFloat(formData.tzOffset);
    const birthUTC = getUTCBirthDate(formData.birthDate, formData.birthTime, tz);

    const sunLong = getSiderealSunLongitude(birthUTC);
    const moonLong = getSiderealMoonLongitude(birthUTC);
    const ascLong = getSiderealAscendant(birthUTC, cityInfo.lat, cityInfo.lng);

    const sunRashi = RASHIS[Math.floor(sunLong / 30) % 12];
    const moonRashi = RASHIS[Math.floor(moonLong / 30) % 12];
    const ascRashi = RASHIS[Math.floor(ascLong / 30) % 12];

    const mulank = getMulank(formData.birthDate);
    const bhagyank = getBhagyank(formData.birthDate);
    const namank = formData.name ? getNameNumber(formData.name) : null;
    const dayOfWeek = birthUTC.getDay();

    const newProfile = {
      name: formData.name || 'Seeker',
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: cityInfo.name,
      tzOffset: String(tz),
      mulank,
      bhagyank,
      namank,
      dayOfWeek,
      chandraRashi: moonRashi.sanskrit,
      suryaRashi: sunRashi.sanskrit,
      lagna: ascRashi.sanskrit,
      chandraLong: moonLong,
      suryaLong: sunLong,
      lagnaLong: ascLong
    };

    setProfile(newProfile);
    setShowCalibrate(false);

    // Add calibration confirmation message
    const userMsg = {
      id: `user-cal-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: `Birth details: ${formData.name || 'Seeker'}, born ${formData.birthDate}${formData.birthTime ? ' at ' + formData.birthTime : ''} (tz: UTC${tz >= 0 ? '+' + tz : tz}) in ${cityInfo.name}.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      // Direct response showing computed Rashi (first setup explain)
      const response = processMessage(`Vedic Chart Profile Synthesis`, newProfile);
      const oracleMsg = {
        id: `oracle-cal-${Date.now()}`,
        sender: 'oracle',
        ...response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, oracleMsg]);
      setIsTyping(false);
    }, 800);
  };


  const handleSend = (textOverride) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processMessage(text, profile);

      // If the engine detected a new profile from the text, save it
      if (response.newProfile) {
        setProfile(response.newProfile);
      }

      const oracleMsg = {
        id: `oracle-${Date.now()}`,
        sender: 'oracle',
        ...response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, oracleMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
      {/* Stars */}
      <div className="stars-overlay" />

      {/* Top Bar */}
      <header className="relative z-20 flex items-center justify-between border-b border-slate-900/80 bg-slate-950/90 backdrop-blur-lg px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/80 to-purple-600/80 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                <Bot className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 font-serif tracking-wide">Aura Oracle</h1>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 px-2.5 py-1.5 text-[10px] text-slate-400">
              <span>Mulank <strong className="text-amber-400">{profile.mulank}</strong></span>
              <span className="text-slate-700">|</span>
              <span>Bhagyank <strong className="text-purple-400">{profile.bhagyank}</strong></span>
              <span className="text-slate-700">|</span>
              <span>Rashi: <strong className="text-slate-200">{profile.chandraRashi}</strong></span>
              <span className="text-slate-700">|</span>
              <span>Lagna: <strong className="text-emerald-400">{profile.lagna}</strong></span>
            </div>
          )}
          <button
            onClick={() => setShowCalibrate(!showCalibrate)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              profile
                ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 animate-pulse'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{profile ? 'Recalibrate' : 'Enter Birth Details'}</span>
          </button>
        </div>
      </header>

      {/* Calibration Dropdown */}
      {showCalibrate && (
        <div className="relative z-20 border-b border-slate-900/80 bg-slate-950/95 backdrop-blur-lg px-4 sm:px-6 py-4">
          <form onSubmit={handleCalibrate} className="mx-auto max-w-3xl flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormInputChange}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">Birth Date *</label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleFormInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">Birth Time</label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleFormInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">Timezone</label>
                <select
                  name="tzOffset"
                  value={formData.tzOffset}
                  onChange={handleFormInputChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">Birth Place</label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleFormInputChange}
                  placeholder="City"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
                {findCity(formData.birthPlace) && (
                  <p className="text-[8px] text-emerald-400 mt-0.5 truncate">
                    ✓ {findCity(formData.birthPlace).name}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              Calibrate
            </button>
          </form>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[92%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs mt-1 ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`rounded-xl px-4 py-3 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm'
                      : 'bg-slate-900/70 border border-slate-800/50 text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.type === 'text' && (
                      <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
                    )}
                    {(msg.type === 'structured' || msg.type === 'numerology_report') && (
                      <StructuredResponse data={msg} />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 mt-1">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-xl bg-slate-900/70 border border-slate-800/50 px-4 py-3 flex gap-1.5 items-center rounded-tl-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions — only show when few messages */}
        {messages.length <= 2 && !isTyping && (
          <div className="px-4 sm:px-6 pb-3">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.query)}
                    className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-3 py-1.5 text-[11px] text-slate-400 hover:text-amber-400 hover:border-amber-500/20 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-900/80 bg-slate-950/90 backdrop-blur-lg px-4 sm:px-6 py-3">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={profile ? 'Ask about career, health, compatibility, gems, daily guidance...' : 'Enter your birth date to start (e.g. 15 March 1995)...'}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="absolute right-2 rounded-lg bg-amber-500 p-2 text-slate-950 transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-600 px-1">
              Responses are based on Vedic numerology and zodiac traditions. Not a substitute for professional advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
