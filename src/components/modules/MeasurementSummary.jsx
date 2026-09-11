import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Ruler, Edit3, CheckCircle2, User } from 'lucide-react';

export function MeasurementSummary() {
  const { measurements, setIsSizingWizardOpen } = useAtelier();

  return (
    <div className="p-5 rounded-3xl glass-panel border border-[#C9A96E]/30 space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#C9A96E]" />
          <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase">
            MY 3D ANATOMICAL PROFILE
          </span>
        </div>

        <button
          onClick={() => setIsSizingWizardOpen(true)}
          className="text-xs font-mono text-[#C9A96E] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>QUICK EDIT</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10">
          <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">STATURE HEIGHT</span>
          <span className="font-serif text-lg text-[#FFFAEF] font-bold">{measurements.height} cm</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10">
          <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">CHEST/BUST</span>
          <span className="font-serif text-lg text-[#C9A96E] font-bold">{measurements.chest} {measurements.unit}</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10">
          <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">NATURAL WAIST</span>
          <span className="font-serif text-lg text-[#C9A96E] font-bold">{measurements.waist} {measurements.unit}</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10">
          <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">HIP GIRTH</span>
          <span className="font-serif text-lg text-[#FFFAEF] font-bold">{measurements.hips} {measurements.unit}</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10">
          <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">SHOULDER</span>
          <span className="font-serif text-lg text-[#FFFAEF] font-bold">{measurements.shoulder} {measurements.unit}</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#120F0D] border border-[#FFFAEF]/10">
          <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">INSEAM DROP</span>
          <span className="font-serif text-lg text-[#FFFAEF] font-bold">{measurements.inseam || 32} {measurements.unit}</span>
        </div>
      </div>
    </div>
  );
}
