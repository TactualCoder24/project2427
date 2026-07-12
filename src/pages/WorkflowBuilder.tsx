import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { agentWorkflowService, AgentWorkflow } from '../lib/supabaseAgentService';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface WFStep {
    id: string;
    agent: string;
    action: string;
    config: Record<string, any>;
}

interface FormData {
    name: string;
    description: string;
    trigger: AgentWorkflow['trigger'];
    steps: WFStep[];
}

interface WorkflowVersion {
    version: number;
    savedAt: string;
    name: string;
    description: string;
    trigger: AgentWorkflow['trigger'];
    steps: WFStep[];
    changeType: 'create' | 'edit' | 'rollback';
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const AVAILABLE_AGENTS = [
    { name: 'GmailAgent',       actions: ['Send email', 'Read inbox', 'Search emails'],              icon: '📧' },
    { name: 'SlackAgent',       actions: ['Post message', 'Create channel', 'Upload file'],          icon: '💬' },
    { name: 'NotionAgent',      actions: ['Create page', 'Update database', 'Search'],               icon: '📓' },
    { name: 'GitHubAgent',      actions: ['Create issue', 'Manage PR', 'Get commits'],               icon: '🐙' },
    { name: 'DataCollector',    actions: ['Fetch metrics', 'Aggregate data'],                        icon: '📊' },
    { name: 'ReportGenerator',  actions: ['Create report', 'Generate summary'],                      icon: '📄' },
    { name: 'SearchAgent',      actions: ['Web search', 'Find information'],                         icon: '🔍' },
    { name: 'SummarizerAgent',  actions: ['Summarize text', 'Extract key points'],                   icon: '✍️' },
];

const INTEGRATION_LABEL: Record<string, string> = {
    GmailAgent: 'Gmail',
    SlackAgent: 'Slack',
    GitHubAgent: 'GitHub',
    NotionAgent: 'Notion',
    GoogleCalendarAgent: 'Google Calendar',
};

type ConfigField = { key: string; label: string; placeholder: string; type?: 'textarea' };
const STEP_CONFIG_FIELDS: Record<string, Record<string, ConfigField[]>> = {
    GmailAgent: {
        'Send email':     [{ key: 'to', label: 'To', placeholder: 'recipient@example.com' }, { key: 'subject', label: 'Subject', placeholder: 'Email subject' }, { key: 'body', label: 'Message', placeholder: 'Email body…', type: 'textarea' }],
        'Read inbox':     [{ key: 'maxResults', label: 'Max emails', placeholder: '5' }],
        'Search emails':  [{ key: 'query', label: 'Search query', placeholder: 'from:boss@company.com' }],
    },
    SlackAgent: {
        'Post message':   [{ key: 'channel', label: 'Channel', placeholder: 'general' }, { key: 'text', label: 'Message', placeholder: 'Your message…', type: 'textarea' }],
        'Create channel': [{ key: 'name', label: 'Channel name', placeholder: 'new-channel' }],
    },
    NotionAgent: {
        'Create page':    [{ key: 'databaseId', label: 'Database ID', placeholder: 'Notion database UUID' }, { key: 'title', label: 'Page title', placeholder: 'New page title' }, { key: 'content', label: 'Content', placeholder: 'Page content…', type: 'textarea' }],
        'Update database':[{ key: 'databaseId', label: 'Database ID', placeholder: 'Notion database UUID' }],
        'Search':         [{ key: 'query', label: 'Search query', placeholder: 'What to search in Notion…' }],
    },
    GitHubAgent: {
        'Create issue':   [{ key: 'repo', label: 'Repo (owner/name)', placeholder: 'myorg/myrepo' }, { key: 'title', label: 'Issue title', placeholder: 'Bug: something is broken' }, { key: 'body', label: 'Description', placeholder: 'Issue details…', type: 'textarea' }],
        'Manage PR':      [{ key: 'repo', label: 'Repo (owner/name)', placeholder: 'myorg/myrepo' }],
        'Get commits':    [{ key: 'repo', label: 'Repo (owner/name)', placeholder: 'myorg/myrepo' }],
    },
    SearchAgent: {
        'Web search':     [{ key: 'query', label: 'Search query', placeholder: 'What to search for…' }],
        'Find information':[{ key: 'query', label: 'Query', placeholder: 'Topic to research…' }],
    },
    SummarizerAgent: {
        'Summarize text':    [{ key: 'text', label: 'Text to summarize (optional — uses previous step output)', placeholder: 'Paste text here…', type: 'textarea' }],
        'Extract key points':[{ key: 'topic', label: 'Focus topic (optional)', placeholder: 'e.g., action items, risks…' }],
    },
};

const AGENT_ICON: Record<string, string> = Object.fromEntries(
    AVAILABLE_AGENTS.map(a => [a.name, a.icon])
);

const TEMPLATES = [
    {
        id: 'morning-briefing',
        name: 'Morning Briefing',
        description: 'Read your inbox and generate a concise daily summary to start your day informed.',
        icon: '☀️',
        trigger: { type: 'scheduled' as const, config: { schedule: '9:00 AM daily' } },
        steps: [
            { id: 's1', agent: 'GmailAgent',      action: 'Read inbox',       config: {} },
            { id: 's2', agent: 'ReportGenerator', action: 'Generate summary', config: {} },
        ],
    },
    {
        id: 'pr-notifier',
        name: 'GitHub PR Notifier',
        description: 'When a pull request is opened, automatically notify the team on Slack.',
        icon: '🐙',
        trigger: { type: 'event' as const, config: { event: 'pull_request.opened' } },
        steps: [
            { id: 's1', agent: 'GitHubAgent', action: 'Manage PR',     config: {} },
            { id: 's2', agent: 'SlackAgent',  action: 'Post message',  config: {} },
        ],
    },
    {
        id: 'content-research',
        name: 'Content Research Pipeline',
        description: 'Search the web for a topic, summarize findings, and save them to Notion.',
        icon: '🔍',
        trigger: { type: 'manual' as const, config: {} },
        steps: [
            { id: 's1', agent: 'SearchAgent',    action: 'Web search',       config: {} },
            { id: 's2', agent: 'SummarizerAgent', action: 'Extract key points', config: {} },
            { id: 's3', agent: 'NotionAgent',    action: 'Create page',      config: {} },
        ],
    },
    {
        id: 'weekly-report',
        name: 'Weekly Team Report',
        description: 'Collect metrics, generate a report, and email it to your team every week.',
        icon: '📊',
        trigger: { type: 'scheduled' as const, config: { schedule: 'Every Monday 8:00 AM' } },
        steps: [
            { id: 's1', agent: 'DataCollector',   action: 'Fetch metrics',    config: {} },
            { id: 's2', agent: 'ReportGenerator', action: 'Create report',    config: {} },
            { id: 's3', agent: 'GmailAgent',      action: 'Send email',       config: {} },
        ],
    },
    {
        id: 'bug-triage',
        name: 'Bug Triage',
        description: 'Convert bug report emails into GitHub issues and notify the dev channel.',
        icon: '🐛',
        trigger: { type: 'event' as const, config: { event: 'email.received' } },
        steps: [
            { id: 's1', agent: 'GmailAgent',  action: 'Read inbox',    config: {} },
            { id: 's2', agent: 'GitHubAgent', action: 'Create issue',  config: {} },
            { id: 's3', agent: 'SlackAgent',  action: 'Post message',  config: {} },
        ],
    },
    {
        id: 'competitive-intel',
        name: 'Competitive Intelligence',
        description: 'Monitor competitors by searching the web and updating your Notion database.',
        icon: '🎯',
        trigger: { type: 'scheduled' as const, config: { schedule: 'Every Friday 6:00 PM' } },
        steps: [
            { id: 's1', agent: 'SearchAgent',     action: 'Web search',         config: {} },
            { id: 's2', agent: 'SummarizerAgent', action: 'Extract key points',  config: {} },
            { id: 's3', agent: 'NotionAgent',     action: 'Update database',     config: {} },
        ],
    },
];

const DEFAULT_FORM: FormData = {
    name: '',
    description: '',
    trigger: { type: 'manual', config: {} },
    steps: [],
};

// ─────────────────────────────────────────────
// Version helpers (localStorage)
// ─────────────────────────────────────────────
function getVersions(workflowId: string): WorkflowVersion[] {
    try {
        const raw = localStorage.getItem(`vidvas_wf_v_${workflowId}`);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveVersion(workflowId: string, wf: AgentWorkflow, changeType: WorkflowVersion['changeType']) {
    const versions = getVersions(workflowId);
    const next: WorkflowVersion = {
        version: versions.length + 1,
        savedAt: new Date().toISOString(),
        name: wf.name,
        description: wf.description,
        trigger: wf.trigger,
        steps: wf.steps as WFStep[],
        changeType,
    };
    const updated = [next, ...versions].slice(0, 10);
    localStorage.setItem(`vidvas_wf_v_${workflowId}`, JSON.stringify(updated));
}

// ─────────────────────────────────────────────
// Error message helper
// ─────────────────────────────────────────────
function parseError(err: unknown, context: 'create' | 'update' | 'run' | 'delete' | 'load'): string {
    const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
    if (msg.includes('not authenticated') || msg.includes('auth')) {
        return 'Your session has expired. Please log out and sign in again.';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
        return 'Cannot reach the database. Check your internet connection and Supabase URL in .env.';
    }
    if (msg.includes('duplicate') || msg.includes('unique')) {
        return 'A workflow with this name already exists. Choose a different name.';
    }
    if (context === 'create') return 'Failed to save workflow. Check your Supabase connection and try again.';
    if (context === 'update') return 'Failed to update workflow. Refresh and try again.';
    if (context === 'run') return 'Execution failed. See the Execution Dashboard for per-step error details.';
    if (context === 'delete') return 'Failed to delete workflow. It may have been already removed.';
    if (context === 'load') return 'Failed to load workflows. Check your Supabase connection.';
    return `Unexpected error: ${err instanceof Error ? err.message : String(err)}`;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const FlowPreview: React.FC<{ steps: WFStep[] }> = ({ steps }) => {
    if (steps.length === 0) {
        return (
            <div className="flex items-center justify-center h-16 border border-dashed border-edge rounded-xl text-ink-3 text-sm font-inter">
                Steps will appear here
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 py-3">
            {steps.map((step, i) => (
                <React.Fragment key={step.id}>
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 glass-premium border border-cyber-aqua/20 rounded-xl min-w-[100px] text-center">
                        <span className="text-lg">{AGENT_ICON[step.agent] || '🔧'}</span>
                        <span className="text-xs text-cyber-aqua font-mono leading-tight">{step.agent.replace('Agent', '')}</span>
                        <span className="text-xs text-ink-2 leading-tight">{step.action}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <span className="text-ink-3 flex-shrink-0 text-lg">→</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
const WorkflowBuilder: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Core state
    const [workflows, setWorkflows] = useState<AgentWorkflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [runningId, setRunningId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'workflows' | 'templates'>('workflows');

    // Fail alert (from WorkflowLogger event)
    const [failAlert, setFailAlert] = useState<{ name: string; error: string } | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<AgentWorkflow | null>(null);
    const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM });
    const [modalError, setModalError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Drag-drop state (for steps inside modal)
    const [dragStepIdx, setDragStepIdx] = useState<number | null>(null);
    const [dragOverStepIdx, setDragOverStepIdx] = useState<number | null>(null);

    // Version history modal
    const [historyWorkflowId, setHistoryWorkflowId] = useState<string | null>(null);

    // ── Effects ───────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        loadWorkflows();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setFailAlert(detail);
        };
        window.addEventListener('workflow:failed', handler);
        return () => window.removeEventListener('workflow:failed', handler);
    }, []);

    // ── Data ──────────────────────────────────
    const loadWorkflows = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await agentWorkflowService.getAll();
            setWorkflows(data);
        } catch (err) {
            setError(parseError(err, 'load'));
        } finally {
            setLoading(false);
        }
    };

    // ── Modal helpers ─────────────────────────
    const openCreate = (prefill?: Partial<FormData>) => {
        setEditingWorkflow(null);
        setFormData(prefill ? { ...DEFAULT_FORM, ...prefill } : { ...DEFAULT_FORM });
        setModalError(null);
        setShowModal(true);
    };

    const openEdit = (workflow: AgentWorkflow) => {
        setEditingWorkflow(workflow);
        setFormData({
            name: workflow.name,
            description: workflow.description,
            trigger: workflow.trigger,
            steps: workflow.steps as WFStep[],
        });
        setModalError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingWorkflow(null);
        setModalError(null);
    };

    // ── Step management ───────────────────────
    const addStep = () => {
        const newStep: WFStep = {
            id: `s${Date.now()}`,
            agent: AVAILABLE_AGENTS[0].name,
            action: AVAILABLE_AGENTS[0].actions[0],
            config: {},
        };
        setFormData(f => ({ ...f, steps: [...f.steps, newStep] }));
    };

    const removeStep = (id: string) => {
        setFormData(f => ({ ...f, steps: f.steps.filter(s => s.id !== id) }));
    };

    const updateStep = (id: string, patch: Partial<WFStep>) => {
        setFormData(f => ({
            ...f,
            steps: f.steps.map(s => s.id === id ? { ...s, ...patch } : s),
        }));
    };

    // ── Drag-drop ─────────────────────────────
    const handleDragStart = (idx: number) => setDragStepIdx(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setDragOverStepIdx(idx);
    };
    const handleDrop = (toIdx: number) => {
        if (dragStepIdx === null || dragStepIdx === toIdx) {
            setDragStepIdx(null);
            setDragOverStepIdx(null);
            return;
        }
        const steps = [...formData.steps];
        const [moved] = steps.splice(dragStepIdx, 1);
        steps.splice(toIdx, 0, moved);
        setFormData(f => ({ ...f, steps }));
        setDragStepIdx(null);
        setDragOverStepIdx(null);
    };
    const handleDragEnd = () => {
        setDragStepIdx(null);
        setDragOverStepIdx(null);
    };

    // ── Save (create or edit) ─────────────────
    const handleSave = async () => {
        if (!formData.name.trim()) { setModalError('Please enter a workflow name.'); return; }
        if (!formData.description.trim()) { setModalError('Please add a short description.'); return; }
        if (formData.steps.length === 0) { setModalError('Add at least one step to your workflow.'); return; }

        setSaving(true);
        setModalError(null);

        try {
            if (editingWorkflow) {
                const updated = await agentWorkflowService.update(editingWorkflow.id, {
                    name: formData.name,
                    description: formData.description,
                    trigger: formData.trigger,
                    steps: formData.steps,
                });
                saveVersion(editingWorkflow.id, updated, 'edit');
                setWorkflows(ws => ws.map(w => w.id === editingWorkflow.id ? updated : w));
            } else {
                const created = await agentWorkflowService.create({
                    name: formData.name,
                    description: formData.description,
                    trigger: formData.trigger,
                    steps: formData.steps,
                    status: 'draft',
                    persona_id: undefined,
                    last_run_at: undefined,
                });
                saveVersion(created.id, created, 'create');
                setWorkflows(ws => [created, ...ws]);
            }
            closeModal();
        } catch (err) {
            setModalError(parseError(err, editingWorkflow ? 'update' : 'create'));
        } finally {
            setSaving(false);
        }
    };

    // ── Actions ───────────────────────────────
    const handleRunWorkflow = async (workflow: AgentWorkflow) => {
        if (!user) return;
        setRunningId(workflow.id);
        setError(null);
        try {
            const { WorkflowExecutor } = await import('../lib/agents/WorkflowExecutor');
            await WorkflowExecutor.run(workflow, user.id);
            await loadWorkflows();
            navigate('/executions');
        } catch {
            setError(parseError(null, 'run'));
        } finally {
            setRunningId(null);
        }
    };

    const handleToggleStatus = async (workflow: AgentWorkflow) => {
        const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
        try {
            await agentWorkflowService.update(workflow.id, { status: newStatus });
            setWorkflows(ws => ws.map(w => w.id === workflow.id ? { ...w, status: newStatus } : w));
        } catch {
            setError('Failed to update status. Try refreshing the page.');
        }
    };

    const handleDeleteWorkflow = async (workflow: AgentWorkflow) => {
        if (!window.confirm(`Delete "${workflow.name}"? This cannot be undone.`)) return;
        try {
            await agentWorkflowService.delete(workflow.id);
            localStorage.removeItem(`vidvas_wf_v_${workflow.id}`);
            setWorkflows(ws => ws.filter(w => w.id !== workflow.id));
        } catch {
            setError(parseError(null, 'delete'));
        }
    };

    const handleRollback = async (workflowId: string, version: WorkflowVersion) => {
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) return;
        if (!window.confirm(`Restore "${workflow.name}" to version ${version.version} from ${new Date(version.savedAt).toLocaleString()}?`)) return;
        try {
            const updated = await agentWorkflowService.update(workflowId, {
                name: version.name,
                description: version.description,
                trigger: version.trigger,
                steps: version.steps,
            });
            saveVersion(workflowId, updated, 'rollback');
            setWorkflows(ws => ws.map(w => w.id === workflowId ? updated : w));
            setHistoryWorkflowId(null);
        } catch {
            setError('Rollback failed. Try refreshing and retrying.');
        }
    };

    // ── Derived ───────────────────────────────
    const totalRuns = workflows.reduce((sum, w) => sum + (w.run_count || 0), 0);
    const activeCount = workflows.filter(w => w.status === 'active').length;
    const avgSteps = workflows.length > 0
        ? Math.round(workflows.reduce((sum, w) => sum + w.steps.length, 0) / workflows.length)
        : 0;

    const historyWorkflow = historyWorkflowId ? workflows.find(w => w.id === historyWorkflowId) : null;
    const historyVersions = historyWorkflowId ? getVersions(historyWorkflowId) : [];

    // ─────────────────────────────────────────
    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            {/* Fail alert banner */}
            {failAlert && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full mx-4 bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-4 font-inter text-sm text-red-300 flex items-start gap-3">
                    <span className="text-xl shrink-0">🚨</span>
                    <div className="flex-1">
                        <p className="font-semibold text-red-200">Workflow Failed</p>
                        <p className="text-red-400">{failAlert.name}: {failAlert.error}</p>
                    </div>
                    <button onClick={() => setFailAlert(null)} className="text-red-400 hover:text-ink ml-2">✕</button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-bold font-inter mb-4">
                        Workflow <span className="text-gradient-animate">Builder</span>
                    </h1>
                    <p className="text-xl text-ink-2 max-w-3xl mx-auto font-inter leading-relaxed">
                        Create, edit, and run automated workflows. Drag-drop steps, use templates, and track version history.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Workflows', value: workflows.length, color: 'from-cyber-aqua to-vivid-purple', icon: '⚙️' },
                        { label: 'Active', value: activeCount, color: 'from-neon-green to-lime-green', icon: '✓' },
                        { label: 'Total Runs', value: totalRuns, color: 'from-vivid-purple to-hot-pink', icon: '🚀' },
                        { label: 'Avg Steps', value: avgSteps, color: 'from-yellow-500 to-orange-500', icon: '📊' },
                    ].map(s => (
                        <Card key={s.label} variant="gradient" className="p-5 hover-glow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-ink-2 text-xs font-inter mb-1">{s.label}</p>
                                    <p className="text-3xl font-bold font-inter text-ink">{s.value}</p>
                                </div>
                                <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-2xl`}>
                                    {s.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Global error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                        <span className="text-red-400 shrink-0">⚠</span>
                        <p className="text-red-300 font-inter text-sm flex-1">{error}</p>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-ink">✕</button>
                    </div>
                )}

                {/* Tab bar */}
                <div className="flex gap-2 mb-8 p-1.5 glass-premium rounded-2xl border border-edge w-fit">
                    {(['workflows', 'templates'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-inter font-semibold text-sm capitalize transition-all duration-200 ${activeTab === tab
                                ? 'bg-gradient-to-r from-cyber-aqua to-vivid-purple text-ink shadow-glow-md'
                                : 'text-ink-2 hover:text-ink'
                            }`}
                        >
                            {tab === 'workflows' ? `⚙️  My Workflows (${workflows.length})` : '📋  Templates'}
                        </button>
                    ))}
                </div>

                {/* ── MY WORKFLOWS TAB ── */}
                {activeTab === 'workflows' && (
                    <>
                        <div className="mb-6 flex justify-end">
                            <Button variant="gradient" size="lg" onClick={() => openCreate()}>
                                ✨ Create New Workflow
                            </Button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : workflows.length === 0 ? (
                            <Card variant="premium" className="p-12 text-center hover-glow">
                                <div className="w-20 h-20 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-glow-purple text-4xl animate-bounce-subtle">
                                    ⚙️
                                </div>
                                <h3 className="text-2xl font-bold font-inter mb-3 text-gradient-intelligence">No automations yet — let's build one</h3>
                                <p className="text-ink-2 mb-6 font-inter text-sm max-w-md mx-auto">
                                    Chain AI services together visually. Pick a template to launch in minutes, or start from scratch.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button variant="gradient" size="md" onClick={() => openCreate()}>Create Workflow</Button>
                                    <Button variant="outline" size="md" onClick={() => setActiveTab('templates')}>Browse Templates</Button>
                                </div>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {workflows.map(workflow => {
                                    const versionCount = getVersions(workflow.id).length;
                                    return (
                                        <Card key={workflow.id} variant="premium" className="p-6 hover-glow flex flex-col gap-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold font-inter text-gradient-intelligence">{workflow.name}</h3>
                                                    <p className="text-ink-2 text-sm font-inter mt-1">{workflow.description}</p>
                                                </div>
                                                <span className={`ml-3 shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    workflow.status === 'active' ? 'bg-neon-green/20 text-neon-green'
                                                    : workflow.status === 'inactive' ? 'bg-gray-500/20 text-ink-2'
                                                    : 'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                    {workflow.status}
                                                </span>
                                            </div>

                                            {/* Trigger */}
                                            <div className="p-3 glass-premium rounded-xl text-sm font-inter flex items-center gap-2">
                                                <span>
                                                    {workflow.trigger.type === 'scheduled' ? '⏰' :
                                                     workflow.trigger.type === 'webhook' ? '🔗' :
                                                     workflow.trigger.type === 'event' ? '⚡' : '👆'}
                                                </span>
                                                <span className="text-ink-2 capitalize">
                                                    {workflow.trigger.type === 'manual' ? 'Manual execution' :
                                                     workflow.trigger.type === 'scheduled' ? `Scheduled: ${workflow.trigger.config.schedule || 'custom'}` :
                                                     workflow.trigger.type === 'webhook' ? 'Webhook trigger' :
                                                     `Event: ${workflow.trigger.config.event || 'custom'}`}
                                                </span>
                                            </div>

                                            {/* Visual flow */}
                                            <FlowPreview steps={workflow.steps as WFStep[]} />

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-3 p-3 glass-premium rounded-xl text-center text-sm font-inter">
                                                <div>
                                                    <p className="text-ink-2 text-xs">Steps</p>
                                                    <p className="text-ink font-bold">{workflow.steps.length}</p>
                                                </div>
                                                <div>
                                                    <p className="text-ink-2 text-xs">Runs</p>
                                                    <p className="text-ink font-bold">{workflow.run_count}</p>
                                                </div>
                                                <div>
                                                    <p className="text-ink-2 text-xs">Last Run</p>
                                                    <p className="text-ink font-bold text-xs">
                                                        {workflow.last_run_at
                                                            ? new Date(workflow.last_run_at).toLocaleDateString()
                                                            : 'Never'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 flex-wrap">
                                                <Button
                                                    variant="gradient"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleRunWorkflow(workflow)}
                                                    disabled={runningId === workflow.id}
                                                >
                                                    {runningId === workflow.id ? '⏳ Running...' : '▶ Run Now'}
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => openEdit(workflow)}>
                                                    ✎ Edit
                                                </Button>
                                                <Button
                                                    variant={workflow.status === 'active' ? 'outline' : 'gradient'}
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(workflow)}
                                                >
                                                    {workflow.status === 'active' ? 'Pause' : 'Activate'}
                                                </Button>
                                                <button
                                                    title={`Version history (${versionCount} saved)`}
                                                    onClick={() => setHistoryWorkflowId(workflow.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-edge text-ink-2 hover:text-cyber-aqua hover:border-cyber-aqua/30 text-xs font-inter transition-all"
                                                >
                                                    🕐 {versionCount > 0 ? versionCount : '—'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWorkflow(workflow)}
                                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-edge text-ink-2 hover:text-red-400 hover:border-red-400/30 text-xs font-inter transition-all"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ── TEMPLATES TAB ── */}
                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TEMPLATES.map(template => (
                            <Card key={template.id} variant="premium" className="p-6 hover-glow flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-aqua to-vivid-purple rounded-xl flex items-center justify-center text-2xl shadow-glow-md">
                                        {template.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold font-inter text-ink">{template.name}</h3>
                                        <span className="text-xs text-ink-2 capitalize font-inter">
                                            {template.trigger.type === 'manual' ? '👆 Manual' :
                                             template.trigger.type === 'scheduled' ? `⏰ ${template.trigger.config.schedule}` :
                                             template.trigger.type === 'event' ? `⚡ Event` :
                                             '🔗 Webhook'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-ink-2 text-sm font-inter leading-relaxed">{template.description}</p>
                                <FlowPreview steps={template.steps} />
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    onClick={() => {
                                        openCreate({
                                            name: template.name,
                                            description: template.description,
                                            trigger: template.trigger,
                                            steps: template.steps.map(s => ({ ...s, id: `s${Date.now()}_${Math.random().toString(36).slice(2, 5)}` })),
                                        });
                                        setActiveTab('workflows');
                                    }}
                                >
                                    Use Template →
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* ── CREATE / EDIT MODAL ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="relative glass-premium border border-edge-2 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-8 shadow-glow-purple">
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 text-ink-2 hover:text-ink text-3xl transition-colors"
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-bold font-inter mb-6 text-gradient-intelligence">
                            {editingWorkflow ? `Edit: ${editingWorkflow.name}` : 'Create New Workflow'}
                        </h2>

                        {modalError && (
                            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-inter flex gap-2">
                                <span>⚠</span><span>{modalError}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-1.5 font-inter">Workflow Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g., Daily Report Generator"
                                    className="w-full bg-white/5 border border-edge rounded-xl px-4 py-3 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyber-aqua font-inter"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-1.5 font-inter">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="What does this workflow do?"
                                    rows={2}
                                    className="w-full bg-white/5 border border-edge rounded-xl px-4 py-3 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyber-aqua resize-none font-inter"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-1.5 font-inter">Trigger</label>
                                <select
                                    value={formData.trigger.type}
                                    onChange={e => setFormData(f => ({ ...f, trigger: { type: e.target.value as any, config: {} } }))}
                                    className="w-full bg-white/5 border border-edge rounded-xl px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-cyber-aqua font-inter"
                                >
                                    <option value="manual">👆 Manual</option>
                                    <option value="scheduled">⏰ Scheduled</option>
                                    <option value="webhook">🔗 Webhook</option>
                                    <option value="event">⚡ Event</option>
                                </select>
                            </div>

                            {/* Flow preview */}
                            <div>
                                <p className="text-sm font-semibold text-ink-2 mb-1.5 font-inter">Flow Preview</p>
                                <FlowPreview steps={formData.steps} />
                            </div>

                            {/* Steps */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-ink-2 font-inter">
                                        Steps ({formData.steps.length}) — drag ☰ to reorder
                                    </label>
                                    <Button variant="outline" size="sm" onClick={addStep}>+ Add Step</Button>
                                </div>

                                <div className="space-y-2">
                                    {formData.steps.map((step, idx) => (
                                        <div
                                            key={step.id}
                                            draggable
                                            onDragStart={() => handleDragStart(idx)}
                                            onDragOver={e => handleDragOver(e, idx)}
                                            onDrop={() => handleDrop(idx)}
                                            onDragEnd={handleDragEnd}
                                            className={`p-3 glass-premium rounded-xl transition-all duration-150 ${
                                                dragOverStepIdx === idx && dragStepIdx !== idx
                                                    ? 'ring-2 ring-cyber-aqua scale-[1.01] bg-cyber-aqua/5'
                                                    : ''
                                            } ${dragStepIdx === idx ? 'opacity-40' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="cursor-grab text-ink-3 hover:text-ink-2 select-none text-lg">☰</span>
                                                <span className="text-cyber-aqua font-bold text-sm w-5 shrink-0">{idx + 1}.</span>
                                                <select
                                                    value={step.agent}
                                                    onChange={e => {
                                                        const agent = AVAILABLE_AGENTS.find(a => a.name === e.target.value)!;
                                                        updateStep(step.id, { agent: e.target.value, action: agent.actions[0], config: {} });
                                                    }}
                                                    className="flex-1 bg-white/5 border border-edge rounded-lg px-3 py-1.5 text-ink text-sm focus:outline-none focus:ring-1 focus:ring-cyber-aqua font-inter"
                                                >
                                                    {AVAILABLE_AGENTS.map(a => (
                                                        <option key={a.name} value={a.name}>{a.icon} {a.name}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={step.action}
                                                    onChange={e => updateStep(step.id, { action: e.target.value, config: {} })}
                                                    className="flex-1 bg-white/5 border border-edge rounded-lg px-3 py-1.5 text-ink text-sm focus:outline-none focus:ring-1 focus:ring-cyber-aqua font-inter"
                                                >
                                                    {AVAILABLE_AGENTS.find(a => a.name === step.agent)?.actions.map(action => (
                                                        <option key={action} value={action}>{action}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => removeStep(step.id)}
                                                    className="text-ink-3 hover:text-red-400 transition-colors shrink-0"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            {/* Connection required hint */}
                                            {INTEGRATION_LABEL[step.agent] && (
                                                <div className="mt-2 pl-8 flex items-center gap-1.5 text-xs text-yellow-400/80 font-inter">
                                                    <span>🔗</span>
                                                    <span>Requires {INTEGRATION_LABEL[step.agent]} connection —</span>
                                                    <Link to="/integrations" className="underline hover:text-yellow-300 transition-colors">
                                                        Connect in Integration Hub
                                                    </Link>
                                                </div>
                                            )}
                                            {/* Config fields for this step */}
                                            {(STEP_CONFIG_FIELDS[step.agent]?.[step.action] ?? []).length > 0 && (
                                                <div className="mt-2 pl-8 grid grid-cols-2 gap-2">
                                                    {(STEP_CONFIG_FIELDS[step.agent]?.[step.action] ?? []).map(field => (
                                                        <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                                            <label className="text-xs text-ink-2 mb-1 block font-inter">{field.label}</label>
                                                            {field.type === 'textarea' ? (
                                                                <textarea
                                                                    value={(step.config?.[field.key] as string) || ''}
                                                                    onChange={e => updateStep(step.id, { config: { ...step.config, [field.key]: e.target.value } })}
                                                                    placeholder={field.placeholder}
                                                                    rows={2}
                                                                    className="w-full bg-black/30 border border-edge rounded-lg px-2.5 py-1.5 text-ink text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyber-aqua resize-none font-inter"
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    value={(step.config?.[field.key] as string) || ''}
                                                                    onChange={e => updateStep(step.id, { config: { ...step.config, [field.key]: e.target.value } })}
                                                                    placeholder={field.placeholder}
                                                                    className="w-full bg-black/30 border border-edge rounded-lg px-2.5 py-1.5 text-ink text-xs placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyber-aqua font-inter"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {formData.steps.length === 0 && (
                                        <div className="text-center text-ink-3 py-8 border border-dashed border-edge rounded-xl font-inter text-sm">
                                            No steps yet. Click <strong>+ Add Step</strong> to build your workflow.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="gradient"
                                    className="flex-1"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? '⏳ Saving...' : editingWorkflow ? 'Save Changes' : 'Create Workflow'}
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── VERSION HISTORY MODAL ── */}
            {historyWorkflowId && historyWorkflow && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="relative glass-premium border border-edge-2 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 shadow-glow-purple">
                        <button
                            onClick={() => setHistoryWorkflowId(null)}
                            className="absolute top-5 right-5 text-ink-2 hover:text-ink text-3xl transition-colors"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold font-inter mb-1 text-gradient-intelligence">Version History</h2>
                        <p className="text-ink-2 text-sm font-inter mb-6">{historyWorkflow.name}</p>

                        {historyVersions.length === 0 ? (
                            <div className="text-center py-10 text-ink-3 font-inter">
                                <p className="text-3xl mb-3">🕐</p>
                                <p>No versions saved yet.</p>
                                <p className="text-xs mt-2 text-gray-600">Versions are saved when you create or edit a workflow.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {historyVersions.map((version, i) => (
                                    <div key={i} className="p-4 glass-premium rounded-xl border border-edge">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-ink font-semibold font-inter text-sm">v{version.version}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        version.changeType === 'create' ? 'bg-neon-green/20 text-neon-green' :
                                                        version.changeType === 'rollback' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-cyber-aqua/20 text-cyber-aqua'
                                                    }`}>
                                                        {version.changeType}
                                                    </span>
                                                    {i === 0 && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-ink-2">current</span>
                                                    )}
                                                </div>
                                                <p className="text-ink-2 text-xs font-inter">
                                                    {new Date(version.savedAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {i !== 0 && (
                                                <button
                                                    onClick={() => handleRollback(historyWorkflowId, version)}
                                                    className="shrink-0 px-3 py-1.5 bg-cyber-aqua/10 border border-cyber-aqua/30 text-cyber-aqua text-xs font-semibold font-inter rounded-lg hover:bg-cyber-aqua/20 transition-all"
                                                >
                                                    Restore
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {version.steps.map((s, si) => (
                                                <span key={si} className="text-xs bg-white/5 text-ink-2 px-2 py-0.5 rounded font-mono">
                                                    {AGENT_ICON[s.agent] || '🔧'} {s.agent} → {s.action}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkflowBuilder;
