import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import Loader from '../Loader.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, healthy: 0, diseased: 0 });
  const [weather, setWeather] = useState(null);
  const [mandiPrices, setMandiPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, weatherRes, mandiRes] = await Promise.all([
          API.get('/detection/stats'),
          API.get('/weather/current'),
          API.get('/mandi/latest')
        ]);
        setStats(statsRes.data.stats);
        setWeather(weatherRes.data);
        setMandiPrices(mandiRes.data.prices || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="animate-fade">
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Total Scans', value: stats.total, color: '#2c5f2d', icon: '🔍' },
          { label: 'Healthy Crops', value: stats.healthy, color: '#4a9e2a', icon: '✅' },
          { label: 'Issues Found', value: stats.diseased, color: '#d94040', icon: '⚠️' }
        ].map((item, i) => (
          <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.label}</p>
              <h3 style={{ margin: '5px 0 0', fontSize: '32px', color: item.color }}>{item.value}</h3>
            </div>
            <span style={{ fontSize: '40px', opacity: 0.2 }}>{item.icon}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Weather Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #2c5f2d, #1a3a1a)', color: 'white' }}>
          <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: '18px' }}>Climate Monitor</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h2 style={{ color: 'white', fontSize: '48px', margin: 0 }}>{weather?.main?.temp}°C</h2>
               <p style={{ color: '#7ecb3a', margin: 0, fontWeight: 'bold' }}>{weather?.weather[0]?.description}</p>
            </div>
            <img src={`http://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} alt="weather" />
          </div>
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Humidity</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{weather?.main?.humidity}%</p>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Wind</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{weather?.wind?.speed} km/h</p>
             </div>
          </div>
        </div>

        {/* Mandi Card */}
        <div className="card">
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Mandi Prices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {mandiPrices.map((item, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8faf8', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#2c5f2d' }}>{item.crop}</span>
                  <span style={{ fontWeight: '800' }}>₹{item.price}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
