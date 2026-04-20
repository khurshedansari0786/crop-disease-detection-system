import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      padding: '15px 5%', 
      background: '#2c5f2d', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img src="/farmguru-logo.png" alt="Logo" style={{ height: '40px' }} />
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          FarmGuru
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
  
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
            <Link to="/history" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>History</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
            <button onClick={handleLogout} style={{
              background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', 
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
            <Link to="/register" style={{ background: 'white', color: '#2c5f2d', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Join Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;