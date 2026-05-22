import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';
import { Job } from '@/lib/types';
import Papa from 'papaparse';
import { validateProduct } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const enhanceTitle = formData.get('enhanceTitle') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    
    // Parse CSV
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const job = dbHelpers.addJob({
      id: Math.random().toString(36).substring(7),
      type: 'csv_upload',
      status: 'RUNNING',
      progress: 0,
      startedAt: new Date().toISOString()
    });

    // Process asynchronously to simulate a background job
    (async () => {
      try {
        const rows = result.data as any[];
        let processedCount = 0;

        for (const row of rows) {
          if (!row.sku_id) continue;

          const product = {
            sku_id: row.sku_id,
            title: row.product_title || row.title || '',
            brand: row.brand || '',
            category: row.category || '',
            price: parseFloat(row.price) || 0,
            mrp: parseFloat(row.mrp) || 0,
            availability: row.availability || 'in_stock',
            description: row.description || '',
            image_url: row.image_url || '',
            product_url: row.product_url || '',
            color: row.color || '',
            size: row.size || '',
            material: row.material || '',
          };

          dbHelpers.upsertProduct(product);
          validateProduct(product);

          if (enhanceTitle) {
            // Mock title enhancement
            const newTitle = `${product.brand || ''} ${product.color || ''} ${product.title || ''} ${product.material ? `with ${product.material}` : ''}`.trim().replace(/\s+/g, ' ');
            dbHelpers.upsertProduct({ ...product, enhanced_title: newTitle });
          }

          processedCount++;
          
          // Update progress
          dbHelpers.updateJob(job.id, {
            progress: Math.floor((processedCount / rows.length) * 100)
          });
          
          // Simulate slight delay per row
          await new Promise(r => setTimeout(r, 200));
        }

        dbHelpers.updateJob(job.id, {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date().toISOString(),
          message: `Successfully processed ${processedCount} products.`
        });
      } catch (err) {
        dbHelpers.updateJob(job.id, {
          status: 'FAILED',
          completedAt: new Date().toISOString(),
          message: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    })();

    return NextResponse.json({ job_id: job.id, message: 'Processing started' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
