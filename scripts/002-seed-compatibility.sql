INSERT INTO compatibility (target, result) VALUES
  ('sUNC', '100%'),
  ('Myriad', '99%'),
  ('UNC', '96%')
ON CONFLICT (target) DO UPDATE SET result = EXCLUDED.result;
