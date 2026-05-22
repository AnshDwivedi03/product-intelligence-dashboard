'use client';

import { useEffect, useState, use } from 'react';
import styles from './page.module.css';

export default function ProductDetail({ params }: { params: Promise<{ sku_id: string }> }) {
  const { sku_id } = use(params);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/products/${sku_id}`)
      .then(res => res.json())
      .then(data => setData(data));
  }, [sku_id]);

  if (!data) return <div className="animate-pulse">Loading product details...</div>;

  const { product, issues, competitorPrices } = data;

  const generateTitle = async () => {
    const res = await fetch(`/api/products/${sku_id}/enhance-title`, { method: 'POST' });
    const json = await res.json();
    setData({ ...data, product: json.product });
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>
          {product.title || 'Untitled Product'}
          <span className={styles.skuBadge}>{product.sku_id}</span>
        </h1>
      </header>

      <div className={styles.grid}>
        <div>
          {product.enhanced_title && (
            <div className={styles.enhancedTitleBox}>
              <div className={styles.enhancedLabel}>✨ AI Enhanced Title</div>
              <div>{product.enhanced_title}</div>
            </div>
          )}

          <div className={`panel ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Product Information</h2>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Brand</span>
                <span className={styles.detailValue}>{product.brand || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{product.category || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Price</span>
                <span className={styles.detailValue}>₹{product.price || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>MRP</span>
                <span className={styles.detailValue}>₹{product.mrp || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Color</span>
                <span className={styles.detailValue}>{product.color || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Material</span>
                <span className={styles.detailValue}>{product.material || '-'}</span>
              </div>
            </div>
            
            {!product.enhanced_title && (
              <button className={styles.actionBtn} onClick={generateTitle}>
                Generate Enhanced Title
              </button>
            )}
          </div>

          <div className={`panel ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Listing Validation Issues ({issues.length})</h2>
            <div className={styles.issueList}>
              {issues.length === 0 ? (
                <p style={{ color: 'var(--success-color)' }}>Perfect! No listing issues detected.</p>
              ) : (
                issues.map((issue: any) => (
                  <div key={issue.id} className={`${styles.issueItem} ${styles[issue.severity]}`}>
                    <strong>[{issue.severity}]</strong> {issue.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className={`panel ${styles.section}`}>
            <h2 className={styles.sectionTitle}>Competitor Prices</h2>
            {competitorPrices.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No competitor data available. Try refreshing prices.</p>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  {competitorPrices.map((cp: any) => (
                    <div key={cp.id} className={styles.priceCard}>
                      <span className={styles.pricePlatform}>{cp.platform}</span>
                      <span className={styles.priceValue}>₹{cp.price}</span>
                    </div>
                  ))}
                </div>
                
                {(() => {
                  const prices = competitorPrices.map((cp: any) => cp.price);
                  const lowest = Math.min(...prices);
                  const highest = Math.max(...prices);
                  const average = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
                  const myPrice = product.price || 0;
                  const priceGap = lowest - myPrice;
                  const percentageDiff = myPrice > 0 ? Math.round((Math.abs(priceGap) / myPrice) * 100) : 0;
                  
                  let recommendation = "Price is optimal.";
                  if (myPrice > lowest * 1.1) recommendation = "Reduce price to match competitors.";
                  else if (myPrice < lowest * 0.9) recommendation = "Consider increasing price to improve margins.";

                  return (
                    <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Price Analysis</h3>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Lowest</span>
                          <span className={styles.detailValue}>₹{lowest}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Average</span>
                          <span className={styles.detailValue}>₹{average}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Highest</span>
                          <span className={styles.detailValue}>₹{highest}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Gap to Lowest</span>
                          <span className={styles.detailValue} style={{ color: priceGap < 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                            {priceGap > 0 ? '+' : ''}{priceGap} ({percentageDiff}%)
                          </span>
                        </div>
                      </div>
                      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', color: 'var(--accent-color)', fontWeight: 500 }}>
                        Recommendation: {recommendation}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
