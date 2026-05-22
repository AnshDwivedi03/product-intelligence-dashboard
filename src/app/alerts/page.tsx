'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Alert } from '@/lib/types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.alerts));
  }, []);

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>System Alerts</h1>
        <p className={styles.subtitle}>Critical listing and competitor pricing issues require your attention.</p>
      </header>

      <div className={styles.alertList}>
        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No alerts found.</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`${styles.alertItem} ${styles[alert.severity]}`}>
              {alert.severity === 'HIGH' ? <AlertCircle size={28} color="var(--danger-color)" /> : 
               alert.severity === 'MEDIUM' ? <AlertTriangle size={28} color="var(--warning-color)" /> : 
               <Info size={28} color="var(--accent-color)" />}
              
              <div className={styles.alertContent}>
                <div className={styles.alertHeader}>
                  <span className={styles.alertSeverity}>{alert.severity} PRIORITY</span>
                  <span className={styles.alertTime}>{new Date(alert.created_at).toLocaleString()}</span>
                </div>
                
                <div className={styles.alertMessage}>{alert.message}</div>
                
                {alert.sku_id && (
                  <Link href={`/products/${alert.sku_id}`}>
                    <span className={styles.skuBadge}>View SKU: {alert.sku_id}</span>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
