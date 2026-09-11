import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ShieldCheck, CheckCircle2, Lock, Clock, Camera } from 'lucide-react';

export function TailorMilestoneView() {
  const { escrowOrder, releaseMilestone, formatPrice, selectedTailor } = useAtelier();

  const [uploadingStep, setUploadingStep] = useState(null);

  const handleUploadProof = (stepNumber) => {
    setUploadingStep(stepNumber);
    setTimeout(() => {
      setUploadingStep(null);
      releaseMilestone(stepNumber);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl glass-panel border border-[#C9A96E]/30 space-y-6 text-left animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FFFAEF]/10 pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase block">
            TAILOR WORKBENCH & ESCROW DISBURSEMENT
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#FFFAEF]">{selectedTailor.name} Workbench</h3>
          <p className="text-xs font-mono text-[#FFFAEF]/60">Order #{escrowOrder.orderId} • Payaza Virtual Escrow</p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-mono text-[#FFFAEF]/50 uppercase block">Total Commission</span>
          <span className="font-serif text-xl sm:text-2xl text-[#C9A96E] font-bold">
            {formatPrice(escrowOrder.totalNGN, escrowOrder.totalUSD)}
          </span>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {escrowOrder.milestones.map((m) => (
          <div
            key={m.step}
            className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
              m.status === 'COMPLETED'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-[#FFFAEF]'
                : m.status === 'IN_PROGRESS'
                ? 'bg-[#5B0F18]/40 border-[#C9A96E] shadow-burgundy-glow'
                : 'bg-[#1B1717]/60 border-[#FFFAEF]/10 text-[#FFFAEF]/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-[#C9A96E] uppercase">MILESTONE 0{m.step} ({m.percentage}%)</span>
                <h4 className="font-serif text-base sm:text-lg text-[#FFFAEF]">{m.title}</h4>
              </div>

              <span className="font-mono text-xs sm:text-sm font-bold text-[#C9A96E]">
                {formatPrice(Math.round(escrowOrder.totalNGN * (m.percentage / 100)), Math.round(escrowOrder.totalUSD * (m.percentage / 100)))}
              </span>
            </div>

            {/* Proof Status */}
            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#FFFAEF]/10">
              <span className="text-[#FFFAEF]/60">Status:</span>
              {m.status === 'COMPLETED' ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DISBURSED
                </span>
              ) : m.status === 'IN_PROGRESS' ? (
                <span className="text-[#C9A96E] font-bold flex items-center gap-1 animate-pulse">
                  <Clock className="w-3.5 h-3.5" /> AWAITING PROOF
                </span>
              ) : (
                <span className="text-[#FFFAEF]/40 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> LOCKED
                </span>
              )}
            </div>

            {/* Proof Upload Trigger */}
            {m.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleUploadProof(m.step)}
                disabled={uploadingStep === m.step}
                className="w-full py-3 px-4 rounded-xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/40 text-[#FFFAEF] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-burgundy-glow"
              >
                <Camera className="w-4 h-4 text-[#C9A96E]" />
                <span>{uploadingStep === m.step ? 'UPLOADING PROOF...' : 'SUBMIT PROOF & RELEASE'}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
