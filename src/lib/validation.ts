import { Product, ListingIssue, Severity } from './types';
import { dbHelpers } from './db';

export function validateProduct(product: Product) {
  // Clear existing issues for this product
  dbHelpers.clearIssuesForProduct(product.sku_id);
  
  const issues: ListingIssue[] = [];

  const addIssue = (issue_type: string, severity: Severity, message: string) => {
    const issue: ListingIssue = {
      id: Math.random().toString(36).substring(7),
      sku_id: product.sku_id,
      issue_type,
      severity,
      message
    };
    dbHelpers.addIssue(issue);
    issues.push(issue);
    
    // Create an alert for HIGH/MEDIUM severity issues during validation
    if (severity === 'HIGH' || severity === 'MEDIUM') {
      dbHelpers.addAlert({
        severity,
        message: `[${product.sku_id}] ${message}`,
        sku_id: product.sku_id
      });
    }
  };

  // Missing title
  if (!product.title || product.title.trim() === '') {
    addIssue('missing_title', 'HIGH', 'Missing product title. Add a clear product title.');
  } else if (product.title.length < 15) {
    addIssue('short_title', 'MEDIUM', 'Title is very short. Consider adding brand, product type, color, or material.');
  }

  // Missing brand
  if (!product.brand || product.brand.trim() === '') {
    addIssue('missing_brand', 'MEDIUM', 'Missing brand. Add brand if known, or mark as unbranded.');
  }

  // Price validation
  if (product.price === undefined || product.price === null || isNaN(Number(product.price)) || Number(product.price) <= 0) {
    addIssue('invalid_price', 'HIGH', 'Selling price must be a positive number.');
  } else if (product.mrp && Number(product.mrp) < Number(product.price)) {
    addIssue('invalid_mrp', 'HIGH', 'MRP cannot be lower than the selling price.');
  }

  // Image validation
  if (!product.image_url || product.image_url.trim() === '') {
    addIssue('missing_image', 'HIGH', 'Add at least one product image.');
  } else if (!product.image_url.startsWith('http')) {
    addIssue('broken_image_url', 'MEDIUM', 'Replace with an accessible image URL starting with http/https.');
  }

  // Weak description
  if (!product.description || product.description.trim() === '' || product.description.length < 30) {
    addIssue('weak_description', 'LOW', 'Description is weak or missing. Add more product details and attributes.');
  }

  // Important attributes
  if (!product.color && !product.size && !product.material) {
    addIssue('missing_attributes', 'MEDIUM', 'Missing important attributes like color, size, or material.');
  }

  // Availability
  if (product.availability && product.availability.toLowerCase().includes('out')) {
    addIssue('out_of_stock', 'LOW', 'Product is marked as out of stock. Notify operations team.');
  }

  return issues;
}
