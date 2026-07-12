import { getAccessToken } from '../oauthService';

async function githubApi(path: string, token: string, body?: any): Promise<any> {
    const res = await fetch(`https://api.github.com${path}`, {
        method: body ? 'POST' : 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`GitHub API error: ${err.message || res.status}`);
    }
    return res.json();
}

export async function githubCreateIssue(input: any): Promise<any> {
    const token = await getAccessToken('github');
    const { repo, title, body = '', labels = [] } = input;
    if (!repo || !title) throw new Error('GitHubAgent: "repo" (owner/name) and "title" are required');

    const data = await githubApi(`/repos/${repo}/issues`, token, { title, body, labels });
    return { created: true, issueNumber: data.number, url: data.html_url, title: data.title };
}

export async function githubListRepos(input: any): Promise<any> {
    const token = await getAccessToken('github');
    const data: any[] = await githubApi('/user/repos?sort=updated&per_page=10', token);
    return {
        repos: data.slice(0, input?.limit || 10).map((r: any) => ({
            name: r.full_name,
            description: r.description,
            stars: r.stargazers_count,
            language: r.language,
            url: r.html_url,
        })),
    };
}

export async function githubCheckConnection(): Promise<any> {
    try {
        const token = await getAccessToken('github');
        const data = await githubApi('/user', token);
        return { connected: true, username: data.login, name: data.name, publicRepos: data.public_repos };
    } catch {
        return { connected: false, message: 'GitHub not connected — go to Integration Hub' };
    }
}
