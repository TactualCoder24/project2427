const NOTION_KEY = process.env.REACT_APP_NOTION_API_KEY || '';
const NOTION_VERSION = '2022-06-28';

async function notionApi(path: string, body?: any): Promise<any> {
    if (!NOTION_KEY) throw new Error('NotionAgent: REACT_APP_NOTION_API_KEY not set in .env');
    const res = await fetch(`https://api.notion.com/v1${path}`, {
        method: body ? 'POST' : 'GET',
        headers: {
            Authorization: `Bearer ${NOTION_KEY}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Notion API error: ${err.message || res.status}`);
    }
    return res.json();
}

export async function notionCreatePage(input: any): Promise<any> {
    const { databaseId, title, content = '' } = input;
    if (!databaseId || !title) throw new Error('NotionAgent: "databaseId" and "title" are required');

    const data = await notionApi('/pages', {
        parent: { database_id: databaseId },
        properties: {
            title: { title: [{ text: { content: title } }] },
        },
        children: content ? [{
            object: 'block',
            type: 'paragraph',
            paragraph: { rich_text: [{ text: { content } }] },
        }] : [],
    });
    return { created: true, pageId: data.id, url: data.url, title };
}

export async function notionSearch(input: any): Promise<any> {
    const { query } = input;
    if (!query) throw new Error('NotionAgent: "query" is required');
    const data = await notionApi('/search', { query, page_size: 5 });
    const results = (data.results || []).map((r: any) => ({
        id: r.id,
        type: r.object,
        title: r.properties?.title?.title?.[0]?.text?.content || r.properties?.Name?.title?.[0]?.text?.content || '(untitled)',
        url: r.url,
    }));
    return { results, total: data.results?.length || 0 };
}
