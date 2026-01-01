import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

interface Persona {
    id: string;
    name: string;
    description: string;
    icon: string;
    instructions: string;
    connectedApps: string[];
    behaviorPatterns: {
        proactive: boolean;
        notificationLevel: 'all' | 'important' | 'critical';
        autoExecute: boolean;
    };
    createdAt: Date;
    lastUsed?: Date;
}

const PersonaManager: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [personas, setPersonas] = useState<Persona[]>([
        {
            id: '1',
            name: 'Marketing Assistant',
            description: 'Helps with social media, email campaigns, and content creation',
            icon: '📢',
            instructions: 'You are a marketing expert. Help with social media posts, email campaigns, and content strategy. Be creative and data-driven.',
            connectedApps: ['LinkedIn', 'Twitter', 'Gmail'],
            behaviorPatterns: {
                proactive: true,
                notificationLevel: 'important',
                autoExecute: false
            },
            createdAt: new Date('2024-01-15'),
            lastUsed: new Date('2024-01-20')
        },
        {
            id: '2',
            name: 'Developer Assistant',
            description: 'Manages code reviews, GitHub issues, and technical documentation',
            icon: '💻',
            instructions: 'You are a senior developer. Help with code reviews, GitHub management, and technical documentation. Focus on best practices and clean code.',
            connectedApps: ['GitHub', 'Slack', 'Notion'],
            behaviorPatterns: {
                proactive: true,
                notificationLevel: 'all',
                autoExecute: false
            },
            createdAt: new Date('2024-01-10'),
            lastUsed: new Date('2024-01-22')
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [newPersona, setNewPersona] = useState({
        name: '',
        description: '',
        icon: '🤖',
        instructions: '',
        connectedApps: [] as string[],
        behaviorPatterns: {
            proactive: false,
            notificationLevel: 'important' as const,
            autoExecute: false
        }
    });

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleCreatePersona = () => {
        const persona: Persona = {
            id: Date.now().toString(),
            ...newPersona,
            createdAt: new Date()
        };
        setPersonas([...personas, persona]);
        setShowCreateModal(false);
        setNewPersona({
            name: '',
            description: '',
            icon: '🤖',
            instructions: '',
            connectedApps: [],
            behaviorPatterns: {
                proactive: false,
                notificationLevel: 'important',
                autoExecute: false
            }
        });
    };

    const handleDeletePersona = (id: string) => {
        if (window.confirm('Are you sure you want to delete this persona?')) {
            setPersonas(personas.filter(p => p.id !== id));
        }
    };

    const availableIcons = ['🤖', '📢', '💻', '📊', '🎯', '💼', '🔬', '🎨', '📝', '⚡'];

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
                        AI <span className="text-gradient-animate">Personas</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
                        Create custom AI personalities with specific behaviors, instructions, and connected apps.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Total Personas</p>
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
                                <p className="text-gray-300 text-sm font-inter mb-2">Active Personas</p>
                                <p className="text-4xl font-bold font-inter text-gradient">
                                    {personas.filter(p => p.behaviorPatterns.proactive).length}
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
                                <p className="text-gray-300 text-sm font-inter mb-2">Connected Apps</p>
                                <p className="text-4xl font-bold font-inter text-gradient-quantum">
                                    {new Set(personas.flatMap(p => p.connectedApps)).size}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                <span className="text-3xl">🔌</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Create Button */}
                <div className="mb-8 flex justify-end">
                    <Button variant="gradient" size="lg" onClick={() => setShowCreateModal(true)}>
                        ✨ Create New Persona
                    </Button>
                </div>

                {/* Personas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personas.map((persona) => (
                        <Card key={persona.id} variant="premium" className="p-6 hover-glow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                    <span className="text-4xl">{persona.icon}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${persona.behaviorPatterns.proactive
                                        ? 'bg-neon-green/20 text-neon-green'
                                        : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {persona.behaviorPatterns.proactive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold font-inter mb-2 text-gradient-intelligence">
                                {persona.name}
                            </h3>

                            <p className="text-gray-300 mb-4 font-inter leading-relaxed">
                                {persona.description}
                            </p>

                            <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-2 font-inter">Connected Apps:</p>
                                <div className="flex flex-wrap gap-2">
                                    {persona.connectedApps.map((app, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-300">
                                            {app}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {persona.lastUsed && (
                                <p className="text-xs text-gray-400 mb-4 font-inter">
                                    Last used: {persona.lastUsed.toLocaleDateString()}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setSelectedPersona(persona)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleDeletePersona(persona.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {personas.length === 0 && (
                    <Card variant="premium" className="p-12 text-center hover-glow">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
                            <span className="text-5xl">🎭</span>
                        </div>
                        <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-intelligence">
                            No Personas Yet
                        </h3>
                        <p className="text-gray-300 mb-6 font-inter max-w-md mx-auto">
                            Create your first AI persona to get started with customized automation.
                        </p>
                        <Button variant="gradient" size="lg" onClick={() => setShowCreateModal(true)}>
                            Create Your First Persona
                        </Button>
                    </Card>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="relative glass-premium border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-glow-purple animate-scaleIn">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl transition-all duration-200 hover:scale-110 hover:rotate-90"
                        >
                            ×
                        </button>

                        <h2 className="text-3xl font-bold font-inter mb-6 text-gradient-intelligence">
                            Create New Persona
                        </h2>

                        <div className="space-y-6">
                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Icon</label>
                                <div className="flex flex-wrap gap-3">
                                    {availableIcons.map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewPersona({ ...newPersona, icon })}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${newPersona.icon === icon
                                                    ? 'bg-gradient-to-br from-cyber-aqua to-vivid-purple shadow-glow-md scale-110'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Name</label>
                                <input
                                    type="text"
                                    value={newPersona.name}
                                    onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                                    placeholder="e.g., Marketing Assistant"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent font-inter"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Description</label>
                                <input
                                    type="text"
                                    value={newPersona.description}
                                    onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
                                    placeholder="Brief description of what this persona does"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent font-inter"
                                />
                            </div>

                            {/* Instructions */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Instructions</label>
                                <textarea
                                    value={newPersona.instructions}
                                    onChange={(e) => setNewPersona({ ...newPersona, instructions: e.target.value })}
                                    placeholder="Detailed instructions for how this persona should behave..."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent resize-none font-inter"
                                />
                            </div>

                            {/* Behavior Patterns */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3 font-inter">Behavior Patterns</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newPersona.behaviorPatterns.proactive}
                                            onChange={(e) => setNewPersona({
                                                ...newPersona,
                                                behaviorPatterns: { ...newPersona.behaviorPatterns, proactive: e.target.checked }
                                            })}
                                            className="w-5 h-5 rounded bg-white/5 border-white/10 text-cyber-aqua focus:ring-cyber-aqua"
                                        />
                                        <span className="text-gray-300 font-inter">Proactive (sends notifications)</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newPersona.behaviorPatterns.autoExecute}
                                            onChange={(e) => setNewPersona({
                                                ...newPersona,
                                                behaviorPatterns: { ...newPersona.behaviorPatterns, autoExecute: e.target.checked }
                                            })}
                                            className="w-5 h-5 rounded bg-white/5 border-white/10 text-cyber-aqua focus:ring-cyber-aqua"
                                        />
                                        <span className="text-gray-300 font-inter">Auto-execute tasks</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="gradient"
                                    className="flex-1"
                                    onClick={handleCreatePersona}
                                    disabled={!newPersona.name || !newPersona.description || !newPersona.instructions}
                                >
                                    Create Persona
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

export default PersonaManager;


