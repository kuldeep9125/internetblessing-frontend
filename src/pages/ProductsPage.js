import React, { useState, useEffect } from 'react';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleBuy = async (product) => {
    setPurchasing(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}/checkout`, { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Stripe checkout: ' + (data.message || 'Coming soon!'));
      }
    } catch (e) {
      alert('Error starting checkout. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.2rem' }}>⏳ Loading products...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚 Digital Products & Courses</h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Learn how to build automated income from YouTube</p>
      </div>

      {/* Products Grid */}
      <div className="products-grid" style={{ paddingTop: '2rem' }}>
        {products.map((product) => (
          <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="product-card-header">
              <span className="product-badge">{product.type === 'membership' ? '⭐ Membership' : '📚 Course'}</span>
              <h3 style={{ marginTop: '0.75rem', fontSize: '1.25rem' }}>{product.name}</h3>
            </div>
            <div className="product-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{ color: '#bbb', lineHeight: '1.6', flex: 1 }}>{product.description}</p>

              {product.features && (
                <ul style={{ margin: '1rem 0', padding: 0, listStyle: 'none' }}>
                  {product.features.map((f, i) => (
                    <li key={i} style={{ color: '#ccc', fontSize: '0.875rem', padding: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#ff6b35' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}

              <div className="product-price">
                ${product.price}{product.type === 'membership' ? <span style={{ fontSize: '1rem', color: '#aaa' }}>/mo</span> : ''}
              </div>

              <button
                onClick={() => handleBuy(product)}
                disabled={purchasing === product.id}
                className="cta-button btn-full"
                style={{ textAlign: 'center', padding: '0.875rem', fontSize: '1rem' }}
              >
                {purchasing === product.id ? '⏳ Processing...' : product.type === 'membership' ? '⭐ Join Now' : '🛒 Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#999' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
        <p style={{ fontSize: '1rem' }}>Secure checkout powered by Stripe — 30-day money back guarantee</p>
      </div>
    </div>
  );
}

export default ProductsPage;
