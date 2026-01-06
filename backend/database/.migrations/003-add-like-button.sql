ALTER TABLE api.blog 
ADD COLUMN IF NOT EXISTS likes bigint DEFAULT 0;

ALTER TABLE api.users
ADD COLUMN IF NOT EXISTS fullname text;

GRANT UPDATE (likes) ON api.blog TO anon;
GRANT SELECT (id, fullname) ON api.users TO anon;
GRANT SELECT, UPDATE on api.users to authenticated;