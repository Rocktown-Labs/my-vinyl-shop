-- Add missing columns to users table
-- This migration adds columns that were added to the schema but may not exist in the database yet

-- Add last_username_change_at if it doesn't exist
ALTER TABLE users ADD COLUMN last_username_change_at INTEGER;

-- Add collection_privacy if it doesn't exist (defaults to 'public')
ALTER TABLE users ADD COLUMN collection_privacy TEXT DEFAULT 'public';

-- Add embedding column if it doesn't exist (for vector search)
-- Note: F32_BLOB is a Turso-specific type, but SQLite will store it as BLOB
ALTER TABLE users ADD COLUMN embedding BLOB;
