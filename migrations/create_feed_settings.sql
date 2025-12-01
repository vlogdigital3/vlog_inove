-- Feed Settings Table
CREATE TABLE IF NOT EXISTS feed_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT false,
    feed_token VARCHAR(255) UNIQUE NOT NULL,
    include_all_properties BOOLEAN DEFAULT true,
    include_available_only BOOLEAN DEFAULT false,
    include_leads BOOLEAN DEFAULT false,
    property_statuses TEXT[] DEFAULT ARRAY['Disponível'],
    webhook_url VARCHAR(500),
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Feed Access Logs Table
CREATE TABLE IF NOT EXISTS feed_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feed_token VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feed_settings_user_id ON feed_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_settings_token ON feed_settings(feed_token);
CREATE INDEX IF NOT EXISTS idx_feed_access_logs_user_id ON feed_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_access_logs_accessed_at ON feed_access_logs(accessed_at DESC);

-- Function to generate unique feed token
CREATE OR REPLACE FUNCTION generate_feed_token()
RETURNS VARCHAR(255) AS $$
DECLARE
    new_token VARCHAR(255);
    token_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random UUID-based token
        new_token := REPLACE(gen_random_uuid()::TEXT, '-', '');
        
        -- Check if token already exists
        SELECT EXISTS(SELECT 1 FROM feed_settings WHERE feed_token = new_token) INTO token_exists;
        
        -- Exit loop if token is unique
        EXIT WHEN NOT token_exists;
    END LOOP;
    
    RETURN new_token;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_feed_settings_updated_at
    BEFORE UPDATE ON feed_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE feed_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies for feed_settings
CREATE POLICY "Users can view their own feed settings"
    ON feed_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feed settings"
    ON feed_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feed settings"
    ON feed_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feed settings"
    ON feed_settings FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for feed_access_logs
CREATE POLICY "Users can view their own feed access logs"
    ON feed_access_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Function to initialize feed settings for new users
CREATE OR REPLACE FUNCTION initialize_feed_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO feed_settings (user_id, feed_token)
    VALUES (NEW.id, generate_feed_token());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create feed settings for new users
CREATE TRIGGER on_user_created_initialize_feed
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_feed_settings();

-- Grant permissions
GRANT ALL ON feed_settings TO authenticated;
GRANT ALL ON feed_access_logs TO authenticated;
