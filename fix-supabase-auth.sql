-- Complete SQL script to fix Supabase auth configuration
-- Run this in your Supabase SQL editor

-- 1. Check what auth tables exist
SELECT 'Checking auth tables...' as status;
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'auth';

-- 2. Try to find config table
SELECT 'Checking for config table...' as status;
SELECT * FROM auth.config LIMIT 1;

-- 3. Try to update site_url if config table exists
SELECT 'Attempting to update site_url...' as status;
UPDATE auth.config
SET site_url = 'https://hci-sable-six.vercel.app'
WHERE site_url = 'http://localhost:3000'
   OR site_url IS NULL
   OR site_url = '';

-- 4. Check if update worked
SELECT 'Checking updated config...' as status;
SELECT * FROM auth.config WHERE site_url LIKE '%vercel%';

-- 5. Try alternative config locations
SELECT 'Checking auth schema for settings...' as status;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'auth';

-- 6. Try to update any settings table
SELECT 'Attempting to update any auth settings table...' as status;
-- Try common auth config table names
DO $$
DECLARE
    table_name text;
    update_count int;
BEGIN
    -- Try different possible config table names
    FOREACH table_name IN ARRAY ARRAY['auth.config', 'auth.settings', 'auth.auth_config', 'config']
    LOOP
        BEGIN
            EXECUTE format('UPDATE %I SET site_url = ''https://hci-sable-six.vercel.app'' WHERE site_url = ''http://localhost:3000''', table_name);
            GET DIAGNOSTICS update_count = ROW_COUNT;
            IF update_count > 0 THEN
                RAISE NOTICE 'Updated % rows in table %', update_count, table_name;
            END IF;
        EXCEPTION
            WHEN undefined_table THEN
                -- Table doesn't exist, continue
                NULL;
            WHEN insufficient_privilege THEN
                RAISE NOTICE 'No permission to update table %', table_name;
        END LOOP;
    END;
END $$;

-- 7. Check for redirect URL configurations
SELECT 'Checking for redirect URL configurations...' as status;
SELECT * FROM auth.config WHERE redirect_urls IS NOT NULL;

-- 8. Try to update redirect URLs
SELECT 'Attempting to update redirect URLs...' as status;
UPDATE auth.config
SET redirect_urls = ARRAY[
    'http://localhost:3000/auth/confirm',
    'http://localhost:3000/auth/update-password',
    'https://hci-sable-six.vercel.app/auth/confirm',
    'https://hci-sable-six.vercel.app/auth/update-password'
]
WHERE array_length(redirect_urls, 1) IS NULL
   OR NOT ('https://hci-sable-six.vercel.app/auth/confirm' = ANY(redirect_urls));

-- 9. Final verification
SELECT 'Final configuration check...' as status;
SELECT
    'Site URL: ' || COALESCE(site_url, 'NOT SET') as site_url_config,
    'Redirect URLs: ' || COALESCE(array_to_string(redirect_urls, ', '), 'NOT SET') as redirect_urls_config
FROM auth.config;

-- 10. Alternative: Check if we can access auth functions
SELECT 'Checking auth functions...' as status;
SELECT proname
FROM pg_proc
WHERE proname LIKE '%config%' OR proname LIKE '%site%' OR proname LIKE '%url%'
  AND pg_function_is_visible(oid);

-- If all else fails, this message will show
SELECT '
MANUAL DASHBOARD UPDATE REQUIRED:

If the SQL updates above did not work, you MUST manually update in Supabase Dashboard:

1. Go to: Supabase Dashboard → [Your Project] → Authentication → URL Configuration
2. Set Site URL to: https://hci-sable-six.vercel.app
3. Add redirect URLs:
   - https://hci-sable-six.vercel.app/auth/confirm
   - https://hci-sable-six.vercel.app/auth/update-password

This is the only way to fix localhost redirects in production.
' as manual_instructions;