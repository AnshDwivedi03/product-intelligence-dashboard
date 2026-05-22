import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ job_id: string }> }) {
  const { job_id } = await params;
  const job = dbHelpers.getJob(job_id);
  
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
  
  return NextResponse.json(job);
}
