export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIALLY_COMPLETED';

export interface Job {
  id: string;
  type: 'video_extraction' | 'csv_upload' | 'price_refresh';
  status: JobStatus;
  progress: number;
  message?: string;
  startedAt: string;
  completedAt?: string;
}

export interface Product {
  sku_id: string;
  title: string;
  brand?: string;
  category?: string;
  price?: number;
  mrp?: number;
  availability?: string;
  description?: string;
  image_url?: string;
  product_url?: string;
  color?: string;
  size?: string;
  material?: string;
  enhanced_title?: string;
  gender?: string;
}

export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ListingIssue {
  id: string;
  sku_id: string;
  issue_type: string;
  severity: Severity;
  message: string;
}

export interface CompetitorPrice {
  id: string;
  sku_id: string;
  platform: string;
  price: number;
  url: string;
  last_checked_at: string;
}

export interface Alert {
  id: string;
  severity: Severity;
  message: string;
  sku_id?: string;
  created_at: string;
  resolved: boolean;
}
