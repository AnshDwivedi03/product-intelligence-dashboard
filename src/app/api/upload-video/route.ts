import { NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';
import { validateProduct } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const enhanceTitle = formData.get('enhanceTitle') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const job = dbHelpers.addJob({
      id: Math.random().toString(36).substring(7),
      type: 'video_extraction',
      status: 'RUNNING',
      progress: 0,
      startedAt: new Date().toISOString()
    });

    // Mock asynchronous video processing
    (async () => {
      try {
        await new Promise(r => setTimeout(r, 1000));
        dbHelpers.updateJob(job.id, { progress: 30, message: 'Extracting frames...' });
        
        await new Promise(r => setTimeout(r, 1500));
        dbHelpers.updateJob(job.id, { progress: 60, message: 'Running OCR and AI analysis...' });

        await new Promise(r => setTimeout(r, 1500));

        // Create a mocked product based on the "video"
        const mockedSkuId = `VID-${Math.floor(Math.random() * 10000)}`;
        const product = {
          sku_id: mockedSkuId,
          title: 'Extracted Smart Watch',
          brand: 'MockBrand',
          category: 'Electronics',
          price: 2999,
          mrp: 4999,
          availability: 'in_stock',
          description: 'A smart watch extracted from the video using mock AI.',
          image_url: 'https://via.placeholder.com/300?text=Smart+Watch',
          color: 'Black',
          material: 'Silicone'
        };

        dbHelpers.upsertProduct(product);
        validateProduct(product);

        if (enhanceTitle) {
          const newTitle = `${product.brand} Black Smart Watch with Silicone Strap`;
          dbHelpers.upsertProduct({ ...product, enhanced_title: newTitle });
        }

        dbHelpers.updateJob(job.id, {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date().toISOString(),
          message: `Successfully extracted 1 product (SKU: ${mockedSkuId}).`
        });

      } catch (err) {
        dbHelpers.updateJob(job.id, {
          status: 'FAILED',
          completedAt: new Date().toISOString(),
          message: 'Video processing failed'
        });
      }
    })();

    return NextResponse.json({ job_id: job.id, message: 'Video processing started' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
