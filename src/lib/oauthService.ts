// OAuth Service - Handles OAuth flows for third-party integrations
import { agentIntegrationService } from './supabaseAgentService';

export interface OAuthConfig {
    clientId: string;
    // clientSecret removed - should only be used server-side (Supabase Edge Functions)
    redirectUri: string;
    scopes: string[];
    authUrl: string;
    // tokenUrl removed - token exchange should happen server-side only
}

// OAuth configurations for each provider
// NOTE: Client secrets are NOT included here for security
// Token exchange must happen server-side via Supabase Edge Functions
const oauthConfigs: Record<string, OAuthConfig> = {
    gmail: {
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || '',
        scopes: [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify'
        ],
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
    },
    slack: {
        clientId: process.env.REACT_APP_SLACK_CLIENT_ID || '',
        redirectUri: process.env.REACT_APP_SLACK_REDIRECT_URI || '',
        scopes: [
            'chat:write',
            'channels:read',
            'channels:write',
            'files:write',
            'users:read'
        ],
        authUrl: 'https://slack.com/oauth/v2/authorize'
    },
    github: {
        clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
        redirectUri: process.env.REACT_APP_GITHUB_REDIRECT_URI || '',
        scopes: ['repo', 'user', 'workflow', 'read:org'],
        authUrl: 'https://github.com/login/oauth/authorize'
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
 * 
 * SECURITY NOTE: This implementation is for development only.
 * For production, you should either:
 * 1. Use PKCE (Proof Key for Code Exchange) - no client secret needed
 * 2. Use a backend API to handle token exchange (Vercel Serverless Functions)
 * 
 * Current implementation stores client secrets in Vercel env vars (build-time only)
 */
export const handleOAuthCallback = async (provider: string, code: string) => {
    const config = oauthConfigs[provider];

    if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    console.log(`Handling OAuth callback for ${provider}`);
    console.warn('⚠️ OAuth implementation needs PKCE or backend API for production security');

    try {
        // For now, store the code and mark integration as pending
        // In production, implement PKCE or use Vercel Serverless Function
        await agentIntegrationService.upsert({
            integration_name: provider,
            integration_type: 'oauth',
            access_token: '', // Will be set after proper token exchange
            refresh_token: '',
            token_expires_at: undefined,
            scopes: config.scopes,
            metadata: {
                authorization_code: code,
                redirect_uri: config.redirectUri
            },
            status: 'pending', // Mark as pending until proper implementation
            connected_at: new Date().toISOString()
        });

        console.log(`${provider} OAuth code received - awaiting token exchange`);

        return {
            success: true,
            provider,
            accessToken: '' // Empty until proper implementation
        };

    } catch (error) {
        console.error(`OAuth callback error for ${provider}:`, error);
        throw error;
    }
};

/**
 * Refresh an expired OAuth token
 * NOTE: Currently not implemented - requires backend API for security
 */
export const refreshOAuthToken = async (provider: string): Promise<string> => {
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
            return integration.access_token || '';
        }
    }

    console.log(`Token refresh for ${provider} - needs proper implementation`);

    // For production, implement token refresh via backend API
    throw new Error('Token refresh requires backend implementation for security');
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

