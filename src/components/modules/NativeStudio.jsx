import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { AtelierScene } from '../3d/AtelierScene';
import {
  Sparkles,
  Scissors,
  Check,
  ShoppingBag,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

export function NativeStudio() {
  const {
    customNative,
    setCustomNative,
    measurements,
    formatPrice,
    setActiveGarment,
    setIsCheckoutOpen
  } = useAtelier();

  const [activeStep, setActiveStep] = useState('style');
  const [isNightLighting, setIsNightLighting] = useState(false);

  const styles = [
    { id: 'agbada', name: 'Imperial Agbada', desc: 'Regal 3-piece outer robe with architectural chest drape', price: 697500 },
    { id: 'senator', name: 'Senator Executive Suite', desc: 'Sleek executive 2-piece tailored tunic & trousers', price: 520000 },
    { id: 'kaftan', name: 'Royal Kaftan', desc: 'Minimalist structural tunic with satin piping', price: 465000 },
    { id: 'dashiki', name: 'Bespoke Dashiki', desc: 'Contemporary fitted printed collar tunic', price: 380000 }
  ];

  const fits = [
    { id: 'tailored', name: 'Tailored Executive Fit', desc: 'Structured European-African bespoke silhouette' },
    { id: 'slim', name: 'Slim Fit', desc: 'Tapered waist & narrow shoulder drop' },
    { id: 'flowing', name: 'Flowing Traditional Fit', desc: 'Comfort ceremonial drape for heritage events' }
  ];

  const colors = [
    { name: 'Imperial Burgundy', hex: '#800020' },
    { name: 'Obsidian Noir', hex: '#1B1717' },
    { name: 'Gold Filigree Silk', hex: '#C9A96E' },
    { name: 'Royal Emerald Velvet', hex: '#0B3C26' },
    { name: 'Deep Midnight Navy', hex: '#0F1B3B' },
    { name: 'Ivory Silk Cream', hex: '#FFFAEF' }
  ];

  const collars = [
    { id: 'mandarin', name: 'Mandarin Stand Collar', desc: 'Crisp 1.5-inch stiff band collar' },
    { id: 'v-neck', name: 'V-Cut Filigree Neckline', desc: 'Deep V-neckline with metallic thread trim' },
    { id: 'placket', name: 'Concealed Fastener Placket', desc: 'Sleek hidden closure front' }
  ];

  const pockets = [
    { id: 'single', name: 'Single Flap Chest Pocket', desc: 'Classic left chest pocket with satin piping' },
    { id: 'none', name: 'Clean Seamless Front', desc: 'No chest pockets for minimalist elegance' },
    { id: 'dual-flap', name: 'Architectural Dual Pockets', desc: 'Twin chest flap pockets' },
    { id: 'zip', name: 'Concealed Zip Pocket', desc: 'Modern hidden zipper accent' }
  ];

  const embroideries = [
    { id: 'geometric', name: 'Gilded Geometric Pattern', desc: 'Metallic gold chest filigree stitching' },
    { id: 'none', name: 'Minimalist Solid Tone', desc: 'Solid monochrome elegance without embroidery' },
    { id: 'filigree', name: 'Imperial Floral Filigree', desc: 'Artisan needlework on neck & chest' },
    { id: 'minimal', name: 'Dual Parallel Stitching', desc: 'Subtle high-precision thread piping' }
  ];

  const previewGarment = {
    id: 'custom-native-3d',
    name: `Bespoke ${customNative.style.toUpperCase()}`,
    subtitle: `${customNative.colorName} • ${customNative.fit.toUpperCase()}`,
    modelType: customNative.style,
    colorHex: customNative.colorHex,
    colorName: customNative.colorName,
    fabric: customNative.fabric,
    priceNGN: customNative.priceNGN,
    hotspots: [
      { id: 'h1', position: [0, 0.96, 0.28], label: `${customNative.collar.toUpperCase()} COLLAR`, description: 'Custom engineered neckline' },
      { id: 'h2', position: [0, 0.45, 0.25], label: `${customNative.pockets.toUpperCase()} DETAIL`, description: 'Tailored chest pocket detail' },
      { id: 'h3', position: [0, 0.7, 0.25], label: `${customNative.embroidery.toUpperCase()} EMBROIDERY`, description: 'Hand-stitched accent pattern' }
    ]
  };

  const handleCommission = () => {
    setActiveGarment(previewGarment);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] mt-20 relative overflow-hidden flex flex-col lg:flex-row text-left animate-entrance select-none">
      {/* 1. Left Configurator Glass Dock */}
      <div className="w-full lg:w-[460px] p-6 lg:p-8 glass-floating border-r border-[var(--border-subtle)] z-20 flex flex-col justify-between space-y-6 overflow-y-auto backdrop-blur-2xl">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-[9px] font-mono tracking-[0.25em] uppercase text-[var(--accent-gold)]">
              <Scissors className="w-3 h-3" />
              <span>Native Design Studio</span>
            </div>
            <h2 className="font-serif text-3xl text-[var(--text-primary)] font-normal leading-tight">
              Bespoke Sculptor.
            </h2>
            <p className="text-xs font-mono text-[var(--text-secondary)]">
              Sculpt silhouettes, collar geometry, and gilded embroidery in real-time.
            </p>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full glass-panel overflow-x-auto">
            {[
              { id: 'style', label: 'Style' },
              { id: 'fit', label: 'Fit' },
              { id: 'color', label: 'Color' },
              { id: 'collar', label: 'Collar' },
              { id: 'pockets', label: 'Pockets' },
              { id: 'embroidery', label: 'Embroidery' }
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeStep === step.id
                    ? 'bg-gradient-to-r from-[var(--accent-burgundy)] to-[#630000] text-[#FFFAEF] font-bold shadow-md border border-[var(--accent-gold)]/40'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Option Step 1: Base Native Style */}
          {activeStep === 'style' && (
            <div className="space-y-2.5 animate-fade-in">
              <span className="text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
                Select Base Silhouette
              </span>
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCustomNative({ ...customNative, style: s.id, priceNGN: s.price })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.style === s.id
                      ? 'bg-gradient-to-r from-[var(--accent-burgundy)]/50 to-[var(--accent-burgundy)]/20 border-[var(--accent-gold)] shadow-ambient'
                      : 'glass-panel hover:border-[var(--accent-gold)]/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-serif text-base text-[var(--text-primary)]">{s.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug">{s.desc}</div>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--accent-gold)] tracking-wider uppercase ml-2 whitespace-nowrap">
                    Bespoke Cut
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Option Step 2: Fit & Cut */}
          {activeStep === 'fit' && (
            <div className="space-y-2.5 animate-fade-in">
              <span className="text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
                Choose Anatomical Fit
              </span>
              {fits.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCustomNative({ ...customNative, fit: f.id })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.fit === f.id
                      ? 'bg-gradient-to-r from-[var(--accent-burgundy)]/50 to-[var(--accent-burgundy)]/20 border-[var(--accent-gold)] shadow-ambient'
                      : 'glass-panel hover:border-[var(--accent-gold)]/40'
                  }`}
                >
                  <div>
                    <div className="font-serif text-base text-[var(--text-primary)]">{f.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug">{f.desc}</div>
                  </div>
                  {customNative.fit === f.id && <Check className="w-4 h-4 text-[var(--accent-gold)]" />}
                </button>
              ))}
            </div>
          )}

          {/* Option Step 3: Color Palette */}
          {activeStep === 'color' && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
                Artisan Dye & Silk Palette
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setCustomNative({ ...customNative, colorHex: c.hex, colorName: c.name })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      customNative.colorHex === c.hex
                        ? 'bg-[var(--accent-burgundy)]/40 border-[var(--accent-gold)] shadow-ambient'
                        : 'glass-panel hover:border-[var(--accent-gold)]/40'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-[var(--accent-gold)]/80 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-mono truncate text-[var(--text-primary)]">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Option Step 4: Collar & Neckline */}
          {activeStep === 'collar' && (
            <div className="space-y-2.5 animate-fade-in">
              <span className="text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
                Collar & Neckline Geometry
              </span>
              {collars.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCustomNative({ ...customNative, collar: c.id })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.collar === c.id
                      ? 'bg-gradient-to-r from-[var(--accent-burgundy)]/50 to-[var(--accent-burgundy)]/20 border-[var(--accent-gold)] shadow-ambient'
                      : 'glass-panel hover:border-[var(--accent-gold)]/40'
                  }`}
                >
                  <div>
                    <div className="font-serif text-base text-[var(--text-primary)]">{c.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug">{c.desc}</div>
                  </div>
                  {customNative.collar === c.id && <Check className="w-4 h-4 text-[var(--accent-gold)]" />}
                </button>
              ))}
            </div>
          )}

          {/* Option Step 5: Pockets */}
          {activeStep === 'pockets' && (
            <div className="space-y-2.5 animate-fade-in">
              <span className="text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
                Chest Pocket Architectural Structure
              </span>
              {pockets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCustomNative({ ...customNative, pockets: p.id })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.pockets === p.id
                      ? 'bg-gradient-to-r from-[var(--accent-burgundy)]/50 to-[var(--accent-burgundy)]/20 border-[var(--accent-gold)] shadow-ambient'
                      : 'glass-panel hover:border-[var(--accent-gold)]/40'
                  }`}
                >
                  <div>
                    <div className="font-serif text-base text-[var(--text-primary)]">{p.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug">{p.desc}</div>
                  </div>
                  {customNative.pockets === p.id && <Check className="w-4 h-4 text-[var(--accent-gold)]" />}
                </button>
              ))}
            </div>
          )}

          {/* Option Step 6: Embroidery */}
          {activeStep === 'embroidery' && (
            <div className="space-y-2.5 animate-fade-in">
              <span className="text-[10px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
                Artisan Metallic Embroidery
              </span>
              {embroideries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setCustomNative({ ...customNative, embroidery: e.id })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.embroidery === e.id
                      ? 'bg-gradient-to-r from-[var(--accent-burgundy)]/50 to-[var(--accent-burgundy)]/20 border-[var(--accent-gold)] shadow-ambient'
                      : 'glass-panel hover:border-[var(--accent-gold)]/40'
                  }`}
                >
                  <div>
                    <div className="font-serif text-base text-[var(--text-primary)]">{e.name}</div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug">{e.desc}</div>
                  </div>
                  {customNative.embroidery === e.id && <Check className="w-4 h-4 text-[var(--accent-gold)]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Payaza Checkout */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="p-4 rounded-2xl glass-panel space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-widest text-[var(--text-secondary)] uppercase block">
                Artisan Quotation
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold tracking-wider uppercase">
                Digital Twin Ready
              </span>
            </div>
            <p className="text-xs font-mono text-[var(--accent-gold)] font-medium">
              Pricing agreed directly with your master tailor on consultation.
            </p>
          </div>

          <button
            onClick={handleCommission}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[var(--accent-burgundy)] to-[#630000] border border-[var(--accent-gold)]/60 text-[#FFFAEF] font-mono text-xs tracking-[0.25em] uppercase font-bold shadow-ambient hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>Consult Artisan & Commission</span>
            <ChevronRight className="w-4 h-4 text-[var(--accent-gold)]" />
          </button>
        </div>
      </div>

      {/* 2. Main Interactive 3D Canvas Stage */}
      <div className="flex-1 h-full relative">
        <AtelierScene
          garment={previewGarment}
          measurements={measurements}
          isNightLighting={isNightLighting}
        />

        {/* Live Floating 3D Specs Badge */}
        <div className="hidden sm:block absolute top-6 right-8 p-4 rounded-2xl glass-floating border border-[var(--border-subtle)] text-right space-y-1 pointer-events-none shadow-2xl backdrop-blur-2xl">
          <span className="text-[9px] font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
            Live 3D Specimen
          </span>
          <h3 className="font-serif text-xl text-[var(--text-primary)]">
            Custom {customNative.style.toUpperCase()}
          </h3>
          <div className="text-xs font-mono text-[var(--accent-gold)]">
            {customNative.colorName} • {customNative.collar.toUpperCase()}
          </div>
        </div>

        {/* Top-Left Lighting Rig Switcher */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => setIsNightLighting(!isNightLighting)}
            className="px-3.5 py-2 rounded-full glass-floating border border-[var(--border-subtle)] text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] flex items-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            {isNightLighting ? <Moon className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> : <Sun className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
            <span>{isNightLighting ? 'Atelier Night' : 'Studio Daylight'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
