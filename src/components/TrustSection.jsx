import React from 'react';
import { ShieldCheck, Database, Award, CheckCircle } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: <Award className="h-6 w-6 text-amber-400" />,
    title: "AFA & ISAR Calibrated",
    desc: "Calculations and house system matrices are constructed to specifications approved by the American Federation of Astrologers."
  },
  {
    icon: <Database className="h-6 w-6 text-purple-400" />,
    title: "Zero-Data Retention Policy",
    desc: "Your birth coordinates, dates, and times are strictly volatile in memory and are never saved to external servers or sold."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    title: "NASA JPL Ephemerides",
    desc: "We align spatial positions with the Jet Propulsion Laboratory DE405 orbit tables, guaranteeing millisecond coordinate precision."
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-cyan-400" />,
    title: "No Synthetic Clickbait",
    desc: "We prioritize actual astrological methodologies. All forecasts are vetted by a team of professional cosmic advisors."
  }
];

export default function TrustSection() {
  return (
    <div className="border-t border-slate-900/60 bg-slate-950/20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-slate-100 font-serif">
            A Higher Standard of Astrological Care
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            Astrology is a sacred science of correspondence. Aura is built to reject cheap daily horoscopes in favor of verified calculations and absolute data security.
          </p>
        </div>

        {/* Grid of Trust points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_POINTS.map((pt, index) => (
            <div 
              key={index}
              className="glass-panel p-6 border-slate-800 text-left space-y-4 hover:border-amber-500/10 transition-all duration-300 bg-slate-900/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-850 shadow-inner">
                {pt.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-200 tracking-wide">
                  {pt.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {pt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific standard stamp footer */}
        <div className="mt-16 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left max-w-4xl mx-auto">
          <div className="space-y-1.5 max-w-lg">
            <h4 className="font-serif text-base font-bold text-slate-200">Astronomical Integrity Pledge</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We update our planetary coordinates every 24 hours to sync with leap-year adjustments and orbital perturbations. Your chart is a mathematically exact snapshot of the cosmos.
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
            <span className="text-2xl font-serif select-none text-amber-500">⚛</span>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              NASA DE405 Core <br />
              <span className="text-emerald-400 font-medium font-sans text-[9px] lowercase tracking-normal">Status: active feed</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
