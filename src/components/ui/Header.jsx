import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { LoomLogo } from './LoomLogo';
import {
  Ruler,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Users
} from 'lucide-react';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    setIsSizingWizardOpen,
    setIsCheckoutOpen,
    setIsCollaborativeRoomOpen,
    theme,
    toggleTheme,
    currency,
    toggleCurrency
  } = useAtelier();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'salon', label: 'Salon' },
    { id: 'atelier', label: '3D Atelier' },
    { id: 'studio', label: 'Studio' },
    { id: 'textiles', label: 'Textiles' },
    { id: 'editions', label: 'Editions' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const getThemeLabel = () => {
    if (theme === 'noir') return 'Obsidian';
    if (theme === 'burgundy') return 'Burgundy';
    return 'Ivory Silk';
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 pt-4 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* 1. Left: Universal Brand Mark */}
        <div
          onClick={() => handleTabClick('salon')}
          className="p-1.5 px-3 rounded-full glass-floating transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <LoomLogo size="default" />
        </div>

        {/* 2. Center: Floating Minimalist Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-floating shadow-ambient">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-[var(--text-primary)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-burgundy)]/50 to-[var(--accent-burgundy)]/80 border border-[var(--accent-gold)]/40 -z-10 animate-fade-in" />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. Right: Luxury Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-floating text-[11px] font-mono tracking-wider transition-all hover:scale-105 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title={`Current Theme: ${getThemeLabel()} (Click to toggle)`}
          >
            <Palette className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span className="capitalize">{getThemeLabel()}</span>
          </button>

          {/* Sizing Fit Wizard */}
          <button
            onClick={() => setIsSizingWizardOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-ghost-luxury text-[11px] font-mono tracking-wider uppercase cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Fit Wizard</span>
          </button>

          {/* Live Fitting Room Sync */}
          <button
            onClick={() => setIsCollaborativeRoomOpen(true)}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full glass-floating hover:border-[var(--accent-gold)] transition-all cursor-pointer relative"
            title="Live Tailor Fitting Room"
          >
            <Users className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 animate-pulse" />
          </button>

          {/* Checkout Drawer Trigger */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--accent-burgundy)] to-[#630000] border border-[var(--accent-gold)]/50 text-[11px] font-mono font-bold tracking-widest text-[#FFFAEF] uppercase shadow-ambient hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span className="hidden xs:inline">Bespoke</span>
            <span>Escrow</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full glass-floating text-[var(--text-primary)] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[var(--accent-gold)]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-sm mx-auto p-5 rounded-3xl glass-modal border border-[var(--border-subtle)] space-y-4 animate-fade-in pointer-events-auto text-left shadow-2xl">
          <div className="flex flex-col space-y-1 pb-2 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent-burgundy)] text-[#FFFAEF] font-bold border border-[var(--accent-gold)]/40'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && <Sparkles className="w-3 h-3 text-[var(--accent-gold)]" />}
              </button>
            ))}
          </div>

          {/* Mobile Controls */}
          <div className="flex justify-center pt-1 text-xs font-mono">
            <button
              onClick={toggleTheme}
              className="w-full p-2.5 rounded-xl glass-panel text-center flex items-center justify-center gap-2 text-[var(--text-secondary)]"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Theme: {getThemeLabel()}</span>
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                setIsSizingWizardOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl btn-ghost-luxury text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Ruler className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Calibrate 3D Fit</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
