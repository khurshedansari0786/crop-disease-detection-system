import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import Loader from '../components/Loader.jsx';
import { formatDate } from '../services/helpers.js';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [fertilizerShops, setFertilizerShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    getUserLocation();
    fetchMandiPrices();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        API.get('/detection/dashboard'),
        API.get('/detection/history')
      ]);
      setStats(statsRes.data.stats);
      setRecentScans(historyRes.data.history.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setLocationStatus('denied');
      setWeatherLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Location obtained:", latitude, longitude);
        setUserLocation({ lat: latitude, lon: longitude });
        setLocationStatus('granted');
        await fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setLocationStatus('denied');
        setWeatherLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    try {
      const res = await API.get(`/weather/current/${lat}/${lon}`);
      if (res.data.success) {
        setWeather(res.data.weather);
      } else {
        setWeather(null);
      }
    } catch (error) {
      console.error("Weather API error:", error);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchMandiPrices = async () => {
    try {
      const res = await API.get('/mandi/prices');
      setMandiPrices(res.data.prices.slice(0, 6));
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
      setMandiPrices([
        { crop: 'Wheat', price: 2275, unit: 'quintal', trend: 'up' },
        { crop: 'Rice', price: 2180, unit: 'quintal', trend: 'stable' },
        { crop: 'Maize', price: 1960, unit: 'quintal', trend: 'down' },
        { crop: 'Potato', price: 1250, unit: 'quintal', trend: 'up' },
        { crop: 'Tomato', price: 1850, unit: 'quintal', trend: 'up' },
        { crop: 'Onion', price: 2150, unit: 'quintal', trend: 'down' }
      ]);
    }
  };

  const getSeasonalCrops = () => {
    const month = new Date().getMonth();
    
    let season = '';
    let seasonMonths = '';
    let crops = [];
    let vegetables = [];
    let tips = '';

    if (month >= 10 || month <= 1) {
      season = 'Rabi (Winter)';
      seasonMonths = 'October - January';
      crops = ['🌾 Wheat (गेहूं)', '🌿 Mustard (सरसों)', '🫘 Chickpea (चना)', '🌾 Barley (जौ)', '🟢 Peas (मटर)'];
      vegetables = ['🥬 Cauliflower', '🥦 Cabbage', '🥕 Carrot', '🧅 Onion', '🧄 Garlic'];
      tips = 'Start sowing in October-November. Apply DAP at sowing time.';
    } 
    else if (month >= 2 && month <= 3) {
      season = 'Zaid (Spring)';
      seasonMonths = 'February - March';
      crops = ['🍉 Watermelon', '🍈 Muskmelon', '🥒 Cucumber', '🫘 Moong', '🌿 Sesame'];
      vegetables = ['🍅 Tomato', '🫑 Bell Pepper', '🍆 Brinjal', '🌶️ Chili'];
      tips = 'Use mulch to retain moisture. Ideal for vegetables.';
    }
    else if (month >= 4 && month <= 6) {
      season = 'Summer';
      seasonMonths = 'April - June';
      crops = ['🍉 Watermelon', '🍈 Muskmelon', '🌿 Sunflower', '🫘 Cowpea', '🌽 Maize'];
      vegetables = ['🍅 Tomato', '🫑 Bell Pepper', '🍆 Brinjal', '🌶️ Chili'];
      tips = 'Increase irrigation frequency. Provide shade for young plants.';
    }
    else {
      season = 'Kharif (Monsoon)';
      seasonMonths = 'July - September';
      crops = ['🌾 Rice (धान)', '🌽 Maize (मक्का)', '🟡 Soybean (सोयाबीन)', '🥜 Groundnut (मूंगफली)', '🌿 Cotton (कपास)'];
      vegetables = ['🌶️ Chili', '🍆 Brinjal', '🎃 Pumpkin', '🥬 Spinach'];
      tips = 'Ensure proper drainage. Watch for fungal diseases.';
    }

    return { season, seasonMonths, crops, vegetables, tips };
  };

  const seasonalData = getSeasonalCrops();

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return '#10b981';
    if (trend === 'down') return '#ef4444';
    return '#f59e0b';
  };

  if (loading) return <Loader />;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0e8 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
              color: '#1a3a1a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>🌾</span> Farmer's Dashboard
            </h1>
            <p style={{ color: '#4a5568', marginTop: '5px' }}>
              Welcome back, {user?.name}! Here's your farm at a glance.
            </p>
          </div>
          <div style={{ 
            background: 'white', 
            padding: '10px 20px', 
            borderRadius: '50px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <span style={{ color: '#2c5f2d' }}>📅</span> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(44,95,45,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>Total Scans</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats?.totalScans || 0}</p>
              </div>
              <div style={{ fontSize: '2.5rem', opacity: 0.7 }}>📸</div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(44,95,45,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>Healthy Crops</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>{stats?.healthyScans || 0}</p>
              </div>
              <div style={{ fontSize: '2.5rem', opacity: 0.7 }}>✅</div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(44,95,45,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>Diseases Found</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>{stats?.diseasedScans || 0}</p>
              </div>
              <div style={{ fontSize: '2.5rem', opacity: 0.7 }}>⚠️</div>
            </div>
          </div>
        </div>

        {/* Weather and Mandi Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          
         
          
          
        </div>

        {/* Crop Planning Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid rgba(44,95,45,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #2c5f2d, #1a3a1a)', 
            padding: '15px 20px',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌱</span> Smart Crop Planning - {seasonalData.season}
            </h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px' }}>
                📅 {seasonalData.seasonMonths}
              </p>
            </div>
            
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🌾 Recommended Crops:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {seasonalData.crops.map((crop, idx) => (
                <span key={idx} style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  {crop}
                </span>
              ))}
            </div>
            
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>🥬 Recommended Vegetables:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {seasonalData.vegetables.map((veg, idx) => (
                <span key={idx} style={{
                  background: '#e0f2fe',
                  color: '#1e40af',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  {veg}
                </span>
              ))}
            </div>
            
            <div style={{ 
              background: '#f0fdf4', 
              padding: '12px', 
              borderRadius: '12px',
              fontSize: '0.8rem'
            }}>
              💡 <strong>Farming Tip:</strong> {seasonalData.tips}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid rgba(44,95,45,0.1)'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #2c5f2d, #1a3a1a)', 
            padding: '15px 20px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> Recent Disease Scans
            </h3>
            <button 
              onClick={() => navigate('/history')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              View All →
            </button>
          </div>
          
          <div style={{ padding: '20px' }}>
            {recentScans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6b7280' }}>No scans yet.</p>
                <button 
                  onClick={() => navigate('/predict')}
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    background: '#2c5f2d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Start Your First Scan →
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Disease</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280' }}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScans.map((scan) => (
                      <tr key={scan._id} style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }} onClick={() => navigate('/history')}>
                        <td style={{ padding: '12px' }}>{formatDate(scan.createdAt)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: scan.overallResult === 'Healthy' ? '#dcfce7' : '#fee2e2',
                            color: scan.overallResult === 'Healthy' ? '#166534' : '#991b1b',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            {scan.overallResult}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{scan.results[0]?.diseaseName || '-'}</td>
                        <td style={{ padding: '12px' }}>{scan.results[0]?.confidence || '-'}%</td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px', 
          padding: '20px',
          color: '#6b7280',
          fontSize: '0.75rem'
        }}>
          <p>🌾 Powered by AI | Real-time weather data | Seasonal crop recommendations</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;