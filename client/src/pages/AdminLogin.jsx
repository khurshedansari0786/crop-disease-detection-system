import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import toast from 'react-hot-toast';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/admin-login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        toast.success('Admin Session Authorized');
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access Denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
        minHeight: '100vh', 
        background: '#0a1a0a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px' 
    }}>
      <div className="card animate-fade" style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '40px', 
          background: '#1a3a1a', 
          border: '1px solid #7ecb3a33',
          textAlign: 'center'
      }}>
        <div style={{ marginBottom: '30px' }}>
           <div style={{ 
             width: '60px', height: '60px', background: '#7ecb3a', borderRadius: '12px', margin: '0 auto 20px auto',
             display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px'
           }}>🛡️</div>
           <h2 style={{ color: 'white', margin: 0 }}>Terminal Access</h2>
           <p style={{ color: '#7ecb3a', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px' }}>Admin Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7ecb3a', textTransform: 'uppercase', marginBottom: '5px' }}>Identity</label>
            <input 
                type="email" 
                className="input-field" 
                style={{ background: '#0a1a0a', border: '1px solid #7ecb3a33', color: 'white' }}
                placeholder="admin@farmguru.ai"
                onChange={e => setEmail(e.target.value)} 
                required 
            />
          </div>
          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7ecb3a', textTransform: 'uppercase', marginBottom: '5px' }}>Access Key</label>
            <input 
                type="password" 
                className="input-field" 
                style={{ background: '#0a1a0a', border: '1px solid #7ecb3a33', color: 'white' }}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} 
                required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', background: '#7ecb3a', color: '#1a3a1a' }}>
            {loading ? 'Verifying...' : 'Initialize Session'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
