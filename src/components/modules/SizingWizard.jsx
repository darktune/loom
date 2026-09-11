import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Ruler, X, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw, Camera } from 'lucide-react';

export function SizingWizard() {
  const { isSizingWizardOpen, setIsSizingWizardOpen, measurements, setMeasurements } = useAtelier();

  const [step, setStep] = useState(1);
  const [unitToggle, setUnitToggle] = useState(measurements.unit || 'in'); // 'in' or 'cm'
  const [tempData, setTempData] = useState({ ...measurements });
  const [errors, setErrors] = useState({});

  if (!isSizingWizardOpen) return null;

  // Real-time numeric validation
  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (tempData.height < 140 || tempData.height > 220) errs.height = 'Height must be between 140cm and 220cm';
      if (tempData.weight < 40 || tempData.weight > 180) errs.weight = 'Weight must be between 40kg and 180kg';
    } else if (step === 2) {
      if (tempData.chest < 28 || tempData.chest > 64) errs.chest = 'Chest must be between 28in and 64in';
      if (tempData.shoulder < 12 || tempData.shoulder > 28) errs.shoulder = 'Shoulder width must be between 12in and 28in';
    } else if (step === 3) {
      if (tempData.waist < 24 || tempData.waist > 58) errs.waist = 'Waist must be between 24in and 58in';
      if (tempData.hips < 28 || tempData.hips > 62) errs.hips = 'Hips must be between 28in and 62in';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleApply = () => {
    if (validateStep()) {
      setMeasurements({ ...tempData, unit: unitToggle });
      setIsSizingWizardOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-4 sm:p-6 flex justify-center items-start animate-fade-in">
      <div className="relative w-full max-w-xl glass-modal text-[#FFFAEF] rounded-3xl border border-[#C9A96E]/40 shadow-obsidian-glow my-6 sm:my-10 overflow-hidden">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-[#120F0D]/95 backdrop-blur-xl border-b border-[#C9A96E]/20 flex items-center justify-between">
          <button
            onClick={() => setIsSizingWizardOpen(false)}
            className="flex items-center gap-2 text-xs font-mono text-[#C9A96E] hover:text-[#FFFAEF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO ATELIER</span>
          </button>

          <div className="flex items-center gap-2">
            {/* IN / CM Toggle Button */}
            <div className="p-1 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 flex items-center gap-1">
              <button
                onClick={() => setUnitToggle('in')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-widest cursor-pointer ${
                  unitToggle === 'in' ? 'bg-[#800020] text-[#FFFAEF] font-bold' : 'text-[#FFFAEF]/50 hover:text-[#FFFAEF]'
                }`}
              >
                INCHES (IN)
              </button>
              <button
                onClick={() => setUnitToggle('cm')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-widest cursor-pointer ${
                  unitToggle === 'cm' ? 'bg-[#800020] text-[#FFFAEF] font-bold' : 'text-[#FFFAEF]/50 hover:text-[#FFFAEF]'
                }`}
              >
                METRIC (CM)
              </button>
            </div>

            <button
              onClick={() => setIsSizingWizardOpen(false)}
              className="p-1.5 rounded-full text-[#FFFAEF]/60 hover:text-[#FFFAEF] hover:bg-[#FFFAEF]/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-left">
          {/* Title Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] text-[10px] font-mono tracking-widest uppercase mb-3">
              <Ruler className="w-3.5 h-3.5" />
              <span>3-STEP ANTHROPOMETRIC SIZING</span>
            </div>

            <h2 className="font-serif italic font-normal text-3xl sm:text-4xl text-[#FFFAEF]">
              Digital Twin Measurement Wizard
            </h2>
            <p className="text-xs text-[#FFFAEF]/60 font-mono max-w-md mx-auto mt-2 leading-relaxed">
              Enter your exact anatomical measurements to morph the 3D parametric mannequin in real time.
            </p>
          </div>

          {/* 3-Step Progress Indicator */}
          <div className="grid grid-cols-3 gap-2 border-y border-[#FFFAEF]/10 py-3.5">
            <div
              className={`p-2 rounded-xl text-center border transition-all ${
                step >= 1 ? 'border-[#C9A96E] bg-[#800020]/20 text-[#C9A96E]' : 'border-[#FFFAEF]/10 text-[#FFFAEF]/40'
              }`}
            >
              <span className="text-[9px] font-mono tracking-widest block uppercase">STEP 1</span>
              <span className="text-xs font-serif italic font-bold">Height & Weight</span>
            </div>

            <div
              className={`p-2 rounded-xl text-center border transition-all ${
                step >= 2 ? 'border-[#C9A96E] bg-[#800020]/20 text-[#C9A96E]' : 'border-[#FFFAEF]/10 text-[#FFFAEF]/40'
              }`}
            >
              <span className="text-[9px] font-mono tracking-widest block uppercase">STEP 2</span>
              <span className="text-xs font-serif italic font-bold">Chest & Shoulder</span>
            </div>

            <div
              className={`p-2 rounded-xl text-center border transition-all ${
                step >= 3 ? 'border-[#C9A96E] bg-[#800020]/20 text-[#C9A96E]' : 'border-[#FFFAEF]/10 text-[#FFFAEF]/40'
              }`}
            >
              <span className="text-[9px] font-mono tracking-widest block uppercase">STEP 3</span>
              <span className="text-xs font-serif italic font-bold">Waist, Hips & Inseam</span>
            </div>
          </div>

          {/* Step 1 Inputs */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase block">Stature Height</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.height}
                      onChange={(e) => setTempData({ ...tempData, height: Number(e.target.value) })}
                      className="w-24 bg-transparent font-serif text-3xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-xs font-mono text-[#C9A96E]">cm</span>
                  </div>
                  {errors.height && <p className="text-[10px] text-red-400 mt-1 font-mono">{errors.height}</p>}
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase block">Body Weight</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.weight}
                      onChange={(e) => setTempData({ ...tempData, weight: Number(e.target.value) })}
                      className="w-24 bg-transparent font-serif text-3xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-xs font-mono text-[#C9A96E]">kg</span>
                  </div>
                  {errors.weight && <p className="text-[10px] text-red-400 mt-1 font-mono">{errors.weight}</p>}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>NEXT: CHEST & SHOULDER</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
              </button>
            </div>
          )}

          {/* Step 2 Inputs */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase block">Bust / Chest Circumference</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.chest}
                      onChange={(e) => setTempData({ ...tempData, chest: Number(e.target.value) })}
                      className="w-24 bg-transparent font-serif text-3xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-xs font-mono text-[#C9A96E]">{unitToggle}</span>
                  </div>
                  {errors.chest && <p className="text-[10px] text-red-400 mt-1 font-mono">{errors.chest}</p>}
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase block">Shoulder Width</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.shoulder}
                      onChange={(e) => setTempData({ ...tempData, shoulder: Number(e.target.value) })}
                      className="w-24 bg-transparent font-serif text-3xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-xs font-mono text-[#C9A96E]">{unitToggle}</span>
                  </div>
                  {errors.shoulder && <p className="text-[10px] text-red-400 mt-1 font-mono">{errors.shoulder}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-4 px-5 rounded-2xl bg-[#FFFAEF]/5 hover:bg-[#FFFAEF]/10 border border-[#FFFAEF]/15 text-[#FFFAEF] font-mono text-xs cursor-pointer"
                >
                  BACK
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>NEXT: WAIST, HIPS & INSEAM</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 Inputs & Apply */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[9px] font-mono text-[#FFFAEF]/50 uppercase block">Natural Waist</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.waist}
                      onChange={(e) => setTempData({ ...tempData, waist: Number(e.target.value) })}
                      className="w-16 bg-transparent font-serif text-2xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-[10px] font-mono text-[#C9A96E]">{unitToggle}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[9px] font-mono text-[#FFFAEF]/50 uppercase block">Hip Girth</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.hips}
                      onChange={(e) => setTempData({ ...tempData, hips: Number(e.target.value) })}
                      className="w-16 bg-transparent font-serif text-2xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-[10px] font-mono text-[#C9A96E]">{unitToggle}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20">
                  <label className="text-[9px] font-mono text-[#FFFAEF]/50 uppercase block">Inseam Drop</label>
                  <div className="flex items-baseline justify-between mt-1">
                    <input
                      type="number"
                      value={tempData.inseam || 32}
                      onChange={(e) => setTempData({ ...tempData, inseam: Number(e.target.value) })}
                      className="w-16 bg-transparent font-serif text-2xl text-[#FFFAEF] focus:outline-none focus:text-[#C9A96E]"
                    />
                    <span className="text-[10px] font-mono text-[#C9A96E]">{unitToggle}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#800020]/20 border border-[#C9A96E]/30 text-xs font-mono text-[#FFFAEF]/80 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A96E] flex-shrink-0" />
                <span>3D Parametric Morph Key Target Ready for R3F Canvas Sync</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="py-4 px-5 rounded-2xl bg-[#FFFAEF]/5 hover:bg-[#FFFAEF]/10 border border-[#FFFAEF]/15 text-[#FFFAEF] font-mono text-xs cursor-pointer"
                >
                  BACK
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>APPLY TO 3D MANNEQUIN</span>
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
