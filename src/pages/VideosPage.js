import React, { useState, useEffect } from 'react';

function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos?page=${page}&limit=20`);
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading videos...</div>;

  return (
    <div>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Latest Videos</h1>
        <p>Trending viral content, updated daily</p>
      </div>

      {videos.length > 0 ? (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              {video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.title} />}
              <div className="video-card-content">
                <h3>{video.title}</h3>
                <div className="video-stats">
                  <div>👀 {video.viewCount || 0} views</div>
                  <div>❤️ {video.likeCount || 0} likes</div>
                  <div>From: {video.sourceType}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center' }}>No videos found yet.</div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ← Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default VideosPage;
