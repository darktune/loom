import React from 'react';

export function Badge({ children, variant = 'gold', className = '' }) {
  const variants = {
    gold: 'bg-[#C9A96E]/10 border-[#C9A96E]/30 text-[#C9A96E]',
    burgundy: 'bg-[#800020]/30 border-[#800020] text-[#FFFAEF]',
    emerald: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
    cream: 'bg-[#F8F1E7]/10 border-[#F8F1E7]/20 text-[#FFFAEF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase ${
        variants[variant] || variants.gold
      } ${className}`}
    >
      {children}
    </span>
  );
}
