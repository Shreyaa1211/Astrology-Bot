import React from 'react';
import { Moon, Sparkles, HelpCircle } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800">
                <Moon className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-slate-100">
                AURA
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Connecting professional astronomical precision with age-old spiritual wisdom. Providing personal chart calculations, AI consultations, and daily transit forecasts.
            </p>
          </div>

          {/* Quick links */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Celestial Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('oracle')} className="hover:text-amber-400 transition-colors">
                  AI Astrology Oracle
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('horoscopes')} className="hover:text-amber-400 transition-colors">
                  Daily Horoscopes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('natal')} className="hover:text-amber-400 transition-colors">
                  Natal Chart Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tarot')} className="hover:text-amber-400 transition-colors">
                  Interactive Tarot
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Data Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-300 cursor-pointer">Privacy Charter</li>
              <li className="hover:text-slate-300 cursor-pointer">Terms of Cosmic Service</li>
              <li className="hover:text-slate-300 cursor-pointer flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                Support Sanctuary
              </li>
            </ul>
          </div>

        </div>

        {/* Affiliate stamps */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} Aura Esoteric Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="uppercase tracking-widest text-[9px]">Verified Partner: AFA</span>
            <span className="uppercase tracking-widest text-[9px]">Calculated: NASA DE405</span>
            <span className="uppercase tracking-widest text-[9px]">Certified ISAR</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
