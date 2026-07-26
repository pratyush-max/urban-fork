'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  RotateCcw, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles,
  Phone,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const suggestionChips = [
  'Recommend a signature dish',
  'Wine pairing for steak',
  'Best dessert',
  'Birthday dinner ideas',
  'Private dining',
  'Vegetarian recommendations',
  'Opening hours',
  'Parking information',
  'Dress code',
  'Chef\'s recommendation'
];

export default function ConciergeAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore history from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('urban_concierge_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []);

  // Save history to sessionStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('urban_concierge_history', JSON.stringify(messages));
    } else {
      sessionStorage.removeItem('urban_concierge_history');
    }
  }, [messages]);

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
    setIsApiKeyMissing(false);
    setHasError(false);
  };

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    setInputValue('');
    setHasError(false);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { role: 'user', content: trimmed, timestamp };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Check if API Key is missing (JSON payload from endpoint)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.error === 'api_key_missing') {
          setIsApiKeyMissing(true);
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'Our digital concierge is currently resting. For reservations, inquiries, or customized requests, please contact our host directly at **+1 (212) 555-0187** or message us on WhatsApp at **+91 88220 77515**. You may also book directly using our reservations form.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          return;
        }
        throw new Error('API returned error JSON');
      }

      // Read response stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader found');

      // Append empty assistant message for streaming chunks
      const assistantMsg: Message = { role: 'assistant', content: '', timestamp: '' };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      let accumulatedText = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages(prev => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1] = {
              role: 'assistant',
              content: accumulatedText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return next;
        });
      }

    } catch (error) {
      console.error('Concierge request error:', error);
      setIsTyping(false);
      setHasError(true);
    }
  };

  const handleRetry = () => {
    // Find the last user message
    const userMsgs = messages.filter(m => m.role === 'user');
    if (userMsgs.length > 0) {
      const lastUserContent = userMsgs[userMsgs.length - 1].content;
      // Trim assistant responses after the last user message
      const lastUserIdx = messages.findLastIndex(m => m.role === 'user');
      setMessages(messages.slice(0, lastUserIdx));
      handleSend(lastUserContent);
    }
  };

  // Markdown inline text parsing
  const formatMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const clean = trimmed.replace(/^[•-]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-[#B5B5B5] leading-relaxed mb-1.5 font-sans font-light">
            {parseBold(clean)}
          </li>
        );
      }
      return (
        <p key={idx} className="text-sm text-[#B5B5B5] leading-relaxed mb-2.5 font-sans font-light">
          {parseBold(line)}
        </p>
      );
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="text-[#D4AF37] font-medium font-serif">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -6, 0]
        }}
        transition={{
          scale: { duration: 0.4, ease: 'easeOut' },
          opacity: { duration: 0.4 },
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-shadow duration-300 focus:outline-none min-h-[44px] min-w-[44px] cursor-none md:cursor-pointer"
        aria-label="Urban Concierge"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={22} />
              <span className="absolute top-[-3px] right-[-3px] flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Concierge Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 md:right-8 z-50 w-[calc(100vw-48px)] sm:w-[380px] md:w-[420px] h-[520px] md:h-[600px] flex flex-col rounded-2xl border border-white/10 bg-[#171717]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-gradient-to-tr from-[#171717] to-[#221c10] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 className="font-serif text-sm text-white tracking-wide font-light">
                    Urban Concierge
                  </h3>
                  <span className="font-sans text-[10px] text-[#B5B5B5]/60 uppercase tracking-widest block">
                    Urban Fork
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-full hover:bg-white/5 text-[#B5B5B5]/60 hover:text-white transition-colors cursor-none md:cursor-pointer"
                    title="Clear Conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-[#B5B5B5]/60 hover:text-white transition-colors cursor-none md:cursor-pointer"
                  aria-label="Minimize Chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Conversation Log */}
            <div 
              ref={scrollRef}
              data-lenis-prevent
              className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/5"
            >
              {messages.length === 0 ? (
                /* Empty / Intro state */
                <div className="h-full flex flex-col justify-center text-center px-4 py-8">
                  <span className="font-serif text-[#D4AF37] italic text-2xl mb-4">
                    Welcome to Urban Fork
                  </span>
                  <p className="font-sans text-xs text-[#B5B5B5]/70 leading-relaxed max-w-[280px] mx-auto mb-8 font-light">
                    Allow me to assist with reserving your table, suggesting exquisite dishes, sommelier wine pairings, or answering directions.
                  </p>
                  
                  {/* Suggestions Chips grid */}
                  <div className="text-left">
                    <span className="font-sans text-[10px] text-[#B5B5B5]/40 uppercase tracking-widest block mb-3 font-semibold">
                      Suggested Inquiries
                    </span>
                    <div 
                      data-lenis-prevent
                      className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1"
                    >
                      {suggestionChips.slice(0, 6).map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          className="px-3 py-1.5 rounded-full border border-white/5 hover:border-[#D4AF37]/30 bg-white/[0.02] hover:bg-white/[0.04] text-[11px] text-[#B5B5B5]/80 hover:text-white font-sans transition-all duration-300 text-left cursor-none md:cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Message list */
                <div className="space-y-6">
                  {messages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="font-sans text-[9px] uppercase tracking-widest text-[#B5B5B5]/40">
                          {msg.role === 'user' ? 'Guest' : 'Concierge'}
                        </span>
                        {msg.timestamp && (
                          <span className="font-sans text-[9px] text-[#B5B5B5]/30">
                            • {msg.timestamp}
                          </span>
                        )}
                      </div>

                      <div className={`relative max-w-[85%] rounded-2xl px-5 py-4 border ${
                        msg.role === 'user' 
                          ? 'bg-[#221c10]/20 border-[#D4AF37]/30 text-white rounded-tr-none'
                          : 'bg-[#1a1a1a]/40 border-white/5 text-[#B5B5B5] rounded-tl-none'
                      }`}>
                        
                        {/* Render body */}
                        <div className="select-text">
                          {msg.role === 'assistant' ? formatMarkdown(msg.content) : <p className="text-sm font-sans font-light leading-relaxed">{msg.content}</p>}
                        </div>

                        {/* Message interactions */}
                        {msg.role === 'assistant' && msg.content && (
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5 text-[#B5B5B5]/40 hover:text-white transition-colors">
                            <button
                              onClick={() => handleCopy(msg.content, index)}
                              className="text-[10px] flex items-center gap-1 cursor-none md:cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === index ? <Check size={11} className="text-[#D4AF37]" /> : <Copy size={11} />}
                              <span>{copiedId === index ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex flex-col items-start">
                      <span className="font-sans text-[9px] uppercase tracking-widest text-[#B5B5B5]/40 mb-1.5 px-1">
                        Concierge is writing...
                      </span>
                      <div className="bg-[#1a1a1a]/40 border border-white/5 px-5 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Fail-Safe UI Indicator */}
                  {isApiKeyMissing && (
                    <div className="p-4 rounded-xl border border-dashed border-[#D4AF37]/20 bg-[#D4AF37]/[0.02] flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[#D4AF37]">
                        <Calendar size={15} />
                        <span className="font-serif text-sm font-light">Concierge Direct Options</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a 
                          href="tel:+12125550187"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-[#B5B5B5] hover:text-white hover:border-[#D4AF37]/30 transition-all cursor-none md:cursor-pointer"
                        >
                          <span className="flex items-center gap-2"><Phone size={12} className="text-[#D4AF37]" /> Call Restaurant</span>
                          <span>+1 (212) 555-0187</span>
                        </a>
                        <a 
                          href="https://wa.me/918822077515"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-[#B5B5B5] hover:text-white hover:border-[#D4AF37]/30 transition-all cursor-none md:cursor-pointer"
                        >
                          <span className="flex items-center gap-2"><MessageSquare size={12} className="text-[#D4AF37]" /> WhatsApp Host</span>
                          <span>918822077515</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Error Indicator (Retry Trigger) */}
                  {hasError && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/[0.02] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 text-[#B5B5B5] text-xs">
                        <AlertTriangle size={15} className="text-red-500" />
                        <span>Transmission timed out. Please retry.</span>
                      </div>
                      <button
                        onClick={handleRetry}
                        className="px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-xs text-[#D4AF37] transition-all flex items-center gap-1.5 cursor-none md:cursor-pointer shrink-0"
                      >
                        <RotateCcw size={12} />
                        Retry
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Input form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-4 border-t border-white/5 bg-black/20 flex flex-col gap-2 shrink-0"
            >
              {/* Floating suggested chips bar if conversation started */}
              {messages.length > 0 && !isApiKeyMissing && !isTyping && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(chip)}
                      className="px-3 py-1 rounded-full border border-white/5 hover:border-[#D4AF37]/30 bg-white/[0.01] text-[10px] text-[#B5B5B5]/60 hover:text-white transition-all duration-300 shrink-0 cursor-none md:cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask the concierge..."
                  aria-label="Ask the concierge"
                  className="w-full pl-4 pr-12 py-3 rounded-full border border-white/10 bg-black/40 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50 transition-colors"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-[#D4AF37] text-black hover:bg-[#CFAE5B] flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-[#D4AF37] focus:outline-none min-h-[36px] min-w-[36px] cursor-none md:cursor-pointer"
                  aria-label="Send Message"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
