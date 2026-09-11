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
import { Sun, Moon, ShoppingBag, Ruler, Layers, ChevronDown, EyeOff, Sparkles, UserCheck } from 'lucide-react';

function AtelierAppContent() {
  const {
    activeTab,
    setActiveTab,
    activeGarment,
    setActiveGarment,
    measurements,
    formatPrice,
    setIsCheckoutOpen,
    setIsSizingWizardOpen,
    GARMENTS
  } = useAtelier();

  const [isNightLighting, setIsNightLighting] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1B1717] text-[#FFFAEF] font-sans flex flex-col justify-between selection:bg-[#800020] selection:text-[#C9A96E]">
      {/* Floating Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'salon' && <SalonHero />}
        
        {activeTab === 'textiles' && <TextileArchive />}

        {activeTab === 'editions' && <ConceptGenerator />}

        {activeTab === 'studio' && <NativeStudio />}

        {/* Main 3D Atelier Showroom */}
        {activeTab === 'atelier' && (
          <div className="w-full h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)] relative overflow-hidden flex flex-col lg:flex-row">
            {/* Desktop Left Control Panel */}
            <div className="hidden lg:flex w-80 p-6 bg-[#120F0D]/95 backdrop-blur-xl border-r border-[#C9A96E]/20 z-20 flex-col justify-between space-y-6 overflow-y-auto text-left">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase block">
                    INTERACTIVE 3D SHOWROOM
                  </span>
                  <h2 className="font-serif text-2xl text-[#FFFAEF] mt-0.5">The Virtual Atelier</h2>
                  <p className="text-xs font-mono text-[#FFFAEF]/60">Rotate 360°, inspect fabricweave, & scale mannequin</p>
                </div>

                {/* Garment Selector */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase tracking-wider block">
                      SELECT SILHOUETTE
                    </span>
                    {activeGarment && (
                      <button
                        onClick={() => setActiveGarment(null)}
                        className="text-[9px] font-mono text-[#C9A96E] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>REMOVE GARMENT</span>
                      </button>
                    )}
                  </div>

                  {/* Bare Mannequin Option */}
                  <button
                    onClick={() => setActiveGarment(null)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      activeGarment === null
                        ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                        : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-[#C9A96E]" />
                      <div>
                        <div className="font-serif text-sm font-bold text-[#FFFAEF]">Bare 3D Mannequin</div>
                        <div className="text-[10px] font-mono text-[#C9A96E]">Anatomical Fit View</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-[#FFFAEF]/50 uppercase">NO OUTFIT</span>
                  </button>

                  {/* Outfits List */}
                  {GARMENTS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setActiveGarment(g)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        activeGarment?.id === g.id
                          ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                          : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                      }`}
                    >
                      <div>
                        <div className="font-serif text-sm font-bold text-[#FFFAEF]">{g.name}</div>
                        <div className="text-[10px] font-mono text-[#C9A96E]">{g.fabric}</div>
                      </div>

                      <span className="font-mono text-xs text-[#C9A96E] font-bold">
                        {formatPrice(g.priceNGN)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3 pt-4 border-t border-[#FFFAEF]/10">
                <button
                  onClick={() => setIsNightLighting(!isNightLighting)}
                  className="w-full py-3 px-4 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 text-xs font-mono text-[#C9A96E] flex items-center justify-between cursor-pointer hover:border-[#C9A96E] transition-all"
                >
                  <span className="flex items-center gap-2">
                    {isNightLighting ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>LIGHTING RIG</span>
                  </span>
                  <span className="font-bold">{isNightLighting ? 'NIGHT' : 'DAY'}</span>
                </button>

                <button
                  onClick={() => setIsSizingWizardOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#FFFAEF]/5 border border-[#FFFAEF]/15 text-xs font-mono text-[#FFFAEF] flex items-center gap-2 cursor-pointer hover:border-[#C9A96E]"
                >
                  <Ruler className="w-4 h-4 text-[#C9A96E]" />
                  <span>MORPH MANNEQUIN ({measurements.chest} in)</span>
                </button>

                {activeGarment ? (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase font-bold shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C9A96E]" />
                    <span>PURCHASE WITH PAYAZA</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveGarment(GARMENTS[0])}
                    className="w-full py-4 px-6 rounded-2xl bg-[#C9A96E] hover:bg-[#C9A96E]/90 text-[#1B1717] font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-gold-glow"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>SELECT A GARMENT</span>
                  </button>
                )}
              </div>
            </div>

            {/* Main 3D Canvas Stage */}
            <div className="flex-1 h-full relative bg-[#1B1717]">
              <AtelierScene
                garment={activeGarment}
                measurements={measurements}
                isNightLighting={isNightLighting}
              />

              {/* Showroom Overlay Badge (Desktop) */}
              <div className="hidden sm:block absolute top-4 right-4 p-3.5 rounded-2xl glass-modal border border-[#C9A96E]/30 text-right space-y-0.5 shadow-obsidian-glow pointer-events-none z-10">
                <span className="text-[8px] font-mono text-[#C9A96E] uppercase tracking-widest block">
                  {activeGarment ? '3D HOTSPOT RAYCASTER ACTIVE' : '3D PARAMETRIC MANNEQUIN STAGE'}
                </span>
                <h3 className="font-serif text-lg text-[#FFFAEF]">
                  {activeGarment ? activeGarment.name : 'Bare 3D Mannequin'}
                </h3>
                <p className="text-xs font-mono text-[#C9A96E] font-bold">
                  {activeGarment ? formatPrice(activeGarment.priceNGN) : 'Anatomical View'}
                </p>
              </div>

              {/* Mobile Floating Garment Quick Selector Overlay */}
              <div className="lg:hidden absolute top-3 left-3 right-3 z-20 flex items-center justify-between p-2.5 rounded-2xl glass-modal border border-[#C9A96E]/30 text-xs font-mono">
                <div className="flex items-center gap-2 text-left">
                  <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
                  <div>
                    <span className="font-serif font-bold text-[#FFFAEF] block leading-tight">
                      {activeGarment ? activeGarment.name : 'Bare 3D Mannequin'}
                    </span>
                    <span className="text-[#C9A96E] text-[10px]">
                      {activeGarment ? formatPrice(activeGarment.priceNGN) : 'No Garment'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsNightLighting(!isNightLighting)}
                    className="p-2 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 text-[#C9A96E]"
                  >
                    {isNightLighting ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
                    className="px-3 py-1.5 rounded-xl bg-[#800020] text-[#FFFAEF] font-bold flex items-center gap-1 border border-[#C9A96E]/40"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>MODELS</span>
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Bottom Controls Sheet */}
              {mobilePanelOpen && (
                <div className="lg:hidden absolute inset-x-0 bottom-0 z-30 p-4 bg-[#120F0D]/95 backdrop-blur-2xl border-t border-[#C9A96E]/30 text-left space-y-3 animate-fade-in max-h-[70vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-[#FFFAEF]/10 pb-2">
                    <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-bold">GARMENT SILHOUETTES</span>
                    <button onClick={() => setMobilePanelOpen(false)} className="p-1 text-[#FFFAEF]/60">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Bare Mannequin Option */}
                    <button
                      onClick={() => {
                        setActiveGarment(null);
                        setMobilePanelOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        activeGarment === null
                          ? 'bg-[#800020]/40 border-[#C9A96E] text-[#FFFAEF]'
                          : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70'
                      }`}
                    >
                      <div className="font-serif text-sm font-bold text-[#FFFAEF]">Bare 3D Mannequin</div>
                      <span className="font-mono text-xs text-[#C9A96E]">NO OUTFIT</span>
                    </button>

                    {GARMENTS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setActiveGarment(g);
                          setMobilePanelOpen(false);
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          activeGarment?.id === g.id
                            ? 'bg-[#800020]/40 border-[#C9A96E] text-[#FFFAEF]'
                            : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70'
                        }`}
                      >
                        <div>
                          <div className="font-serif text-sm font-bold text-[#FFFAEF]">{g.name}</div>
                          <div className="text-[9px] font-mono text-[#C9A96E]">{g.fabric}</div>
                        </div>
                        <span className="font-mono text-xs text-[#C9A96E] font-bold">{formatPrice(g.priceNGN)}</span>
                      </button>
                    ))}
                  </div>

                  {activeGarment ? (
                    <button
                      onClick={() => {
                        setMobilePanelOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#800020] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 shadow-burgundy-glow"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C9A96E]" />
                      <span>PAY WITH PAYAZA</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveGarment(GARMENTS[0]);
                        setMobilePanelOpen(false);
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#C9A96E] text-[#1B1717] font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 shadow-gold-glow"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>CHOOSE AN OUTFIT</span>
                    </button>
                  )}
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
