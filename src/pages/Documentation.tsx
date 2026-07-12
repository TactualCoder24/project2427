import React, { useState } from 'react';

type Tab = 'api' | 'workflows' | 'integrations';

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'typescript' }) => (
    <div className="relative my-4">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border border-edge rounded-t-xl">
            <span className="text-xs text-ink-2 font-mono">{language}</span>
        </div>
        <pre className="bg-black/40 border border-edge border-t-0 rounded-b-xl p-4 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono whitespace-pre">{code}</code>
        </pre>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-2xl font-bold font-inter text-ink mb-4 pb-2 border-b border-edge">{title}</h2>
        {children}
    </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold font-inter text-cyber-aqua mb-3">{title}</h3>
        {children}
    </div>
);

const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
    const styles = {
        info: 'bg-cyber-aqua/10 border-cyber-aqua/30 text-cyber-aqua',
        warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        tip: 'bg-neon-green/10 border-neon-green/30 text-neon-green',
    };
    const icons = { info: 'ℹ️', warning: '⚠️', tip: '💡' };
    return (
        <div className={`p-4 rounded-xl border my-4 ${styles[type]}`}>
            <span className="mr-2">{icons[type]}</span>
            <span className="font-inter text-sm">{children}</span>
        </div>
    );
};

// ─────────────────────────────────────────────
// Tab content components
// ─────────────────────────────────────────────

const APIDocsTab: React.FC = () => (
    <div>
        <Section title="Custom Agent API">
            <p className="text-ink-2 font-inter leading-relaxed mb-4">
                Custom agents extend the AgentOrchestrator with real integrations. Each agent handles a specific platform or action type.
            </p>
            <Callout type="info">
                Agents currently return stub responses. Connect real APIs by replacing the stub return values in <code className="font-mono text-xs bg-white/10 px-1 rounded">AgentOrchestrator.ts → executeStep()</code>.
            </Callout>
        </Section>

        <Section title="Agent Interface">
            <SubSection title="AgentStep type">
                <p className="text-ink-2 font-inter text-sm mb-2">Every agent receives a step object and must return a result object.</p>
                <CodeBlock language="typescript" code={`export interface AgentStep {
  agent: string;       // e.g. "GmailAgent"
  action: string;      // e.g. "send_email"
  input: any;          // parameters passed to the action
  output?: any;        // result after execution
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
}`} />
            </SubSection>

            <SubSection title="Adding a Custom Agent">
                <p className="text-ink-2 font-inter text-sm mb-2">
                    Add a new case inside <code className="font-mono text-xs bg-white/10 px-1 rounded">executeStep()</code> in <code className="font-mono text-xs bg-white/10 px-1 rounded">src/lib/agents/AgentOrchestrator.ts</code>:
                </p>
                <CodeBlock language="typescript" code={`case 'MyCustomAgent':
  if (step.action === 'do_something') {
    // Call your external API here
    const result = await fetch('https://api.example.com/action', {
      method: 'POST',
      headers: { Authorization: \`Bearer \${accessToken}\` },
      body: JSON.stringify(step.input)
    });
    const data = await result.json();
    return { success: true, data };
  }
  break;`} />
            </SubSection>

            <SubSection title="Registering the Agent in the Workflow Builder">
                <p className="text-ink-2 font-inter text-sm mb-2">
                    Add your agent to the <code className="font-mono text-xs bg-white/10 px-1 rounded">availableAgents</code> array in <code className="font-mono text-xs bg-white/10 px-1 rounded">src/pages/WorkflowBuilder.tsx</code>:
                </p>
                <CodeBlock language="typescript" code={`const availableAgents = [
  // ... existing agents
  {
    name: 'MyCustomAgent',
    actions: ['do_something', 'do_something_else']
  }
];`} />
            </SubSection>
        </Section>

        <Section title="Persona System Instructions API">
            <SubSection title="Setting a persona programmatically">
                <CodeBlock language="typescript" code={`import { orchestrator } from '../lib/agents/AgentOrchestrator';

// Activate a persona — its instructions become the system prompt
orchestrator.setPersona({
  id: 'persona-uuid',
  name: 'Marketing Assistant',
  instructions: 'You are a marketing expert...',
  icon: '📢',
  // ...other AgentPersona fields
});

// Get active persona
const persona = orchestrator.getActivePersona();

// Get just the instructions string (for LLM system prompt)
const systemPrompt = orchestrator.getSystemInstructions();

// Deactivate
orchestrator.setPersona(null);`} />
            </SubSection>
        </Section>

        <Section title="WorkflowExecutor API">
            <SubSection title="Running a workflow manually">
                <CodeBlock language="typescript" code={`import { WorkflowExecutor } from '../lib/agents/WorkflowExecutor';
import { agentWorkflowService } from '../lib/supabaseAgentService';

// Load a workflow from Supabase
const workflows = await agentWorkflowService.getAll();
const workflow = workflows[0];

// Execute it — creates execution record, runs steps, writes to agent_executions
await WorkflowExecutor.run(workflow, userId);`} />
            </SubSection>

            <SubSection title="Execution lifecycle">
                <div className="space-y-2 font-inter text-sm text-ink-2">
                    {[
                        ['1', 'Creates a row in agent_executions with status = running'],
                        ['2', 'Iterates steps — marks each running → completed / failed'],
                        ['3', 'Updates the execution row after each step via agentExecutionService.update()'],
                        ['4', 'On finish: calls agentExecutionService.complete() and increments run_count on the workflow'],
                        ['5', 'ExecutionDashboard receives the update via Supabase realtime subscription'],
                    ].map(([n, desc]) => (
                        <div key={n} className="flex gap-3 p-3 glass-premium rounded-lg">
                            <span className="text-cyber-aqua font-bold">{n}.</span>
                            <span>{desc}</span>
                        </div>
                    ))}
                </div>
            </SubSection>
        </Section>

        <Section title="Database Schema">
            <SubSection title="Key tables">
                <div className="overflow-x-auto">
                    <table className="w-full font-inter text-sm">
                        <thead>
                            <tr className="border-b border-edge">
                                <th className="text-left py-2 pr-4 text-ink-2">Table</th>
                                <th className="text-left py-2 pr-4 text-ink-2">Purpose</th>
                                <th className="text-left py-2 text-ink-2">Service</th>
                            </tr>
                        </thead>
                        <tbody className="text-ink-2">
                            {[
                                ['agent_workflows', 'Workflow definitions (name, steps, trigger)', 'agentWorkflowService'],
                                ['agent_executions', 'Execution history and step-level logs', 'agentExecutionService'],
                                ['agent_personas', 'Custom AI persona definitions', 'agentPersonaService'],
                                ['agent_integrations', 'OAuth tokens for third-party apps', 'agentIntegrationService'],
                            ].map(([table, purpose, service]) => (
                                <tr key={table} className="border-b border-edge">
                                    <td className="py-2 pr-4 font-mono text-xs text-cyber-aqua">{table}</td>
                                    <td className="py-2 pr-4">{purpose}</td>
                                    <td className="py-2 font-mono text-xs text-yellow-400">{service}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SubSection>
        </Section>
    </div>
);

const WorkflowGuideTab: React.FC = () => (
    <div>
        <Section title="Building Your First Workflow">
            <p className="text-ink-2 font-inter leading-relaxed mb-4">
                Workflows chain multiple AI agents together to automate multi-step tasks. Each workflow has a trigger (how it starts) and steps (what it does).
            </p>
            <Callout type="tip">
                Start with a manual-trigger workflow to test your steps before adding a schedule or webhook.
            </Callout>
        </Section>

        <Section title="Step 1 — Create a Workflow">
            <div className="space-y-4 font-inter text-sm text-ink-2">
                <div className="flex gap-4 p-4 glass-premium rounded-xl">
                    <span className="text-2xl">1.</span>
                    <div>
                        <p className="font-semibold text-ink mb-1">Go to Workflow Builder</p>
                        <p className="text-ink-2">Navigate to <code className="font-mono text-xs bg-white/10 px-1 rounded">/workflows</code> and click <strong>Create New Workflow</strong>.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 glass-premium rounded-xl">
                    <span className="text-2xl">2.</span>
                    <div>
                        <p className="font-semibold text-ink mb-1">Name & describe it</p>
                        <p className="text-ink-2">Give it a clear name like "Daily Slack Summary" and a description of what it does.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 glass-premium rounded-xl">
                    <span className="text-2xl">3.</span>
                    <div>
                        <p className="font-semibold text-ink mb-1">Choose a trigger</p>
                        <div className="mt-2 space-y-1">
                            {[
                                ['Manual', 'Run on-demand by clicking "Run Now"'],
                                ['Scheduled', 'Run at a fixed time (e.g. 9 AM daily) — requires background job setup'],
                                ['Webhook', 'Triggered by an external HTTP request'],
                                ['Event', 'Triggered by app events (e.g. new GitHub PR)'],
                            ].map(([type, desc]) => (
                                <div key={type} className="flex gap-2">
                                    <span className="text-cyber-aqua font-mono text-xs w-20 shrink-0">{type}</span>
                                    <span className="text-ink-2">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 p-4 glass-premium rounded-xl">
                    <span className="text-2xl">4.</span>
                    <div>
                        <p className="font-semibold text-ink mb-1">Add steps</p>
                        <p className="text-ink-2">Click <strong>+ Add Step</strong> and choose an agent and action for each step. Steps run sequentially — if one fails, the rest are marked failed.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-4 glass-premium rounded-xl">
                    <span className="text-2xl">5.</span>
                    <div>
                        <p className="font-semibold text-ink mb-1">Save & run</p>
                        <p className="text-ink-2">Click <strong>Create Workflow</strong>. It saves to Supabase. Then click <strong>▶ Run Now</strong> to execute it manually.</p>
                    </div>
                </div>
            </div>
        </Section>

        <Section title="Step 2 — Monitor Executions">
            <p className="text-ink-2 font-inter text-sm mb-4">
                Every run creates a record in the Execution Dashboard at <code className="font-mono text-xs bg-white/10 px-1 rounded">/executions</code>. You can see per-step status, duration, output, and error messages in real-time.
            </p>
            <Callout type="info">
                The dashboard subscribes to Supabase realtime — step statuses update live as the workflow runs without needing a page refresh.
            </Callout>
        </Section>

        <Section title="Available Agents & Actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { agent: 'GmailAgent', actions: ['Send email', 'Read inbox', 'Search emails'], status: 'live', note: 'Connect Gmail in Integration Hub' },
                    { agent: 'SlackAgent', actions: ['Post message', 'Create channel', 'Upload file'], status: 'live', note: 'Connect Slack in Integration Hub' },
                    { agent: 'NotionAgent', actions: ['Create page', 'Update database', 'Search'], status: 'live', note: 'Connect Notion in Integration Hub' },
                    { agent: 'GitHubAgent', actions: ['Create issue', 'Manage PR', 'Get commits'], status: 'live', note: 'Connect GitHub in Integration Hub' },
                    { agent: 'SearchAgent', actions: ['Web search', 'Find information'], status: 'stub', note: 'No connection required' },
                    { agent: 'ReportGenerator', actions: ['Create report', 'Generate summary'], status: 'stub', note: 'No connection required' },
                ].map(({ agent, actions, status, note }) => (
                    <div key={agent} className="p-4 glass-premium rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm text-cyber-aqua font-semibold">{agent}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'live' ? 'bg-neon-green/20 text-neon-green' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {actions.map(a => (
                                <span key={a} className="text-xs bg-white/5 text-ink-2 px-2 py-0.5 rounded">{a}</span>
                            ))}
                        </div>
                        <p className="text-xs text-ink-3 font-inter">{note}</p>
                    </div>
                ))}
            </div>
            <Callout type="tip">
                Live agents use your connected accounts from Integration Hub to perform real actions. Fill in step config fields (To, Channel, Repo…) when building your workflow.
            </Callout>
        </Section>

        <Section title="Example Workflow — GitHub PR → Slack Notify">
            <p className="text-ink-2 font-inter text-sm mb-3">When a new PR is opened on GitHub, post a message to your Slack #dev channel.</p>
            <CodeBlock language="json" code={`{
  "name": "GitHub PR Notifier",
  "trigger": { "type": "webhook", "config": {} },
  "steps": [
    {
      "agent": "GitHubAgent",
      "action": "Manage PR",
      "config": { "event": "pull_request.opened" }
    },
    {
      "agent": "SlackAgent",
      "action": "Post message",
      "config": { "channel": "#dev-team" }
    }
  ]
}`} />
        </Section>
    </div>
);

const IntegrationGuideTab: React.FC = () => (
    <div>
        <Section title="How Integrations Work">
            <p className="text-ink-2 font-inter leading-relaxed mb-4">
                Connect your existing accounts — Gmail, Slack, GitHub, Notion, and Google Calendar — so VIDVAS AI agents can act on your behalf. The connection process is simple: click <strong className="text-ink">Connect</strong>, sign in to the service, and you're done. You never share your password with us.
            </p>
            <Callout type="tip">
                Go to <strong>Integration Hub</strong> (in the top navigation) to connect and manage all your accounts in one place.
            </Callout>
        </Section>

        <Section title="🔐 Security — How Your Credentials Are Protected">
            <div className="space-y-3">
                {[
                    ['Encrypted at rest', 'Your access tokens are stored encrypted in our database. Even database administrators cannot read them in plain text.'],
                    ['Server-side only', 'When an agent takes an action (e.g. sending an email), your token is retrieved and used entirely on our servers — it never passes through your browser.'],
                    ['Your data, your control', 'We only request the minimum permissions needed. You can disconnect any service at any time from Integration Hub, which immediately revokes access.'],
                    ['No password sharing', 'All connections use OAuth — you authenticate directly with Google, Slack, GitHub, or Notion. VIDVAS AI receives only a limited-access token, never your password.'],
                ].map(([title, desc]) => (
                    <div key={title} className="flex gap-4 p-4 glass-premium rounded-xl">
                        <span className="text-neon-green text-lg shrink-0">✓</span>
                        <div>
                            <p className="font-semibold text-ink text-sm font-inter mb-0.5">{title}</p>
                            <p className="text-ink-2 text-sm font-inter">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>

        {[
            {
                name: 'Gmail',
                icon: '📧',
                status: '✅ Live',
                what: 'Send emails, read your inbox, search messages — all from your own Gmail account.',
                steps: [
                    'Go to Integration Hub and click Connect next to Gmail.',
                    'A Google sign-in page opens. Choose the Google account you want to connect.',
                    'Review the permissions and click Allow.',
                    'You\'re redirected back to VIDVAS AI. Gmail now shows as Connected.',
                    'Any workflow step using GmailAgent will now act as you.',
                ],
                permission: 'Read and send emails on your behalf',
                usedBy: 'GmailAgent — Send email, Read inbox, Search emails',
            },
            {
                name: 'Slack',
                icon: '💬',
                status: '✅ Live',
                what: 'Post messages to channels, list channels, and upload files to your Slack workspace.',
                steps: [
                    'Go to Integration Hub and click Connect next to Slack.',
                    'A Slack authorization page opens. Select the workspace to connect.',
                    'Review the bot permissions and click Allow.',
                    'You\'re redirected back. Slack shows as Connected.',
                    'Workflow steps using SlackAgent will post as the VIDVAS bot in your workspace.',
                ],
                permission: 'Post messages, read channel list',
                usedBy: 'SlackAgent — Post message, Create channel, Upload file',
            },
            {
                name: 'GitHub',
                icon: '🐙',
                status: '✅ Live',
                what: 'Create issues, manage pull requests, and read commit history on your repositories.',
                steps: [
                    'Go to Integration Hub and click Connect next to GitHub.',
                    'GitHub\'s authorization page opens. Review the requested permissions.',
                    'Click Authorize to grant access.',
                    'You\'re redirected back. GitHub shows as Connected.',
                    'Workflow steps using GitHubAgent will act on your behalf on your repos.',
                ],
                permission: 'Read repos, create issues and PRs',
                usedBy: 'GitHubAgent — Create issue, Manage PR, Get commits',
            },
            {
                name: 'Notion',
                icon: '📓',
                status: '✅ Live',
                what: 'Create pages, update databases, and search content in your Notion workspace.',
                steps: [
                    'Go to notion.so/my-integrations and sign in.',
                    'Click New integration, give it a name (e.g. "VIDVAS AI"), and click Submit.',
                    'Copy the Internal Integration Secret shown on the next page.',
                    'Go to each Notion database/page you want to use → click the ··· menu → Add connections → select your integration.',
                    'In Integration Hub, click Connect next to Notion and paste the secret.',
                ],
                permission: 'Read and write pages/databases you explicitly share with the integration',
                usedBy: 'NotionAgent — Create page, Update database, Search',
            },
            {
                name: 'Google Calendar',
                icon: '📅',
                status: '✅ Live',
                what: 'Create calendar events and check your availability using your Google Calendar.',
                steps: [
                    'Go to Integration Hub and click Connect next to Gmail (Calendar uses the same Google connection).',
                    'On the Google sign-in page, make sure the account has Google Calendar access.',
                    'Click Allow. Calendar access is granted alongside Gmail.',
                    'Workflow steps using GoogleCalendarAgent will read/write your primary calendar.',
                ],
                permission: 'Read events, create events on your primary calendar',
                usedBy: 'GoogleCalendarAgent — Check availability, Create event',
            },
        ].map(({ name, icon, status, what, steps, permission, usedBy }) => (
            <Section key={name} title={`${icon} ${name}`}>
                <div className="mb-3 flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-neon-green/20 text-neon-green font-inter">{status}</span>
                    <p className="text-ink-2 text-sm font-inter">{what}</p>
                </div>

                <SubSection title="How to Connect">
                    <ol className="space-y-2">
                        {steps.map((step, i) => (
                            <li key={i} className="flex gap-3 font-inter text-sm text-ink-2">
                                <span className="text-cyber-aqua font-bold shrink-0">{i + 1}.</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </SubSection>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white/[0.03] border border-edge rounded-lg">
                        <p className="text-xs text-ink-3 font-inter mb-1">Permission requested</p>
                        <p className="text-xs text-ink-2 font-inter">{permission}</p>
                    </div>
                    <div className="p-3 bg-white/[0.03] border border-edge rounded-lg">
                        <p className="text-xs text-ink-3 font-inter mb-1">Used by</p>
                        <p className="font-mono text-xs text-yellow-400">{usedBy}</p>
                    </div>
                </div>
            </Section>
        ))}

        <Section title="After Connecting">
            <p className="text-ink-2 font-inter text-sm mb-4">
                Once connected, head to <strong className="text-ink">Workflow Builder</strong>, create a workflow with steps using that agent, fill in the step config fields (like To, Channel, Repo name), and click <strong className="text-ink">Run Now</strong>. The agent will act using your connected account.
            </p>
            <Callout type="info">
                You can disconnect any integration at any time from Integration Hub. This immediately removes the stored token — no future agent actions will be able to use that service until you reconnect.
            </Callout>
        </Section>

        <Section title="Troubleshooting">
            <div className="space-y-3">
                {[
                    ['Step fails with "not connected"', 'Go to Integration Hub and check that the service shows as Connected. If it expired, click Disconnect then Connect again to refresh.'],
                    ['Gmail: permission denied', 'Make sure you granted all requested scopes during the Google sign-in. Try disconnecting and reconnecting.'],
                    ['Notion: page not found', 'You need to share each Notion database/page with your integration manually in Notion — see Step 4 in the Notion setup above.'],
                    ['GitHub: repo not accessible', 'The GitHub token needs access to the specific repo. Make sure the repo is owned by the account you connected, or the organization has granted the OAuth app access.'],
                ].map(([problem, fix]) => (
                    <div key={problem} className="p-4 glass-premium rounded-xl">
                        <p className="text-sm font-semibold text-yellow-400 font-inter mb-1">⚠ {problem}</p>
                        <p className="text-sm text-ink-2 font-inter">{fix}</p>
                    </div>
                ))}
            </div>
        </Section>

        {/* legacy block removed */}
    </div>
);

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'api', label: 'API Reference', icon: '⚡' },
    { id: 'workflows', label: 'Workflow Guide', icon: '🔄' },
    { id: 'integrations', label: 'Integration Guide', icon: '🔌' },
];

const Documentation: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('api');

    return (
        <div className="min-h-screen pt-20 pb-16 bg-atmospheric-mesh">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14 animate-fadeInUp">
                    <div className="inline-block px-8 py-4 glass-editorial rounded-full text-sm font-bold mb-10 border-2 border-electric-amber/30 shadow-atmospheric">
                        <span className="text-gradient-editorial font-body">📚 Documentation</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-display font-black mb-6">
                        <span>Learn</span>{' '}
                        <span className="text-soft-cream">VIDVAS AI</span>
                    </h1>
                    <p className="text-xl text-soft-cream/70 font-body max-w-2xl mx-auto">
                        Guides, API reference, and integration docs to build and extend your automation workflows.
                    </p>
                </div>

                {/* Tab Bar */}
                <div className="flex gap-2 mb-10 p-2 glass-editorial rounded-2xl border border-electric-amber/20">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-inter font-semibold text-sm transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-electric-amber to-retro-orange text-deep-black shadow-atmospheric'
                                : 'text-soft-cream/60 hover:text-soft-cream hover:bg-white/5'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="glass-editorial rounded-3xl border border-electric-amber/20 p-8 shadow-editorial">
                    {activeTab === 'api' && <APIDocsTab />}
                    {activeTab === 'workflows' && <WorkflowGuideTab />}
                    {activeTab === 'integrations' && <IntegrationGuideTab />}
                </div>
            </div>
        </div>
    );
};

export default Documentation;
