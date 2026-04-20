import { useState } from 'react';
import API from '../../services/api.js';
import Loader from '../Loader.jsx';
import toast from 'react-hot-toast';

function CropPlanner() {
  const [lang, setLang] = useState('hi');
  const [crop, setCrop] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const generatePlan = async () => {
    if (!crop) return toast.error('Please enter a crop name');
    setLoading(true);
    try {
      const res = await API.post('/chatbot/smart-plan', {
        crop, location: 'India', language: lang
      });
      if (res.data.success) {
        setPlan(res.data.plan);
        setChatHistory([{ role: 'system', msg: `Expert AI plan generated for ${crop}. You can now ask specific follow-up questions.` }]);
      }
    } catch (error) {
      toast.error('Plan generation service unavailable.');
    } finally { setLoading(false); }
  };

  const handleChat = async () => {
    if (!chatInput || chatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', msg: userMsg }]);
    setChatLoading(true);
    try {
      const res = await API.post('/chatbot/smart-plan-chat', {
        question: userMsg, crop, location: 'India', language: lang
      });
      if (res.data.success) {
        setChatHistory(prev => [...prev, { role: 'agent', msg: res.data.reply }]);
      }
    } catch (err) {
      toast.error('Expert response failed.');
    } finally { setChatLoading(false); }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Input Header */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
           <h3 style={{ fontSize: '20px' }}>AI Cultivation Intelligence</h3>
           <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
              {['hi', 'en'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: lang === l ? 'white' : 'transparent',
                    color: lang === l ? '#10b981' : '#64748b',
                    fontWeight: '700', fontSize: '13px', transition: 'all 0.2s',
                    boxShadow: lang === l ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {l === 'hi' ? 'हिंदी' : 'English'}
                </button>
              ))}
           </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
           <input 
             className="input-field"
             placeholder="Enter crop name (e.g. Tomato, Wheat, Mustard)..."
             value={crop}
             onChange={e => setCrop(e.target.value)}
             style={{ flex: 1, minWidth: '280px' }}
           />
           <button onClick={generatePlan} disabled={loading} className="btn btn-primary" style={{ padding: '0 32px' }}>
              {loading ? 'Analyzing...' : 'Generate Plan'}
           </button>
        </div>
      </div>

      {plan && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
           {/* Detailed Plan Area */}
           <div className="glass-card" style={{ padding: '32px' }}>
              <h4 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '24px' }}>Step-by-Step Guide for {crop}</h4>
              <div style={{ 
                background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0',
                color: '#475569', fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap'
              }}>
                {plan}
              </div>
           </div>

           {/* AI Follow-up Chat Area */}
           <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '600px' }}>
              <h4 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px' }}>Ask follow-up questions</h4>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px', marginBottom: '20px' }}>
                {chatHistory.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    background: m.role === 'user' ? '#10b981' : '#f1f5f9',
                    color: m.role === 'user' ? 'white' : '#1e293b',
                    padding: '12px 16px', borderRadius: '16px', maxWidth: '85%', fontSize: '14px'
                  }}>
                    {m.msg}
                  </div>
                ))}
                {chatLoading && <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI is thinking...</div>}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <input 
                   className="input-field" 
                   placeholder="Ask about fertilizer, water, etc..." 
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   onKeyPress={e => e.key === 'Enter' && handleChat()}
                 />
                 <button onClick={handleChat} disabled={chatLoading} className="btn btn-primary" style={{ padding: '0 16px' }}>➤</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default CropPlanner;
