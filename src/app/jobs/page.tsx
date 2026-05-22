'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Job } from '@/lib/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = () => {
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => setJobs(data.jobs));
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Processing Jobs</h1>
        <p className={styles.subtitle}>Track background tasks like video processing and validation.</p>
      </header>

      <div className={styles.jobList}>
        {jobs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No jobs found.</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={`panel ${styles.jobCard}`}>
              <div className={styles.jobHeader}>
                <div className={styles.jobType}>{job.type.replace('_', ' ')}</div>
                <div className={`${styles.jobStatus} ${styles[job.status]}`}>{job.status}</div>
              </div>
              
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${job.progress}%` }}></div>
              </div>
              
              <div className={styles.jobMessage}>{job.message || 'Processing...'}</div>
              
              <div className={styles.jobMeta}>
                <span>Job ID: {job.id}</span>
                <span>Started: {new Date(job.startedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
