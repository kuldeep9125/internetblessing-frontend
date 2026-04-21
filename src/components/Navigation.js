import React from 'react';
import { Link } from 'react-router-dom';

function Navigation({ token, user, onLogout }) {
  return (
    <nav>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        🎥 InternetBlessing
      </Link>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/videos">Videos</Link>
        <Link to="/products">Courses</Link>
        {token && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/automation" style={{ color: '#a78bfa' }}>⚙️ Pipeline</Link>
        {token ? (
          <>
            <span>{user?.username}</span>
            <button
              onClick={onLogout}
              style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
