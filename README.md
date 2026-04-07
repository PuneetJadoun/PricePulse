# 🚀 PricePulse – Smart Product Price Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blue?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://pricepulseapp.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Track product prices across e-commerce sites and get real-time alerts on price drops.**

PricePulse is a high-performance web application built with **Next.js**, **Firecrawl**, and **Supabase**. It automates the tedious task of price tracking, providing you with interactive history charts and instant email notifications when prices hit your target.

[**Explore the Live Demo »**](https://pricepulseapp.vercel.app)

---

## 🎯 Features

- 🔍 **Track Any Product:** Seamlessly extract data from Amazon, Zara, Walmart, and more.
- 📊 **Price History Charts:** Interactive graphs showing price trends over time using Recharts.
- 🔐 **Google Authentication:** Secure and easy sign-in with Google OAuth via Supabase.
- 🔄 **Automated Daily Checks:** Scheduled cron jobs monitor prices automatically.
- 📧 **Email Alerts:** Get notified instantly when prices drop via Resend.
- ⚡ **AI-Powered Extraction:** Uses Firecrawl for intelligent, structured data scraping.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Scraping:** [Firecrawl](https://firecrawl.dev/) (JS Rendering, Anti-bot bypass, AI extraction)
- **Database / Auth:** [Supabase](https://supabase.com/) (PostgreSQL, OAuth, RLS)
- **Automated Jobs:** `pg_cron` & `pg_net` via Supabase
- **Email Service:** [Resend](https://resend.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)

---

## 🚀 Setup Instructions

### 1. Clone and Install
```bash
git clone https://github.com/PuneetJadoun/PricePulse.git
cd PricePulse
npm install
```

### 2. Supabase Setup

#### Create Project
Create a new project at [supabase.com](https://supabase.com).

#### Run Database Migrations
Run these migrations in the Supabase SQL Editor:

**Migration 1: Database Schema**
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text not null,
  current_price numeric(10,2) not null,
  currency text not null default 'USD',
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Price history table
create table price_history (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  price numeric(10,2) not null,
  currency text not null,
  checked_at timestamp with time zone default now()
);

-- Add unique constraint for upsert functionality
ALTER TABLE products
ADD CONSTRAINT products_user_url_unique UNIQUE (user_id, url);

-- Enable Row Level Security
alter table products enable row level security;
alter table price_history enable row level security;

-- Policies for products
create policy "Users can view their own products" on products for select using (auth.uid() = user_id);
create policy "Users can insert their own products" on products for insert with check (auth.uid() = user_id);
create policy "Users can update their own products" on products for update using (auth.uid() = user_id);
create policy "Users can delete their own products" on products for delete using (auth.uid() = user_id);

-- Policies for price_history
create policy "Users can view price history for their products" 
on price_history for select using (
  exists (select 1 from products where products.id = price_history.product_id and products.user_id = auth.uid())
);
```

**Migration 2: Setup Cron Job**
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION trigger_price_check()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://pricepulseapp.vercel.app/api/cron/check-prices',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_CRON_SECRET_HERE'
    )
  );
END;
$$;

-- Schedule daily at 9 AM UTC
SELECT cron.schedule('daily-price-check', '0 9 * * *', 'SELECT trigger_price_check();');
```

### 3. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
CRON_SECRET=your_generated_cron_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📂 Project Structure

```bash
├── app/              # Next.js App Router (Pages & API)
├── components/       # UI Components (shadcn, forms, charts)
├── lib/              # API Integrations (Firecrawl, Email)
├── utils/            # Supabase clients & Middleware
├── supabase/         # SQL Migrations
└── ...               # Config files
```

---

## 🔍 How It Works

1. **User Flow:** User pastes a product URL -> Firecrawl scrapes details (Name, Price, Image) -> Stored in Supabase.
2. **Automated Tracking:** Supabase `pg_cron` triggers a secure API endpoint daily.
3. **Smart Update:** Firecrawl re-scrapes products; if the price changes, it's logged to `price_history` and the user gets an email via Resend.

---

## 🤝 Contributing

Contributions are welcome! Fork the project, create your feature branch, and submit a pull request.

---

## ⚖️ License

Distributed under the MIT License.

---

## 📧 Contact

**Puneet Kumar Singh** - [LinkedIn](https://linkedin.com/in/puneet-singh) - [GitHub](https://github.com/PuneetJadoun)

Project Link: [https://github.com/PuneetJadoun/PricePulse](https://github.com/PuneetJadoun/PricePulse)

---
<p align="center">Built with ❤️ by Puneet Kumar Singh using Next.js, Firecrawl, and Supabase</p>