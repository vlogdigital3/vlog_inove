-- Function to increment feed access count
CREATE OR REPLACE FUNCTION increment_feed_access_count(token VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE feed_settings
    SET 
        access_count = access_count + 1,
        last_accessed_at = NOW()
    WHERE feed_token = token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_feed_access_count(VARCHAR) TO anon, authenticated;
