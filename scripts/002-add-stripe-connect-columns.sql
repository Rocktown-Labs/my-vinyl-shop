-- Add Stripe Connect columns to users table
ALTER TABLE users ADD COLUMN stripe_connect_account_id TEXT;
ALTER TABLE users ADD COLUMN stripe_connect_onboarding_status TEXT;
ALTER TABLE users ADD COLUMN stripe_connect_onboarding_link TEXT;
