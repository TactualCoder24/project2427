// OAuth Service - Handles OAuth flows for third-party integrations
import { agentIntegrationService } from './supabaseAgentService';

export interface OAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
    authUrl: string;
    tokenUrl: string;
}

// OAuth configurations for each provider
const oauthConfigs: Record<string, OAuthConfig> = {
    gmail: {
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
        redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || '',
        scopes: [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify'
        ],
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token'
    },
    slack: {
        clientId: process.env.REACT_APP_SLACK_CLIENT_ID || '',
        clientSecret: process.env.REACT_APP_SLACK_CLIENT_SECRET || '',
        redirectUri: process.env.REACT_APP_SLACK_REDIRECT_URI || '',
        scopes: [
            'chat:write',
            'channels:read',
            'channels:write',
            'files:write',
            'users:read'
        ],
        authUrl: 'https://slack.com/oauth/v2/authorize',
        tokenUrl: 'https://slack.com/api/oauth.v2.access'
    },
    github: {
        clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET || '',
        redirectUri: process.env.REACT_APP_GITHUB_REDIRECT_URI || '',
        scopes: ['repo', 'user', 'workflow', 'read:org'],
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token'
    }
};

/**
 * Initiate OAuth flow by redirecting to provider's authorization page
 */
export const initiateOAuth = (provider: string) => {
    const config = oauthConfigs[provider];

    if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    if (!config.clientId) {
        throw new Error(`${provider} OAuth not configured. Please add credentials to .env file.`);
    }

    // Build authorization URL with proper parameters
    const params: Record<string, string> = {
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' ')
    };

    // Add provider-specific parameters
    if (provider === 'gmail') {
        params.access_type = 'offline'; // Request refresh token
        params.prompt = 'consent'; // Always show consent screen
    } else if (provider === 'slack') {
        params.user_scope = 'identity.basic,identity.email';
    }

    const urlParams = new URLSearchParams(params);
    const authUrl = `${config.authUrl}?${urlParams.toString()}`;

    console.log(`Initiating OAuth for ${provider}:`, authUrl);
    console.log('Redirect URI:', config.redirectUri);

    // Redirect to OAuth provider
    window.location.href = authUrl;
};

/**
 * Handle OAuth callback and exchange code for tokens
 */
export const handleOAuthCallback = async (provider: string, code: string) => {
    const config = oauthConfigs[provider];

    if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    console.log(`Handling OAuth callback for ${provider}`);

    try {
        // Exchange authorization code for tokens
        const tokenParams = new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri: config.redirectUri,
            grant_type: 'authorization_code'
        });

        const response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: tokenParams.toString()
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error_description || data.error);
        }

        // Extract tokens (different providers return different structures)
        let accessToken = data.access_token;
        let refreshToken = data.refresh_token;

        // Slack returns tokens in a nested structure
        if (provider === 'slack' && data.authed_user) {
            accessToken = data.authed_user.access_token;
            refreshToken = data.authed_user.refresh_token;
        }

        // Calculate token expiration
        const expiresAt = data.expires_in
            ? new Date(Date.now() + data.expires_in * 1000).toISOString()
            : undefined;

        // Store integration in database
        await agentIntegrationService.upsert({
            integration_name: provider,
            integration_type: 'oauth',
            access_token: accessToken,
            refresh_token: refreshToken,
            token_expires_at: expiresAt,
            scopes: config.scopes,
            metadata: {
                token_type: data.token_type,
                scope: data.scope
            },
            status: 'connected',
            connected_at: new Date().toISOString()
        });

        console.log(`${provider} OAuth successful`);

        return {
            success: true,
            provider,
            accessToken
        };

    } catch (error) {
        console.error(`OAuth callback error for ${provider}:`, error);
        throw error;
    }
};

/**
 * Refresh an expired OAuth token
 */
export const refreshOAuthToken = async (provider: string) => {
    const config = oauthConfigs[provider];

    if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    // Get current integration
    const integration = await agentIntegrationService.getByName(provider);

    if (!integration || !integration.refresh_token) {
        throw new Error(`No refresh token available for ${provider}`);
    }

    // Check if token is still valid
    if (integration.token_expires_at) {
        const expiresAt = new Date(integration.token_expires_at);
        const now = new Date();

        // If token expires in more than 5 minutes, return current token
        if (expiresAt.getTime() - now.getTime() > 5 * 60 * 1000) {
            return integration.access_token;
        }
    }

    console.log(`Refreshing token for ${provider}`);

    try {
        // Request new token
        const refreshParams = new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            refresh_token: integration.refresh_token,
            grant_type: 'refresh_token'
        });

        const response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: refreshParams.toString()
        });

        const data = await response.json();

        if (data.error) {
            // Token refresh failed - mark integration as expired
            await agentIntegrationService.updateStatus(integration.id, 'expired');
            throw new Error(data.error_description || data.error);
        }

        // Update integration with new token
        const expiresAt = data.expires_in
            ? new Date(Date.now() + data.expires_in * 1000).toISOString()
            : undefined;

        await agentIntegrationService.update(integration.id, {
            access_token: data.access_token,
            refresh_token: data.refresh_token || integration.refresh_token,
            token_expires_at: expiresAt,
            status: 'connected'
        });

        console.log(`Token refreshed for ${provider}`);

        return data.access_token;

    } catch (error) {
        console.error(`Token refresh error for ${provider}:`, error);
        throw error;
    }
};

/**
 * Get a valid access token (refreshing if necessary)
 */
export const getAccessToken = async (provider: string): Promise<string> => {
    const integration = await agentIntegrationService.getByName(provider);

    if (!integration) {
        throw new Error(`${provider} is not connected. Please connect it first.`);
    }

    if (integration.status === 'expired') {
        // Try to refresh
        return await refreshOAuthToken(provider);
    }

    if (integration.status !== 'connected') {
        throw new Error(`${provider} integration is ${integration.status}`);
    }

    // Check if token needs refresh
    if (integration.token_expires_at) {
        const expiresAt = new Date(integration.token_expires_at);
        const now = new Date();

        // Refresh if expires in less than 5 minutes
        if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
            return await refreshOAuthToken(provider);
        }
    }

    return integration.access_token || '';
};

/**
 * Disconnect an integration
 */
export const disconnectIntegration = async (provider: string) => {
    const integration = await agentIntegrationService.getByName(provider);

    if (integration) {
        await agentIntegrationService.updateStatus(integration.id, 'disconnected');
    }
};

/**
 * Check if an integration is connected
 */
export const isConnected = async (provider: string): Promise<boolean> => {
    const integration = await agentIntegrationService.getByName(provider);
    return integration?.status === 'connected';
};
