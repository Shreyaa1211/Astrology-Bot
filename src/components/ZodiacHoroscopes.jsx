import React, { useState } from 'react';
import { Star, ShieldAlert, Sparkles, X, Heart, Briefcase, Smile, Zap } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', date: 'Mar 21 - Apr 19', glyph: '♈', element: 'Fire', rulingPlanet: 'Mars', quality: 'Cardinal' },
  { name: 'Taurus', date: 'Apr 20 - May 20', glyph: '♉', element: 'Earth', rulingPlanet: 'Venus', quality: 'Fixed' },
  { name: 'Gemini', date: 'May 21 - Jun 20', glyph: '♊', element: 'Air', rulingPlanet: 'Mercury', quality: 'Mutable' },
  { name: 'Cancer', date: 'Jun 21 - Jul 22', glyph: '♋', element: 'Water', rulingPlanet: 'Moon', quality: 'Cardinal' },
  { name: 'Leo', date: 'Jul 23 - Aug 22', glyph: '♌', element: 'Fire', rulingPlanet: 'Sun', quality: 'Fixed' },
  { name: 'Virgo', date: 'Aug 23 - Sep 22', glyph: '♍', element: 'Earth', rulingPlanet: 'Mercury', quality: 'Mutable' },
  { name: 'Libra', date: 'Sep 23 - Oct 22', glyph: '♎', element: 'Air', rulingPlanet: 'Venus', quality: 'Cardinal' },
  { name: 'Scorpio', date: 'Oct 23 - Nov 21', glyph: '♏', element: 'Water', rulingPlanet: 'Pluto & Mars', quality: 'Fixed' },
  { name: 'Sagittarius', date: 'Nov 22 - Dec 21', glyph: '♐', element: 'Fire', rulingPlanet: 'Jupiter', quality: 'Mutable' },
  { name: 'Capricorn', date: 'Dec 22 - Jan 19', glyph: '♑', element: 'Earth', rulingPlanet: 'Saturn', quality: 'Cardinal' },
  { name: 'Aquarius', date: 'Jan 20 - Feb 18', glyph: '♒', element: 'Air', rulingPlanet: 'Uranus & Saturn', quality: 'Fixed' },
  { name: 'Pisces', date: 'Feb 19 - Mar 20', glyph: '♓', element: 'Water', rulingPlanet: 'Neptune & Jupiter', quality: 'Mutable' },
];

const MOCK_HOROSCOPES = {
  Love: 4,
  Career: 5,
  Wellness: 3,
  luckyNumber: "7",
  luckyColor: "Royal Indigo",
  compatibility: "Leo",
  forecast: "Today, your ruling sphere enters a highly beneficial aspect. This triggers a release of communication blocks that have slowed your personal relationship sectors since the start of the week. Professionally, trust your immediate impulses, as a Mars-Jupiter alignment is actively supporting your financial sector. In wellness, avoid physical overexertion; let your mind process the insights of the day in a calm environment."
};

export default function ZodiacHoroscopes() {
  const [selectedSign, setSelectedSign] = useState(null);

  const getElementColor = (element) => {
    switch (element) {
      case 'Fire': return 'from-red-500/20 to-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Earth': return 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30';
      case 'Air': return 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30';
      case 'Water': return 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30';
      default: return 'from-slate-500/20 to-slate-700/20 text-slate-300 border-slate-500/30';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4.5 w-4.5 ${
              star <= rating 
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]' 
                : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-100 font-serif">
          Daily Celestial Forecasts
        </h2>
        <p className="text-slate-400 leading-relaxed text-sm">
          Select your zodiac sign to read your verified daily horoscope. Calculated using the current planetary transits relative to your sign's solar house alignment.
        </p>
      </div>

      {/* Grid of Signs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ZODIAC_SIGNS.map((sign) => (
          <div
            key={sign.name}
            onClick={() => setSelectedSign(sign)}
            className={`glass-panel glass-panel-hover p-6 cursor-pointer text-center relative overflow-hidden group bg-gradient-to-br ${getElementColor(sign.element)}`}
          >
            {/* Background elements */}
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 font-serif font-bold group-hover:scale-110 transition-transform duration-300 select-none">
              {sign.glyph}
            </div>

            <div className="flex flex-col items-center space-y-3">
              <span className="text-4xl select-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
                {sign.glyph}
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100 tracking-wider">
                  {sign.name}
                </h3>
                <p className="text-xs text-slate-400">{sign.date}</p>
              </div>
              
              {/* Pill badge for element */}
              <span className="rounded-full bg-slate-950/40 border border-slate-800/80 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                {sign.element}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Details */}
      {selectedSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl glass-panel border-slate-800 bg-slate-900 overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header banner based on sign element */}
            <div className={`p-6 bg-gradient-to-r ${getElementColor(selectedSign.element)} border-b border-slate-850 flex justify-between items-start`}>
              <div className="flex items-center space-x-4">
                <span className="text-5xl select-none">{selectedSign.glyph}</span>
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-wider text-slate-100">
                    {selectedSign.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans tracking-wide">{selectedSign.date} • Ruling Planet: {selectedSign.rulingPlanet}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSign(null)}
                className="rounded-full bg-slate-950/60 p-2 text-slate-400 hover:text-slate-100 transition-colors border border-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-left">
              {/* Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-950/50 border border-slate-850 p-4">
                  <div className="flex items-center space-x-2 text-rose-400">
                    <Heart className="h-4.5 w-4.5 fill-rose-400/20" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-350">Love</span>
                  </div>
                  {renderStars(MOCK_HOROSCOPES.Love)}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-950/50 border border-slate-850 p-4">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Briefcase className="h-4.5 w-4.5 fill-amber-400/20" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-350">Career</span>
                  </div>
                  {renderStars(MOCK_HOROSCOPES.Career)}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-950/50 border border-slate-850 p-4">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Smile className="h-4.5 w-4.5 fill-emerald-400/20" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-350">Wellness</span>
                  </div>
                  {renderStars(MOCK_HOROSCOPES.Wellness)}
                </div>
              </div>

              {/* Forecast Text */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Daily Transit Synthesis
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 border border-slate-850/60 rounded-xl p-4 shadow-inner">
                  {MOCK_HOROSCOPES.forecast}
                </p>
              </div>

              {/* Bottom statistics grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-850 pt-5 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Lucky Number</span>
                  <p className="text-lg font-serif font-bold text-amber-400 text-glow-gold">{MOCK_HOROSCOPES.luckyNumber}</p>
                </div>
                <div className="space-y-1 border-x border-slate-850">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Lucky Color</span>
                  <p className="text-sm font-semibold text-slate-200">{MOCK_HOROSCOPES.luckyColor}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Compatibility</span>
                  <p className="text-sm font-semibold text-slate-200">{MOCK_HOROSCOPES.compatibility}</p>
                </div>
              </div>

            </div>

            {/* Modal Footer warning */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-850 flex items-center space-x-2 text-[10px] text-slate-500">
              <ShieldAlert className="h-4.5 w-4.5 text-slate-500 flex-shrink-0" />
              <span>Calculations generated relative to Solar House placements. Consult a personalized Natal Chart for absolute accuracy.</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
