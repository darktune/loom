import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Ruler, Users, ShoppingBag, Menu, X, Wand2 } from 'lucide-react';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    setIsSizingWizardOpen,
    setIsCheckoutOpen,
    setIsCollaborativeRoomOpen
  } = useAtelier();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'salon', label: 'SALON', badge: null },
    { id: 'atelier', label: 'ATELIER', badge: '3D LIVE' },
    { id: 'studio', label: 'STUDIO', badge: 'BUILD NATIVE' },
    { id: 'textiles', label: 'TEXTILES', badge: 'MACRO' },
    { id: 'editions', label: 'EDITIONS', badge: 'AI CONCEPT' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1B1717]/90 backdrop-blur-xl border-b border-[#C9A96E]/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => handleTabClick('salon')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#800020] to-[#5B0F18] border border-[#C9A96E]/40 flex items-center justify-center text-[#C9A96E] font-serif font-bold text-lg shadow-burgundy-glow group-hover:scale-105 transition-transform">
            L
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif italic font-bold tracking-wider text-lg sm:text-xl text-[#FFFAEF]">
                LOOM
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-full bg-[#800020]/40 border border-[#C9A96E]/30 text-[8px] font-mono text-[#C9A96E] tracking-widest uppercase">
                3D ATELIER
              </span>
            </div>
          </div>
        </div>

        {/* Desktop 5-Tab Navigation Pill */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-[#120F0D]/90 border border-[#C9A96E]/20">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#800020] text-[#FFFAEF] shadow-burgundy-glow font-bold border border-[#C9A96E]/40'
                    : 'text-[#FFFAEF]/60 hover:text-[#FFFAEF] hover:bg-[#FFFAEF]/5'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[7px] px-1 py-0.2 rounded ${
                      isActive ? 'bg-[#C9A96E] text-[#1B1717] font-bold' : 'bg-[#FFFAEF]/10 text-[#C9A96E]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Sizing Wizard Trigger */}
          <button
            onClick={() => setIsSizingWizardOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFFAEF]/5 border border-[#FFFAEF]/15 hover:border-[#C9A96E] text-[11px] font-mono text-[#FFFAEF] transition-all cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>FIT WIZARD</span>
          </button>

          {/* Live Sync Trigger */}
          <button
            onClick={() => setIsCollaborativeRoomOpen(true)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFFAEF]/5 border border-[#FFFAEF]/15 hover:border-[#C9A96E] text-[11px] font-mono text-[#FFFAEF] transition-all cursor-pointer relative"
          >
            <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>LIVE SYNC</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
          </button>

          {/* Checkout Drawer Trigger */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[11px] font-mono text-[#FFFAEF] font-semibold tracking-wider uppercase shadow-burgundy-glow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>CHECKOUT</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-xl bg-[#120F0D] border border-[#C9A96E]/30 text-[#FFFAEF]/80 hover:text-[#FFFAEF] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#C9A96E]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#120F0D] border-b border-[#C9A96E]/30 p-4 space-y-3 animate-fade-in text-left">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`p-2.5 rounded-xl font-mono text-xs tracking-wider uppercase flex items-center justify-between border ${
                  activeTab === tab.id
                    ? 'bg-[#800020] border-[#C9A96E] text-[#FFFAEF] font-bold'
                    : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && <span className="text-[8px] text-[#C9A96E]">{tab.badge}</span>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FFFAEF]/10">
            <button
              onClick={() => {
                setIsSizingWizardOpen(true);
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 text-xs font-mono text-[#FFFAEF] flex items-center justify-center gap-2"
            >
              <Ruler className="w-4 h-4 text-[#C9A96E]" />
              <span>FIT WIZARD</span>
            </button>

            <button
              onClick={() => {
                setIsCollaborativeRoomOpen(true);
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 text-xs font-mono text-[#FFFAEF] flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-[#C9A96E]" />
              <span>LIVE FITTING</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
