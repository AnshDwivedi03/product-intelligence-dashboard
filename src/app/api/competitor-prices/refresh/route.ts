import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST() {
  const job = dbHelpers.addJob({
    id: Math.random().toString(36).substring(7),
    type: 'price_refresh',
    status: 'RUNNING',
    progress: 0,
    startedAt: new Date().toISOString()
  });

  (async () => {
    try {
      const products = dbHelpers.getAllProducts();
      let processed = 0;

      for (const product of products) {
        dbHelpers.clearCompetitorPrices(product.sku_id);
        
        // Simulate finding competitor prices
        const platforms = ['Amazon', 'Myntra', 'Ajio'];
        let lowestPrice = Infinity;
        
        for (const platform of platforms) {
          // Randomly decide if platform has the product
          if (Math.random() > 0.2) {
            // Price variation +/- 15%
            const variation = (Math.random() * 0.3) - 0.15;
            const compPrice = Math.round((product.price || 1000) * (1 + variation));
            
            dbHelpers.addCompetitorPrice({
              id: Math.random().toString(36).substring(7),
              sku_id: product.sku_id,
              platform,
              price: compPrice,
              url: `https://example.com/${platform.toLowerCase()}/${product.sku_id}`,
              last_checked_at: new Date().toISOString()
            });

            if (compPrice < lowestPrice) {
              lowestPrice = compPrice;
            }
          }
        }

        // Price Alert Logic
        if (product.price && lowestPrice < Infinity) {
          if (product.price > lowestPrice * 1.1) {
            dbHelpers.addAlert({
              severity: 'HIGH',
              message: `Our price (₹${product.price}) is more than 10% higher than lowest competitor price (₹${lowestPrice}).`,
              sku_id: product.sku_id
            });
          }
        }

        processed++;
        dbHelpers.updateJob(job.id, {
          progress: Math.floor((processed / products.length) * 100)
        });

        await new Promise(r => setTimeout(r, 100)); // Simulate API delay
      }

      dbHelpers.updateJob(job.id, {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date().toISOString(),
        message: `Successfully refreshed competitor prices for ${products.length} products.`
      });
    } catch (err) {
      dbHelpers.updateJob(job.id, {
        status: 'FAILED',
        completedAt: new Date().toISOString(),
        message: 'Failed to refresh competitor prices.'
      });
    }
  })();

  return NextResponse.json({ job_id: job.id, message: 'Price refresh started' });
}
