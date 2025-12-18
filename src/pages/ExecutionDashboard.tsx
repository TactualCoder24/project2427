import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

interface ExecutionStep {
    agent: string;
    action: string;
    status: 'completed' | 'failed' | 'running' | 'pending';
    duration: number;
    output?: any;
    error?: string;
}

interface Execution {
    id: string;
    workflowName: string;
    trigger: string;
    status: 'completed' | 'failed' | 'running';
    startedAt: Date;
    completedAt?: Date;
    duration: number;
    steps: ExecutionStep[];
    successRate: number;
}

const ExecutionDashboard: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [executions, setExecutions] = useState<Execution[]>([
        {
            id: '1',
            workflowName: 'Daily Report Generator',
            trigger: 'Scheduled',
            status: 'completed',
            startedAt: new Date('2024-01-22T09:00:00'),
            completedAt: new Date('2024-01-22T09:02:30'),
            duration: 150,
            steps: [
                { agent: 'DataCollector', action: 'Fetch metrics', status: 'completed', duration: 45 },
                { agent: 'ReportGenerator', action: 'Create report', status: 'completed', duration: 60 },
                { agent: 'EmailAgent', action: 'Send email', status: 'completed', duration: 45 }
            ],
            successRate: 100
        },
        {
            id: '2',
            workflowName: 'GitHub PR Notifier',
            trigger: 'Webhook',
            status: 'completed',
            startedAt: new Date('2024-01-21T14:30:00'),
            completedAt: new Date('2024-01-21T14:30:15'),
            duration: 15,
            steps: [
                { agent: 'GitHubAgent', action: 'Get PR details', status: 'completed', duration: 8 },
                { agent: 'SlackAgent', action: 'Post message', status: 'completed', duration: 7 }
            ],
            successRate: 100
        },
        {
            id: '3',
            workflowName: 'Email Campaign Sender',
            trigger: 'Manual',
            status: 'failed',
            startedAt: new Date('2024-01-20T16:00:00'),
            completedAt: new Date('2024-01-20T16:00:45'),
            duration: 45,
            steps: [
                { agent: 'ContactListAgent', action: 'Fetch contacts', status: 'completed', duration: 20 },
                { agent: 'EmailAgent', action: 'Send bulk email', status: 'failed', duration: 25, error: 'Gmail API rate limit exceeded' }
            ],
            successRate: 50
        }
    ]);

    const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed' | 'running'>('all');

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const filteredExecutions = executions.filter(
        e => filterStatus === 'all' || e.status === filterStatus
    );

    const totalExecutions = executions.length;
    const completedExecutions = executions.filter(e => e.status === 'completed').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;
    const avgDuration = executions.length > 0
        ? Math.round(executions.reduce((sum, e) => sum + e.duration, 0) / executions.length)
        : 0;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 font-jakarta">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-outfit mb-6">
                        Execution <span className="text-gradient-animate">Dashboard</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-jakarta leading-relaxed">
                        Monitor and analyze all your workflow executions in real-time.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-jakarta mb-2">Total Executions</p>
                                <p className="text-4xl font-bold font-outfit text-gradient-cyber">{totalExecutions}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-vivid-purple rounded-2xl flex items-center justify-center shadow-glow-md">
                                <span className="text-3xl">📊</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-jakarta mb-2">Completed</p>
                                <p className="text-4xl font-bold font-outfit text-gradient">
                                    {completedExecutions}
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
                                <p className="text-gray-300 text-sm font-jakarta mb-2">Failed</p>
                                <p className="text-4xl font-bold font-outfit text-gradient-electric">
                                    {failedExecutions}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl">✗</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-jakarta mb-2">Avg Duration</p>
                                <p className="text-4xl font-bold font-outfit text-gradient">
                                    {avgDuration}s
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                <span className="text-3xl">⏱️</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {(['all', 'completed', 'failed', 'running'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-full transition-all duration-300 font-sora font-semibold text-base capitalize ${filterStatus === status
                                    ? 'bg-gradient-to-r from-electric-blue to-vivid-purple text-white shadow-glow-md scale-105'
                                    : 'glass-premium text-gray-300 hover:text-white hover:border-electric-blue/50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Executions List */}
                <div className="space-y-6">
                    {filteredExecutions.map((execution) => (
                        <Card key={execution.id} variant="premium" className="p-6 hover-glow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold font-outfit text-gradient-cyber">
                                            {execution.workflowName}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${execution.status === 'completed'
                                                ? 'bg-neon-green/20 text-neon-green'
                                                : execution.status === 'failed'
                                                    ? 'bg-red-500/20 text-red-500'
                                                    : 'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {execution.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 font-jakarta">
                                        <span>🎯 {execution.trigger}</span>
                                        <span>⏱️ {execution.duration}s</span>
                                        <span>📅 {execution.startedAt.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedExecution(execution)}
                                >
                                    View Details
                                </Button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400 font-jakarta">Progress</span>
                                    <span className="text-sm font-bold text-white">{execution.successRate}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${execution.status === 'completed'
                                                ? 'bg-gradient-to-r from-neon-green to-lime-green'
                                                : execution.status === 'failed'
                                                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                                    : 'bg-gradient-to-r from-electric-blue to-vivid-purple'
                                            }`}
                                        style={{ width: `${execution.successRate}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Steps Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {execution.steps.map((step, idx) => (
                                    <div key={idx} className="p-3 glass-premium rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-lg ${step.status === 'completed' ? 'text-neon-green' :
                                                    step.status === 'failed' ? 'text-red-500' :
                                                        step.status === 'running' ? 'text-yellow-500' :
                                                            'text-gray-500'
                                                }`}>
                                                {step.status === 'completed' ? '✓' :
                                                    step.status === 'failed' ? '✗' :
                                                        step.status === 'running' ? '⏳' : '○'}
                                            </span>
                                            <span className="text-sm font-semibold text-white font-jakarta">{step.agent}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-jakarta">{step.action}</p>
                                        <p className="text-xs text-gray-500 font-jakarta mt-1">{step.duration}s</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredExecutions.length === 0 && (
                    <Card variant="premium" className="p-12 text-center hover-glow">
                        <div className="w-24 h-24 bg-gradient-to-br from-electric-blue via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
                            <span className="text-5xl">📊</span>
                        </div>
                        <h3 className="text-2xl font-bold font-outfit mb-4 text-gradient-cyber">
                            No Executions Found
                        </h3>
                        <p className="text-gray-300 mb-6 font-jakarta max-w-md mx-auto">
                            {filterStatus === 'all'
                                ? 'No workflow executions yet. Create and run a workflow to see execution history.'
                                : `No ${filterStatus} executions found.`}
                        </p>
                        <Button variant="gradient" size="lg" onClick={() => navigate('/workflows')}>
                            Go to Workflows
                        </Button>
                    </Card>
                )}
            </div>

            {/* Detail Modal */}
            {selectedExecution && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="relative glass-premium border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-glow-purple animate-scaleIn">
                        <button
                            onClick={() => setSelectedExecution(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl transition-all duration-200 hover:scale-110 hover:rotate-90"
                        >
                            ×
                        </button>

                        <h2 className="text-3xl font-bold font-outfit mb-6 text-gradient-cyber">
                            Execution Details
                        </h2>

                        {/* Overview */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-gray-400 mb-1 font-jakarta">Workflow</p>
                                <p className="text-lg font-bold text-white font-outfit">{selectedExecution.workflowName}</p>
                            </div>
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-gray-400 mb-1 font-jakarta">Status</p>
                                <p className={`text-lg font-bold capitalize ${selectedExecution.status === 'completed' ? 'text-neon-green' :
                                        selectedExecution.status === 'failed' ? 'text-red-500' :
                                            'text-yellow-500'
                                    }`}>{selectedExecution.status}</p>
                            </div>
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-gray-400 mb-1 font-jakarta">Duration</p>
                                <p className="text-lg font-bold text-white">{selectedExecution.duration}s</p>
                            </div>
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-gray-400 mb-1 font-jakarta">Success Rate</p>
                                <p className="text-lg font-bold text-white">{selectedExecution.successRate}%</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold font-outfit mb-4 text-gradient">Execution Timeline</h3>
                            <div className="space-y-4">
                                {selectedExecution.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-neon-green/20 text-neon-green' :
                                                    step.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                                                        'bg-gray-500/20 text-gray-500'
                                                }`}>
                                                {step.status === 'completed' ? '✓' :
                                                    step.status === 'failed' ? '✗' : '○'}
                                            </div>
                                            {idx < selectedExecution.steps.length - 1 && (
                                                <div className="w-0.5 h-12 bg-white/10"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="p-4 glass-premium rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-white font-outfit">{step.agent}</h4>
                                                    <span className="text-sm text-gray-400 font-jakarta">{step.duration}s</span>
                                                </div>
                                                <p className="text-gray-300 mb-2 font-jakarta">{step.action}</p>
                                                {step.error && (
                                                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                        <p className="text-sm text-red-400 font-jakarta">Error: {step.error}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button variant="gradient" className="flex-1" onClick={() => setSelectedExecution(null)}>
                                Close
                            </Button>
                            <Button variant="outline" className="flex-1">
                                Re-run Workflow
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExecutionDashboard;
