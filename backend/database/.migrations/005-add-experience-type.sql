ALTER TABLE api.experience 
ADD column if not exists type integer default 1;

ALTER TABLE api.experience 
ADD COLUMN IF NOT EXISTS order integer;