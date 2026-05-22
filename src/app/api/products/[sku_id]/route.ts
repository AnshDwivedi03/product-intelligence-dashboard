import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ sku_id: string }> }) {
  const { sku_id } = await params;
  const product = dbHelpers.getProduct(sku_id);
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  const issues = dbHelpers.getIssuesForProduct(sku_id);
  const competitorPrices = dbHelpers.getCompetitorPrices(sku_id);
  
  return NextResponse.json({ product, issues, competitorPrices });
}
