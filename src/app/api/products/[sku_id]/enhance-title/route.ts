import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ sku_id: string }> }) {
  const { sku_id } = await params;
  const product = dbHelpers.getProduct(sku_id);
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Mock AI enhancement
  const newTitle = `${product.brand || ''} ${product.color || ''} ${product.title || ''} ${product.material ? `with ${product.material}` : ''}`.trim().replace(/\s+/g, ' ');
  
  const updated = dbHelpers.upsertProduct({
    ...product,
    enhanced_title: newTitle
  });

  return NextResponse.json({ product: updated });
}
