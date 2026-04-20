import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import Loader from '../Loader.jsx';
import { formatDate } from '../../services/helpers.js';

function History() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = history;
    if (search) {
      filtered = filtered.filter(item => 
        item.results.some(r => r.diseaseName.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (dateFilter) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt).toLocaleDateString('en-CA') === dateFilter
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.overallResult === statusFilter);
    }
    setFilteredHistory(filtered);
  }, [search, dateFilter, statusFilter, history]);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/detection/history');
      setHistory(res.data.history);
      setFilteredHistory(res.data.history);
    } catch (error) {} finally { setLoading(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
            <input 
                className="input-field"
                placeholder="Search by disease..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div style={{ minWidth: '160px' }}>
            <input 
                type="date" 
                className="input-field"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
            />
        </div>
        <div style={{ minWidth: '160px' }}>
            <select 
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">All Status</option>
                <option value="Healthy">Healthy</option>
                <option value="Diseased">Diseased</option>
            </select>
        </div>
        <button onClick={() => { setSearch(''); setDateFilter(''); setStatusFilter('all'); }} className="btn btn-outline" style={{ padding: '10px 20px' }}>
            Reset
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
          <p style={{ fontWeight: '600' }}>No diagnostic records found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredHistory.map((scan) => (
            <div key={scan._id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '56px', height: '56px', borderRadius: '16px', 
                      background: scan.overallResult === 'Healthy' ? '#ecfdf5' : '#fff1f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' 
                    }}>
                        {scan.overallResult === 'Healthy' ? '🌿' : '🥀'}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>{formatDate(scan.createdAt)}</p>
                        <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#0f172a' }}>{scan.results[0]?.diseaseName || 'General Scan'}</h4>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{
                        padding: '6px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: '800',
                        background: scan.overallResult === 'Healthy' ? '#ecfdf5' : '#fee2e2',
                        color: scan.overallResult === 'Healthy' ? '#059669' : '#b91c1c'
                    }}>
                        {scan.overallResult.toUpperCase()}
                    </span>
                    <button 
                        onClick={() => setSelectedScan(selectedScan === scan._id ? null : scan._id)}
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        {selectedScan === scan._id ? 'Close' : 'View Report'}
                    </button>
                </div>
              </div>

              {selectedScan === scan._id && (
                <div className="animate-fade-in" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      {scan.results.map((r, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                           <p style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>{r.diseaseName}</p>
                           <p style={{ fontSize: '14px', color: '#475569', marginBottom: '12px', lineHeight: '1.6' }}><strong>Treatment:</strong> {r.treatment}</p>
                           <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.6' }}><strong>Prevention:</strong> {r.prevention}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
