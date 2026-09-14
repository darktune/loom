import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ArrowRight, Sparkles, ShieldCheck, Box, Award } from 'lucide-react';

export function SalonHero() {
  const { setActiveTab, setIsSizingWizardOpen } = useAtelier();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 animate-fade-in text-left">
      {/* Hero Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#800020]/30 border border-[#C9A96E]/40 text-[#C9A96E] text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LUXURY VIRTUAL FASHION • LOOM 3D ATELIER</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#FFFAEF] leading-[1.1]">
            Where Fashion Meets <span className="italic text-[#C9A96E]">Dimension.</span>
          </h1>

          <p className="text-xs sm:text-base font-mono text-[#FFFAEF]/70 max-w-xl leading-relaxed">
            The luxury 3D virtual atelier replacing static lookbooks with parametric WebGL garments, live 3D body morphing, and direct Payaza checkout.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('atelier')}
              className="py-4 px-8 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs font-bold tracking-[0.2em] uppercase shadow-burgundy-glow flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105"
            >
              <span>ENTER THE ATELIER</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </button>

            <button
              onClick={() => setIsSizingWizardOpen(true)}
              className="py-4 px-6 rounded-2xl bg-[#FFFAEF]/5 hover:bg-[#FFFAEF]/10 border border-[#FFFAEF]/20 text-[#FFFAEF] font-mono text-xs tracking-wider uppercase cursor-pointer text-center"
            >
              <span>CALIBRATE 3D FIT</span>
            </button>
          </div>
        </div>

        {/* Featured Garment Showcase Card */}
        <div className="lg:col-span-5 relative">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#C9A96E]/40 text-center space-y-6 shadow-burgundy-glow">
            <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-widest block">
              FLAGSHIP MODEL • OBJ/01
            </span>

            <div className="relative w-40 sm:w-48 h-56 sm:h-64 mx-auto flex items-center justify-center">
              <div className="w-full h-full rounded-3xl bg-gradient-to-b from-[#800020]/40 via-[#5B0F18]/60 to-[#120F0D] border border-[#C9A96E]/30 flex flex-col items-center justify-center p-4">
                <span className="font-serif italic text-5xl sm:text-6xl text-[#C9A96E] opacity-90 animate-pulse">👑</span>
                <span className="font-serif text-lg sm:text-xl text-[#FFFAEF] mt-2">The Sovereign Agbada</span>
                <span className="text-[10px] font-mono text-[#C9A96E]">Imperial Cherry Burgundy</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-[#FFFAEF]/10">
              <span className="text-[#FFFAEF]/60">Artisan Studio:</span>
              <span className="text-[#C9A96E] font-bold">Babatunde O. Atelier</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl glass-panel border border-[#C9A96E]/20 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#800020]/30 border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-xl text-[#FFFAEF]">100% Handcrafted Aso-Oke</h4>
          <p className="text-xs font-mono text-[#FFFAEF]/60 leading-relaxed">
            Woven on heritage wooden looms in Iseyin & Lagos with metallic gold filigree thread.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-[#C9A96E]/20 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#800020]/30 border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-xl text-[#FFFAEF]">Direct Payaza Checkout</h4>
          <p className="text-xs font-mono text-[#FFFAEF]/60 leading-relaxed">
            Direct, encrypted e-commerce checkout powered by Payaza payment gateway in Naira (₦).
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-[#C9A96E]/20 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#800020]/30 border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
            <Box className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-xl text-[#FFFAEF]">60 FPS WebGL Showroom</h4>
          <p className="text-xs font-mono text-[#FFFAEF]/60 leading-relaxed">
            React Three Fiber stage with real-time morphing mannequins and raycaster hotspots.
          </p>
        </div>
      </div>
    </div>
  );
}
