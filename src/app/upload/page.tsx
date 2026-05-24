'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [enhanceTitle, setEnhanceTitle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const executeUpload = async (uploadFile: File) => {
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('enhanceTitle', enhanceTitle.toString());

    const isCsv = uploadFile.name.endsWith('.csv');
    const endpoint = isCsv ? '/api/upload-products-csv' : '/api/upload-video';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Job started. Redirecting...`);
        setTimeout(() => {
          router.push('/jobs');
        }, 1500);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await executeUpload(file);
  };

  const testCSV = async () => {
    try {
      setMessage('Downloading sample CSV...');
      const res = await fetch('/sample_products.csv');
      const blob = await res.blob();
      const testFile = new File([blob], 'sample_products.csv', { type: 'text/csv' });
      await executeUpload(testFile);
    } catch (err) {
      setMessage('Failed to load sample CSV.');
    }
  };

  const testVideo = async () => {
    const blob = new Blob(['dummy video content'], { type: 'video/mp4' });
    const testFile = new File([blob], 'sample_video.mp4', { type: 'video/mp4' });
    await executeUpload(testFile);
  };

  return (
    <div className={`animate-fade-in ${styles.container}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Upload Product Data</h1>
        <p className={styles.subtitle}>Upload a product video for AI extraction, or a fallback CSV feed.</p>
      </header>

      <form onSubmit={handleUpload} className={`panel ${styles.uploadForm}`}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Select File</label>
          <p className={styles.description}>Supports .mp4, .mov, or .csv</p>
          <input 
            type="file" 
            accept=".mp4,.mov,.csv" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className={styles.fileInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              className={styles.checkbox}
              checked={enhanceTitle}
              onChange={(e) => setEnhanceTitle(e.target.checked)}
            />
            Enhance product titles?
          </label>
          <p className={styles.description}>If selected, we will suggest improved titles based on product attributes.</p>
        </div>

        <button type="submit" disabled={!file || loading} className={styles.submitBtn}>
          {loading ? 'Uploading...' : 'Upload and Process'}
        </button>

        {message && <div className={styles.message}>{message}</div>}
      </form>

      <div className={styles.testActions}>
        <div className={styles.testDivider}>
          <span>OR QUICK TEST</span>
        </div>
        <div className={styles.testButtons}>
          <button type="button" onClick={testCSV} disabled={loading} className={styles.secondaryBtn}>
            Test with Sample CSV
          </button>
          <button type="button" onClick={testVideo} disabled={loading} className={styles.secondaryBtn}>
            Test with Sample Video
          </button>
        </div>
      </div>
    </div>
  );
}
