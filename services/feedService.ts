import { supabase } from '@/lib/supabase';

export interface FeedSettings {
    id: string;
    user_id: string;
    is_enabled: boolean;
    feed_token: string;
    include_all_properties: boolean;
    include_available_only: boolean;
    include_leads: boolean;
    property_statuses: string[];
    webhook_url: string | null;
    access_count: number;
    last_accessed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface FeedAccessLog {
    id: string;
    user_id: string;
    feed_token: string;
    ip_address: string;
    user_agent: string;
    accessed_at: string;
}

export class FeedService {
    /**
     * Get feed settings for current user
     */
    async getFeedSettings(): Promise<FeedSettings | null> {
        const { data, error } = await supabase
            .from('feed_settings')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching feed settings:', error);
            return null;
        }

        return data;
    }

    /**
     * Get feed settings by token (for public feed access)
     */
    async getFeedSettingsByToken(token: string): Promise<FeedSettings | null> {
        const { data, error } = await supabase
            .from('feed_settings')
            .select('*')
            .eq('feed_token', token)
            .single();

        if (error) {
            console.error('Error fetching feed settings by token:', error);
            return null;
        }

        return data;
    }

    /**
     * Update feed settings
     */
    async updateFeedSettings(settings: Partial<FeedSettings>): Promise<boolean> {
        const { error } = await supabase
            .from('feed_settings')
            .update(settings)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (error) {
            console.error('Error updating feed settings:', error);
            return false;
        }

        return true;
    }

    /**
     * Toggle feed enabled/disabled
     */
    async toggleFeed(enabled: boolean): Promise<boolean> {
        return this.updateFeedSettings({ is_enabled: enabled });
    }

    /**
     * Regenerate feed token
     */
    async regenerateFeedToken(): Promise<string | null> {
        // Call Supabase function to generate new token
        const { data, error } = await supabase.rpc('generate_feed_token');

        if (error) {
            console.error('Error generating feed token:', error);
            return null;
        }

        const newToken = data as string;

        // Update feed settings with new token
        const updated = await this.updateFeedSettings({ feed_token: newToken });

        if (!updated) {
            return null;
        }

        return newToken;
    }

    /**
     * Log feed access
     */
    async logFeedAccess(userId: string, feedToken: string, ipAddress: string, userAgent: string): Promise<void> {
        await supabase
            .from('feed_access_logs')
            .insert({
                user_id: userId,
                feed_token: feedToken,
                ip_address: ipAddress,
                user_agent: userAgent,
            });

        // Increment access count
        await supabase.rpc('increment_feed_access_count', { token: feedToken });
    }

    /**
     * Get feed access statistics
     */
    async getFeedStats(): Promise<{ totalAccess: number; lastAccessed: string | null; totalProperties: number }> {
        const settings = await this.getFeedSettings();

        if (!settings) {
            return { totalAccess: 0, lastAccessed: null, totalProperties: 0 };
        }

        // Get total properties count
        const { count } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true });

        return {
            totalAccess: settings.access_count,
            lastAccessed: settings.last_accessed_at,
            totalProperties: count || 0,
        };
    }

    /**
     * Send webhook notification
     */
    async sendWebhookNotification(webhookUrl: string, event: string): Promise<boolean> {
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event,
                    timestamp: new Date().toISOString(),
                }),
            });

            return response.ok;
        } catch (error) {
            console.error('Webhook notification error:', error);
            return false;
        }
    }
}

export const feedService = new FeedService();
