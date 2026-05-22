'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  const refreshPrices = async () => {
    await fetch('/api/competitor-prices/refresh', { method: 'POST' });
    router.push('/jobs');
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>List of all processed products.</p>
        </div>
        <button className={styles.actionBtn} onClick={refreshPrices}>
          Refresh Competitor Prices
        </button>
      </header>

      <div className={`panel ${styles.tableContainer}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>SKU</th>
              <th className={styles.th}>Product Title</th>
              <th className={styles.th}>Brand</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Availability</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.td} style={{ textAlign: 'center' }}>No products found. Upload data first.</td>
              </tr>
            )}
            {products.map(product => (
              <tr 
                key={product.sku_id} 
                className={styles.tr}
                onClick={() => router.push(`/products/${product.sku_id}`)}
              >
                <td className={styles.td}>
                  <span className={styles.skuId}>{product.sku_id}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.productTitle}>{product.title || 'Untitled'}</div>
                </td>
                <td className={styles.td}>{product.brand || '-'}</td>
                <td className={styles.td}>₹{product.price || '-'}</td>
                <td className={styles.td}>{product.availability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
