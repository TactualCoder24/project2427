import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

// Fix 1: btoa fails on non-Latin-1 chars (e.g. Hindi, emoji). Use TextEncoder instead.
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ── Token retrieval (server-side only) ───────────────────────────────────────

async function getToken(supabase: ReturnType<typeof createClient>, userId: string, provider: string): Promise<string> {
  const { data, error } = await supabase
    .from('agent_integrations')
    .select('access_token, status')
    .eq('user_id', userId)
    .eq('integration_name', provider)
    .single();
  if (error || !data) throw new Error(`${provider} not connected — go to Integration Hub`);
  if (data.status !== 'connected') throw new Error(`${provider} is ${data.status} — reconnect in Integration Hub`);
  return data.access_token as string;
}

// ── Agent implementations ─────────────────────────────────────────────────────

async function runGmail(action: string, input: Record<string, unknown>, token: string) {
  const auth = { Authorization: `Bearer ${token}` };

  if (action === 'check_connection') {
    const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', { headers: auth });
    if (!r.ok) throw new Error('Gmail token invalid — reconnect in Integration Hub');
    const d = await r.json();
    return { connected: true, email: d.emailAddress };
  }

  if (action === 'read_inbox') {
    const max = (input?.maxResults as number) || 5;
    const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&labelIds=INBOX`, { headers: auth });
    if (!r.ok) throw new Error(`Gmail list failed: ${r.status}`);
    const d = await r.json();
    const details = await Promise.all(
      (d.messages || []).slice(0, max).map(async (m: { id: string }) => {
        const mr = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
          { headers: auth }
        );
        const md = await mr.json();
        const h: Array<{ name: string; value: string }> = md.payload?.headers || [];
        return {
          id: m.id,
          subject: h.find(x => x.name === 'Subject')?.value || '(no subject)',
          from: h.find(x => x.name === 'From')?.value || '',
          snippet: md.snippet || '',
        };
      })
    );
    return { inbox: details, total: d.resultSizeEstimate || 0 };
  }

  if (action === 'send_email') {
    const to = input?.to as string;
    const subject = (input?.subject as string) || '(no subject)';
    const body = (input?.body as string) || (input?.message as string) || '';
    if (!to) throw new Error('send_email requires "to"');
    // Fix 1 applied: toBase64Url handles unicode safely
    const raw = toBase64Url(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\nMIME-Version: 1.0\r\n\r\n${body}`);
    const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    if (!r.ok) { const e = await r.json(); throw new Error(e?.error?.message || `Gmail send failed: ${r.status}`); }
    const d = await r.json();
    return { sent: true, messageId: d.id, to, subject };
  }

  throw new Error(`GmailAgent: unknown action "${action}"`);
}

async function runSlack(action: string, input: Record<string, unknown>, token: string) {
  // Fix 2: Slack API always requires POST — even auth.test. Using GET returns 404.
  const api = async (endpoint: string, body?: Record<string, unknown>) => {
    const r = await fetch(`https://slack.com/api/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    const d = await r.json();
    if (!d.ok) throw new Error(`Slack error on ${endpoint}: ${d.error}`);
    return d;
  };

  if (action === 'check_connection') {
    const d = await api('auth.test');
    return { connected: true, team: d.team, user: d.user, url: d.url };
  }
  if (action === 'post_message') {
    const channel = `#${((input?.channel as string) || 'general').replace(/^#/, '')}`;
    const text = (input?.text as string) || (input?.message as string);
    if (!text) throw new Error('post_message requires "text" or "message"');
    const d = await api('chat.postMessage', { channel, text });
    return { posted: true, channel: d.channel, ts: d.ts };
  }
  if (action === 'list_channels') {
    const d = await api('conversations.list', { limit: 10 });
    return { channels: (d.channels || []).map((c: { name: string; num_members: number }) => ({ name: c.name, members: c.num_members })) };
  }

  throw new Error(`SlackAgent: unknown action "${action}"`);
}

async function runGitHub(action: string, input: Record<string, unknown>, token: string) {
  const api = async (path: string, body?: Record<string, unknown>) => {
    const r = await fetch(`https://api.github.com${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e as { message?: string }).message || `GitHub: ${r.status}`); }
    return r.json();
  };

  if (action === 'check_connection') { const d = await api('/user'); return { connected: true, username: d.login, repos: d.public_repos }; }
  if (action === 'list_repos') {
    const d: Array<{ full_name: string; stargazers_count: number; language: string; html_url: string }> = await api('/user/repos?sort=updated&per_page=10');
    return { repos: d.map(r => ({ name: r.full_name, stars: r.stargazers_count, language: r.language, url: r.html_url })) };
  }
  if (action === 'create_issue') {
    const repo = input?.repo as string;
    const title = input?.title as string;
    if (!repo || !title) throw new Error('create_issue requires "repo" (owner/name) and "title"');
    const d = await api(`/repos/${repo}/issues`, { title, body: (input?.body as string) || '', labels: (input?.labels as string[]) || [] });
    return { created: true, number: d.number, url: d.html_url };
  }

  throw new Error(`GitHubAgent: unknown action "${action}"`);
}

async function runNotion(action: string, input: Record<string, unknown>) {
  const key = Deno.env.get('NOTION_API_KEY');
  if (!key) throw new Error('NOTION_API_KEY not set in Edge Function secrets');
  const api = async (path: string, body?: Record<string, unknown>) => {
    const r = await fetch(`https://api.notion.com/v1${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${key}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e as { message?: string }).message || `Notion: ${r.status}`); }
    return r.json();
  };

  if (action === 'search') {
    const d = await api('/search', { query: input?.query || '', page_size: 5 });
    return { results: (d.results || []).map((r: { id: string; properties?: { title?: { title?: Array<{ text?: { content?: string } }> } }; url: string }) => ({ id: r.id, title: r.properties?.title?.title?.[0]?.text?.content || '(untitled)', url: r.url })) };
  }
  if (action === 'create_page') {
    const databaseId = input?.databaseId as string;
    const title = input?.title as string;
    if (!databaseId || !title) throw new Error('create_page requires "databaseId" and "title"');
    const d = await api('/pages', { parent: { database_id: databaseId }, properties: { title: { title: [{ text: { content: title } }] } } });
    return { created: true, pageId: d.id, url: d.url };
  }

  throw new Error(`NotionAgent: unknown action "${action}"`);
}

async function runCalendar(action: string, input: Record<string, unknown>, token: string) {
  const api = async (path: string, body?: Record<string, unknown>) => {
    const r = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error((e as { error?: { message?: string } })?.error?.message || `Calendar: ${r.status}`); }
    return r.json();
  };

  if (action === 'list_events') {
    const now = new Date().toISOString();
    const d = await api(`/calendars/primary/events?timeMin=${encodeURIComponent(now)}&singleEvents=true&orderBy=startTime&maxResults=${(input?.limit as number) || 5}`);
    return { events: (d.items || []).map((e: { summary: string; start?: { dateTime?: string; date?: string }; htmlLink: string }) => ({ title: e.summary, start: e.start?.dateTime || e.start?.date, url: e.htmlLink })) };
  }

  if (action === 'check_availability') {
    const now = new Date().toISOString();
    // Fix 3: Default timeMax to 24h from now — empty string causes Calendar API 400
    const timeMax = (input?.to as string) || new Date(Date.now() + 86400000).toISOString();
    const d = await api(`/calendars/primary/events?timeMin=${encodeURIComponent((input?.from as string) || now)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true`);
    return { available: !d.items?.length, busySlots: (d.items || []).map((e: { summary: string; start?: { dateTime?: string } }) => ({ title: e.summary, start: e.start?.dateTime })) };
  }

  if (action === 'create_event') {
    const title = (input?.title as string) || (input?.summary as string);
    const startStr = input?.start as string;
    if (!title || !startStr) throw new Error('create_event requires "title" and "start" (ISO datetime)');
    const start = new Date(startStr);
    const end = input?.end ? new Date(input.end as string) : new Date(start.getTime() + 3600000);
    const d = await api('/calendars/primary/events', {
      summary: title,
      description: (input?.description as string) || '',
      start: { dateTime: start.toISOString(), timeZone: 'Asia/Kolkata' },
      end: { dateTime: end.toISOString(), timeZone: 'Asia/Kolkata' },
      attendees: ((input?.attendees as string[]) || []).map(e => ({ email: e })),
    });
    return { created: true, eventId: d.id, url: d.htmlLink, title: d.summary };
  }

  throw new Error(`CalendarAgent: unknown action "${action}"`);
}

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing Authorization header' }, 401);

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Fix 4: Safe destructuring — data can be null if JWT is invalid, causing a crash
    const { data: authData, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    ).auth.getUser(authHeader.replace('Bearer ', ''));
    const user = authData?.user;
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const { agent, action, input = {} } = await req.json();
    if (!agent || !action) return json({ error: 'agent and action are required' }, 400);

    const act = (action as string).toLowerCase().replace(/\s+/g, '_');
    let result: unknown;

    switch (agent) {
      case 'GmailAgent':         { const t = await getToken(supabase, user.id, 'gmail');   result = await runGmail(act, input, t);    break; }
      case 'SlackAgent':         { const t = await getToken(supabase, user.id, 'slack');   result = await runSlack(act, input, t);    break; }
      case 'GitHubAgent':        { const t = await getToken(supabase, user.id, 'github');  result = await runGitHub(act, input, t);   break; }
      case 'NotionAgent':        {                                                           result = await runNotion(act, input);      break; }
      case 'GoogleCalendarAgent':{ const t = await getToken(supabase, user.id, 'gmail');   result = await runCalendar(act, input, t); break; }
      default: return json({ error: `Unknown agent: ${agent}` }, 400);
    }

    return json({ success: true, agent, action, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ success: false, error: message }, 500);
  }
});
