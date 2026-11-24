import React from 'react';
import { Sparkles, Moon, Menu, X, MessageSquare } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenChat }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'horoscopes', label: 'Horoscopes' },
    { id: 'natal', label: 'Birth Chart' },
    { id: 'tarot', label: 'Tarot' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-900/80 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-amber-500 to-indigo-600 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                <Moon className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <span className="font-serif text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600">
              AURA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-2 py-1.5 text-sm font-medium transition-colors duration-200 hover:text-amber-300 font-sans tracking-wide ${
                  activeTab === item.id ? 'text-amber-400' : 'text-slate-500'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-amber-400 to-yellow-600" />
                )}
              </button>
            ))}
          </div>

          {/* Chat CTA Button */}
          <button
            onClick={onOpenChat}
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Consult Oracle
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-900 bg-slate-950 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left rounded-md px-3 py-2.5 text-base font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-slate-900 text-amber-400 border-l-2 border-amber-500'
                  : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenChat();
              setIsOpen(false);
            }}
            className="w-full mt-2 flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2.5 text-base font-bold text-slate-950"
          >
            <MessageSquare className="h-4 w-4" />
            Consult Oracle
          </button>
        </div>
      )}
    </nav>
  );
}
