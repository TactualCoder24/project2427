import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

interface WorkflowStep {
    id: string;
    agent: string;
    action: string;
    config: Record<string, any>;
}

interface Workflow {
    id: string;
    name: string;
    description: string;
    trigger: {
        type: 'manual' | 'scheduled' | 'webhook' | 'event';
        config: Record<string, any>;
    };
    steps: WorkflowStep[];
    status: 'active' | 'inactive' | 'draft';
    createdAt: Date;
    lastRun?: Date;
    runCount: number;
}

const WorkflowBuilder: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [workflows, setWorkflows] = useState<Workflow[]>([
        {
            id: '1',
            name: 'Daily Report Generator',
            description: 'Automatically generate and send daily reports every morning',
            trigger: {
                type: 'scheduled',
                config: { schedule: '9:00 AM daily' }
            },
            steps: [
                { id: 's1', agent: 'DataCollector', action: 'Fetch metrics', config: {} },
                { id: 's2', agent: 'ReportGenerator', action: 'Create report', config: {} },
                { id: 's3', agent: 'EmailAgent', action: 'Send email', config: { to: 'team@example.com' } }
            ],
            status: 'active',
            createdAt: new Date('2024-01-15'),
            lastRun: new Date('2024-01-22'),
            runCount: 45
        },
        {
            id: '2',
            name: 'GitHub PR Notifier',
            description: 'Send Slack notifications when new PRs are created',
            trigger: {
                type: 'webhook',
                config: { source: 'GitHub', event: 'pull_request.opened' }
            },
            steps: [
                { id: 's1', agent: 'GitHubAgent', action: 'Get PR details', config: {} },
                { id: 's2', agent: 'SlackAgent', action: 'Post message', config: { channel: '#dev-team' } }
            ],
            status: 'active',
            createdAt: new Date('2024-01-10'),
            lastRun: new Date('2024-01-21'),
            runCount: 23
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
    const [newWorkflow, setNewWorkflow] = useState({
        name: '',
        description: '',
        trigger: {
            type: 'manual' as const,
            config: {}
        },
        steps: [] as WorkflowStep[]
    });

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const availableAgents = [
        { name: 'GmailAgent', actions: ['Send email', 'Read inbox', 'Search emails'] },
        { name: 'SlackAgent', actions: ['Post message', 'Create channel', 'Upload file'] },
        { name: 'NotionAgent', actions: ['Create page', 'Update database', 'Search'] },
        { name: 'GitHubAgent', actions: ['Create issue', 'Manage PR', 'Get commits'] },
        { name: 'DataCollector', actions: ['Fetch metrics', 'Aggregate data'] },
        { name: 'ReportGenerator', actions: ['Create report', 'Generate summary'] }
    ];

    const handleAddStep = () => {
        const newStep: WorkflowStep = {
            id: `s${newWorkflow.steps.length + 1}`,
            agent: availableAgents[0].name,
            action: availableAgents[0].actions[0],
            config: {}
        };
        setNewWorkflow({
            ...newWorkflow,
            steps: [...newWorkflow.steps, newStep]
        });
    };

    const handleRemoveStep = (stepId: string) => {
        setNewWorkflow({
            ...newWorkflow,
            steps: newWorkflow.steps.filter(s => s.id !== stepId)
        });
    };

    const handleCreateWorkflow = () => {
        const workflow: Workflow = {
            id: Date.now().toString(),
            ...newWorkflow,
            status: 'draft',
            createdAt: new Date(),
            runCount: 0
        };
        setWorkflows([...workflows, workflow]);
        setShowCreateModal(false);
        setNewWorkflow({
            name: '',
            description: '',
            trigger: { type: 'manual', config: {} },
            steps: []
        });
    };

    const handleToggleStatus = (id: string) => {
        setWorkflows(workflows.map(w =>
            w.id === id
                ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' as const }
                : w
        ));
    };

    const handleDeleteWorkflow = (id: string) => {
        if (window.confirm('Are you sure you want to delete this workflow?')) {
            setWorkflows(workflows.filter(w => w.id !== id));
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 font-inter">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
                        Workflow <span className="text-gradient-animate">Builder</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
                        Create automated workflows that chain multiple AI agents together to accomplish complex tasks.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Total Workflows</p>
                                <p className="text-4xl font-bold font-inter text-gradient-intelligence">{workflows.length}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua to-vivid-purple rounded-2xl flex items-center justify-center shadow-glow-md">
                                <span className="text-3xl">⚙️</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Active</p>
                                <p className="text-4xl font-bold font-inter text-gradient">
                                    {workflows.filter(w => w.status === 'active').length}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center shadow-glow-sm">
                                <span className="text-3xl">✓</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Total Runs</p>
                                <p className="text-4xl font-bold font-inter text-gradient-quantum">
                                    {workflows.reduce((sum, w) => sum + w.runCount, 0)}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                <span className="text-3xl">🚀</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Avg Steps</p>
                                <p className="text-4xl font-bold font-inter text-gradient">
                                    {workflows.length > 0 ? Math.round(workflows.reduce((sum, w) => sum + w.steps.length, 0) / workflows.length) : 0}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl">📊</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Create Button */}
                <div className="mb-8 flex justify-end">
                    <Button variant="gradient" size="lg" onClick={() => setShowCreateModal(true)}>
                        ✨ Create New Workflow
                    </Button>
                </div>

                {/* Workflows Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {workflows.map((workflow) => (
                        <Card key={workflow.id} variant="premium" className="p-6 hover-glow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold font-inter mb-2 text-gradient-intelligence">
                                        {workflow.name}
                                    </h3>
                                    <p className="text-gray-300 font-inter">{workflow.description}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${workflow.status === 'active'
                                        ? 'bg-neon-green/20 text-neon-green'
                                        : workflow.status === 'inactive'
                                            ? 'bg-gray-500/20 text-gray-400'
                                            : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {workflow.status}
                                </span>
                            </div>

                            {/* Trigger */}
                            <div className="mb-4 p-3 glass-premium rounded-xl">
                                <p className="text-sm text-gray-400 mb-1 font-inter">Trigger:</p>
                                <p className="text-white font-inter">
                                    {workflow.trigger.type === 'scheduled' && `⏰ ${workflow.trigger.config.schedule}`}
                                    {workflow.trigger.type === 'webhook' && `🔗 ${workflow.trigger.config.source} - ${workflow.trigger.config.event}`}
                                    {workflow.trigger.type === 'manual' && '👆 Manual execution'}
                                    {workflow.trigger.type === 'event' && '⚡ Event-based'}
                                </p>
                            </div>

                            {/* Steps */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-2 font-inter">Workflow Steps ({workflow.steps.length}):</p>
                                <div className="space-y-2">
                                    {workflow.steps.slice(0, 3).map((step, idx) => (
                                        <div key={step.id} className="flex items-center gap-2 text-sm">
                                            <span className="text-cyber-aqua font-bold">{idx + 1}.</span>
                                            <span className="text-gray-300 font-inter">{step.agent}</span>
                                            <span className="text-gray-500">→</span>
                                            <span className="text-gray-400 font-inter">{step.action}</span>
                                        </div>
                                    ))}
                                    {workflow.steps.length > 3 && (
                                        <p className="text-xs text-gray-500 font-inter">+{workflow.steps.length - 3} more steps</p>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4 p-3 glass-premium rounded-xl">
                                <div>
                                    <p className="text-xs text-gray-400 font-inter">Total Runs</p>
                                    <p className="text-lg font-bold text-white">{workflow.runCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-inter">Last Run</p>
                                    <p className="text-lg font-bold text-white">
                                        {workflow.lastRun ? workflow.lastRun.toLocaleDateString() : 'Never'}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant={workflow.status === 'active' ? 'outline' : 'gradient'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleToggleStatus(workflow.id)}
                                >
                                    {workflow.status === 'active' ? 'Pause' : 'Activate'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedWorkflow(workflow)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteWorkflow(workflow.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {workflows.length === 0 && (
                    <Card variant="premium" className="p-12 text-center hover-glow">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
                            <span className="text-5xl">⚙️</span>
                        </div>
                        <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-intelligence">
                            No Workflows Yet
                        </h3>
                        <p className="text-gray-300 mb-6 font-inter max-w-md mx-auto">
                            Create your first automated workflow to chain AI agents together.
                        </p>
                        <Button variant="gradient" size="lg" onClick={() => setShowCreateModal(true)}>
                            Create Your First Workflow
                        </Button>
                    </Card>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="relative glass-premium border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-glow-purple animate-scaleIn">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl transition-all duration-200 hover:scale-110 hover:rotate-90"
                        >
                            ×
                        </button>

                        <h2 className="text-3xl font-bold font-inter mb-6 text-gradient-intelligence">
                            Create New Workflow
                        </h2>

                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Workflow Name</label>
                                <input
                                    type="text"
                                    value={newWorkflow.name}
                                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                                    placeholder="e.g., Daily Report Generator"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent font-inter"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Description</label>
                                <textarea
                                    value={newWorkflow.description}
                                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                                    placeholder="What does this workflow do?"
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent resize-none font-inter"
                                />
                            </div>

                            {/* Trigger Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Trigger Type</label>
                                <select
                                    value={newWorkflow.trigger.type}
                                    onChange={(e) => setNewWorkflow({
                                        ...newWorkflow,
                                        trigger: { type: e.target.value as any, config: {} }
                                    })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent font-inter"
                                >
                                    <option value="manual">Manual</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="webhook">Webhook</option>
                                    <option value="event">Event</option>
                                </select>
                            </div>

                            {/* Steps */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-gray-300 font-inter">Workflow Steps</label>
                                    <Button variant="outline" size="sm" onClick={handleAddStep}>
                                        + Add Step
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {newWorkflow.steps.map((step, idx) => (
                                        <div key={step.id} className="p-4 glass-premium rounded-xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-cyber-aqua font-bold">{idx + 1}.</span>
                                                <select
                                                    value={step.agent}
                                                    onChange={(e) => {
                                                        const agent = availableAgents.find(a => a.name === e.target.value);
                                                        setNewWorkflow({
                                                            ...newWorkflow,
                                                            steps: newWorkflow.steps.map(s =>
                                                                s.id === step.id
                                                                    ? { ...s, agent: e.target.value, action: agent?.actions[0] || '' }
                                                                    : s
                                                            )
                                                        });
                                                    }}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyber-aqua font-inter"
                                                >
                                                    {availableAgents.map(agent => (
                                                        <option key={agent.name} value={agent.name}>{agent.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleRemoveStep(step.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <select
                                                value={step.action}
                                                onChange={(e) => setNewWorkflow({
                                                    ...newWorkflow,
                                                    steps: newWorkflow.steps.map(s =>
                                                        s.id === step.id ? { ...s, action: e.target.value } : s
                                                    )
                                                })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyber-aqua font-inter"
                                            >
                                                {availableAgents.find(a => a.name === step.agent)?.actions.map(action => (
                                                    <option key={action} value={action}>{action}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                    {newWorkflow.steps.length === 0 && (
                                        <p className="text-center text-gray-400 py-8 font-inter">No steps added yet. Click "Add Step" to begin.</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="gradient"
                                    className="flex-1"
                                    onClick={handleCreateWorkflow}
                                    disabled={!newWorkflow.name || !newWorkflow.description || newWorkflow.steps.length === 0}
                                >
                                    Create Workflow
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkflowBuilder;


