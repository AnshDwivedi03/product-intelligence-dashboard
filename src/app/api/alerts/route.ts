import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function GET() {
  const alerts = dbHelpers.getAlerts();
  return NextResponse.json({ alerts });
}
