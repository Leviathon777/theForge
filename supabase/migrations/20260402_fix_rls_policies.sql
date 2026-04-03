-- ============================================================
-- SECURITY FIX: Replace permissive RLS policies
--
-- CONTEXT: This is a Web3 app with wallet-based auth (no
-- Supabase Auth / JWT). There is no auth.uid() to use.
--
-- STRATEGY:
--   - All WRITE operations (INSERT/UPDATE/DELETE) are DENIED
--     to the anon role. Mutations go through API routes using
--     the service role client (which bypasses RLS automatically).
--   - SELECT is scoped per table based on risk level.
--
-- RUN THIS IN SUPABASE SQL EDITOR AFTER REVIEWING
-- ============================================================

-- ========================
-- 1. FORGER ACCOUNTS
-- ========================
DROP POLICY IF EXISTS "Allow all operations on forger_accounts" ON forger_accounts;

-- Anon can read accounts (needed for profile lookups by wallet address)
-- App-level code filters by wallet_address in queries
CREATE POLICY "Anon can read accounts" ON forger_accounts
  FOR SELECT USING (true);

-- Only service role can insert/update (via API routes)
-- No INSERT/UPDATE/DELETE policies for anon = denied by default

-- ========================
-- 2. FORGER EMAILS
-- ========================
DROP POLICY IF EXISTS "Allow all operations on forger_emails" ON forger_emails;

-- No anon read — emails contain sensitive recipient data
-- Service role handles all email operations via API routes

-- ========================
-- 3. TRANSACTIONS
-- ========================
DROP POLICY IF EXISTS "Allow all operations on transactions" ON transactions;

-- Anon can read transactions (needed for profile/history display)
-- Transaction data is non-sensitive (on-chain data is public anyway)
CREATE POLICY "Anon can read transactions" ON transactions
  FOR SELECT USING (true);

-- Only service role can insert transactions (via API routes)

-- ========================
-- 4. FORGER KYC
-- ========================
DROP POLICY IF EXISTS "Allow all operations on forger_kyc" ON forger_kyc;

-- No anon read — KYC data is highly sensitive (PII, verification details)
-- Only service role (webhook callback) can read/insert/update KYC

-- ============================================================
-- SUMMARY OF ACCESS:
--
-- Table              | Anon SELECT | Anon INSERT/UPDATE/DELETE | Service Role
-- -------------------|-------------|--------------------------|-------------
-- forger_accounts    | YES         | NO (denied by RLS)       | Full access
-- forger_emails      | NO          | NO (denied by RLS)       | Full access
-- transactions       | YES         | NO (denied by RLS)       | Full access
-- forger_kyc         | NO          | NO (denied by RLS)       | Full access
--
-- NOTE: Service role key automatically bypasses all RLS policies.
-- API routes using getServiceSupabase() continue to work.
-- ============================================================
