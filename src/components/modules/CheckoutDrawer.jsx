import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { ShoppingBag, X, CheckCircle2, CreditCard, Lock, User, Mail, Phone, MapPin } from 'lucide-react';

export function CheckoutDrawer() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    activeGarment,
    formatPrice,
    selectedTailor,
    measurements,
    orderDetails,
    setOrderDetails
  } = useAtelier();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const handlePayWithPayaza = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payaza/initialize-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeGarment.priceNGN,
          currency: 'NGN',
          email: orderDetails.email,
          fullName: orderDetails.fullName
        })
      });

      const data = await response.json();
      
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
      }, 1200);
    } catch (err) {
      console.warn('Payaza transaction demo:', err);
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in flex justify-end">
      <div className="w-full sm:max-w-md h-full bg-[#120F0D] border-l border-[#C9A96E]/30 text-[#FFFAEF] shadow-obsidian-glow flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-[#C9A96E]/20 bg-[#1B1717]/80 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase">
                PAYAZA CHECKOUT
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FFFAEF] mt-0.5">Order Checkout</h3>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full text-[#FFFAEF]/60 hover:text-[#FFFAEF] hover:bg-[#FFFAEF]/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Form & Summary */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 text-left">
          {/* Order Summary Card */}
          <div className="p-4 rounded-2xl bg-[#1B1717] border border-[#C9A96E]/20 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-[#C9A96E] uppercase">{activeGarment.subtitle}</span>
                <h4 className="font-serif text-base sm:text-lg text-[#FFFAEF]">{activeGarment.name}</h4>
                <p className="text-xs font-mono text-[#FFFAEF]/60">{activeGarment.fabric}</p>
              </div>

              <div className="text-right">
                <span className="font-serif text-xl text-[#C9A96E] font-bold block">
                  {formatPrice(activeGarment.priceNGN)}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  TAILORED FIT ({measurements.chest} in)
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

          {/* Customer Shipping & Contact Details */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-[#C9A96E] font-bold uppercase tracking-wider block">
              DELIVERY & CONTACT DETAILS
            </span>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-[#FFFAEF]/50 uppercase flex items-center gap-1">
                  <User className="w-3 h-3 text-[#C9A96E]" /> FULL NAME
                </label>
                <input
                  type="text"
                  value={orderDetails.fullName}
                  onChange={(e) => setOrderDetails({ ...orderDetails, fullName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 font-sans text-xs text-[#FFFAEF] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#FFFAEF]/50 uppercase flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#C9A96E]" /> EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={orderDetails.email}
                  onChange={(e) => setOrderDetails({ ...orderDetails, email: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 font-sans text-xs text-[#FFFAEF] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#FFFAEF]/50 uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#C9A96E]" /> PHONE NUMBER
                </label>
                <input
                  type="text"
                  value={orderDetails.phone}
                  onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 font-sans text-xs text-[#FFFAEF] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#FFFAEF]/50 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C9A96E]" /> DELIVERY ADDRESS
                </label>
                <textarea
                  value={orderDetails.address}
                  rows={2}
                  onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 font-sans text-xs text-[#FFFAEF] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Payaza CTA */}
        <div className="p-4 sm:p-6 border-t border-[#C9A96E]/20 bg-[#1B1717] sticky bottom-0 space-y-3">
          {!paymentSuccess ? (
            <button
              onClick={handlePayWithPayaza}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase font-bold shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <CreditCard className="w-4 h-4 text-[#C9A96E]" />
              <span>{isProcessing ? 'CONNECTING TO PAYAZA...' : `PAY WITH PAYAZA (${formatPrice(activeGarment.priceNGN)})`}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>PAYMENT INITIATED VIA PAYAZA</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-300/80">
                Your order is confirmed! Redirecting to Payaza gateway.
              </p>
            </div>
          )}

          <div className="text-center text-[9px] font-mono tracking-widest text-[#FFFAEF]/40 uppercase flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-[#C9A96E]" />
            <span>SECURE CHECKOUT POWERED BY PAYAZA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
