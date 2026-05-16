-- ==============================================================================
-- MIGRATION: Align orders table with dashboard + syncService schema
-- Run this in Supabase SQL Editor
-- ==============================================================================

-- Step 1: Drop the old orders table and recreate with correct schema
-- (Safe to do since we're about to re-sync from Shopify anyway)

DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
    id          BIGINT PRIMARY KEY,              -- Shopify order ID (globally unique)
    store_id    UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    name        TEXT,                            -- e.g. "#1001"
    created_at  TIMESTAMP WITH TIME ZONE,
    total_price NUMERIC(10, 2),
    tags        TEXT DEFAULT '',                 -- comma-separated string e.g. "delivered,cod"
    customer_fn TEXT,
    customer_ln TEXT,
    line_items  JSONB DEFAULT '[]'::jsonb        -- array of {title, sku, quantity, price}
);

-- Step 2: Re-enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Step 3: RLS Policies for new orders table
CREATE POLICY "Users can view orders for their stores" ON public.orders
    FOR SELECT USING (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );

CREATE POLICY "Users can insert orders for their stores" ON public.orders
    FOR INSERT WITH CHECK (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );

CREATE POLICY "Users can delete own orders" ON public.orders
    FOR DELETE USING (
        store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid())
    );

-- Step 4: Also fix products table — add missing columns if not present
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;

-- ==============================================================================
-- Verify: after running, check the orders table columns look correct
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';
-- ==============================================================================
