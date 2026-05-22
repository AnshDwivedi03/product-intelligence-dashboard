import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  // Return sorted jobs (newest first)
  const sortedJobs = [...db.jobs].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  return NextResponse.json({ jobs: sortedJobs });
}
