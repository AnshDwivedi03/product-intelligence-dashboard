'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, ListTree, Activity, BellRing } from 'lucide-react';
import styles from '@/app/layout.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Data', path: '/upload', icon: Upload },
    { name: 'Products', path: '/products', icon: ListTree },
    { name: 'Jobs', path: '/jobs', icon: Activity },
    { name: 'Alerts', path: '/alerts', icon: BellRing },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Activity color="var(--accent-color)" />
        <span>Quantacus</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          // Exact match for Dashboard, prefix match for others (like /products/[id])
          const isActive = item.path === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.path);

          return (
            <Link 
              key={item.path}
              href={item.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
