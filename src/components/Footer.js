import React from 'react';

function Footer() {
  return (
    <footer>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h3>InternetBlessing</h3>
        <p>Automated viral content creation platform. Earn money 24/7.</p>

        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <h4>Quick Links</h4>
            <p>Home | Videos | Courses | Dashboard</p>
          </div>
          <div>
            <h4>Legal</h4>
            <p>Terms of Service | Privacy Policy</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>support@internetblessing.com</p>
          </div>
        </div>

        <hr style={{ margin: '2rem 0', borderColor: '#333' }} />
        <p>&copy; 2026 InternetBlessing. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
