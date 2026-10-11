import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Sparkles, Wand2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ConceptGenerator() {
  const { setActiveGarment } = useAtelier();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConcept, setGeneratedConcept] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedConcept(null);

    try {
      const res = await fetch('/api/ai/generate-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedConcept(data.concept);
      }
    } catch (err) {
      console.warn('AI Conceptor API error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fade-in text-left">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#800020]/30 border border-[#C9A96E]/40 text-[#C9A96E] text-[10px] font-mono tracking-widest uppercase">
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI BESPOKE CONCEPT GENERATOR</span>
        </div>

        <h2 className="font-serif text-4xl text-[#FFFAEF]">Describe Your Dream Garment</h2>
        <p className="text-xs font-mono text-[#FFFAEF]/60 max-w-md mx-auto">
          Describe any silhouette, fabric blend, or embroidery concept. Dual AI engine (Gemini + Groq) will synthesize a 3D specification.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="p-6 rounded-3xl glass-modal border border-[#C9A96E]/30 space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. Imperial Agbada in deep burgundy velvet with heavy gold filigree embroidery around the neck and cuffs..."
          className="w-full p-4 rounded-2xl bg-[#120F0D] border border-[#C9A96E]/30 font-sans text-xs text-[#FFFAEF] placeholder-[#FFFAEF]/40 focus:outline-none focus:border-[#C9A96E]"
        />

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] font-mono text-xs tracking-[0.2em] uppercase shadow-burgundy-glow flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#C9A96E]" />
          <span>{isGenerating ? 'SYNTHESIZING 3D CONCEPT...' : 'GENERATE BESPOKE 3D SPECIFICATION'}</span>
        </button>
      </form>

      {generatedConcept && (
        <div className="p-6 rounded-3xl glass-panel border border-[#C9A96E]/40 space-y-4 animate-fade-in shadow-burgundy-glow">
          <div className="flex items-center justify-between border-b border-[#FFFAEF]/10 pb-3">
            <div>
              <span className="text-[9px] font-mono text-[#C9A96E] uppercase font-bold">SYNTHESIZED 3D CONCEPT</span>
              <h3 className="font-serif text-2xl text-[#FFFAEF]">{generatedConcept.garmentName}</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              AI DESIGN READY
            </span>
          </div>

          <p className="text-xs font-mono text-[#FFFAEF]/80 leading-relaxed">{generatedConcept.description}</p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
            <div className="p-3 rounded-xl bg-[#120F0D] border border-[#FFFAEF]/10">
              <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">PRIMARY FABRIC</span>
              <span className="text-[#C9A96E] font-bold">{generatedConcept.fabricType}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#120F0D] border border-[#FFFAEF]/10">
              <span className="text-[9px] text-[#FFFAEF]/50 uppercase block">SILHOUETTE</span>
              <span className="text-[#FFFAEF] font-bold uppercase">{generatedConcept.silhouette}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
