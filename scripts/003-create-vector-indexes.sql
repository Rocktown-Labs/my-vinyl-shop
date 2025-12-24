-- Create vector indexes for TursoDB vector search
-- These indexes use libSQL's native vector support with DiskANN algorithm
-- Note: Embedding columns should be added via Drizzle migration first

-- Create vector index for vinyls (listings and collections)
-- This index enables efficient similarity search on vinyl embeddings
-- Uses cosine distance by default
CREATE INDEX IF NOT EXISTS vinyls_idx ON vinyls(libsql_vector_idx(embedding));

-- Create vector index for users (sellers)
-- This index enables efficient similarity search on user/seller embeddings
-- Uses cosine distance by default
CREATE INDEX IF NOT EXISTS users_idx ON users(libsql_vector_idx(embedding));

-- Note: To populate embeddings, you'll need to:
-- 1. Generate embeddings using AI SDK (Google Gemini embedding-001 model)
-- 2. Store them in the embedding columns using vector32() function
-- 3. The vector indexes will automatically handle similarity search
-- 4. Use vector_top_k() function to query the indexes
