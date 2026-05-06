import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight } from 'lucide-react';

export default function CopilotChat({ store, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your Pocket Dashboard AI Co-Pilot. I constantly monitor ${store?.store_name || 'your store'}'s data. What would you like to know about your business today?`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store?.id,
          messages: newMessages.filter(m => m.role !== 'system')
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to get AI response');

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Oops! I had trouble connecting to the brain. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      />
      
      {/* Slide-out panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
        width: '100%', maxWidth: '420px',
        background: 'rgba(10,10,16,0.95)',
        backdropFilter: 'blur(30px) saturate(150%)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .typing-dot {
            width: 5px; height: 5px; border-radius: 50%;
            background: rgba(255,255,255,0.6);
            animation: typingPulse 1.4s infinite ease-in-out both;
          }
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }
          @keyframes typingPulse {
            0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(90deg, rgba(167,139,250,0.05), transparent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px -5px rgba(167,139,250,0.5)'
            }}>
              <Sparkles size={18} color="#000" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: 'Outfit' }}>AI Co-Pilot</h3>
              <div style={{ fontSize: '11px', color: 'rgba(45,212,160,0.9)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dd4a0' }} />
                Online & Analyzing
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Suggested Prompts (only if no user messages yet) */}
        {messages.length === 1 && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)', fontWeight: 700 }}>Suggested Questions</p>
            {[
              "What is my exact net profit this week?",
              "Which 3 products have the highest RTO rate?",
              "Am I losing money on any ad campaigns right now?"
            ].map((q, i) => (
              <button 
                key={i}
                onClick={() => setInput(q)}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  padding: '10px 14px', borderRadius: '8px', color: 'var(--text-muted)',
                  fontSize: '12.5px', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.2s, border-color 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                {q} <ArrowRight size={14} style={{ opacity: 0.5 }} />
              </button>
            ))}
          </div>
        )}

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: msg.role === 'assistant' ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${msg.role === 'assistant' ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {msg.role === 'assistant' ? <Bot size={16} color="rgba(167,139,250,0.9)" /> : <User size={16} color="rgba(255,255,255,0.8)" />}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                padding: msg.role === 'user' ? '10px 14px' : '4px 0',
                borderRadius: '12px', borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderTopLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                color: '#e2e8f0', fontSize: '13.5px', lineHeight: 1.6, maxWidth: '85%'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={16} color="rgba(167,139,250,0.9)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 0' }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,16,0.95)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '6px'
          }}>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your data..."
              style={{
                flex: 1, background: 'transparent', border: 'none', color: '#fff',
                padding: '8px 10px', fontSize: '13px', outline: 'none', fontFamily: 'Inter'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.05)',
                color: input.trim() ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.3)',
                border: 'none', borderRadius: '8px', padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10.5px', color: 'var(--text-dim)' }}>
            AI can make mistakes. Always verify profit calculations.
          </div>
        </div>
      </div>
    </>
  );
}
