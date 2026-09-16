import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ArrowRight, Sparkles, ShieldCheck, Box, Award, Compass, Eye } from 'lucide-react';
import { LoomLogo } from '../ui/LoomLogo';

export function SalonHero() {
  const { setActiveTab, setIsSizingWizardOpen, formatPrice, activeGarment } = useAtelier();

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-8 pt-24 sm:pt-28 pb-12 animate-entrance select-none">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[var(--accent-burgundy)]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Headline & Proportionate Breathing Space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1 my-auto">
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Subtle Edition Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-floating text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--accent-gold)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
            <span>Digital Atelier • Autumn / Winter Bespoke</span>
          </div>

          {/* Apple-Level Hero Typography */}
          <div className="space-y-4">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[var(--text-primary)] leading-[1.05]">
              Fashion In <br />
              <span className="italic text-[var(--accent-gold)] font-light">
                Dimension.
              </span>
            </h1>

            <p className="text-sm sm:text-base font-mono text-[var(--text-secondary)] max-w-lg leading-relaxed font-light">
              Where heritage African craftsmanship converges with real-time biometric 3D modeling and milestone-locked escrow.
            </p>
          </div>

          {/* Minimal Ghost Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('atelier')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--accent-burgundy)] to-[#630000] border border-[var(--accent-gold)]/60 text-[#FFFAEF] font-mono text-xs font-semibold tracking-[0.25em] uppercase shadow-ambient hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Enter The Atelier</span>
              <ArrowRight className="w-4 h-4 text-[var(--accent-gold)] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsSizingWizardOpen(true)}
              className="px-8 py-4 rounded-full btn-ghost-luxury font-mono text-xs tracking-[0.2em] uppercase cursor-pointer text-center"
            >
              <span>Calibrate 3D Fit</span>
            </button>
          </div>
        </div>

        {/* Right: Architectural 3D Spotlight Frame */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div
            onClick={() => setActiveTab('atelier')}
            className="w-full max-w-sm p-6 rounded-[32px] glass-floating space-y-6 text-center shadow-2xl transition-all duration-500 hover:border-[var(--accent-gold)] hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase">
              <span>Flagship Piece</span>
              <span className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3 h-3" />
                <span>Inspect 3D</span>
              </span>
            </div>

            {/* Visual Centerpiece Canvas Placeholder */}
            <div className="relative w-48 h-64 mx-auto rounded-2xl bg-gradient-to-b from-[var(--accent-burgundy)]/30 via-black/40 to-black/80 border border-[var(--border-subtle)] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:border-[var(--accent-gold)]/60 transition-colors">
              <div className="absolute inset-0 bg-radial-at-c from-[var(--accent-gold)]/10 via-transparent to-transparent pointer-events-none" />
              
              <span className="font-serif italic text-6xl text-[var(--accent-gold)] opacity-80 group-hover:scale-110 transition-transform duration-500">
                ⚜
              </span>
              <span className="font-serif text-lg text-[var(--text-primary)] mt-3">
                {activeGarment?.name || 'The Sovereign Agbada'}
              </span>
              <span className="text-[10px] font-mono text-[var(--accent-gold)] mt-1">
                {activeGarment?.fabric || 'Hand-Loomed Aso-Oke'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs font-mono">
              <span className="text-[var(--text-secondary)]">Bespoke Commission</span>
              <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--accent-gold)] font-bold">
                Quote on Consultation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3 Minimalist Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-12 border-t border-[var(--border-subtle)] text-left">
        <div className="p-5 rounded-2xl glass-panel space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-mono tracking-widest uppercase">
            <Award className="w-4 h-4" />
            <span>01 • Artisanal Provenance</span>
          </div>
          <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            Every textile loomed by master artisans across Iseyin and Lagos.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-mono tracking-widest uppercase">
            <Compass className="w-4 h-4" />
            <span>02 • Parametric 3D Morph</span>
          </div>
          <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            Zero guess sizing. Mannequins sculpt in real-time to your measurements.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-mono tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>03 • Payaza Protected Escrow</span>
          </div>
          <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
            Funds segregated and released strictly on verified tailoring milestones.
          </p>
        </div>
      </div>
    </div>
  );
}
