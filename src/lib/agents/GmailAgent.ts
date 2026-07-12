import { getAccessToken } from '../oauthService';

function makeRawEmail(to: string, subject: string, body: string, from?: string): string {
    const lines = [
        from ? `From: ${from}` : '',
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        body,
    ].filter(Boolean);
    const raw = lines.join('\r\n');
    return btoa(unescape(encodeURIComponent(raw)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function gmailSendEmail(input: any): Promise<any> {
    const token = await getAccessToken('gmail');
    const { to, subject = '(no subject)', body = '', message } = input;
    if (!to) throw new Error('GmailAgent: recipient "to" is required');

    const raw = makeRawEmail(to, subject, body || message || '');
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Gmail send failed: ${err?.error?.message || res.status}`);
    }
    const data = await res.json();
    return { sent: true, messageId: data.id, to, subject };
}

export async function gmailReadInbox(input: any): Promise<any> {
    const token = await getAccessToken('gmail');
    const maxResults = input?.maxResults || 5;
    const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`Gmail list failed: ${res.status}`);
    const data = await res.json();
    const messages = data.messages || [];

    // Fetch snippet for each message
    const details = await Promise.all(
        messages.slice(0, 5).map(async (m: any) => {
            const r = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!r.ok) return { id: m.id };
            const d = await r.json();
            const headers: any[] = d.payload?.headers || [];
            return {
                id: m.id,
                subject: headers.find((h: any) => h.name === 'Subject')?.value || '(no subject)',
                from: headers.find((h: any) => h.name === 'From')?.value || '',
                snippet: d.snippet || '',
            };
        })
    );
    return { inbox: details, total: data.resultSizeEstimate || 0 };
}

export async function gmailCheckConnection(): Promise<any> {
    try {
        const token = await getAccessToken('gmail');
        const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return { connected: false, message: 'Gmail token invalid — reconnect in Integration Hub' };
        const data = await res.json();
        return { connected: true, email: data.emailAddress, messagesTotal: data.messagesTotal };
    } catch {
        return { connected: false, message: 'Gmail not connected — go to Integration Hub' };
    }
}
