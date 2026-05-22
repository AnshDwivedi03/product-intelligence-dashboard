import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function GET() {
  const products = dbHelpers.getAllProducts();
  return NextResponse.json({ products });
}
