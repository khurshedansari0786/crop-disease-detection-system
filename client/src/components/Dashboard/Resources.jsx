import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import Loader from '../Loader.jsx';

function Resources() {
  const [lang, setLang] = useState('hi');
  const [schemes, setSchemes] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('schemes');

  useEffect(() => {
    fetchSchemes();
  }, [lang]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await API.post('/chatbot/schemes', { category: 'general', state: 'India', language: lang });
      if (res.data.success) setSchemes(res.data.schemes);
    } catch (e) {} finally { setLoading(false); }
  };

  const pesticides = [
    { name: 'Neem Oil', target: 'Aphids, Mites', type: 'Organic', dosage: '2-3ml per liter' },
    { name: 'Copper Oxychloride', target: 'Blight, Downy Mildew', type: 'Fungicide', dosage: '2g per liter' },
    { name: 'Imidacloprid', target: 'Sucking insects', type: 'Insecticide', dosage: '0.5ml per liter' },
    { name: 'Mancozeb', target: 'Fungal diseases', type: 'Fungicide', dosage: '2.5g per liter' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
         <button onClick={() => setActiveTab('schemes')} style={{
             background: 'none', border: 'none', padding: '10px 20px', borderRadius: '12px',
             fontWeight: 'bold', color: activeTab === 'schemes' ? '#10b981' : '#64748b',
             background: activeTab === 'schemes' ? '#ecfdf5' : 'transparent', cursor: 'pointer'
         }}>🏛️ Govt Schemes</button>
         <button onClick={() => setActiveTab('pesticides')} style={{
             background: 'none', border: 'none', padding: '10px 20px', borderRadius: '12px',
             fontWeight: 'bold', color: activeTab === 'pesticides' ? '#10b981' : '#64748b',
             background: activeTab === 'pesticides' ? '#ecfdf5' : 'transparent', cursor: 'pointer'
         }}>🧪 Pesticide Database</button>
      </div>

      {activeTab === 'schemes' ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Live Welfare Feed</h4>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                 <button onClick={() => setLang('hi')} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: lang === 'hi' ? 'white' : 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Hindi</button>
                 <button onClick={() => setLang('en')} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: lang === 'en' ? 'white' : 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>English</button>
              </div>
           </div>
           {loading ? <Loader /> : (
             <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#475569', fontSize: '15px' }}>
                {schemes}
             </div>
           )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {pesticides.map((p, i) => (
            <div key={i} style={{ background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{p.name}</h4>
                  <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', color: '#64748b' }}>{p.type}</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                     <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Target Problems</p>
                     <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontWeight: '600' }}>{p.target}</p>
                  </div>
                  <div>
                     <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Recommended Dosage</p>
                     <p style={{ margin: '4px 0 0 0', color: '#10b981', fontWeight: '700' }}>{p.dosage}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resources;
