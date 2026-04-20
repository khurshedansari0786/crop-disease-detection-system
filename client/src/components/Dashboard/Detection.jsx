import { useState, useRef } from 'react';
import API from '../../services/api.js';
import toast from 'react-hot-toast';

function Detection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const cameraInputRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!image) return toast.error('Please select an image first');
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await API.post('/detection/predict', formData);
      setResult(response.data.detection);
      toast.success('Diagnosis Complete!');
    } catch (err) {
      toast.error('Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
      {/* Upload Side */}
      <div className="glass-card" style={{ background: 'white' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--primary-dark)' }}>AI Field Scanner</h3>
        
        <div 
          onClick={() => fileInputRef.current.click()}
          style={{
            width: '100%', aspectRatio: '4/3', background: '#f8fafc', 
            border: '2px dashed #cbd5e1', borderRadius: '20px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden', position: 'relative'
          }}
        >
          {preview ? (
            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <span style={{ fontSize: '48px' }}>📸</span>
              <p style={{ fontWeight: '600', marginTop: '10px' }}>Click to Upload or Take Photo</p>
            </div>
          )}
          {loading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div className="voice-pulse" style={{ width: '50px', height: '50px', background: 'var(--primary)', borderRadius: '50%' }}></div>
            </div>
          )}
        </div>

        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImage} />
        <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleImage} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
          <button onClick={() => cameraInputRef.current.click()} className="btn btn-blue" style={{ flex: 1 }}>
            📸 Camera
          </button>
          <button onClick={() => fileInputRef.current.click()} className="btn btn-outline" style={{ flex: 1, borderColor: '#cbd5e1', color: '#64748b' }}>
            📁 Gallery
          </button>
        </div>

        <button 
          onClick={handleScan} 
          disabled={!image || loading} 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '12px' }}
        >
          {loading ? 'Analyzing...' : '🔍 Analyze Crop Health'}
        </button>
      </div>

      {/* Result Side */}
      <div className="glass-card" style={{ background: 'white' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--secondary-dark)' }}>Health Intelligence</h3>
        
        {result ? (
          <div className="animate-up">
            <div style={{ 
              padding: '20px', background: result.status === 'Healthy' ? '#ecfdf5' : '#fef2f2', 
              borderRadius: '16px', border: `1px solid ${result.status === 'Healthy' ? '#10b981' : '#f87171'}`,
              marginBottom: '24px'
            }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: result.status === 'Healthy' ? '#059669' : '#b91c1c', textTransform: 'uppercase' }}>Detected Condition</span>
                <h4 style={{ fontSize: '24px', margin: '6px 0' }}>{result.diseaseName}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                   <div style={{ height: '8px', width: '120px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${result.confidence}%`, background: 'var(--primary)' }}></div>
                   </div>
                   <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>{result.confidence}% Match</span>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '8px' }}>📝 Assessment</h5>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>{result.description}</p>
            </div>

            <div>
              <h5 style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '8px' }}>💊 Treatment Protocol</h5>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                 <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.treatment?.map((t, i) => (
                      <li key={i} style={{ fontSize: '13px', color: '#475569' }}>{t}</li>
                    ))}
                 </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.3 }}>
            <span style={{ fontSize: '72px', marginBottom: '20px' }}>🧬</span>
            <p style={{ fontWeight: '600' }}>Upload crop leaf to generate intelligence report</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detection;
