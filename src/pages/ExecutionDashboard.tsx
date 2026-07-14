import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { agentExecutionService, AgentExecution, subscribeToExecutions } from '../lib/supabaseAgentService';

const ExecutionDashboard: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [executions, setExecutions] = useState<AgentExecution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedExecution, setSelectedExecution] = useState<AgentExecution | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed' | 'running'>('all');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadExecutions();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!user) return;
        const sub = subscribeToExecutions(user.id, (updated) => {
            setExecutions(prev => {
                const idx = prev.findIndex(e => e.id === updated.id);
                if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = updated;
                    return next;
                }
                return [updated, ...prev];
            });
        });
        return () => { sub.unsubscribe(); };
    }, [user]);

    const loadExecutions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await agentExecutionService.getAll(100);
            setExecutions(data);
        } catch (err) {
            setError('Failed to load executions. Check your Supabase connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredExecutions = executions.filter(
        e => filterStatus === 'all' || e.status === filterStatus
    );

    const totalExecutions = executions.length;
    const completedExecutions = executions.filter(e => e.status === 'completed').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;
    const avgDuration = executions.filter(e => e.duration_seconds).length > 0
        ? Math.round(
            executions.filter(e => e.duration_seconds).reduce((sum, e) => sum + (e.duration_seconds || 0), 0) /
            executions.filter(e => e.duration_seconds).length
        )
        : 0;

    const getSuccessRate = (execution: AgentExecution) => {
        if (!execution.steps || execution.steps.length === 0) return 0;
        const completed = execution.steps.filter(s => s.status === 'completed').length;
        return Math.round((completed / execution.steps.length) * 100);
    };

    if (!user && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-surface via-surface-2 to-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
                        Execution <span className="text-gradient-animate">Dashboard</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-ink-2 max-w-4xl mx-auto font-inter leading-relaxed">
                        Monitor and analyze all your workflow executions in real-time.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-inter">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Total Executions</p>
                                <p className="text-4xl font-bold font-inter text-gradient-intelligence">{totalExecutions}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua to-vivid-purple rounded-2xl flex items-center justify-center shadow-glow-md">
                                <span className="text-3xl">📊</span>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Completed</p>
                                <p className="text-4xl font-bold font-inter text-gradient">{completedExecutions}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center shadow-glow-sm">
                                <span className="text-3xl">✓</span>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Failed</p>
                                <p className="text-4xl font-bold font-inter text-gradient-quantum">{failedExecutions}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl">✗</span>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Avg Duration</p>
                                <p className="text-4xl font-bold font-inter text-gradient">{avgDuration}s</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                <span className="text-3xl">⏱️</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                    {(['all', 'completed', 'failed', 'running'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-full transition-all duration-300 font-sora font-semibold text-base capitalize ${filterStatus === status
                                ? 'bg-gradient-to-r from-cyber-aqua to-vivid-purple text-white shadow-glow-md scale-105'
                                : 'glass-premium text-ink-2 hover:text-ink hover:border-cyber-aqua/50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                    <button
                        onClick={loadExecutions}
                        className="px-6 py-3 rounded-full glass-premium text-ink-2 hover:text-ink transition-all duration-300 font-sora font-semibold text-base"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredExecutions.map((execution) => {
                            const successRate = getSuccessRate(execution);
                            return (
                                <Card key={execution.id} variant="premium" className="p-6 hover-glow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold font-inter text-gradient-intelligence">
                                                    {execution.workflow_name}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${execution.status === 'completed'
                                                    ? 'bg-neon-green/20 text-neon-green'
                                                    : execution.status === 'failed'
                                                        ? 'bg-red-500/20 text-red-500'
                                                        : execution.status === 'running'
                                                            ? 'bg-yellow-500/20 text-yellow-500'
                                                            : 'bg-gray-500/20 text-ink-2'
                                                    }`}>
                                                    {execution.status === 'running' && <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-1" />}
                                                    {execution.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-ink-2 font-inter">
                                                <span>🎯 {execution.trigger_type}</span>
                                                {execution.duration_seconds !== undefined && <span>⏱️ {execution.duration_seconds}s</span>}
                                                <span>📅 {new Date(execution.started_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedExecution(execution)}>
                                            View Details
                                        </Button>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-ink-2 font-inter">Progress</span>
                                            <span className="text-sm font-bold text-ink">{successRate}%</span>
                                        </div>
                                        <div className="w-full bg-ink/[0.06] rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${execution.status === 'completed'
                                                    ? 'bg-gradient-to-r from-neon-green to-lime-green'
                                                    : execution.status === 'failed'
                                                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                                        : 'bg-gradient-to-r from-cyber-aqua to-vivid-purple'
                                                    }`}
                                                style={{ width: `${successRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    {execution.steps && execution.steps.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {execution.steps.map((step, idx) => (
                                                <div key={idx} className="p-3 glass-premium rounded-xl">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-lg ${step.status === 'completed' ? 'text-neon-green' :
                                                            step.status === 'failed' ? 'text-red-500' :
                                                                step.status === 'running' ? 'text-yellow-500' : 'text-ink-3'
                                                            }`}>
                                                            {step.status === 'completed' ? '✓' :
                                                                step.status === 'failed' ? '✗' :
                                                                    step.status === 'running' ? '⏳' : '○'}
                                                        </span>
                                                        <span className="text-sm font-semibold text-ink font-inter">{step.agent}</span>
                                                    </div>
                                                    <p className="text-xs text-ink-2 font-inter">{step.action}</p>
                                                    {step.duration > 0 && <p className="text-xs text-ink-3 font-inter mt-1">{step.duration}s</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredExecutions.length === 0 && (
                    <Card variant="premium" className="p-12 text-center hover-glow">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
                            <span className="text-5xl">📊</span>
                        </div>
                        <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-intelligence">No Executions Found</h3>
                        <p className="text-ink-2 mb-6 font-inter max-w-md mx-auto">
                            {filterStatus === 'all'
                                ? 'No workflow executions yet. Go to Workflows and hit "Run Now" to start one.'
                                : `No ${filterStatus} executions found.`}
                        </p>
                        <Button variant="gradient" size="lg" onClick={() => navigate('/workflows')}>
                            Go to Workflows
                        </Button>
                    </Card>
                )}
            </div>

            {selectedExecution && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="relative glass-premium border border-edge-2 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-glow-purple animate-scaleIn">
                        <button
                            onClick={() => setSelectedExecution(null)}
                            className="absolute top-6 right-6 text-ink-2 hover:text-ink text-3xl transition-all duration-200 hover:scale-110 hover:rotate-90"
                        >
                            ×
                        </button>

                        <h2 className="text-3xl font-bold font-inter mb-6 text-gradient-intelligence">Execution Details</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-ink-2 mb-1 font-inter">Workflow</p>
                                <p className="text-lg font-bold text-ink font-inter">{selectedExecution.workflow_name}</p>
                            </div>
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-ink-2 mb-1 font-inter">Status</p>
                                <p className={`text-lg font-bold capitalize ${selectedExecution.status === 'completed' ? 'text-neon-green' :
                                    selectedExecution.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                                    }`}>{selectedExecution.status}</p>
                            </div>
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-ink-2 mb-1 font-inter">Duration</p>
                                <p className="text-lg font-bold text-ink">
                                    {selectedExecution.duration_seconds !== undefined ? `${selectedExecution.duration_seconds}s` : 'In progress'}
                                </p>
                            </div>
                            <div className="p-4 glass-premium rounded-xl">
                                <p className="text-sm text-ink-2 mb-1 font-inter">Started</p>
                                <p className="text-lg font-bold text-ink">
                                    {new Date(selectedExecution.started_at).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {selectedExecution.error_message && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-sm text-red-400 font-inter">Error: {selectedExecution.error_message}</p>
                            </div>
                        )}

                        {selectedExecution.steps && selectedExecution.steps.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold font-inter mb-4 text-gradient">Execution Timeline</h3>
                                <div className="space-y-4">
                                    {selectedExecution.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-neon-green/20 text-neon-green' :
                                                    step.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                                                        step.status === 'running' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-ink-3'
                                                    }`}>
                                                    {step.status === 'completed' ? '✓' :
                                                        step.status === 'failed' ? '✗' :
                                                            step.status === 'running' ? '⏳' : '○'}
                                                </div>
                                                {idx < selectedExecution.steps.length - 1 && (
                                                    <div className="w-0.5 h-12 bg-ink/[0.06]" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="p-4 glass-premium rounded-xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold text-ink font-inter">{step.agent}</h4>
                                                        {step.duration > 0 && <span className="text-sm text-ink-2 font-inter">{step.duration}s</span>}
                                                    </div>
                                                    <p className="text-ink-2 mb-2 font-inter">{step.action}</p>
                                                    {step.error && (
                                                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                            <p className="text-sm text-red-400 font-inter">Error: {step.error}</p>
                                                        </div>
                                                    )}
                                                    {step.output && (
                                                        <div className="mt-2 p-2 bg-ink/5 rounded-lg">
                                                            <p className="text-xs text-ink-2 font-inter font-mono">
                                                                {typeof step.output === 'string' ? step.output : JSON.stringify(step.output, null, 2)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button variant="gradient" className="flex-1" onClick={() => setSelectedExecution(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExecutionDashboard;
