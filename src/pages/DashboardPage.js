import React, { useState, useEffect } from 'react';

function DashboardPage() {
  const [stats, setStats] = useState({ totalViews: 0, totalEarnings: 0, videosUploaded: 0, totalSubscribers: 700 });
  const [revenue, setRevenue] = useState({ youtube: 0, products: 0, memberships: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, revenueRes] = await Promise.all([
        fetch('/api/analytics/summary/today'),
        fetch('/api/analytics/revenue/breakdown')
      ]);
      const statsData = await statsRes.json();
      const revenueData = await revenueRes.json();
      if (statsData && !statsData.error) setStats(statsData);
      if (revenueData && !revenueData.error) setRevenue(revenueData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.2rem' }}>⏳ Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1 style={{ marginBottom: '0.5rem' }}>📊 Dashboard</h1>
      <p style={{ color: '#999', marginBottom: '2rem' }}>Your InternetBlessing platform overview</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">👀 Total Views Today</div>
          <div className="stat-card-value">{(stats.totalViews || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">🎬 Videos Uploaded</div>
          <div className="stat-card-value">{stats.videosUploaded || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">👥 Subscribers</div>
          <div className="stat-card-value">{(stats.totalSubscribers || 700).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">💰 Earnings Today</div>
          <div className="stat-card-value">${(stats.totalEarnings || 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>💵 Revenue Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.5rem' }}>📺 YouTube AdSense</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ff6b35' }}>${(revenue.youtube || 0).toFixed(2)}</div>
          </div>
          <div>
            <div style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.5rem' }}>📦 Digital Products</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ff6b35' }}>${(revenue.products || 0).toFixed(2)}</div>
          </div>
          <div>
            <div style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.5rem' }}>⭐ Memberships</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ff6b35' }}>${(revenue.memberships || 0).toFixed(2)}</div>
          </div>
          <div style={{ borderLeft: '2px solid #ff6b35', paddingLeft: '1.5rem' }}>
            <div style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.5rem' }}>🏆 TOTAL</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ff6b35' }}>${(revenue.total || 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>⚡ Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🤖', title: 'Run Automation', desc: 'Scrape & process trending videos' },
            { icon: '📤', title: 'Upload to YouTube', desc: 'Push processed videos live' },
            { icon: '📧', title: 'Send Email Campaign', desc: 'Notify subscribers of new content' },
            { icon: '📊', title: 'View Analytics', desc: 'Check YouTube Studio stats' },
          ].map((action) => (
            <div key={action.title} style={{ backgroundColor: '#0f0f0f', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #333', cursor: 'pointer', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6b35'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{action.icon}</div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{action.title}</div>
              <div style={{ color: '#999', fontSize: '0.8rem' }}>{action.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Checklist */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>✅ Setup Checklist</h2>
        {[
          { done: true,  label: 'Website live at localhost:3000' },
          { done: true,  label: 'Backend API running at port 5000' },
          { done: false, label: 'Add YouTube API key in .env' },
          { done: false, label: 'Add Stripe keys in .env for payments' },
          { done: false, label: 'Set up Python automation engine' },
          { done: false, label: 'Deploy to internetblessing.com' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #222' }}>
            <span style={{ fontSize: '1.25rem' }}>{item.done ? '✅' : '⬜'}</span>
            <span style={{ color: item.done ? '#fff' : '#999' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
