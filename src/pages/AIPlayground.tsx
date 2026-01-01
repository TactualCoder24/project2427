import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'processing' | 'completed' | 'error';
    metadata?: {
        intent?: string;
        agents?: string[];
        steps?: { agent: string; action: string; status: string }[];
    };
}

const AIPlayground: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

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
            // Import and use the orchestrator
            const { orchestrator } = await import('../lib/agents/AgentOrchestrator');
            const result = await orchestrator.executeTask(userInput, user.id);

            // Build response message
            let responseContent = '';
            let metadata: any = {};

            if (result.success) {
                responseContent = `✅ **Task Analysis Complete**\n\n`;
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
        { icon: '📊', text: 'Generate report', command: 'Create a summary report of this week\'s activities' },
        { icon: '🔍', text: 'Research topic', command: 'Research the latest trends in AI automation' }
    ];

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
                        AI <span className="text-gradient-animate">Playground</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
                        Your conversational AI command center. Execute tasks across platforms with natural language.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chat Interface */}
                    <div className="lg:col-span-2">
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
                                                    : 'glass-premium border border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    {message.role === 'user' ? (
                                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                            <span className="text-sm">👤</span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-green to-lime-green flex items-center justify-center">
                                                            <span className="text-sm">🤖</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-400 mb-1 font-inter">
                                                        {message.role === 'user' ? 'You' : 'Vidvas AI'}
                                                    </p>
                                                    <div className="text-white whitespace-pre-wrap font-inter leading-relaxed">
                                                        {message.content}
                                                    </div>
                                                    {message.status === 'processing' && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div className="w-2 h-2 bg-cyber-aqua rounded-full animate-pulse"></div>
                                                            <div className="w-2 h-2 bg-vivid-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                            <div className="w-2 h-2 bg-hot-pink rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                        </div>
                                                    )}
                                                    {message.metadata?.steps && (
                                                        <div className="mt-3 space-y-2">
                                                            {message.metadata.steps.map((step, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                                    <span className={step.status === 'completed' ? 'text-neon-green' : 'text-gray-400'}>
                                                                        {step.status === 'completed' ? '✓' : '○'}
                                                                    </span>
                                                                    <span className="text-gray-300">{step.agent}: {step.action}</span>
                                                                </div>
                                                            ))}
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
                            <div className="border-t border-white/10 p-4">
                                <div className="flex gap-3">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your command... (e.g., 'Send an email to team@example.com')"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent resize-none font-inter"
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
                                        className="w-full text-left p-3 glass-premium rounded-xl border border-white/10 hover:border-cyber-aqua/50 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{cmd.icon}</span>
                                            <span className="text-gray-300 font-inter group-hover:text-white transition-colors">
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
                                {[
                                    { name: 'Intent Recognizer', status: 'active' },
                                    { name: 'Routing Agent', status: 'active' },
                                    { name: 'Gmail Agent', status: 'inactive' },
                                    { name: 'Slack Agent', status: 'inactive' },
                                    { name: 'Notion Agent', status: 'inactive' }
                                ].map((agent, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 glass-premium rounded-xl">
                                        <span className="text-gray-300 font-inter">{agent.name}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${agent.status === 'active'
                                            ? 'bg-neon-green/20 text-neon-green'
                                            : 'bg-gray-500/20 text-gray-400'
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
                                        <span className="text-gray-400 font-inter">Tasks Executed</span>
                                        <span className="text-white font-bold">0</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-cyber-aqua to-vivid-purple h-2 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400 font-inter">Success Rate</span>
                                        <span className="text-white font-bold">--</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-neon-green to-lime-green h-2 rounded-full" style={{ width: '0%' }}></div>
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


