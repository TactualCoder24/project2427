import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { agentPersonaService, AgentPersona } from '../lib/supabaseAgentService';

const AVAILABLE_ICONS = ['🤖', '📢', '💻', '📊', '🎯', '💼', '🔬', '🎨', '📝', '⚡'];
const AVAILABLE_APPS = ['Gmail', 'Slack', 'GitHub', 'Notion', 'Google Calendar', 'Drive', 'LinkedIn', 'Twitter'];

const emptyForm = {
    name: '',
    description: '',
    icon: '🤖',
    instructions: '',
    connected_apps: [] as string[],
    behavior_patterns: {
        proactive: false,
        notificationLevel: 'important' as const,
        autoExecute: false
    },
    status: 'active' as const,
};

const PersonaManager: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [personas, setPersonas] = useState<AgentPersona[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
    const [newPersona, setNewPersona] = useState({ ...emptyForm, connected_apps: [] as string[] });

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        loadPersonas();
        // Restore active persona from orchestrator
        import('../lib/agents/AgentOrchestrator').then(({ orchestrator }) => {
            const active = orchestrator.getActivePersona();
            if (active) setActivePersonaId(active.id);
        });
    }, [isAuthenticated, navigate]);

    const loadPersonas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await agentPersonaService.getAll();
            setPersonas(data);
        } catch (err) {
            setError('Failed to load personas. Check your Supabase connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePersona = async () => {
        if (!newPersona.name || !newPersona.description || !newPersona.instructions) return;
        try {
            const created = await agentPersonaService.create(newPersona);
            setPersonas([created, ...personas]);
            setShowCreateModal(false);
            setNewPersona({ ...emptyForm, connected_apps: [] });
        } catch (err) {
            setError('Failed to create persona.');
        }
    };

    const handleToggleStatus = async (persona: AgentPersona) => {
        const newStatus = persona.status === 'active' ? 'inactive' : 'active';
        try {
            await agentPersonaService.update(persona.id, { status: newStatus });
            setPersonas(personas.map(p => p.id === persona.id ? { ...p, status: newStatus } : p));
        } catch {
            setError('Failed to update persona status.');
        }
    };

    const handleDeletePersona = async (id: string) => {
        if (!window.confirm('Delete this persona?')) return;
        try {
            await agentPersonaService.delete(id);
            setPersonas(personas.filter(p => p.id !== id));
            if (activePersonaId === id) {
                const { orchestrator } = await import('../lib/agents/AgentOrchestrator');
                orchestrator.setPersona(null);
                setActivePersonaId(null);
            }
        } catch {
            setError('Failed to delete persona.');
        }
    };

    const handleUseInPlayground = async (persona: AgentPersona) => {
        const { orchestrator } = await import('../lib/agents/AgentOrchestrator');
        orchestrator.setPersona(persona);
        await agentPersonaService.updateLastUsed(persona.id);
        setActivePersonaId(persona.id);
        navigate('/playground');
    };

    const toggleApp = (app: string) => {
        setNewPersona(prev => ({
            ...prev,
            connected_apps: prev.connected_apps.includes(app)
                ? prev.connected_apps.filter(a => a !== app)
                : [...prev.connected_apps, app]
        }));
    };

    if (!user && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    const activeCount = personas.filter(p => p.status === 'active').length;
    const totalApps = new Set(personas.flatMap(p => p.connected_apps || [])).size;

    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-surface via-surface-2 to-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
                        AI <span className="text-gradient-animate">Personas</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-ink-2 max-w-4xl mx-auto font-inter leading-relaxed">
                        Create custom AI personalities with specific behaviors, instructions, and connected apps.
                    </p>
                </div>

                {activePersonaId && (
                    <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl text-neon-green font-inter flex items-center gap-3">
                        <span>✓</span>
                        <span>
                            Active persona: <strong>{personas.find(p => p.id === activePersonaId)?.name}</strong> — used in AI Playground
                        </span>
                        <button
                            className="ml-auto text-ink-2 hover:text-ink text-lg"
                            onClick={async () => {
                                const { orchestrator } = await import('../lib/agents/AgentOrchestrator');
                                orchestrator.setPersona(null);
                                setActivePersonaId(null);
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-inter">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Total Personas</p>
                                <p className="text-4xl font-bold font-inter text-gradient-intelligence">{personas.length}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua to-vivid-purple rounded-2xl flex items-center justify-center shadow-glow-md">
                                <span className="text-3xl">🎭</span>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Active Personas</p>
                                <p className="text-4xl font-bold font-inter text-gradient">{activeCount}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center shadow-glow-sm">
                                <span className="text-3xl">✓</span>
                            </div>
                        </div>
                    </Card>
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-ink-2 text-sm font-inter mb-2">Connected Apps</p>
                                <p className="text-4xl font-bold font-inter text-gradient-quantum">{totalApps}</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                <span className="text-3xl">🔌</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mb-8 flex justify-end">
                    <Button variant="gradient" size="lg" onClick={() => setShowCreateModal(true)}>
                        ✨ Create New Persona
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {personas.map((persona) => (
                            <Card key={persona.id} variant="premium" className={`p-6 hover-glow ${activePersonaId === persona.id ? 'ring-2 ring-neon-green/50' : ''}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                        <span className="text-4xl">{persona.icon}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${persona.status === 'active'
                                            ? 'bg-neon-green/20 text-neon-green'
                                            : 'bg-gray-500/20 text-ink-2'}`}>
                                            {persona.status}
                                        </span>
                                        {activePersonaId === persona.id && (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyber-aqua/20 text-cyber-aqua">
                                                in use
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold font-inter mb-2 text-gradient-intelligence">{persona.name}</h3>
                                <p className="text-ink-2 mb-3 font-inter leading-relaxed text-sm">{persona.description}</p>

                                {persona.instructions && (
                                    <div className="mb-3 p-3 bg-ink/5 rounded-xl">
                                        <p className="text-xs text-ink-2 mb-1 font-inter">Instructions:</p>
                                        <p className="text-xs text-ink-2 font-inter line-clamp-2">{persona.instructions}</p>
                                    </div>
                                )}

                                {persona.connected_apps && persona.connected_apps.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-ink-2 mb-2 font-inter">Connected Apps:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {persona.connected_apps.map((app, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-ink/5 rounded-lg text-xs text-ink-2">{app}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {persona.last_used_at && (
                                    <p className="text-xs text-ink-3 mb-4 font-inter">
                                        Last used: {new Date(persona.last_used_at).toLocaleDateString()}
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        variant="gradient"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleUseInPlayground(persona)}
                                    >
                                        Use in Playground
                                    </Button>
                                    <Button
                                        variant={persona.status === 'active' ? 'outline' : 'gradient'}
                                        size="sm"
                                        onClick={() => handleToggleStatus(persona)}
                                    >
                                        {persona.status === 'active' ? 'Pause' : 'Activate'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeletePersona(persona.id)}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && personas.length === 0 && (
                    <Card variant="premium" className="p-12 text-center hover-glow">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple animate-bounce-subtle">
                            <span className="text-5xl">🎭</span>
                        </div>
                        <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-intelligence">Your AI stage is empty</h3>
                        <p className="text-ink-2 mb-6 font-inter max-w-md mx-auto">
                            Personas give your AI a name, a voice, and a purpose. Create one in under 2 minutes — no code needed.
                        </p>
                        <Button variant="gradient" size="lg" onClick={() => setShowCreateModal(true)}>
                            ✨ Create Your First Persona
                        </Button>
                    </Card>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="relative glass-premium border border-edge-2 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-glow-purple animate-scaleIn">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-6 right-6 text-ink-2 hover:text-ink text-3xl transition-all duration-200 hover:scale-110 hover:rotate-90"
                        >×</button>

                        <h2 className="text-3xl font-bold font-inter mb-6 text-gradient-intelligence">Create New Persona</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Icon</label>
                                <div className="flex flex-wrap gap-3">
                                    {AVAILABLE_ICONS.map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewPersona({ ...newPersona, icon })}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${newPersona.icon === icon
                                                ? 'bg-gradient-to-br from-cyber-aqua to-vivid-purple shadow-glow-md scale-110'
                                                : 'bg-ink/5 hover:bg-ink/[0.06]'}`}
                                        >{icon}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Name</label>
                                <input
                                    type="text"
                                    value={newPersona.name}
                                    onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                                    placeholder="e.g., Marketing Assistant"
                                    className="w-full bg-ink/5 border border-edge rounded-xl px-4 py-3 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyber-aqua font-inter"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Description</label>
                                <input
                                    type="text"
                                    value={newPersona.description}
                                    onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
                                    placeholder="Brief description of what this persona does"
                                    className="w-full bg-ink/5 border border-edge rounded-xl px-4 py-3 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyber-aqua font-inter"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">System Instructions</label>
                                <textarea
                                    value={newPersona.instructions}
                                    onChange={(e) => setNewPersona({ ...newPersona, instructions: e.target.value })}
                                    placeholder="How should this persona behave? e.g., 'You are a marketing expert. Always respond with data-driven insights and suggest actionable next steps.'"
                                    rows={4}
                                    className="w-full bg-ink/5 border border-edge rounded-xl px-4 py-3 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-cyber-aqua resize-none font-inter"
                                />
                                <p className="text-xs text-ink-3 mt-1 font-inter">These instructions will be used as the system prompt when this persona is active in the AI Playground.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-3 font-inter">Connected Apps</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_APPS.map(app => (
                                        <button
                                            key={app}
                                            onClick={() => toggleApp(app)}
                                            className={`px-3 py-2 rounded-lg text-sm font-inter transition-all ${newPersona.connected_apps.includes(app)
                                                ? 'bg-cyber-aqua/20 text-cyber-aqua border border-cyber-aqua/40'
                                                : 'bg-ink/5 text-ink-2 border border-edge hover:border-edge-2'}`}
                                        >{app}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-3 font-inter">Behavior Settings</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newPersona.behavior_patterns.proactive}
                                            onChange={(e) => setNewPersona({
                                                ...newPersona,
                                                behavior_patterns: { ...newPersona.behavior_patterns, proactive: e.target.checked }
                                            })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="text-ink-2 font-inter">Proactive (sends notifications)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newPersona.behavior_patterns.autoExecute}
                                            onChange={(e) => setNewPersona({
                                                ...newPersona,
                                                behavior_patterns: { ...newPersona.behavior_patterns, autoExecute: e.target.checked }
                                            })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="text-ink-2 font-inter">Auto-execute tasks</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="gradient"
                                    className="flex-1"
                                    onClick={handleCreatePersona}
                                    disabled={!newPersona.name || !newPersona.description || !newPersona.instructions}
                                >
                                    Create Persona
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
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

export default PersonaManager;
