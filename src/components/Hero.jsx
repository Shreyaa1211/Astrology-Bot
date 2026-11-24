import React from 'react';
import { Sparkles, Compass, Shield, ArrowRight } from 'lucide-react';

export default function Hero({ onStartOracle, onStartChart }) {
  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-purple-900/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-900/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRUSTED BY 2.4M+ ASTROLOGERS WORLDWIDE</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-100 font-serif leading-none">
              Discover the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 text-glow-gold">
                Celestial Code
              </span> <br />
              of Your Destiny.
            </h1>

            <p className="max-w-xl text-lg text-slate-300 leading-relaxed font-sans">
              Welcome to Aura. We combine real NASA planetary ephemeris data with professional astrological heritage to bring you verified, deeply accurate, and highly personalized spiritual readings. No generic horoscopes, just real wisdom.
            </p>

            {/* Feature lists for trust */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">Mathematical Precision</h4>
                  <p className="text-xs text-slate-400">Powered by Swiss Ephemeris calculations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">100% Secure & Private</h4>
                  <p className="text-xs text-slate-400">Your birth location and time details never leave your device.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onStartOracle}
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-base font-semibold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/25 active:scale-100"
              >
                Consult the Oracle AI
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onStartChart}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-base font-semibold text-slate-200 transition-all hover:bg-slate-900 hover:text-slate-100 hover:border-slate-600"
              >
                Generate Free Natal Chart
              </button>
            </div>
          </div>

          {/* Astrological Chart Visualiser (Floating Graphic) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {/* Outer starry ring */}
              <div className="absolute inset-0 rounded-full border border-slate-800/80 animate-spin-slow" />
              
              {/* Mid ring with constellations */}
              <div className="absolute inset-6 rounded-full border border-amber-500/20 flex items-center justify-center animate-[spin_100s_linear_infinite_reverse]">
                <div className="absolute top-2 text-[10px] text-amber-400/40 select-none">♈</div>
                <div className="absolute right-2 text-[10px] text-amber-400/40 select-none">♋</div>
                <div className="absolute bottom-2 text-[10px] text-amber-400/40 select-none">♎</div>
                <div className="absolute left-2 text-[10px] text-amber-400/40 select-none">♑</div>
              </div>

              {/* Inner ring */}
              <div className="absolute inset-14 rounded-full border border-slate-700/50" />
              
              {/* Inner orbits & center sun */}
              <div className="absolute inset-20 rounded-full border border-slate-800/80" />
              
              {/* Rotating planetary nodes */}
              <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                <div className="absolute top-10 left-10 h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                <div className="absolute bottom-16 right-12 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
              </div>
              <div className="absolute inset-0 animate-[spin_25s_linear_infinite_reverse]">
                <div className="absolute top-20 right-20 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>

              {/* Center Glow */}
              <div className="absolute inset-[38%] rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-600/30 blur-md" />
              <div className="absolute inset-[40%] rounded-full bg-slate-950 border border-amber-500/40 flex items-center justify-center shadow-2xl">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 animate-pulse flex items-center justify-center text-slate-950 font-serif font-bold text-sm">
                  ☼
                </div>
              </div>
              
              {/* Concentric planetary alignment lines */}
              <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100">
                <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="0.2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.2" />
                <line x1="15" y1="15" x2="85" y2="85" stroke="#334155" strokeWidth="0.2" />
                <line x1="85" y1="15" x2="15" y2="85" stroke="#334155" strokeWidth="0.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
