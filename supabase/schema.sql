-- ==============================================================================
-- MULTI-TENANT SAAS SCHEMA FOR D2C ANALYTICS
-- ==============================================================================

-- 1. Stores (Tenants)
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    store_name TEXT NOT NULL,
    shopify_domain TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    plan_type TEXT DEFAULT 'free',
    primary_color TEXT DEFAULT '#fbbf24',
    logo_url TEXT,
    dashboard_style TEXT DEFAULT 'dark-modern',
    shopify_access_token TEXT,
    dashboard_features JSONB DEFAULT '{
      "daily_view": true,
      "weekly_view": true,
      "monthly_view": true,
      "all_time_view": true,
      "scoreboard": true,
      "business_analytics": true
    }'::jsonb
);

-- Migration: add dashboard_features to existing stores table if not present
-- Run this manually in Supabase SQL editor if the table already exists:
-- ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS dashboard_features JSONB DEFAULT '{"daily_view":true,"weekly_view":true,"monthly_view":true,"all_time_view":true,"scoreboard":true,"business_analytics":true}'::jsonb;

-- 2. Orders 
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    shopify_order_id TEXT NOT NULL,
    customer_name TEXT,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    UNIQUE(store_id, shopify_order_id)
);

-- 3. Products & Pricing Configuration
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    shopify_product_id TEXT NOT NULL,
    title TEXT NOT NULL,
    sku TEXT,
    cost_price NUMERIC(10, 2) DEFAULT 0.00,
    shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    selling_price NUMERIC(10, 2),
    UNIQUE(store_id, shopify_product_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Ensures users only see data belonging to their own store
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 1. Policies for Stores
CREATE POLICY "Users can view their own store" ON public.stores
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own store" ON public.stores
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own store" ON public.stores
    FOR UPDATE USING (auth.uid() = owner_id);

-- 2. Policies for Orders
CREATE POLICY "Users can view orders for their stores" ON public.orders
    FOR SELECT USING (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );

CREATE POLICY "Users can insert orders for their stores" ON public.orders
    FOR INSERT WITH CHECK (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );

-- 3. Policies for Products
CREATE POLICY "Users can view products for their stores" ON public.products
    FOR SELECT USING (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );

CREATE POLICY "Users can update products for their stores" ON public.products
    FOR UPDATE USING (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );
