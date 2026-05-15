-- STEP 1: Check how many orders exist in the database for your store
-- Make sure to check the exact count
SELECT count(*) as total_orders
FROM public.orders;

-- STEP 2: Let's see a sample of 1 order just to ensure it has the correct store_id
SELECT *
FROM public.orders
LIMIT 1;

-- STEP 3: Let's check if the RLS policies on the orders table are blocking the frontend from reading them.
-- If you look in your schema, what are the RLS policies for the orders table?
