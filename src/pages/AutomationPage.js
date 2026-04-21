import React, { useState, useEffect, useCallback } from 'react';

// ── helpers ─────────────────────────────────────────────────────────────────
function timeSince(iso) {
  if (!iso) return 'Never';
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function fmtMB(mb) {
  if (mb >= 1024) return `${(mb/1024).toFixed(1)} GB`;
  return `${mb.toFixed(1)} MB`;
}

// ── sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = '#7c3aed' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 24px',
      borderLeft: `4px solid ${color}`, minWidth: 160,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 14, color: '#e2e8f0', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function FolderCard({ name, data, icon }) {
  if (!data) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 20,
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{icon} {name}</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{data.count} files · {fmtMB(data.total_mb)}</span>
      </div>
      {data.files && data.files.length > 0 ? (
        <div style={{ maxHeight: 180, overflowY: 'auto' }}>
          {data.files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: 13,
            }}>
              <span style={{ color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                {f.name}
              </span>
              <span style={{ color: '#94a3b8', flexShrink: 0 }}>{f.size_mb} MB</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
          Empty — run the pipeline to populate
        </div>
      )}
    </div>
  );
}

function CredBadge({ label, ok }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
      background: ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${ok ? '#10b981' : '#ef4444'}`,
      color: ok ? '#34d399' : '#f87171',
    }}>
      {ok ? '✓' : '✗'} {label}
    </div>
  );
}

function LogViewer({ logs }) {
  return (
    <div style={{
      background: '#0f172a', borderRadius: 10, padding: 16, fontFamily: 'monospace',
      fontSize: 12, color: '#94a3b8', maxHeight: 340, overflowY: 'auto',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {logs && logs.length > 0
        ? [...logs].reverse().map((line, i) => {
            const color = line.includes('ERROR') ? '#f87171'
                        : line.includes('DONE') || line.includes('OK') ? '#34d399'
                        : line.includes('[1/') || line.includes('[2/') || line.includes('[3/') || line.includes('[4/') ? '#60a5fa'
                        : '#94a3b8';
            return <div key={i} style={{ color, marginBottom: 2 }}>{line}</div>;
          })
        : <div style={{ color: '#475569', fontStyle: 'italic' }}>No logs yet. Run the pipeline first.</div>
      }
    </div>
  );
}

// ── main page ────────────────────────────────────────────────────────────────
export default function AutomationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/automation/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchStatus, 10000);
    return () => clearInterval(id);
  }, [fetchStatus, autoRefresh]);

  const pipeline = data?.pipeline || {};
  const folders  = data?.folders  || {};
  const creds    = data?.credentials || {};
  const logs     = data?.logs || [];

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: '#f1f5f9', padding: '32px 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── header ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>⚙️ Automation Dashboard</h1>
            <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 14 }}>
              Live status of the content pipeline
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              {lastRefresh ? `Updated ${timeSince(lastRefresh.toISOString())}` : ''}
            </span>
            <button
              onClick={fetchStatus}
              style={{
                background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8,
                padding: '8px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              }}
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(a => !a)}
              style={{
                background: autoRefresh ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                color: autoRefresh ? '#34d399' : '#94a3b8',
                border: `1px solid ${autoRefresh ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13,
              }}
            >
              {autoRefresh ? '● Live' : '○ Paused'}
            </button>
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading pipeline status…</div>}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
            borderRadius: 10, padding: 16, marginBottom: 24, color: '#fca5a5',
          }}>
            ⚠️ Cannot reach backend API: {error}
            <div style={{ fontSize: 12, marginTop: 6, color: '#94a3b8' }}>
              Make sure the backend is running locally (npm start in website/backend) or check Railway logs.
            </div>
          </div>
        )}

        {data && (
          <>
            {/* ── pipeline stats ──────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
              <StatCard label="Last Run" value={timeSince(pipeline.last_run)} color="#7c3aed" />
              <StatCard label="Scraped"   value={pipeline.videos_scraped   || 0} sub="videos found" color="#2563eb" />
              <StatCard label="Ranked"    value={pipeline.videos_ranked    || 0} sub="by virality"  color="#0891b2" />
              <StatCard label="Processed" value={pipeline.videos_processed || 0} sub="metadata ready" color="#059669" />
              <StatCard label="Uploaded"  value={pipeline.videos_uploaded  || 0} sub="to YouTube"   color="#d97706" />
            </div>

            {/* ── top videos ──────────────────────────────────────── */}
            {pipeline.top_videos && pipeline.top_videos.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20,
                border: '1px solid rgba(255,255,255,0.08)', marginBottom: 28,
              }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 16, color: '#c4b5fd' }}>🔥 Top Videos from Last Run</h2>
                {pipeline.top_videos.map((v, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ color: '#7c3aed', fontWeight: 700, minWidth: 20 }}>#{i+1}</span>
                    <span style={{ flex: 1, fontSize: 14, color: '#e2e8f0' }}>{v.title}</span>
                    <span style={{
                      fontSize: 12, padding: '3px 10px', borderRadius: 20,
                      background: 'rgba(124,58,237,0.2)', color: '#c4b5fd',
                    }}>{v.source}</span>
                    <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 80, textAlign: 'right' }}>
                      {typeof v.views === 'number' ? v.views.toLocaleString() + ' views' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── folder cards ────────────────────────────────────── */}
            <h2 style={{ fontSize: 16, color: '#c4b5fd', marginBottom: 16 }}>📁 Pipeline Folders</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16, marginBottom: 32 }}>
              <FolderCard name="Downloads"        data={folders.downloads}        icon="⬇️" />
              <FolderCard name="Processed Videos" data={folders.processed_videos} icon="🎬" />
              <FolderCard name="Thumbnails"       data={folders.thumbnails}       icon="🖼️" />
            </div>

            {/* ── credentials ─────────────────────────────────────── */}
            <h2 style={{ fontSize: 16, color: '#c4b5fd', marginBottom: 12 }}>🔑 API Credentials</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
              <CredBadge label="YouTube API"  ok={creds.youtube} />
              <CredBadge label="Reddit API"   ok={creds.reddit} />
              <CredBadge label="Twitter API"  ok={creds.twitter} />
              <CredBadge label="ElevenLabs"   ok={creds.elevenlabs} />
              <CredBadge label="Stripe"       ok={creds.stripe} />
            </div>
            {Object.values(creds).some(v => !v) && (
              <div style={{
                background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b',
                borderRadius: 8, padding: '10px 16px', marginBottom: 28, fontSize: 13, color: '#fcd34d',
              }}>
                ⚡ Add missing keys to <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>automation/.env</code> to unlock more content sources.
              </div>
            )}

            {/* ── how to run ──────────────────────────────────────── */}
            <h2 style={{ fontSize: 16, color: '#c4b5fd', marginBottom: 12 }}>🚀 How to Run the Pipeline</h2>
            <div style={{
              background: '#0f172a', borderRadius: 10, padding: 20, marginBottom: 28,
              border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace', fontSize: 13,
            }}>
              {[
                ['Run pipeline once',       'cd automation && python run_scheduler.py'],
                ['Live monitor (terminal)', 'cd automation && python monitor.py --watch'],
                ['Start auto-scheduler',   'cd automation && python -c "from scheduler.jobs import ContentScheduler; ContentScheduler().start_scheduler()"'],
                ['Check this dashboard',   'Visit internetblessing.com/automation'],
              ].map(([label, cmd]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 3 }}># {label}</div>
                  <div style={{ color: '#7dd3fc' }}>{cmd}</div>
                </div>
              ))}
            </div>

            {/* ── log viewer ──────────────────────────────────────── */}
            <h2 style={{ fontSize: 16, color: '#c4b5fd', marginBottom: 12 }}>📋 Recent Log ({logs.length} entries)</h2>
            <LogViewer logs={logs} />
          </>
        )}
      </div>
    </div>
  );
}
