import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from './layout.module.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Intelligence Dashboard",
  description: "E-commerce product extraction and validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
