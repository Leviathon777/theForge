-- ============================================================
-- THE FORGE - Supabase Schema Migration from Firebase Firestore
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- 1. FORGER ACCOUNTS (was: forgerAccount collection)
-- Document ID was walletAddress
CREATE TABLE IF NOT EXISTS forger_accounts (
  wallet_address TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  territory TEXT,

  -- Mailing address (was nested object)
  street_address TEXT,
  apartment TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  dob TEXT,
  agreed BOOLEAN DEFAULT FALSE,
  uk_fca_agreed BOOLEAN,
  eu_agreed BOOLEAN,
  date_of_join TIMESTAMPTZ DEFAULT NOW(),

  -- KYC fields (was nested object)
  kyc_status TEXT,
  kyc_completed_at TEXT,
  kyc_submitted_at TEXT,
  kyc_verified BOOLEAN DEFAULT FALSE,

  -- XdRiP drip fields (was nested object)
  drip_count INTEGER DEFAULT 0,
  drip_percent NUMERIC DEFAULT 0,
  date_last_logged TEXT,
  qualifies_for_bonus BOOLEAN DEFAULT FALSE,

  -- Ramp progression (stored as JSONB arrays)
  -- Each ramp is an array of medal purchase objects
  ramps JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FORGER EMAILS (was: forgerEmails collection)
-- Used to queue emails for sending
CREATE TABLE IF NOT EXISTS forger_emails (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  recipients TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  text_body TEXT,
  html_body TEXT,
  email_type TEXT DEFAULT 'general',
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRANSACTIONS (was: transactions collection)
-- Document ID was wallet address, each tx was a nested field
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  transaction_number TEXT NOT NULL,
  purchaser TEXT,
  purchased_medal TEXT,
  transaction_hash TEXT,
  status TEXT,
  block_number TEXT,
  timestamp TEXT,
  action TEXT,
  from_address TEXT,
  to_address TEXT,
  value_bnb TEXT,
  gas_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_medal ON transactions(purchased_medal);

-- 4. FORGER KYC (was: forgerKYC collection)
-- Document ID was external_applicant_id
CREATE TABLE IF NOT EXISTS forger_kyc (
  external_applicant_id TEXT PRIMARY KEY,
  request_id TEXT,
  type TEXT,
  form_id TEXT,
  form_token TEXT,
  verification_id TEXT,
  applicant_id TEXT,
  verification_status TEXT,
  verification_attempts_left INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB DEFAULT '{}'
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE forger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forger_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forger_kyc ENABLE ROW LEVEL SECURITY;

-- Allow anon/public read+write for now (matches Firebase open rules)
-- Tighten these later when auth is set up
CREATE POLICY "Allow all operations on forger_accounts" ON forger_accounts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on forger_emails" ON forger_emails
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on transactions" ON transactions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on forger_kyc" ON forger_kyc
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forger_accounts_updated_at
  BEFORE UPDATE ON forger_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
