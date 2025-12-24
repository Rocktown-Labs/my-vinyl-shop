-- Add missing columns to users table
ALTER TABLE users ADD COLUMN last_username_change_at INTEGER;
ALTER TABLE users ADD COLUMN collection_privacy TEXT DEFAULT 'public';
ALTER TABLE users ADD COLUMN embedding BLOB;
