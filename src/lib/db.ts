import { Job, Product, ListingIssue, CompetitorPrice, Alert } from './types';

// In-memory data store for the demo (persists during the lifetime of the Node process)
// On Vercel, this will persist within the same lambda instance across warm requests.

interface Database {
  jobs: Job[];
  products: Product[];
  issues: ListingIssue[];
  competitorPrices: CompetitorPrice[];
  alerts: Alert[];
}

const globalForDb = global as unknown as { db: Database };

export const db = globalForDb.db || {
  jobs: [],
  products: [],
  issues: [],
  competitorPrices: [],
  alerts: []
};

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}

// Helper methods
export const dbHelpers = {
  addJob: (job: Job) => {
    db.jobs.push(job);
    return job;
  },
  getJob: (id: string) => db.jobs.find(j => j.id === id),
  updateJob: (id: string, updates: Partial<Job>) => {
    const idx = db.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      db.jobs[idx] = { ...db.jobs[idx], ...updates };
      return db.jobs[idx];
    }
  },
  
  upsertProduct: (product: Product) => {
    const idx = db.products.findIndex(p => p.sku_id === product.sku_id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...product };
    } else {
      db.products.push(product);
    }
    return product;
  },
  getProduct: (sku_id: string) => db.products.find(p => p.sku_id === sku_id),
  getAllProducts: () => [...db.products],
  
  addIssue: (issue: ListingIssue) => {
    db.issues.push(issue);
    return issue;
  },
  getIssuesForProduct: (sku_id: string) => db.issues.filter(i => i.sku_id === sku_id),
  clearIssuesForProduct: (sku_id: string) => {
    db.issues = db.issues.filter(i => i.sku_id !== sku_id);
  },
  
  addCompetitorPrice: (price: CompetitorPrice) => {
    db.competitorPrices.push(price);
    return price;
  },
  getCompetitorPrices: (sku_id: string) => db.competitorPrices.filter(p => p.sku_id === sku_id),
  clearCompetitorPrices: (sku_id: string) => {
    db.competitorPrices = db.competitorPrices.filter(p => p.sku_id !== sku_id);
  },
  
  addAlert: (alert: Omit<Alert, 'id' | 'created_at' | 'resolved'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      resolved: false
    };
    db.alerts.push(newAlert);
    return newAlert;
  },
  getAlerts: () => [...db.alerts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  
  // Reset DB for testing/refresh
  reset: () => {
    db.jobs = [];
    db.products = [];
    db.issues = [];
    db.competitorPrices = [];
    db.alerts = [];
  }
};
