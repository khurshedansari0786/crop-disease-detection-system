import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Overview', icon: '📊', path: '/dashboard' },
    { name: 'Detection', icon: '📸', path: '/dashboard/detect' },
    { name: 'Crop Planner', icon: '🌱', path: '/dashboard/planner' },
    { name: 'History', icon: '📜', path: '/dashboard/history' },
    { name: 'Resources', icon: '📚', path: '/dashboard/resources' },
    { name: 'Profile', icon: '👤', path: '/dashboard/profile' },
  ];

  const activeItem = menuItems.find(item => item.path === location.pathname) || menuItems[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f4' }}>
      {/* Sidebar - Desktop */}
      <aside style={{
        width: '260px',
        background: '#1a3a1a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }} className="sidebar-desktop">
        <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/farmguru-logo.png" alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />
            <h1 style={{ color: 'white', fontSize: '20px', margin: 0 }}>FarmGuru</h1>
        </div>

        <nav style={{ flex: 1, padding: '20px 10px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#7ecb3a' : 'rgba(255,255,255,0.7)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: '600',
                  marginBottom: '5px',
                  transition: 'all 0.2s'
                }}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#7ecb3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.name?.[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Farmer</p>
              </div>
           </div>
           <button onClick={() => { logout(); navigate('/login'); }} style={{
             width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
             background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '13px'
           }}>
             🚪 Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '30px',
        maxWidth: '100%'
      }} className="main-content">
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#1a3a1a' }}>{activeItem.name}</h2>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Welcome back, {user?.name}!</p>
           </div>
           <div style={{ fontSize: '14px', color: '#2c5f2d', fontWeight: 'bold', background: 'white', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              📅 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
           </div>
        </header>
        
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px',
        background: '#1a3a1a', color: 'white', display: 'none',
        justifyContent: 'space-around', alignItems: 'center', zIndex: 1000
      }} className="mobile-nav">
        {menuItems.slice(0, 4).map((item) => (
          <Link key={item.path} to={item.path} style={{ textAlign: 'center', textDecoration: 'none', color: location.pathname === item.path ? '#7ecb3a' : 'white' }}>
            <div style={{ fontSize: '20px' }}>{item.icon}</div>
            <div style={{ fontSize: '10px' }}>{item.name}</div>
          </Link>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .main-content { margin-left: 0 !important; padding-bottom: 80px !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default DashboardLayout;
