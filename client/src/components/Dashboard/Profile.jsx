import { useAuth } from '../../context/AuthContext.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';

function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    farmSize: user?.farmSize || '',
    address: user?.location?.address || '',
    city: user?.location?.city || '',
    state: user?.location?.state || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API update
    setTimeout(() => {
        toast.success('Intelligence Profile Updated');
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      {/* Avatar Card */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{
            width: '120px', height: '120px', borderRadius: '50%', background: '#f0fdf4',
            border: '4px solid #2c5f2d', margin: '0 auto 20px auto', overflow: 'hidden'
        }}>
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="avatar" />
        </div>
        <h3 style={{ margin: '0 0 5px 0' }}>{user?.name}</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{user?.email}</p>
        
        <div style={{ marginTop: '20px', padding: '5px 15px', background: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
            Verified Farmer
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#94a3b8' }}>Account Type</span>
                <span style={{ fontWeight: 'bold', color: '#1a3a1a' }}>{user?.role?.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#94a3b8' }}>Member Since</span>
                <span style={{ fontWeight: 'bold', color: '#1a3a1a' }}>{new Date(user?.createdAt).getFullYear()}</span>
            </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="card">
        <h3 style={{ margin: '0 0 25px 0' }}>Farm Intelligence Profile</h3>
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
                    <input name="name" className="input-field" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                    <input name="phone" className="input-field" value={formData.phone} onChange={handleChange} />
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Farm Size (Acres)</label>
                <input name="farmSize" type="number" className="input-field" value={formData.farmSize} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>City</label>
                    <input name="city" className="input-field" value={formData.city} onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>State</label>
                    <input name="state" className="input-field" value={formData.state} onChange={handleChange} />
                </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? 'Updating...' : 'Save Intelligence Profile'}
            </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
