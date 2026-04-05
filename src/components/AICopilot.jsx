import React, { useState, useRef, useEffect } from 'react';

export default function AICopilot({ store }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hi! I'm your BnB Store Co-Pilot. How can I help optimize ${store?.store_name || 'your store'} today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Optimistic UI update
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // Simulated AI Backend Response
    setTimeout(() => {
      let aiResponse = "I've analyzed your store data. It looks like your RTO rate is stable this week, but pushing pre-paid orders by offering a 5% discount could massively improve delivery ratios!";
      
      if (input.toLowerCase().includes('product')) {
        aiResponse = "Your highest revenue product right now is generating solid margins, but the logistics cost on SKU 'A-12' is eating into your net profit. Consider raising the SP or renegotiating shipping.";
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', boxSizing: 'border-box' }}>
      <div id="ai-summary-box" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', color: '#a78bfa', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%', boxShadow: '0 0 8px #a78bfa' }}></span>
          Gemini AI Executive Summary
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#e4e4e7', fontStyle: 'italic' }}>
          "Analyzing store health... Cash on Delivery (COD) ratio is at 62%. Warning: Potential margin leak detected in regional shipping costs."
        </div>
      </div>
      
      <div style={{ fontSize: '12px', fontWeight: '700', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💬</span> Chat with Store Co-Pilot
      </div>
      
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '8px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
            color: msg.role === 'user' ? '#000' : 'var(--text-main)',
            padding: '10px 14px', 
            borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', 
            maxWidth: '85%',
            fontSize: '13px',
            lineHeight: '1.5',
            fontWeight: msg.role === 'user' ? '500' : '400'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '12px', padding: '10px 14px' }}>
            <span>Co-Pilot is typing...</span>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', background: '#18181b', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about your store..." 
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '13px' }} 
        />
        <button onClick={handleSend} style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
}
