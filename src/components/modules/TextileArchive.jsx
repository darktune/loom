import React, { useState } from 'react';
import { Sparkles, Volume2, ZoomIn, Play, Pause, ShieldCheck } from 'lucide-react';

export function TextileArchive() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMacro, setActiveMacro] = useState('aso-oke');

  const textiles = [
    {
      id: 'aso-oke',
      name: 'Imperial Aso-Oke Silk',
      origin: 'Iseyin Master Looms, Oyo State',
      zoom: '1200x Macro',
      threadCount: '480 Threads/in²',
      story: 'Oral History #04: The Golden Warp Thread of King Adetona',
      audioDuration: '2:45',
      color: '#800020'
    },
    {
      id: 'velvet-silk',
      name: 'Deep Burgundy Royal Velvet',
      origin: 'Kano Dyers Guild',
      zoom: '800x Optical',
      threadCount: '360 Pile Threads/in²',
      story: 'Oral History #08: Indigo & Madder Root Extraction',
      audioDuration: '3:10',
      color: '#5B0F18'
    }
  ];

  const activeTextile = textiles.find((t) => t.id === activeMacro) || textiles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#FFFAEF]/10 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase block">
            DEPARTMENT OF WEFT & PROVENANCE
          </span>
          <h2 className="font-serif text-3xl text-[#FFFAEF]">Heritage Textile Vault</h2>
          <p className="text-xs font-mono text-[#FFFAEF]/60">1200x Optical Macro Visualizer & Oral History Archives</p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-xs font-mono text-[#C9A96E] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTHENTICITY VERIFIED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1200x Macro Lens Simulation Frame */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-modal border border-[#C9A96E]/40 space-y-4 shadow-obsidian-glow">
          <div className="flex justify-between text-xs font-mono text-[#C9A96E]">
            <span className="flex items-center gap-1.5">
              <ZoomIn className="w-4 h-4" /> 1200X OPTICAL MAGNIFICATION
            </span>
            <span>THREAD DENSITY: {activeTextile.threadCount}</span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#C9A96E]/30 bg-gradient-to-br from-[#800020] via-[#5B0F18] to-[#120F0D] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A96E]/20 via-transparent to-transparent pointer-events-none" />
            <div className="text-center space-y-3 z-10">
              <span className="font-serif italic text-5xl text-[#C9A96E] block">🕸️</span>
              <h3 className="font-serif text-2xl text-[#FFFAEF]">{activeTextile.name}</h3>
              <p className="text-xs font-mono text-[#FFFAEF]/70">{activeTextile.origin}</p>
            </div>
          </div>
        </div>

        {/* Oral History Audio Player & Specimen List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-[#C9A96E]/30 space-y-4">
            <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-widest block">
              ORAL HISTORY ARCHIVE
            </span>
            <h4 className="font-serif text-xl text-[#FFFAEF]">{activeTextile.story}</h4>

            <div className="p-4 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10 flex items-center justify-between">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-[#800020] hover:bg-[#630000] border border-[#C9A96E] flex items-center justify-center text-[#FFFAEF] cursor-pointer shadow-burgundy-glow"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex-1 mx-4 space-y-1">
                <div className="h-1.5 rounded-full bg-[#FFFAEF]/10 overflow-hidden">
                  <div className={`h-full bg-[#C9A96E] ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#FFFAEF]/50">
                  <span>AUDIO NARRATION</span>
                  <span>{activeTextile.audioDuration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase tracking-wider block">SELECT SPECIMEN</span>
            {textiles.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveMacro(t.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeMacro === t.id
                    ? 'bg-[#800020]/30 border-[#C9A96E] text-[#FFFAEF]'
                    : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/60 hover:border-[#C9A96E]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#C9A96E]" style={{ backgroundColor: t.color }} />
                  <div>
                    <h5 className="font-serif text-sm text-[#FFFAEF]">{t.name}</h5>
                    <p className="text-[10px] font-mono text-[#FFFAEF]/50">{t.origin}</p>
                  </div>
                </div>

                <span className="text-xs font-mono text-[#C9A96E]">{t.zoom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
