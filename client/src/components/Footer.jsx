function Footer() {
  return (
    <footer style={{
      background: '#1a3a1a',
      color: 'white',
      textAlign: 'center',
      padding: '40px 20px',
      marginTop: '50px',
      borderTop: '4px solid #2c5f2d'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <img src="/farmguru-logo.png" alt="FarmGuru Logo" style={{ height: '50px' }} />
      </div>
      <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>&copy; 2024 FarmGuru - Crop Disease Detection System. All rights reserved.</p>
      <p style={{ color: '#9ca3af' }}>Your trusted partner in modern farming & crop protection.</p>
    </footer>
  );
}

export default Footer;