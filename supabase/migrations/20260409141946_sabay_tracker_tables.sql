-- ============================================================
-- Sabay Feeding Tracker — Tables, Seed Data, RLS
-- ============================================================

-- Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  calories numeric NOT NULL,
  serving numeric NOT NULL,
  unit text NOT NULL DEFAULT 'can',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on products" ON products USING (true) WITH CHECK (true);

-- Feedings
CREATE TABLE IF NOT EXISTS feedings (
  id text PRIMARY KEY,
  "timestamp" text NOT NULL,
  product_id text,
  product_name text,
  grams numeric,
  calories numeric,
  method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on feedings" ON feedings USING (true) WITH CHECK (true);

-- Daily Meds (one row per date, JSONB stores all med checks for that day)
CREATE TABLE IF NOT EXISTS daily_meds (
  date date PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE daily_meds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on daily_meds" ON daily_meds USING (true) WITH CHECK (true);

-- Weights
CREATE TABLE IF NOT EXISTS weights (
  id text PRIMARY KEY,
  date date NOT NULL,
  value numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on weights" ON weights USING (true) WITH CHECK (true);

-- Respiratory Rates
CREATE TABLE IF NOT EXISTS respiratory_rates (
  id text PRIMARY KEY,
  "timestamp" text NOT NULL,
  bpm integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE respiratory_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on respiratory_rates" ON respiratory_rates USING (true) WITH CHECK (true);

-- Blood Work
CREATE TABLE IF NOT EXISTS blood_work (
  id text PRIMARY KEY,
  date date NOT NULL,
  cre numeric,
  bun numeric,
  sdma numeric,
  phos numeric,
  ca numeric,
  k numeric,
  tco2 numeric,
  fsaa numeric,
  glu numeric,
  alt_val numeric,
  ast_val numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blood_work ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on blood_work" ON blood_work USING (true) WITH CHECK (true);

-- Vet Appointments
CREATE TABLE IF NOT EXISTS vet_appointments (
  id text PRIMARY KEY,
  date date NOT NULL,
  location text NOT NULL,
  tests text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vet_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on vet_appointments" ON vet_appointments USING (true) WITH CHECK (true);

-- ============================================================
-- Seed Data
-- ============================================================

-- Products
INSERT INTO products (id, name, calories, serving, unit) VALUES
  ('p1', 'Hill''s k/d Chicken & Vegetable Stew', 58, 82, 'can'),
  ('p2', 'Hill''s k/d Pate with Chicken', 135, 156, 'can'),
  ('p3', 'Royal Canin Renal with Fish', 82, 85, 'pouch'),
  ('p4', 'AvoDerm Tuna & Crab', 78, 85, 'can')
ON CONFLICT (id) DO NOTHING;

-- Weights
INSERT INTO weights (id, date, value) VALUES
  ('w1', '2026-04-09', 3.3)
ON CONFLICT (id) DO NOTHING;

-- Blood Work
INSERT INTO blood_work (id, date, cre, bun, sdma, phos, ca, k, tco2, fsaa, glu, alt_val, ast_val) VALUES
  ('lb1',  '2024-09-06', NULL, NULL, 9,    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('lb2',  '2025-12-11', 3.6,  55,   NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('lb3',  '2026-01-26', 6.2,  64,   14,   NULL, NULL, NULL, NULL, NULL, 123,  81,   NULL),
  ('lb4',  '2026-02-03', 4.7,  76,   NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('lb5',  '2026-02-14', 4.8,  55,   NULL, NULL, 11.5, NULL, 22,   NULL, NULL, NULL, NULL),
  ('lb6',  '2026-03-27', 10.5, 145,  NULL, 11.5, 11.6, 3.9,  20,   88.4, 112,  136,  89),
  ('lb7',  '2026-03-29', 7.3,  123,  NULL, 12.0, 11.8, 3.7,  21,   NULL, NULL, NULL, NULL),
  ('lb8',  '2026-04-02', 7.2,  138,  NULL, 12.8, 12.2, 5.1,  18,   NULL, 151,  NULL, NULL),
  ('lb9',  '2026-04-04', 6.9,  132,  42,   10.4, 11.9, 4.4,  NULL, NULL, 120,  NULL, NULL),
  ('lb10', '2026-04-05', 8.4,  132,  42,   NULL, NULL, NULL, NULL, 30,   NULL, NULL, NULL),
  ('lb11', '2026-04-06', 7.5,  118,  NULL, NULL, NULL, NULL, NULL, 12,   NULL, NULL, NULL),
  ('lb12', '2026-04-07', 7.5,  118,  43,   NULL, 12.7, 4.0,  19,   NULL, 120,  81,   40),
  ('lb13', '2026-04-09', 7.0,  110,  42,   NULL, 12.9, 4.8,  22,   NULL, 112,  61,   32)
ON CONFLICT (id) DO NOTHING;

-- Vet Appointments
INSERT INTO vet_appointments (id, date, location, tests) VALUES
  ('v1', '2026-04-12', 'Local vet', 'Check 1 - CRE, BUN, K, PHOS, CA'),
  ('v2', '2026-04-16', 'Local vet', 'Check 2 - CRE, BUN, K, PHOS, CA'),
  ('v3', '2026-04-24', 'Chulalongkorn University Hospital', 'Check 3 - Full panel + SDMA')
ON CONFLICT (id) DO NOTHING;

-- Grant access to all roles
GRANT ALL ON TABLE products TO anon, authenticated, service_role;
GRANT ALL ON TABLE feedings TO anon, authenticated, service_role;
GRANT ALL ON TABLE daily_meds TO anon, authenticated, service_role;
GRANT ALL ON TABLE weights TO anon, authenticated, service_role;
GRANT ALL ON TABLE respiratory_rates TO anon, authenticated, service_role;
GRANT ALL ON TABLE blood_work TO anon, authenticated, service_role;
GRANT ALL ON TABLE vet_appointments TO anon, authenticated, service_role;
