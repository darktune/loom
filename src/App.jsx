import React, { useState } from 'react';
import { AtelierProvider, useAtelier } from './context/AtelierContext';
import { Header } from './components/ui/Header';
import { SalonHero } from './components/modules/SalonHero';
import { TextileArchive } from './components/modules/TextileArchive';
import { ConceptGenerator } from './components/modules/ConceptGenerator';
import { NativeStudio } from './components/modules/NativeStudio';
import { SizingWizard } from './components/modules/SizingWizard';
import { CheckoutDrawer } from './components/modules/CheckoutDrawer';
import { CollaborativeRoom } from './components/modules/CollaborativeRoom';
import { AtelierScene } from './components/3d/AtelierScene';
import {
  Sun,
  Moon,
  ShoppingBag,
  Ruler,
  UserCheck,
  EyeOff,
  Sparkles,
  Layers,
  ChevronUp
} from 'lucide-react';

function AtelierAppContent() {
  const {
    activeTab,
    activeGarment,
    setActiveGarment,
    measurements,
    formatPrice,
    setIsCheckoutOpen,
    setIsSizingWizardOpen,
    GARMENTS
  } = useAtelier();

  const [isNightLighting, setIsNightLighting] = useState(false);
  const [mobileSelectorOpen, setMobileSelectorOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden select-none flex flex-col justify-between">
      {/* 1. Global Floating Luxury Header */}
      <Header />

      {/* 2. Main Content Router */}
      <main className="flex-1 w-full">
        {activeTab === 'salon' && <SalonHero />}
        {activeTab === 'textiles' && <TextileArchive />}
        {activeTab === 'editions' && <ConceptGenerator />}
        {activeTab === 'studio' && <NativeStudio />}

        {/* 3. The 3D Atelier Showroom (Canvas as Hero, Zero Clutter) */}
        {activeTab === 'atelier' && (
          <div className="relative w-full h-screen overflow-hidden animate-entrance">
            {/* Full-Screen WebGL Canvas */}
            <div className="absolute inset-0 w-full h-full z-0">
              <AtelierScene
                garment={activeGarment}
                measurements={measurements}
                isNightLighting={isNightLighting}
              />
            </div>

            {/* Top-Right Floating Atmosphere & Fit Controls Island */}
            <div className="absolute top-24 right-4 sm:right-8 z-20 flex flex-col items-end gap-3 pointer-events-auto">
              {/* Garment / Mannequin Status Card */}
              <div className="p-4 rounded-2xl glass-floating border border-[var(--border-subtle)] text-right space-y-1 shadow-2xl backdrop-blur-2xl">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[var(--accent-gold)] uppercase block font-medium">
                  {activeGarment ? '3D Hotspot Raycaster Active' : 'Parametric Digital Twin'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] font-normal leading-tight">
                  {activeGarment ? activeGarment.name : 'Bare 3D Mannequin'}
                </h3>
                <p className="text-xs font-mono text-[var(--accent-gold)] font-bold tracking-wider">
                  {activeGarment ? 'Price on Consultation' : 'Anatomical Calibration'}
                </p>
              </div>

              {/* Day / Night Studio Lighting Rig Toggle */}
              <button
                onClick={() => setIsNightLighting(!isNightLighting)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-floating text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-all cursor-pointer shadow-lg"
                title="Toggle Lighting Rig Atmosphere"
              >
                {isNightLighting ? (
                  <Moon className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                )}
                <span>{isNightLighting ? 'Atelier Night' : 'Studio Daylight'}</span>
              </button>

              {/* Morphing Mannequin Dimension Pill */}
              <button
                onClick={() => setIsSizingWizardOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-floating text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-all cursor-pointer shadow-lg"
                title="Calibrate Digital Twin Proportions"
              >
                <Ruler className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Fit: {measurements.chest} in Chest</span>
              </button>
            </div>

            {/* Floating Bottom Island: Garment Silhouettes & Bespoke Escrow Trigger (Desktop) */}
            <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-center gap-4 pointer-events-auto">
              <div className="px-6 py-3 rounded-full glass-floating border border-[var(--border-subtle)] shadow-2xl flex items-center gap-5 backdrop-blur-2xl">
                {/* Bare Mannequin Button */}
                <button
                  onClick={() => setActiveGarment(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeGarment === null
                      ? 'bg-[var(--accent-burgundy)] text-[#FFFAEF] border border-[var(--accent-gold)]/50 shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`}
                  title="View Bare Anatomical Mannequin"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Bare Mannequin</span>
                </button>

                <div className="w-[1px] h-5 bg-[var(--border-subtle)]" />

                {/* Garment Selector Pills */}
                <div className="flex items-center gap-2">
                  {GARMENTS.map((g) => {
                    const isSelected = activeGarment?.id === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setActiveGarment(g)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[var(--accent-burgundy)] to-[#630000] text-[#FFFAEF] border border-[var(--accent-gold)]/60 font-semibold shadow-md'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: g.colorHex || '#C9A96E' }}
                        />
                        <span>{g.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="w-[1px] h-5 bg-[var(--border-subtle)]" />

                {/* Instant Commission CTA */}
                {activeGarment ? (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[var(--accent-burgundy)] to-[#630000] border border-[var(--accent-gold)]/60 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] font-bold uppercase shadow-ambient hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>Commission with Artisan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveGarment(GARMENTS[0])}
                    className="px-5 py-2 rounded-full bg-[var(--accent-gold)] text-[#1B1717] font-mono text-xs tracking-widest font-bold uppercase hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Select Outfit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Bottom Floating Dock & Slide-Up Sheet */}
            <div className="md:hidden absolute bottom-6 inset-x-4 z-20 pointer-events-auto">
              <div className="p-3 rounded-2xl glass-floating border border-[var(--border-subtle)] flex items-center justify-between shadow-2xl backdrop-blur-2xl">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-[var(--accent-gold)] block">
                    {activeGarment ? activeGarment.name : 'Bare Mannequin'}
                  </span>
                  <span className="font-serif text-sm text-[var(--text-primary)]">
                    {activeGarment ? 'Price on Consultation' : 'No Outfit'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileSelectorOpen(!mobileSelectorOpen)}
                    className="p-2.5 rounded-xl glass-panel text-[var(--accent-gold)] cursor-pointer"
                    title="Change Garment"
                  >
                    <Layers className="w-4 h-4" />
                  </button>

                  {activeGarment && (
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[var(--accent-burgundy)] border border-[var(--accent-gold)]/40 text-[10px] font-mono font-bold tracking-wider uppercase text-[#FFFAEF]"
                    >
                      Consult
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Slide-Up Drawer */}
              {mobileSelectorOpen && (
                <div className="mt-2 p-4 rounded-3xl glass-modal border border-[var(--border-subtle)] space-y-2 text-left animate-fade-in shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono text-[var(--accent-gold)]">
                    <span>CHOOSE SILHOUETTE</span>
                    <button onClick={() => setMobileSelectorOpen(false)} className="text-xs">✕</button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveGarment(null);
                      setMobileSelectorOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                      activeGarment === null ? 'bg-[var(--accent-burgundy)] text-[#FFFAEF]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>Bare 3D Mannequin</span>
                    <span>Anatomical</span>
                  </button>

                  {GARMENTS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setActiveGarment(g);
                        setMobileSelectorOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                        activeGarment?.id === g.id ? 'bg-[var(--accent-burgundy)] text-[#FFFAEF]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{g.name}</span>
                      <span className="text-[var(--accent-gold)] text-[10px]">Quote on Consultation</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <SizingWizard />
      <CheckoutDrawer />
      <CollaborativeRoom />
    </div>
  );
}

export default function App() {
  return (
    <AtelierProvider>
      <AtelierAppContent />
    </AtelierProvider>
  );
}
