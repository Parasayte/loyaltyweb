/*
  # Create Settings and Transaction Tables

  1. New Tables
    - `system_settings`
      - `id` (uuid, primary key)
      - `exchange_rate` (numeric) - points given per 1 TL
      - `qr_points_value` (int) - base points per QR scan
      - `game_multiplier` (numeric) - points multiplier for games
      - `referral_bonus` (int) - bonus points for referrals
      - `daily_limit` (int) - max points per day per user
      - `updated_at` (timestamp)
      - `updated_by` (uuid, FK to auth.users)
    
    - `point_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users)
      - `amount` (int) - points added/removed
      - `type` (text) - transaction type (purchase, qr, game, referral, admin, redeem)
      - `description` (text)
      - `reference_id` (text) - optional reference to related entity
      - `created_at` (timestamp)
      - `metadata` (jsonb) - additional data
    
    - `user_profiles`
      - `id` (uuid, primary key, FK to auth.users)
      - `username` (text)
      - `total_points` (int)
      - `level` (int)
      - `qr_scans` (int)
      - `games_played` (int)
      - `referrals` (int)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Allow admins full read/write on system_settings
    - Allow users to read own profile and transactions
    - Allow admins to view all transactions

  3. Initial Data
    - Create default system settings
*/

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_rate numeric DEFAULT 10,
  qr_points_value int DEFAULT 50,
  game_multiplier numeric DEFAULT 1.5,
  referral_bonus int DEFAULT 100,
  daily_limit int DEFAULT 1000,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create point_transactions table
CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount int NOT NULL,
  type text NOT NULL DEFAULT 'admin',
  description text,
  reference_id text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  total_points int DEFAULT 0,
  level int DEFAULT 1,
  qr_scans int DEFAULT 0,
  games_played int DEFAULT 0,
  referrals int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON point_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON point_transactions(type);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- system_settings policies
CREATE POLICY "Admins can view settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON system_settings FOR UPDATE
  TO authenticated
  USING ((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert settings"
  ON system_settings FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

-- point_transactions policies
CREATE POLICY "Users can view own transactions"
  ON point_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert transactions"
  ON point_transactions FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

-- user_profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Insert default settings
INSERT INTO system_settings (exchange_rate, qr_points_value, game_multiplier, referral_bonus, daily_limit)
VALUES (10, 50, 1.5, 100, 1000)
ON CONFLICT DO NOTHING;
