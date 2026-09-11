import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { AtelierScene } from '../3d/AtelierScene';
import { Sparkles, Palette, Scissors, Layers, Check, ShoppingBag, Ruler, Wand2, ShieldCheck, Sun, Moon } from 'lucide-react';

export function NativeStudio() {
  const {
    customNative,
    setCustomNative,
    measurements,
    formatPrice,
    setActiveGarment,
    setIsCheckoutOpen,
    setIsSizingWizardOpen
  } = useAtelier();

  const [activeStep, setActiveStep] = useState('style'); // 'style' | 'fit' | 'color' | 'collar' | 'pockets' | 'embroidery'
  const [isNightLighting, setIsNightLighting] = useState(false);

  // Available Custom Options
  const styles = [
    { id: 'senator', name: 'Senator Top Suite', desc: 'Sleek executive 2-piece tailored tunic & trousers', price: 520000 },
    { id: 'agbada', name: 'Imperial Agbada', desc: 'Regal 3-piece outer robe with heavy chest drape', price: 697500 },
    { id: 'kaftan', name: 'Royal Kaftan', desc: 'Minimalist structural tunic with satin trim', price: 465000 },
    { id: 'dashiki', name: 'Bespoke Dashiki', desc: 'Contemporary fitted printed collar tunic', price: 380000 }
  ];

  const fits = [
    { id: 'slim', name: 'Slim Fit', desc: 'Tapered waist & narrow shoulder drop' },
    { id: 'tailored', name: 'Tailored Executive Fit', desc: 'Classic European-African structured cut' },
    { id: 'flowing', name: 'Flowing Traditional Fit', desc: 'Relaxed ceremonial comfort drape' }
  ];

  const colors = [
    { name: 'Imperial Cherry Burgundy', hex: '#800020' },
    { name: 'Obsidian Black', hex: '#1B1717' },
    { name: 'Gold Filigree Silk', hex: '#C9A96E' },
    { name: 'Royal Emerald Velvet', hex: '#0B3C26' },
    { name: 'Deep Navy Blue', hex: '#0F1B3B' },
    { name: 'Ivory Cream', hex: '#FFFAEF' }
  ];

  const collars = [
    { id: 'mandarin', name: 'Mandarin Stand Collar', desc: 'Clean 1.5-inch stiff band collar' },
    { id: 'v-neck', name: 'V-Cut Embroidered Neck', desc: 'Deep V-neckline with gold thread trim' },
    { id: 'placket', name: 'Concealed Button Placket', desc: 'Sleek hidden fastener front' }
  ];

  const pockets = [
    { id: 'none', name: 'No Pocket (Clean Front)', desc: 'Seamless minimalist chest' },
    { id: 'single', name: 'Single Flap Chest Pocket', desc: 'Classic left chest pocket with satin piping' },
    { id: 'dual-flap', name: 'Dual Flap Pockets', desc: 'Architectural twin chest flap pockets' },
    { id: 'zip', name: 'Concealed Zip Pocket', desc: 'Modern hidden zipper accent' }
  ];

  const embroideries = [
    { id: 'none', name: 'No Embroidery (Minimal)', desc: 'Solid monochrome elegance' },
    { id: 'geometric', name: 'Gilded Geometric Pattern', desc: 'Metallic gold chest filigree stitching' },
    { id: 'filigree', name: 'Imperial Floral Filigree', desc: 'Intricate artisan needlework' },
    { id: 'minimal', name: 'Minimalist Double Stitching', desc: 'Subtle parallel thread piping' }
  ];

  // Dynamically constructed 3D garment object for real-time WebGL render
  const previewGarment = {
    id: 'custom-native-3d',
    name: `Custom ${customNative.style.toUpperCase()} (${customNative.colorName})`,
    subtitle: `Bespoke ${customNative.fit.toUpperCase()} • ${customNative.collar.toUpperCase()}`,
    modelType: customNative.style,
    colorHex: customNative.colorHex,
    colorName: customNative.colorName,
    fabric: customNative.fabric,
    priceNGN: customNative.priceNGN,
    hotspots: [
      { id: 'h1', position: [0, 0.96, 0.28], label: `${customNative.collar.toUpperCase()} COLLAR`, description: 'Custom engineered neckline' },
      { id: 'h2', position: [0, 0.45, 0.25], label: `${customNative.pockets.toUpperCase()} POCKET`, description: 'Tailored chest pocket detail' },
      { id: 'h3', position: [0, 0.7, 0.25], label: `${customNative.embroidery.toUpperCase()} EMBROIDERY`, description: 'Hand-stitched accent pattern' }
    ]
  };

  const handleCommissionCustomNative = () => {
    setActiveGarment(previewGarment);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)] relative overflow-hidden flex flex-col lg:flex-row text-left animate-fade-in">
      {/* Left Control Panel — Design Options Studio */}
      <div className="w-full lg:w-[450px] p-4 sm:p-6 bg-[#120F0D]/95 backdrop-blur-xl border-r border-[#C9A96E]/20 z-20 flex flex-col justify-between space-y-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#800020]/30 border border-[#C9A96E]/40 text-[#C9A96E] text-[9px] font-mono tracking-widest uppercase">
              <Wand2 className="w-3 h-3" />
              <span>NATIVE DESIGN STUDIO</span>
            </div>
            <h2 className="font-serif text-2xl text-[#FFFAEF] mt-1">Design Your Native From Scratch</h2>
            <p className="text-xs font-mono text-[#FFFAEF]/60">Customize style, fit, color, collar, and pockets live on your 3D model</p>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1B1717] border border-[#C9A96E]/20 overflow-x-auto">
            {[
              { id: 'style', label: '1. STYLE' },
              { id: 'fit', label: '2. FIT' },
              { id: 'color', label: '3. COLOR' },
              { id: 'collar', label: '4. COLLAR' },
              { id: 'pockets', label: '5. POCKETS' },
              { id: 'embroidery', label: '6. EMBROIDERY' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                  activeStep === tab.id
                    ? 'bg-[#800020] text-[#FFFAEF] font-bold border border-[#C9A96E]/40 shadow-burgundy-glow'
                    : 'text-[#FFFAEF]/60 hover:text-[#FFFAEF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Option Step 1: Base Native Style */}
          {activeStep === 'style' && (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-wider block">
                CHOOSE NATIVE SILHOUETTE
              </span>
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCustomNative({ ...customNative, style: s.id, priceNGN: s.price })}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.style === s.id
                      ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                      : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold text-[#FFFAEF]">{s.name}</div>
                    <div className="text-[10px] font-mono text-[#FFFAEF]/60">{s.desc}</div>
                  </div>
                  <span className="font-mono text-xs text-[#C9A96E] font-bold">{formatPrice(s.price)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Option Step 2: Fit & Cut */}
          {activeStep === 'fit' && (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-wider block">
                CHOOSE ANATOMICAL FIT
              </span>
              {fits.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCustomNative({ ...customNative, fit: f.id })}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.fit === f.id
                      ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                      : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold text-[#FFFAEF]">{f.name}</div>
                    <div className="text-[10px] font-mono text-[#FFFAEF]/60">{f.desc}</div>
                  </div>
                  {customNative.fit === f.id && <Check className="w-4 h-4 text-[#C9A96E]" />}
                </button>
              ))}
            </div>
          )}

          {/* Option Step 3: Color Selection */}
          {activeStep === 'color' && (
            <div className="space-y-3 animate-fade-in">
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-wider block">
                CHOOSE FABRIC COLOR & PALETTE
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setCustomNative({ ...customNative, colorHex: c.hex, colorName: c.name })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      customNative.colorHex === c.hex
                        ? 'bg-[#800020]/40 border-[#C9A96E] text-[#FFFAEF] shadow-burgundy-glow'
                        : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-[#C9A96E] flex-shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-xs font-mono truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Option Step 4: Collar & Neckline */}
          {activeStep === 'collar' && (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-wider block">
                CHOOSE COLLAR & NECKLINE
              </span>
              {collars.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCustomNative({ ...customNative, collar: c.id })}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.collar === c.id
                      ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                      : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold text-[#FFFAEF]">{c.name}</div>
                    <div className="text-[10px] font-mono text-[#FFFAEF]/60">{c.desc}</div>
                  </div>
                  {customNative.collar === c.id && <Check className="w-4 h-4 text-[#C9A96E]" />}
                </button>
              ))}
            </div>
          )}

          {/* Option Step 5: Pockets & Details */}
          {activeStep === 'pockets' && (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-wider block">
                CHOOSE CHEST POCKET DESIGN
              </span>
              {pockets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCustomNative({ ...customNative, pockets: p.id })}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.pockets === p.id
                      ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                      : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold text-[#FFFAEF]">{p.name}</div>
                    <div className="text-[10px] font-mono text-[#FFFAEF]/60">{p.desc}</div>
                  </div>
                  {customNative.pockets === p.id && <Check className="w-4 h-4 text-[#C9A96E]" />}
                </button>
              ))}
            </div>
          )}

          {/* Option Step 6: Embroidery Patterns */}
          {activeStep === 'embroidery' && (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase tracking-wider block">
                CHOOSE EMBROIDERY PATTERN
              </span>
              {embroideries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setCustomNative({ ...customNative, embroidery: e.id })}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    customNative.embroidery === e.id
                      ? 'bg-[#800020]/40 border-[#C9A96E] shadow-burgundy-glow text-[#FFFAEF]'
                      : 'bg-[#1B1717] border-[#FFFAEF]/10 text-[#FFFAEF]/70 hover:border-[#C9A96E]/30'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold text-[#FFFAEF]">{e.name}</div>
                    <div className="text-[10px] font-mono text-[#FFFAEF]/60">{e.desc}</div>
                  </div>
                  {customNative.embroidery === e.id && <Check className="w-4 h-4 text-[#C9A96E]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Checkout Button */}
        <div className="space-y-3 pt-4 border-t border-[#FFFAEF]/10">
          <div className="p-3.5 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/30 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-[#FFFAEF]/50 block">ESTIMATED PRICE</span>
              <span className="font-serif text-xl text-[#C9A96E] font-bold">{formatPrice(customNative.priceNGN)}</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              CUSTOM DESIGN READY
            </span>
          </div>

          <button
            onClick={handleCommissionCustomNative}
            className="w-full py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase font-bold shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <ShoppingBag className="w-4 h-4 text-[#C9A96E]" />
            <span>COMMISSION NATIVE (PAY WITH PAYAZA)</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage Preview */}
      <div className="flex-1 h-full relative bg-[#1B1717]">
        <AtelierScene
          garment={previewGarment}
          measurements={measurements}
          isNightLighting={isNightLighting}
        />

        {/* Live 3D Overlay Specs Card */}
        <div className="hidden sm:block absolute top-4 right-4 p-4 rounded-2xl glass-modal border border-[#C9A96E]/40 text-right space-y-1 shadow-obsidian-glow pointer-events-none z-10">
          <span className="text-[9px] font-mono text-[#C9A96E] uppercase tracking-widest block">
            LIVE 3D NATIVE PREVIEW
          </span>
          <h3 className="font-serif text-xl text-[#FFFAEF]">Custom {customNative.style.toUpperCase()}</h3>
          <div className="text-xs font-mono text-[#C9A96E] font-bold">
            {customNative.colorName} • {customNative.collar.toUpperCase()} COLLAR
          </div>
          <div className="text-[10px] font-mono text-[#FFFAEF]/60">
            {customNative.pockets.toUpperCase()} POCKET • {customNative.embroidery.toUpperCase()} EMBROIDERY
          </div>
        </div>

        {/* Lighting Rig Toggle Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setIsNightLighting(!isNightLighting)}
            className="px-3.5 py-2 rounded-xl glass-modal border border-[#C9A96E]/40 text-xs font-mono text-[#C9A96E] flex items-center gap-2 cursor-pointer hover:border-[#C9A96E]"
          >
            {isNightLighting ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>{isNightLighting ? 'NIGHT' : 'DAY'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
