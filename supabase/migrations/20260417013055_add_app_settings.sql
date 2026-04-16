CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access on app_settings" ON app_settings USING (true) WITH CHECK (true);
GRANT ALL ON TABLE app_settings TO anon, authenticated, service_role;

INSERT INTO app_settings (key, value) VALUES ('day_start_hour', '0'::jsonb)
ON CONFLICT (key) DO NOTHING;
