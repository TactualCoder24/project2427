import { getAccessToken } from '../oauthService';

async function slackApi(endpoint: string, token: string, body?: any): Promise<any> {
    const res = await fetch(`https://slack.com/api/${endpoint}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`Slack API error: ${data.error}`);
    return data;
}

export async function slackPostMessage(input: any): Promise<any> {
    const token = await getAccessToken('slack');
    const { channel = 'general', text, message } = input;
    const content = text || message;
    if (!content) throw new Error('SlackAgent: "text" or "message" is required');

    const data = await slackApi('chat.postMessage', token, { channel: `#${channel.replace(/^#/, '')}`, text: content });
    return { posted: true, channel: data.channel, ts: data.ts, message: content };
}

export async function slackListChannels(input: any): Promise<any> {
    const token = await getAccessToken('slack');
    const data = await slackApi('conversations.list', token);
    const channels = (data.channels || []).slice(0, input?.limit || 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        memberCount: c.num_members,
        isPrivate: c.is_private,
    }));
    return { channels, total: data.channels?.length || 0 };
}

export async function slackCheckConnection(): Promise<any> {
    try {
        const token = await getAccessToken('slack');
        const data = await slackApi('auth.test', token);
        return { connected: true, team: data.team, user: data.user, url: data.url };
    } catch {
        return { connected: false, message: 'Slack not connected — go to Integration Hub' };
    }
}
