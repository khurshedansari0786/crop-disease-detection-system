import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        toast.success('Profile Updated');
        setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '80px 5%', minHeight: '80vh', background: '#f4f7f4' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '30px', color: '#1a3a1a' }}>My Farmer Profile</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
           <div style={{ textAlign: 'center' }}>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                alt="avatar" 
                style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#ecfdf5', border: '4px solid #2c5f2d' }} 
              />
              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{user?.role?.toUpperCase()}</p>
           </div>

           <form onSubmit={handleUpdate} style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Name</label>
                <input type="text" defaultValue={user?.name} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
                <input type="email" value={user?.email} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone Number</label>
                <input type="text" defaultValue={user?.phone} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </div>

              <button type="submit" disabled={loading} style={{ 
                background: '#2c5f2d', color: 'white', padding: '12px 30px', borderRadius: '8px', 
                border: 'none', fontWeight: 'bold', cursor: 'pointer' 
              }}>
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
