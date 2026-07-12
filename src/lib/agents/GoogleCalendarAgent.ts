import { getAccessToken } from '../oauthService';

async function calendarApi(path: string, token: string, body?: any): Promise<any> {
    const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Calendar API error: ${err?.error?.message || res.status}`);
    }
    return res.json();
}

export async function calendarCreateEvent(input: any): Promise<any> {
    const token = await getAccessToken('gmail'); // Calendar uses the same Google OAuth token
    const { title, summary, start, end, attendees = [], description = '', calendarId = 'primary' } = input;
    const eventTitle = title || summary;
    if (!eventTitle || !start) throw new Error('CalendarAgent: "title" and "start" (ISO datetime) are required');

    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date(startTime.getTime() + 60 * 60 * 1000); // default 1 hour

    const event = {
        summary: eventTitle,
        description,
        start: { dateTime: startTime.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: endTime.toISOString(), timeZone: 'Asia/Kolkata' },
        attendees: attendees.map((email: string) => ({ email })),
    };

    const data = await calendarApi(`/calendars/${calendarId}/events`, token, event);
    return { created: true, eventId: data.id, url: data.htmlLink, title: data.summary, start: data.start.dateTime };
}

export async function calendarCheckAvailability(input: any): Promise<any> {
    const token = await getAccessToken('gmail');
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const timeMin = input?.from ? new Date(input.from).toISOString() : now.toISOString();
    const timeMax = input?.to ? new Date(input.to).toISOString() : tomorrow.toISOString();

    const data = await calendarApi(
        `/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=10`,
        token
    );
    const events = (data.items || []).map((e: any) => ({
        title: e.summary,
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
    }));
    return { available: events.length === 0, busySlots: events, from: timeMin, to: timeMax };
}

export async function calendarListEvents(input: any): Promise<any> {
    const token = await getAccessToken('gmail');
    const now = new Date().toISOString();
    const data = await calendarApi(
        `/calendars/primary/events?timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=${input?.limit || 5}`,
        token
    );
    const events = (data.items || []).map((e: any) => ({
        title: e.summary,
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        url: e.htmlLink,
    }));
    return { events, count: events.length };
}
