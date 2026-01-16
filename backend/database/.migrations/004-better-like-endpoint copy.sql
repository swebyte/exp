-- Function to decrement likes for a blog post
CREATE OR REPLACE FUNCTION api.dec_blog_likes(blog_id integer)
RETURNS TABLE(id integer, likes integer) AS $$
UPDATE api.blog
SET likes = GREATEST(likes - 1, 0)
WHERE id = blog_id
RETURNING id, likes;
$$ LANGUAGE sql VOLATILE;

GRANT EXECUTE ON FUNCTION api.dec_blog_likes(integer) TO anon, authenticated;

CREATE OR REPLACE FUNCTION api.inc_blog_likes(blog_id integer)
RETURNS TABLE(id integer, likes integer) AS $$
UPDATE api.blog
SET likes = likes + 1
WHERE id = blog_id
RETURNING id, likes;
$$ LANGUAGE sql VOLATILE;

GRANT EXECUTE ON FUNCTION api.inc_blog_likes(integer) TO anon, authenticated;