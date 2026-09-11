import React, { useState } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { MessageSquare, Users, Copy, Send, X, Sparkles, Check } from 'lucide-react';

export function CollaborativeRoom() {
  const {
    isCollaborativeRoomOpen,
    setIsCollaborativeRoomOpen,
    roomCode,
    chatMessages,
    sendChatMessage,
    selectedTailor
  } = useAtelier();

  const [inputMessage, setInputMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCollaborativeRoomOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendChatMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in flex justify-end">
      <div className="w-full max-w-md h-full bg-[#120F0D] border-l border-[#C9A96E]/30 text-[#FFFAEF] shadow-obsidian-glow flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div className="p-6 border-b border-[#C9A96E]/20 bg-[#1B1717]/80 sticky top-0 z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase">
                COLLABORATIVE FITTING ROOM
              </span>
            </div>

            <button
              onClick={() => setIsCollaborativeRoomOpen(false)}
              className="p-1.5 rounded-full text-[#FFFAEF]/60 hover:text-[#FFFAEF] hover:bg-[#FFFAEF]/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={selectedTailor.avatar} alt={selectedTailor.name} className="w-9 h-9 rounded-full border border-[#C9A96E]" />
              <div className="text-left">
                <h4 className="font-serif text-sm text-[#FFFAEF]">{selectedTailor.name}</h4>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE IN ROOM
                </span>
              </div>
            </div>

            {/* Room Code Copy Pill */}
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-[#1B1717] border border-[#C9A96E]/30 text-xs font-mono text-[#C9A96E] hover:border-[#C9A96E] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Copy Room Code to Share"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : roomCode}</span>
            </button>
          </div>
        </div>

        {/* Chat Feed Messages */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto text-left">
          <div className="text-center">
            <span className="text-[9px] font-mono text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-3 py-1 rounded-full uppercase">
              🔒 SOCKET.IO ENCRYPTED TAILOR SESSION
            </span>
          </div>

          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.isTailor ? 'items-start' : 'items-end'} space-y-1`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#FFFAEF]/50">
                <span>{msg.sender}</span>
                <span>• {msg.time}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-sans leading-relaxed ${
                  msg.isTailor
                    ? 'bg-[#1B1717] border border-[#C9A96E]/30 text-[#FFFAEF]'
                    : 'bg-[#800020] border border-[#C9A96E]/50 text-[#FFFAEF] shadow-burgundy-glow'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#C9A96E]/20 bg-[#1B1717] sticky bottom-0 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type notes or ask your master tailor..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#120F0D] border border-[#C9A96E]/30 font-sans text-xs text-[#FFFAEF] focus:outline-none focus:border-[#C9A96E]"
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-xl bg-[#800020] hover:bg-[#630000] border border-[#C9A96E]/50 text-[#FFFAEF] cursor-pointer shadow-burgundy-glow"
          >
            <Send className="w-4 h-4 text-[#C9A96E]" />
          </button>
        </form>
      </div>
    </div>
  );
}
