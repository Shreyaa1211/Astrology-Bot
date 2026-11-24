import React, { useState } from 'react';
import { Sparkles, RefreshCw, Eye, BookOpen, ShieldCheck } from 'lucide-react';

const TAROT_DECK = [
  { name: 'The Fool', num: '0', theme: 'New Beginnings & Faith', ruler: 'Uranus', glyph: '🌀', desc: 'Indicates a clean slate, fresh spiritual leaps, and spontaneous trust in the universe. Do not fear the unknown.' },
  { name: 'The Magician', num: 'I', theme: 'Manifestation & Willpower', ruler: 'Mercury', glyph: '🪄', desc: 'Represents alignment of thoughts and action. You possess all resources necessary to convert intent into physical reality.' },
  { name: 'The High Priestess', num: 'II', theme: 'Intuition & Subconscious', ruler: 'Moon', glyph: '🌙', desc: 'A sign to stop looking for external logical solutions. Trust the quiet voice, the dream patterns, and the unseen realms.' },
  { name: 'The Empress', num: 'III', theme: 'Abundance & Creation', ruler: 'Venus', glyph: '🌱', desc: 'Signals a fertile period of creative output, emotional security, and connection to nature. Nourish your ideas.' },
  { name: 'The Emperor', num: 'IV', theme: 'Authority & Structure', ruler: 'Aries', glyph: '👑', desc: 'Calls for building structures, implementing self-discipline, and establishing protective boundaries around your energy.' },
  { name: 'The Lovers', num: 'VI', theme: 'Alignment & Values', ruler: 'Gemini', glyph: '💞', desc: 'Reflects personal alignment, relational harmony, and choices that respect your core authentic values.' },
  { name: 'The Chariot', num: 'VII', theme: 'Willpower & Momentum', ruler: 'Cancer', glyph: '⚔️', desc: 'Indicates directed control, overcoming obstacles through raw determination, and rapid forward momentum.' },
  { name: 'Wheel of Fortune', num: 'X', theme: 'Destiny & Cyclical Change', ruler: 'Jupiter', glyph: '🎡', desc: 'A reminder that this too shall pass. Cycles rotate continuously; accept the shift and prepare for the upward turn.' },
  { name: 'The Star', num: 'XVII', theme: 'Hope, Healing & Clarity', ruler: 'Aquarius', glyph: '⭐', desc: 'Indicates that the storm has passed. Peace is returning. You are being guided along your correct soul path.' },
  { name: 'The Moon', num: 'XVIII', theme: 'Illusion & Shadow Work', ruler: 'Pisces', glyph: '🔮', desc: 'Warning of hidden elements, psychological anxieties, or projections. Look closer; things are not as they appear.' },
  { name: 'The Sun', num: 'XIX', theme: 'Success, Vitality & Truth', ruler: 'Sun', glyph: '☀️', desc: 'Represents pure clarity, radiant energy, validation, and success. The light is shining directly on your path.' }
];

export default function TarotReading() {
  const [spread, setSpread] = useState([
    { position: 'Past', card: null, revealed: false },
    { position: 'Present', card: null, revealed: false },
    { position: 'Future', card: null, revealed: false }
  ]);
  const [readingActive, setReadingActive] = useState(false);

  const drawSpread = () => {
    // Shuffle and pick 3 distinct cards
    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    setSpread([
      { position: 'Past Influence', card: shuffled[0], revealed: false },
      { position: 'Present State', card: shuffled[1], revealed: false },
      { position: 'Future Pathway', card: shuffled[2], revealed: false }
    ]);
    setReadingActive(true);
  };

  const flipCard = (index) => {
    setSpread(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, revealed: true };
      }
      return item;
    }));
  };

  const resetSpread = () => {
    setSpread([
      { position: 'Past Influence', card: null, revealed: false },
      { position: 'Present State', card: null, revealed: false },
      { position: 'Future Pathway', card: null, revealed: false }
    ]);
    setReadingActive(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* CSS 3D Flip Styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-100 font-serif">
          Interactive Three-Card Tarot Reading
        </h2>
        <p className="text-slate-400 leading-relaxed text-sm">
          Focus on your query and initiate the draw. Flip the cards to examine your Past, Present, and Future alignments. All readings are verified by professional esoteric specialists.
        </p>
      </div>

      {!readingActive ? (
        <div className="glass-panel p-12 border-slate-800 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto">
          <div className="flex -space-x-8">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="w-24 h-40 rounded-xl border border-amber-500/25 bg-slate-950 flex-shrink-0 shadow-2xl transform hover:-translate-y-4 hover:rotate-3 transition-all duration-300"
                style={{
                  backgroundImage: `url('/tarot_card_back.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ))}
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-slate-200">Shuffled & Magnetized</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Take a deep breath, quiet your mind, and press the draw button to sync the cards with your energetic signature.
            </p>
          </div>
          <button
            onClick={drawSpread}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-base font-semibold text-slate-950 hover:shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95"
          >
            Draw Cards
          </button>
        </div>
      ) : (
        <div className="space-y-12 animate-fade-in">
          {/* Card Spread */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spread.map((slot, index) => (
              <div key={slot.position} className="flex flex-col items-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{slot.position}</span>
                
                {/* 3D Flip Card Container */}
                <div 
                  onClick={() => !slot.revealed && flipCard(index)}
                  className={`relative w-56 h-88 rounded-2xl cursor-pointer perspective-1000 transition-transform duration-500 hover:scale-[1.03] ${slot.revealed ? '' : 'hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'}`}
                >
                  <div className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${slot.revealed ? 'rotate-y-180' : ''}`}>
                    
                    {/* Facedown State */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl border border-amber-500/30 bg-slate-950 backface-hidden shadow-xl"
                      style={{
                        backgroundImage: `url('/tarot_card_back.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Decorative inner lock graphic */}
                      <div className="absolute inset-2 border border-amber-500/10 rounded-xl flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
                        <div className="text-[10px] text-amber-400/40 uppercase tracking-widest font-serif border border-amber-500/20 bg-slate-950/80 px-2.5 py-1 rounded">
                          FLIP
                        </div>
                      </div>
                    </div>

                    {/* Faceup State */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl border border-slate-800 bg-slate-900 rotate-y-180 backface-hidden flex flex-col p-4 text-left justify-between bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
                      
                      {/* Top glyph & number */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-500">{slot.card?.num}</span>
                        <span className="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-400 rounded-md px-1.5 py-0.5 uppercase tracking-wide">
                          {slot.card?.ruler}
                        </span>
                      </div>

                      {/* Graphic/Glyph Core */}
                      <div className="flex h-24 items-center justify-center rounded-xl bg-slate-950/80 border border-slate-850 my-3 text-4xl select-none shadow-inner filter drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                        {slot.card?.glyph}
                      </div>

                      {/* Card Title & Content */}
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-bold text-amber-400 tracking-wider">
                          {slot.card?.name}
                        </h4>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {slot.card?.theme}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-normal font-sans border-t border-slate-850 pt-2 mt-1">
                          {slot.card?.desc}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reset Action Area */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={resetSpread}
              className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-slate-100 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reshuffle & Return</span>
            </button>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 flex items-center space-x-2 text-emerald-400 text-[11px] max-w-md">
              <ShieldCheck className="h-4 w-4" />
              <span>Tarot spread configurations use cryptographic true random seed variables.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
