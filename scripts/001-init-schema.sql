-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  location TEXT,
  country TEXT,
  website TEXT,
  instagram_handle TEXT,
  discogs_username TEXT,
  is_verified INTEGER DEFAULT 0,
  is_seller INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  ships_worldwide INTEGER DEFAULT 0,
  specialized_genres TEXT,
  onboarding_completed INTEGER DEFAULT 0,
  stripe_connect_account_id TEXT,
  stripe_connect_onboarding_status TEXT,
  stripe_connect_onboarding_link TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Vinyls table
CREATE TABLE IF NOT EXISTS vinyls (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT NOT NULL,
  year INTEGER,
  label TEXT,
  catalog_number TEXT,
  description TEXT,
  condition TEXT NOT NULL,
  sleeve_condition TEXT,
  vinyl_condition TEXT,
  type TEXT NOT NULL DEFAULT 'used',
  images TEXT,
  is_listed INTEGER DEFAULT 0,
  is_in_collection INTEGER DEFAULT 1,
  price REAL,
  listing_type TEXT DEFAULT 'fixed',
  starting_bid REAL,
  reserve_price REAL,
  buy_now_price REAL,
  auction_end_date INTEGER,
  quantity INTEGER DEFAULT 1,
  ai_suggested_price REAL,
  ai_condition_notes TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  buyer_id TEXT NOT NULL REFERENCES users(id),
  seller_id TEXT NOT NULL REFERENCES users(id),
  vinyl_id TEXT NOT NULL REFERENCES vinyls(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount REAL NOT NULL,
  shipping_amount REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER,
  UNIQUE(follower_id, following_id)
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  participant1_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant2_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES orders(id),
  vinyl_id TEXT REFERENCES vinyls(id),
  last_message_at INTEGER,
  created_at INTEGER
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
  id TEXT PRIMARY KEY,
  vinyl_id TEXT NOT NULL REFERENCES vinyls(id) ON DELETE CASCADE,
  bidder_id TEXT NOT NULL REFERENCES users(id),
  amount REAL NOT NULL,
  created_at INTEGER
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read INTEGER DEFAULT 0,
  metadata TEXT,
  created_at INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vinyls_user_id ON vinyls(user_id);
CREATE INDEX IF NOT EXISTS idx_vinyls_is_listed ON vinyls(is_listed);
CREATE INDEX IF NOT EXISTS idx_vinyls_genre ON vinyls(genre);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_vinyl_id ON bids(vinyl_id);
