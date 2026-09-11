import React from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { User, Award } from 'lucide-react';
import { MeasurementSummary } from './MeasurementSummary';
import { TailorMilestoneView } from './TailorMilestoneView';

export function PatronDossier() {
  const { escrowOrder, formatPrice } = useAtelier();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FFFAEF]/10 pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase block">
            PATRON LOUNGE & DOSSIER
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FFFAEF]">Patron Profile #0847</h2>
          <p className="text-xs font-mono text-[#FFFAEF]/60">Certified Bespoke Haute-Couture Collector</p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#800020]/30 border border-[#C9A96E]/40 text-xs font-mono text-[#C9A96E] flex items-center gap-2 self-start sm:self-auto">
          <Award className="w-3.5 h-3.5" />
          <span>IMPERIAL TIER PATRON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-5 space-y-6">
          <MeasurementSummary />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <TailorMilestoneView />
        </div>
      </div>
    </div>
  );
}
