# 🚀 Product Intelligence Dashboard

A full-stack, enterprise-grade web application built to help e-commerce sellers validate listing quality, simulate AI data extraction, compare competitor prices, and view actionable system alerts. 

**Built by [Ansh Dhar Dwivedi]**

---

## 🌟 Features Overview

- **Product Uploads & Jobs:** Upload a fallback CSV or process a product video. Asynchronous job queues handle long-running tasks without blocking the UI.
- **Product Validation Engine:** Automatically scans listings for missing titles, bad pricing, missing images, and omitted attributes.
- **AI Title Enhancement:** Dynamically generates optimized product titles based on extracted attributes like color, brand, and material.
- **Competitor Price Simulation:** Simulates scraping across Amazon, Myntra, and Ajio to gather pricing data.
- **Price Analysis:** Computes Lowest, Highest, Average, and Price Gaps to generate business recommendations.
- **Real-Time Alerts System:** Raises High, Medium, and Low severity alerts based on internal pricing rules and validation errors.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Pure CSS Modules (Zero Tailwind). Features a sleek, modern, professional light-mode design system with crisp glass-panels and soft drop-shadows.
- **State & Data:** Ephemeral In-Memory Store (Architected specifically for Vercel Serverless compatibility to allow instant reviewer testing without DB setup).

---

## 📦 Running Locally

1. Clone or download the repository.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Boot up the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

> **💡 Testing Tip:** You can use the included `sample_products.csv` located in the root directory to immediately test the upload, validation, and dashboard flows!

---

## 🚢 Deployment & Architecture Notes

This application has been intentionally designed to deploy flawlessly to **Vercel** out-of-the-box. 

### Why an In-Memory Database?
The assignment requested a deployed application that reviewers could interact with immediately. Because standard SQLite files do not persist writes across serverless API requests on Vercel, this application uses a highly robust Node.js in-memory database (`src/lib/db.ts`). 
- **The Tradeoff:** Data resets on serverless cold starts.
- **The Benefit:** Zero configuration required. The application works perfectly for demo purposes without forcing the reviewer to provision a PostgreSQL database or edit `.env` files.

### Mocks and Assumptions
As permitted by the assignment guidelines (*"Mocked or simulated integrations are acceptable"*), the following systems are safely mocked:
- **Video Extraction:** Simulates frame extraction latency and yields a mocked product payload.
- **Competitor Scraping:** Uses randomized math bounds to simulate live prices and test the Alerting rules safely.
- **AI Generation:** Uses string manipulation of known attributes rather than burning fragile OpenAI API keys.

---
*Intern Assignment | Product Intelligence Dashboard 2026*
