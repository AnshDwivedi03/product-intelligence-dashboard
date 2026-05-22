'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Alert } from '@/lib/types';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/quality-summary')
      .then(res => res.json())
      .then(data => setSummary(data));
      
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.alerts.slice(0, 5)));
  }, []);

  if (!summary) return <div className="animate-pulse">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Product Intelligence Dashboard</h1>
        <p className={styles.subtitle}>Overview of product quality and alerts.</p>
      </header>

      <div className={styles.grid}>
        <div className={`panel ${styles.card} ${styles.primary}`}>
          <div className={styles.cardTitle}>Total Products</div>
          <div className={styles.cardValue}>{summary.totalProducts}</div>
        </div>
        
        <div className={`panel ${styles.card} ${summary.qualityScore > 80 ? styles.success : styles.warning}`}>
          <div className={styles.cardTitle}>Listing Quality Score</div>
          <div className={styles.cardValue}>{summary.qualityScore}%</div>
        </div>

        <div className={`panel ${styles.card} ${styles.danger}`}>
          <div className={styles.cardTitle}>Critical Issues (HIGH)</div>
          <div className={styles.cardValue}>{summary.issuesBySeverity.HIGH}</div>
        </div>

        <div className={`panel ${styles.card} ${styles.warning}`}>
          <div className={styles.cardTitle}>Warnings (MEDIUM)</div>
          <div className={styles.cardValue}>{summary.issuesBySeverity.MEDIUM}</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Recent Alerts</h2>
      <div className={styles.alertList}>
        {alerts.length === 0 ? (
          <div className={styles.alertItem}>
            <CheckCircle2 color="var(--success-color)" />
            <div className={styles.alertContent}>
              <div className={styles.alertMessage}>All good! No recent alerts.</div>
            </div>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`${styles.alertItem} ${styles[alert.severity]}`}>
              {alert.severity === 'HIGH' ? <AlertCircle color="var(--danger-color)" /> : 
               alert.severity === 'MEDIUM' ? <AlertTriangle color="var(--warning-color)" /> : 
               <Info color="var(--accent-color)" />}
              <div className={styles.alertContent}>
                <div className={styles.alertMessage}>{alert.message}</div>
                <div className={styles.alertMeta}>{new Date(alert.created_at).toLocaleString()} {alert.sku_id && `• SKU: ${alert.sku_id}`}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
