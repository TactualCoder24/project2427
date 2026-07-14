import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { invisibleChainEngine, InvisibleChain } from '../lib/agents/InvisibleChains';
import { agentIntegrationService, agentWorkflowService } from '../lib/supabaseAgentService';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'processing' | 'completed' | 'error';
    chain?: InvisibleChain;
    metadata?: {
        intent?: string;
        agents?: string[];
        steps?: { agent: string; action: string; status: string }[];
    };
}

const AIPlayground: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activePersonaName, setActivePersonaName] = useState<string | null>(null);
    const [activePersonaIcon, setActivePersonaIcon] = useState<string>('🤖');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'system',
            content: 'Welcome to Vidvas AI Playground! I can help you automate tasks across multiple platforms. Try commands like:\n\n• "Send an email to team@example.com"\n• "Create a task in my project management tool"\n• "Summarize my recent notifications"\n• "Schedule a meeting for tomorrow at 2 PM"',
            timestamp: new Date(),
            status: 'completed'
        }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [agentStatus, setAgentStatus] = useState<{ name: string; status: 'active' | 'inactive' }[]>([
        { name: 'Intent Recognizer', status: 'active' },
        { name: 'Routing Agent', status: 'active' },
        { name: 'Gmail Agent', status: 'inactive' },
        { name: 'Slack Agent', status: 'inactive' },
        { name: 'Notion Agent', status: 'inactive' },
    ]);
    const [stats, setStats] = useState({ totalRuns: 0, successRate: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        // Read active persona from orchestrator
        import('../lib/agents/AgentOrchestrator').then(({ orchestrator }) => {
            const persona = orchestrator.getActivePersona();
            if (persona) {
                setActivePersonaName(persona.name);
                setActivePersonaIcon(persona.icon || '🤖');
            }
        });
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const loadOverview = async () => {
            if (!user) return;
            try {
                const [integrations, workflows] = await Promise.all([
                    agentIntegrationService.getAll(),
                    agentWorkflowService.getAll(),
                ]);

                const connectedNames = new Set(
                    integrations.filter(i => i.status === 'connected').map(i => i.integration_name)
                );
                const integrationAgentMap: Record<string, string> = {
                    'Gmail': 'Gmail Agent',
                    'Slack': 'Slack Agent',
                    'Notion': 'Notion Agent',
                };
                setAgentStatus(prev => prev.map(agent => {
                    const integrationName = Object.keys(integrationAgentMap).find(
                        key => integrationAgentMap[key] === agent.name
                    );
                    return integrationName && connectedNames.has(integrationName)
                        ? { ...agent, status: 'active' as const }
                        : agent;
                }));

                const totalRuns = workflows.reduce((sum, w) => sum + (w.run_count || 0), 0);
                const totalSuccesses = workflows.reduce((sum, w) => sum + (w.success_count || 0), 0);
                setStats({
                    totalRuns,
                    successRate: totalRuns > 0 ? Math.round((totalSuccesses / totalRuns) * 100) : 0,
                });
            } catch (error) {
                console.error('Error loading playground overview:', error);
            }
        };
        loadOverview();
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isProcessing || !user) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
            status: 'completed'
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = input;
        setInput('');
        setIsProcessing(true);

        // Processing message
        const processingMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Processing your request...',
            timestamp: new Date(),
            status: 'processing'
        };

        setMessages(prev => [...prev, processingMessage]);

        try {
            // InvisibleChains: detect complex multi-step intents and decompose before orchestrating
            const chain = await invisibleChainEngine.decomposeIntent(userInput);
            if (chain.steps.length > 0) {
                const chainMessage: Message = {
                    id: (Date.now() + 1.5).toString(),
                    role: 'assistant',
                    content: `🔗 **Multi-Step Plan Detected**\n\nI've broken your request into ${chain.steps.length} coordinated steps:`,
                    timestamp: new Date(),
                    status: 'completed',
                    chain,
                };
                setMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat(chainMessage));
                setIsProcessing(false);
                return;
            }

            // Import and use the orchestrator
            const { orchestrator } = await import('../lib/agents/AgentOrchestrator');
            const result = await orchestrator.executeTask(userInput, user.id);

            // Build response message
            let responseContent = '';
            let metadata: any = {};

            if (result.success) {
                responseContent = `✅ **Task Analysis Complete**\n\n`;
                if (result.persona) {
                    responseContent += `**Active Persona:** ${result.persona.name}\n`;
                    responseContent += `**System Context:** ${result.persona.instructions.slice(0, 100)}${result.persona.instructions.length > 100 ? '...' : ''}\n\n`;
                }
                responseContent += `**Intent Detected:** ${result.intent.type} (${Math.round(result.intent.confidence * 100)}% confidence)\n\n`;

                if (Object.keys(result.intent.entities).length > 0) {
                    responseContent += `**Extracted Information:**\n`;
                    Object.entries(result.intent.entities).forEach(([key, value]) => {
                        responseContent += `• ${key}: ${value}\n`;
                    });
                    responseContent += `\n`;
                }

                responseContent += `**Execution Plan:**\n`;
                result.plan.steps.forEach((step: any, idx: number) => {
                    const statusIcon = step.status === 'completed' ? '✓' :
                        step.status === 'failed' ? '✗' :
                            step.status === 'running' ? '⏳' : '○';
                    responseContent += `${idx + 1}. ${statusIcon} ${step.agent} - ${step.action}\n`;
                    if (step.output?.message) {
                        responseContent += `   → ${step.output.message}\n`;
                    }
                });

                metadata = {
                    intent: result.intent.type,
                    agents: result.plan.steps.map((s: any) => s.agent),
                    steps: result.plan.steps
                };
            } else {
                responseContent = `❌ **Error Processing Request**\n\n${result.error}\n\nPlease try rephrasing your request or check the Integration Hub for required connections.`;
            }

            const responseMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: responseContent,
                timestamp: new Date(),
                status: 'completed',
                metadata
            };

            setMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat(responseMessage));
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: `❌ **System Error**\n\n${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease try again or contact support if the issue persists.`,
                timestamp: new Date(),
                status: 'error'
            };
            setMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat(errorMessage));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const exampleCommands = [
        { icon: '📧', text: 'Send an email', command: 'Send an email to team@example.com with subject "Weekly Update"' },
        { icon: '📅', text: 'Schedule meeting', command: 'Schedule a team meeting for tomorrow at 2 PM' },
        { icon: '🚀', text: 'Launch product', command: 'Launch product — plan my go-to-market steps' },
        { icon: '✍️', text: 'Create content', command: 'Create content — blog post about AI automation' },
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-ink-2 font-inter">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-surface via-surface-2 to-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
                        AI <span className="text-gradient-animate">Playground</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-ink-2 max-w-4xl mx-auto font-inter leading-relaxed">
                        Your conversational AI command center. Execute tasks across platforms with natural language.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chat Interface */}
                    <div className="lg:col-span-2">
                        {activePersonaName && (
                            <div className="mb-3 px-4 py-2 bg-cyber-aqua/10 border border-cyber-aqua/30 rounded-xl flex items-center gap-3 font-inter text-sm">
                                <span className="text-xl">{activePersonaIcon}</span>
                                <span className="text-cyber-aqua font-semibold">{activePersonaName}</span>
                                <span className="text-ink-2">persona is active</span>
                                <button
                                    className="ml-auto text-ink-3 hover:text-ink transition-colors text-xs"
                                    onClick={() => navigate('/personas')}
                                >
                                    Change →
                                </button>
                            </div>
                        )}
                        <Card variant="premium" className="h-[600px] flex flex-col">
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                                ? 'bg-gradient-to-r from-cyber-aqua to-vivid-purple text-white'
                                                : message.role === 'system'
                                                    ? 'glass-premium border border-cyber-aqua/30'
                                                    : 'glass-premium border border-edge'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    {message.role === 'user' ? (
                                                        <div className="w-8 h-8 rounded-full bg-ink/[0.12] flex items-center justify-center">
                                                            <span className="text-sm">👤</span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-green to-lime-green flex items-center justify-center">
                                                            <span className="text-sm">{activePersonaName ? activePersonaIcon : '🤖'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-ink-2 mb-1 font-inter">
                                                        {message.role === 'user' ? 'You' : activePersonaName ? activePersonaName : 'Vidvas AI'}
                                                    </p>
                                                    <div className="text-ink whitespace-pre-wrap font-inter leading-relaxed">
                                                        {message.content}
                                                    </div>
                                                    {message.status === 'processing' && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div className="w-2 h-2 bg-cyber-aqua rounded-full animate-pulse"></div>
                                                            <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                        </div>
                                                    )}
                                                    {message.metadata?.steps && (
                                                        <div className="mt-3 space-y-2">
                                                            {message.metadata.steps.map((step, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                                    <span className={step.status === 'completed' ? 'text-neon-green' : 'text-ink-2'}>
                                                                        {step.status === 'completed' ? '✓' : '○'}
                                                                    </span>
                                                                    <span className="text-ink-2">{step.agent}: {step.action}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {message.chain && (
                                                        <div className="mt-4 border border-edge rounded-xl overflow-hidden">
                                                            <div className="divide-y divide-white/5">
                                                                {message.chain.steps.map((step, idx) => (
                                                                    <div key={step.id} className="flex items-start gap-3 px-4 py-3">
                                                                        <span className="text-xs font-bold font-outfit text-gradient-cyber mt-0.5 w-6 flex-shrink-0">
                                                                            {String(idx + 1).padStart(2, '0')}
                                                                        </span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm text-ink font-outfit font-semibold">{step.description}</p>
                                                                            <p className="text-xs text-ink-3 font-jakarta mt-0.5">{step.agent} → {step.action}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="border-t border-edge px-4 py-3 bg-white/[0.02]">
                                                                <button
                                                                    onClick={() => navigate('/workflows')}
                                                                    className="text-xs font-semibold text-electric-blue hover:text-neon-blue transition-colors font-outfit"
                                                                >
                                                                    ⚙️ Create Workflow from this Plan →
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-edge p-4">
                                <div className="flex gap-3">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your command... (e.g., 'Send an email to team@example.com')"
                                        className="flex-1 bg-ink/5 border border-edge rounded-xl px-4 py-3 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent resize-none font-inter"
                                        rows={2}
                                        disabled={isProcessing}
                                    />
                                    <Button
                                        variant="gradient"
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || isProcessing}
                                        className="self-end"
                                    >
                                        {isProcessing ? '⏳' : '🚀'} Send
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Commands */}
                        <Card variant="gradient" className="p-6">
                            <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-intelligence">
                                ⚡ Quick Commands
                            </h3>
                            <div className="space-y-3">
                                {exampleCommands.map((cmd, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(cmd.command)}
                                        className="w-full text-left p-3 glass-premium rounded-xl border border-edge hover:border-cyber-aqua/50 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{cmd.icon}</span>
                                            <span className="text-ink-2 font-inter group-hover:text-ink transition-colors">
                                                {cmd.text}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Agent Status */}
                        <Card variant="premium" className="p-6">
                            <h3 className="text-2xl font-bold font-inter mb-4 text-gradient">
                                🤖 Active Agents
                            </h3>
                            <div className="space-y-3">
                                {agentStatus.map((agent, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 glass-premium rounded-xl">
                                        <span className="text-ink-2 font-inter">{agent.name}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${agent.status === 'active'
                                            ? 'bg-neon-green/20 text-neon-green'
                                            : 'bg-gray-500/20 text-ink-2'
                                            }`}>
                                            {agent.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => navigate('/integrations')}
                            >
                                Manage Integrations →
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => navigate('/personas')}
                            >
                                Manage Personas →
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => navigate('/workflows')}
                            >
                                Workflow Builder →
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => navigate('/executions')}
                            >
                                View Executions →
                            </Button>
                        </Card>

                        {/* Stats */}
                        <Card variant="premium" className="p-6">
                            <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-quantum">
                                📊 Usage Stats
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-ink-2 font-inter">Tasks Executed</span>
                                        <span className="text-ink font-bold">{stats.totalRuns}</span>
                                    </div>
                                    <div className="w-full bg-ink/[0.06] rounded-full h-2">
                                        <div className="bg-gradient-to-r from-cyber-aqua to-vivid-purple h-2 rounded-full" style={{ width: `${Math.min(stats.totalRuns, 100)}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-ink-2 font-inter">Success Rate</span>
                                        <span className="text-ink font-bold">{stats.totalRuns > 0 ? `${stats.successRate}%` : '--'}</span>
                                    </div>
                                    <div className="w-full bg-ink/[0.06] rounded-full h-2">
                                        <div className="bg-gradient-to-r from-neon-green to-lime-green h-2 rounded-full" style={{ width: `${stats.successRate}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPlayground;


