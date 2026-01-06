-- Migration #001: Add user relationships and auto-set user_id trigger

-- Add user_id column to blog table
ALTER TABLE api.blog 
ADD COLUMN IF NOT EXISTS user_id bigint;

-- Add foreign key constraint
ALTER TABLE api.blog
ADD CONSTRAINT fk_blog_user 
FOREIGN KEY (user_id) REFERENCES api.users(id) ON DELETE SET NULL;

-- Add user_id column to experience table
ALTER TABLE api.experience 
ADD COLUMN IF NOT EXISTS user_id bigint;

-- Add foreign key constraint
ALTER TABLE api.experience
ADD CONSTRAINT fk_experience_user 
FOREIGN KEY (user_id) REFERENCES api.users(id) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_user_id ON api.blog(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_user_id ON api.experience(user_id);

-- Function to automatically set user_id from JWT claims
CREATE OR REPLACE FUNCTION api.set_user_id()
RETURNS TRIGGER AS $$
DECLARE
  jwt_user_id TEXT;
BEGIN
  -- Get user_id from JWT token claims
  jwt_user_id := current_setting('request.jwt.claims', true);
  
  -- If we have a JWT claim with user_id, use it
  IF jwt_user_id IS NOT NULL THEN
    NEW.user_id := (jwt_user_id::json->>'user_id')::bigint;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for blog table
CREATE TRIGGER set_blog_user_id
  BEFORE INSERT ON api.blog
  FOR EACH ROW
  EXECUTE FUNCTION api.set_user_id();

-- Trigger for experience table
CREATE TRIGGER set_experience_user_id
  BEFORE INSERT ON api.experience
  FOR EACH ROW
  EXECUTE FUNCTION api.set_user_id();
