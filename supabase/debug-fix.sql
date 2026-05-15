-- STEP 1: See what's in the stores table (run this first)
SELECT id, store_name, shopify_domain, owner_id, created_at, plan_type
FROM public.stores;

-- STEP 2: See all users in auth.users
SELECT id, email, created_at
FROM auth.users;

-- STEP 3: If owner_id is NULL or wrong, fix it:
-- Replace 'YOUR-USER-UUID-HERE' with the id from STEP 2 (your email's row)
-- Replace 'bnb-toys' with your shopify_domain value from STEP 1
-- UPDATE public.stores
-- SET owner_id = 'YOUR-USER-UUID-HERE'
-- WHERE shopify_domain = 'bnb-toys';
