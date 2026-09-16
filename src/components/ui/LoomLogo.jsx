import React from 'react';

/**
 * Universal LOOM Brand Identity Component
 * Follows the Stitch design manifesto: thin serif letterform,
 * oval monogram frame, gold foil accents, and ultra-wide tracking.
 * Ready to receive the upcoming official logo assets universally.
 */
export function LoomLogo({ size = 'default', showTagline = false, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Monogram Frame: Thin Gold Oval with Serif 'L' */}
      <div
        className={`relative flex items-center justify-center rounded-full border border-[#C9A96E]/60 bg-gradient-to-br from-[#800020]/40 via-[#5B0F18]/30 to-[#120F0D] shadow-burgundy-glow group-hover:border-[#C9A96E] group-hover:scale-105 transition-all duration-300 ${
          isLarge ? 'w-12 h-14' : isSmall ? 'w-7 h-8' : 'w-8 h-10'
        }`}
      >
        <span
          className={`font-serif italic font-normal text-[#C9A96E] leading-none ${
            isLarge ? 'text-2xl' : isSmall ? 'text-sm' : 'text-base'
          }`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          L
        </span>
        {/* Subtle Luxury Outer Ring Glow */}
        <span className="absolute inset-0 rounded-full border border-[#C9A96E]/20 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Brand Wordmark & Optional Editorial Subtitle */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span
            className={`font-serif tracking-[0.28em] uppercase font-light text-current transition-colors duration-300 ${
              isLarge ? 'text-3xl' : isSmall ? 'text-sm' : 'text-lg'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            LOOM
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] opacity-75" />
        </div>

        {showTagline && (
          <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-[#C9A96E]/80 mt-0.5">
            Where Fashion Meets Dimension
          </span>
        )}
      </div>
    </div>
  );
}
