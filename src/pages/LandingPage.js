import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [channelStats, setChannelStats] = useState(null);

  useEffect(() => {
    fetch('/api/analytics/summary/today')
      .then(r => r.json())
      .then(data => setChannelStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="landing">
      {/* Hero */}
      <h1>🎥 InternetBlessing</h1>
      <p>Automated viral content creation. Auto-generate, upload, and monetize videos 24/7.</p>

      {channelStats && (
        <div style={{ display: 'inline-flex', gap: '2rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.75rem 2rem', borderRadius: '2rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <span>👥 <strong>{Number(channelStats.totalSubscribers || 700).toLocaleString()}</strong> Subscribers</span>
          <span>👀 <strong>{Number(channelStats.totalViews || 0).toLocaleString()}</strong> Views</span>
          <span>🎬 <strong>{channelStats.videosUploaded || 0}</strong> Videos</span>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/videos" className="cta-button">🎬 Watch Videos</Link>
        <Link to="/products" className="cta-button" style={{ backgroundColor: '#764ba2' }}>📚 Explore Courses</Link>
      </div>

      {/* How It Works */}
      <div style={{ marginTop: '5rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>How It Works</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem' }}>Fully automated from discovery to monetization</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { icon: '🔍', step: '1', title: 'Discover', desc: 'AI finds trending content from TikTok, Instagram, Reddit, Twitter & more' },
            { icon: '⚙️', step: '2', title: 'Process', desc: 'AI adds commentary, generates eye-catching thumbnails & edits video' },
            { icon: '📤', step: '3', title: 'Upload', desc: 'Videos auto-upload to YouTube with monetization & SEO optimized' },
            { icon: '💰', step: '4', title: 'Earn', desc: 'Revenue flows in from AdSense, digital products & memberships' },
          ].map(item => (
            <div key={item.step} style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.75rem', color: '#ff6b35', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Step {item.step}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Streams */}
      <div style={{ marginTop: '4rem', padding: '3rem 2rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '1rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💵 Multiple Income Streams</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Don't rely on just one revenue source</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '📺', title: 'YouTube AdSense', desc: 'Earn from every view automatically. Target: $1,000+/month', color: '#ff0000' },
            { icon: '📚', title: 'Digital Courses', desc: 'Sell your knowledge. $27–$97 per sale with zero inventory', color: '#ff6b35' },
            { icon: '⭐', title: 'Memberships', desc: 'Recurring monthly income from your most loyal fans', color: '#764ba2' },
            { icon: '🔗', title: 'Affiliate Links', desc: 'Earn commissions from tools & products you recommend', color: '#667eea' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'left', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <h3 style={{ color: item.color, marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>🚀 Ready to Start Earning?</h2>
        <Link to="/products" className="cta-button" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
          View Courses & Products
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
