import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Sparkles, Info } from 'lucide-react';

export function Hotspots({ hotspots }) {
  const [activeId, setActiveId] = useState(null);

  if (!hotspots || hotspots.length === 0) return null;

  return (
    <>
      {hotspots.map((h) => {
        const isOpen = activeId === h.id;
        return (
          <group key={h.id} position={h.position}>
            <Html distanceFactor={8} center>
              <div className="relative group">
                <button
                  onClick={() => setActiveId(isOpen ? null : h.id)}
                  className="w-7 h-7 rounded-full bg-[#800020] border-2 border-[#C9A96E] text-[#C9A96E] flex items-center justify-center shadow-gold-glow animate-bounce cursor-pointer hover:scale-110 transition-transform"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                {isOpen && (
                  <div className="absolute left-10 top-0 w-56 p-3 rounded-2xl glass-modal border border-[#C9A96E] text-left text-[#FFFAEF] space-y-1 shadow-obsidian-glow z-30 animate-fade-in">
                    <div className="text-[10px] font-mono text-[#C9A96E] uppercase font-bold tracking-wider">{h.label}</div>
                    <p className="text-[11px] font-sans text-[#FFFAEF]/80 leading-snug">{h.description}</p>
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}
