import React, { useState, useRef, useEffect } from 'react';

export default function AICopilot({ store }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hi! I'm your Store Co-Pilot. How can I help optimize **${store?.store_name || 'your store'}** today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "I've analyzed your store data. Your RTO rate is stable this week, but pushing pre-paid orders by offering a 5% discount could massively improve your delivery ratios!";

      if (input.toLowerCase().includes('product')) {
        aiResponse = "Your highest revenue product is generating solid margins, but logistics cost on SKU 'A-12' is eating into net profit. Consider raising the SP or renegotiating shipping.";
      } else if (input.toLowerCase().includes('revenue') || input.toLowerCase().includes('profit')) {
        aiResponse = "Revenue is trending upward week-over-week. Your COD ratio at 62% is contributing to margin pressure. Even a 10% shift to prepaid could add ₹12,000+ to monthly net profit.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* AI Summary Box */}
      <div style={{
        margin: '20px 20px 0',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '14px 16px',
        borderRadius: '12px',
      }}>
        <div style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', boxShadow: '0 0 8px #a78bfa', animation: 'pulse-glow 2s ease infinite' }} />
          Gemini AI Executive Summary
        </div>
        <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#c4b5fd', fontStyle: 'italic' }}>
          "COD ratio at 62% — potential margin leak detected. Prepaid adoption push recommended this week."
        </div>
      </div>

      {/* Chat Label */}
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', padding: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        💬 Chat with Co-Pilot
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className={`chat-avatar ${msg.role}`}>
              {msg.role === 'ai' ? '✨' : (store?.store_name?.charAt(0) || 'U')}
            </div>
            <div className={`chat-bubble ${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message ai">
            <div className="chat-avatar ai">✨</div>
            <div className="chat-bubble ai">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--surface)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about revenue, products, RTO..."
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '13px', fontFamily: 'inherit' }}
          />
          <button
            onClick={handleSend}
            style={{
              background: input.trim() ? 'var(--primary-gradient)' : 'var(--surface-2)',
              color: input.trim() ? '#000' : 'var(--text-dim)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
