-- Create vector indexes for TursoDB vector search
-- These indexes use libSQL's native vector support with DiskANN algorithm

-- Add embedding columns to tables (if not already present)
-- Note: These columns should be added via migration if they don't exist
-- ALTER TABLE vinyls ADD COLUMN embedding vector32(768);
-- ALTER TABLE users ADD COLUMN embedding vector32(768);

-- Create vector index for vinyls
-- This index enables efficient similarity search on vinyl embeddings
CREATE INDEX IF NOT EXISTS vinyls_idx ON vinyls(libsql_vector_idx(embedding));

-- Create vector index for sellers
-- This index enables efficient similarity search on seller embeddings
CREATE INDEX IF NOT EXISTS sellers_idx ON users(libsql_vector_idx(embedding));

-- Note: To populate embeddings, you'll need to:
-- 1. Generate embeddings using AI SDK (Google Gemini embedding model)
-- 2. Store them in the embedding columns
-- 3. The vector indexes will automatically handle similarity search
