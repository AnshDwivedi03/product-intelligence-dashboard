import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const totalProducts = db.products.length;
  const issues = db.issues;
  
  const highSeverity = issues.filter(i => i.severity === 'HIGH').length;
  const mediumSeverity = issues.filter(i => i.severity === 'MEDIUM').length;
  const lowSeverity = issues.filter(i => i.severity === 'LOW').length;
  
  const missingImages = issues.filter(i => i.issue_type === 'missing_image').length;
  const invalidPrices = issues.filter(i => i.issue_type === 'invalid_price').length;
  const weakListings = issues.filter(i => i.issue_type === 'weak_description' || i.issue_type === 'short_title').length;
  
  const productsWithIssues = new Set(issues.map(i => i.sku_id)).size;
  const healthyProducts = totalProducts - productsWithIssues;
  
  const qualityScore = totalProducts === 0 ? 100 : Math.round((healthyProducts / totalProducts) * 100);

  return NextResponse.json({
    totalProducts,
    issuesBySeverity: {
      HIGH: highSeverity,
      MEDIUM: mediumSeverity,
      LOW: lowSeverity
    },
    metrics: {
      missingImages,
      invalidPrices,
      weakListings,
    },
    qualityScore
  });
}
