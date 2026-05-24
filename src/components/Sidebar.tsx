'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, ListTree, Activity, BellRing, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from '@/app/layout.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar automatically when clicking a link (on path change)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Data', path: '/upload', icon: Upload },
    { name: 'Products', path: '/products', icon: ListTree },
    { name: 'Jobs', path: '/jobs', icon: Activity },
    { name: 'Alerts', path: '/alerts', icon: BellRing },
  ];

  return (
    <>
      <div className={styles.mobileHeader}>
        <button onClick={() => setIsOpen(true)} className={styles.hamburgerBtn}>
          <Menu size={24} />
        </button>
        <Link href="/" className={styles.mobileTitle}>Quantacus</Link>
      </div>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <Activity color="#10b981" />
            <span>Quantacus</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
            <X size={24} color="white" />
          </button>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
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
    </>
  );
}
