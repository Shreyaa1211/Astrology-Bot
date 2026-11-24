import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ZodiacHoroscopes from './components/ZodiacHoroscopes';
import NatalChart from './components/NatalChart';
import TarotReading from './components/TarotReading';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import ChatPage from './pages/ChatPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);

  // If chat page is active, render it as a full overlay
  if (showChat) {
    return <ChatPage onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Background Starry Animation */}
      <div className="stars-overlay" />

      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenChat={() => setShowChat(true)} />

      {/* Main Content Areas */}
      <main className="flex-grow z-10 relative">
        {activeTab === 'home' && (
          <Hero onStartOracle={() => setShowChat(true)} onStartChart={() => setActiveTab('natal')} />
        )}

        {activeTab === 'horoscopes' && (
          <div className="pb-16">
            <ZodiacHoroscopes />
          </div>
        )}

        {activeTab === 'natal' && (
          <div className="pb-16">
            <NatalChart />
          </div>
        )}

        {activeTab === 'tarot' && (
          <div className="pb-16">
            <TarotReading />
          </div>
        )}
      </main>

      {/* Trust Grid & Footer */}
      <div className="z-10 mt-auto">
        <TrustSection />
        <Footer setActiveTab={setActiveTab} onOpenChat={() => setShowChat(true)} />
      </div>
    </div>
  );
}

export default App;
