import React from 'react';

export function GlassCard({ children, className = '', glow = false }) {
  return (
    <div
      className={`glass-card p-6 rounded-3xl relative overflow-hidden ${
        glow ? 'border-[#C9A96E]/40 shadow-burgundy-glow' : 'border-[#C9A96E]/20'
      } ${className}`}
    >
      {/* Decorative Gold Filigree Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#C9A96E]/15 to-transparent pointer-events-none rounded-bl-full" />
      {children}
    </div>
  );
}
