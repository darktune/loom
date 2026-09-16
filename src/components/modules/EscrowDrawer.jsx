import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ShieldCheck, X, CheckCircle2, Lock, Copy, CreditCard, Building2 } from 'lucide-react';

export function EscrowDrawer() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    activeGarment,
    escrowOrder,
    formatPrice,
    selectedTailor
  } = useAtelier();

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(escrowOrder.virtualAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitializeEscrow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in flex justify-end">
      <div className="w-full sm:max-w-md h-full bg-[#120F0D] border-l border-[#C9A96E]/30 text-[#FFFAEF] shadow-obsidian-glow flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-[#C9A96E]/20 bg-[#1B1717]/80 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase">
                PAYAZA ESCROW VAULT
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FFFAEF] mt-0.5">Bespoke Escrow Checkout</h3>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full text-[#FFFAEF]/60 hover:text-[#FFFAEF] hover:bg-[#FFFAEF]/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 text-left">
          {/* Garment & Tailor Summary Card */}
          <div className="p-4 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-[#C9A96E] uppercase">{activeGarment.subtitle}</span>
                <h4 className="font-serif text-base sm:text-lg text-[#FFFAEF]">{activeGarment.name}</h4>
                <p className="text-xs font-mono text-[#FFFAEF]/60">{activeGarment.fabric}</p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs text-[#C9A96E] font-bold tracking-wider uppercase block">
                  Agreed Tailor Quote
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  SECURED ESCROW
                </span>
              </div>
            </div>

            {/* Tailor Info */}
            <div className="pt-3 border-t border-[#FFFAEF]/10 flex items-center justify-between text-xs font-mono text-[#FFFAEF]/80">
              <div className="flex items-center gap-2">
                <img src={selectedTailor.avatar} alt={selectedTailor.name} className="w-6 h-6 rounded-full border border-[#C9A96E]" />
                <span>{selectedTailor.name}</span>
              </div>
              <span className="text-[#C9A96E]">{selectedTailor.leadTime} Lead Time</span>
            </div>
          </div>

          {/* 4-Tier Milestone Disbursement Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#C9A96E] font-bold uppercase tracking-wider">4-TIER MILESTONE DISBURSEMENT</span>
              <span className="text-[#FFFAEF]/50">Protected Funds</span>
            </div>

            <div className="space-y-2">
              {escrowOrder.milestones.map((m) => (
                <div
                  key={m.step}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    m.status === 'COMPLETED'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-[#FFFAEF]'
                      : m.status === 'IN_PROGRESS'
                      ? 'bg-[#800020]/20 border-[#C9A96E] text-[#FFFAEF]'
                      : 'bg-[#1B1717]/60 border-[#FFFAEF]/10 text-[#FFFAEF]/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {m.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : m.status === 'IN_PROGRESS' ? (
                      <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-ping" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#FFFAEF]/40" />
                    )}

                    <div>
                      <div className="text-xs font-serif font-bold text-[#FFFAEF]">{m.title}</div>
                      <div className="text-[9px] font-mono text-[#FFFAEF]/60">{m.percentage}% Gated Payout</div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-[#C9A96E]">
                    {formatPrice(Math.round(activeGarment.priceNGN * (m.percentage / 100)), Math.round(activeGarment.priceUSD * (m.percentage / 100)))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Payaza Virtual Account Box */}
          <div className="p-4 rounded-2xl bg-[#5B0F18]/40 border border-[#C9A96E]/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#C9A96E]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>PAYAZA VIRTUAL ESCROW ACCOUNT</span>
              </span>
              <button
                onClick={handleCopyAccount}
                className="text-[10px] flex items-center gap-1 text-[#FFFAEF]/80 hover:text-[#C9A96E] cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>

            <div className="font-mono text-sm text-[#FFFAEF] font-bold tracking-wider">
              {escrowOrder.virtualAccount}
            </div>

            <p className="text-[10px] font-mono text-[#FFFAEF]/60 leading-relaxed">
              Funds remain securely locked in Payaza Escrow until you approve each tailor milestone release.
            </p>
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-[#C9A96E]/20 bg-[#1B1717] sticky bottom-0 space-y-3">
          {!paymentSuccess ? (
            <button
              onClick={handleInitializeEscrow}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CreditCard className="w-4 h-4 text-[#C9A96E]" />
              <span>{isProcessing ? 'INITIALIZING PAYAZA ESCROW...' : 'INITIALIZE BESPOKE ESCROW'}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PAYAZA ESCROW ACTIVE</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-300/80">
                Virtual Account Created! 20% Material Sourcing milestone initialized.
              </p>
            </div>
          )}

          <div className="text-center text-[9px] font-mono tracking-widest text-[#FFFAEF]/40 uppercase">
            POWERED BY PAYAZA VIRTUAL ACCOUNTS & ESCROW VAULT
          </div>
        </div>
      </div>
    </div>
  );
}
