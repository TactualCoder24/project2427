import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  agentPersonaService,
  agentWorkflowService,
  AgentPersona,
  AgentWorkflow,
} from '../lib/supabaseAgentService';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  totalPersonas: number;
  activePersonas: number;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    totalPersonas: 0,
    activePersonas: 0,
  });
  const [recentPersonas, setRecentPersonas] = useState<AgentPersona[]>([]);
  const [recentWorkflows, setRecentWorkflows] = useState<AgentWorkflow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
    import('../lib/agents/AgentOrchestrator').then(({ orchestrator }) => {
      const active = orchestrator.getActivePersona();
      if (active) setActivePersonaId(active.id);
    });
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);

      const [workflows, personas, executionsResult] = await Promise.allSettled([
        agentWorkflowService.getAll(),
        agentPersonaService.getAll(),
        supabase
          .from('agent_executions')
          .select('id, status')
          .order('started_at', { ascending: false })
          .limit(100),
      ]);

      const wfData = workflows.status === 'fulfilled' ? workflows.value : [];
      const pData = personas.status === 'fulfilled' ? personas.value : [];
      const execData =
        executionsResult.status === 'fulfilled' && !executionsResult.value.error
          ? executionsResult.value.data || []
          : [];

      setStats({
        totalWorkflows: wfData.length,
        activeWorkflows: wfData.filter(w => w.status === 'active').length,
        totalExecutions: execData.length,
        successfulExecutions: execData.filter((e: any) => e.status === 'completed').length,
        totalPersonas: pData.length,
        activePersonas: pData.filter(p => p.status === 'active').length,
      });

      setRecentPersonas(pData.slice(0, 3));
      setRecentWorkflows(wfData.slice(0, 3));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUsePersona = async (persona: AgentPersona) => {
    const { orchestrator } = await import('../lib/agents/AgentOrchestrator');
    orchestrator.setPersona(persona);
    await agentPersonaService.updateLastUsed(persona.id);
    setActivePersonaId(persona.id);
    navigate('/playground');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-2 font-inter">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getSubscriptionColor = (sub: string) => {
    const map: Record<string, string> = {
      free:       'bg-gradient-to-r from-gray-500 to-gray-600',
      pro:        'bg-gradient-to-r from-electric-blue to-cyber-cyan',
      enterprise: 'bg-gradient-to-r from-neon-green to-lime-green',
    };
    return map[sub] || map.free;
  };

  const getWorkflowStatusColor = (status: string) => {
    const map: Record<string, string> = {
      active:   'bg-neon-green/20 text-neon-green',
      inactive: 'bg-gray-500/20 text-ink-2',
      draft:    'bg-yellow-500/20 text-yellow-400',
    };
    return map[status] || map.draft;
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-surface via-surface-2/50 to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Profile Header ─────────────────────────────────── */}
        <div className="mb-10">
          <Card variant="premium" className="p-8 hover-glow">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-electric-blue/30 shadow-glow-md object-cover"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-2">
                    Welcome back, <span className="text-gradient-cyber">{user.name.split(' ')[0]}</span>
                  </h1>
                  <p className="text-ink-2 font-inter mb-3">{user.email}</p>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white ${getSubscriptionColor(user.subscription)} shadow-glow-sm`}>
                    {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)} Plan
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        {/* Active persona banner */}
        {activePersonaId && (
          <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl flex items-center gap-3 font-inter">
            <span className="text-neon-green">✓</span>
            <span className="text-ink-2 text-sm">
              Active persona:{' '}
              <strong className="text-ink">{recentPersonas.find(p => p.id === activePersonaId)?.name ?? 'Selected Persona'}</strong>
              {' '}— currently used in AI Playground
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

        {/* ── Stats Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {loadingData ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} variant="premium" className="p-4 text-center">
                <div className="h-8 bg-ink/5 rounded animate-pulse mb-2" />
                <div className="h-3 bg-ink/5 rounded animate-pulse" />
              </Card>
            ))
          ) : (
            <>
              {[
                { value: stats.totalWorkflows,      label: 'Workflows',    gradient: 'text-gradient-cyber',        icon: '⚙️', iconBg: 'from-electric-blue to-cyber-cyan' },
                { value: stats.activeWorkflows,     label: 'Active',       gradient: 'text-neon-green',            icon: '▶️', iconBg: 'from-neon-green to-lime-green' },
                { value: stats.totalExecutions,     label: 'Executions',   gradient: 'text-gradient',              icon: '📊', iconBg: 'from-vivid-purple to-hot-pink' },
                { value: stats.successfulExecutions,label: 'Successful',   gradient: 'text-gradient-intelligence', icon: '✓',  iconBg: 'from-electric-blue to-vivid-purple' },
                { value: stats.totalPersonas,       label: 'Personas',     gradient: 'text-gradient-electric',     icon: '🎭', iconBg: 'from-hot-pink to-amber-glow' },
                { value: stats.activePersonas,      label: 'Active',       gradient: 'text-gradient-quantum',      icon: '⚡', iconBg: 'from-vivid-purple to-electric-blue' },
              ].map((s, idx) => (
                <Card key={idx} variant="gradient" className="p-4 text-center hover-glow">
                  <div className={`w-10 h-10 bg-gradient-to-br ${s.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-glow-sm`}>
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <p className={`text-2xl font-bold font-outfit ${s.gradient}`}>{s.value}</p>
                  <p className="text-ink-2 font-inter text-xs mt-0.5">{s.label}</p>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* ── Two-column: Personas + Workflows ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Personas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-outfit text-gradient-animate">Your Personas</h2>
              <Button variant="gradient-purple" size="sm" onClick={() => navigate('/personas')}>
                Manage All →
              </Button>
            </div>

            {loadingData ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <Card key={i} variant="premium" className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-ink/5 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 bg-ink/5 rounded animate-pulse mb-2 w-1/2" />
                        <div className="h-3 bg-ink/5 rounded animate-pulse w-3/4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : recentPersonas.length === 0 ? (
              <Card variant="premium" className="p-8 text-center hover-glow">
                <div className="w-16 h-16 bg-gradient-to-br from-hot-pink to-vivid-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-purple animate-bounce-subtle">
                  <span className="text-3xl">🎭</span>
                </div>
                <h3 className="text-lg font-bold font-outfit mb-2 text-gradient-intelligence">Your AI cast is empty</h3>
                <p className="text-ink-2 font-inter text-sm mb-4">
                  Give your AI a name, a voice, and a personality — build your first persona in under 2 minutes.
                </p>
                <Button variant="gradient" size="sm" onClick={() => navigate('/personas')}>
                  ✨ Create First Persona
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentPersonas.map(persona => (
                  <Card
                    key={persona.id}
                    variant="premium"
                    className={`p-4 hover-glow ${activePersonaId === persona.id ? 'ring-2 ring-neon-green/40' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan via-vivid-purple to-hot-pink rounded-xl flex items-center justify-center shadow-glow-sm flex-shrink-0">
                        <span className="text-2xl">{persona.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold font-inter text-ink text-sm truncate">{persona.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                            persona.status === 'active' ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20 text-ink-2'
                          }`}>{persona.status}</span>
                          {activePersonaId === persona.id && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-electric-blue/20 text-electric-blue flex-shrink-0">active</span>
                          )}
                        </div>
                        <p className="text-ink-2 font-inter text-xs truncate">{persona.description}</p>
                      </div>
                      <Button
                        variant="gradient"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => handleUsePersona(persona)}
                      >
                        Use
                      </Button>
                    </div>
                  </Card>
                ))}
                {stats.totalPersonas > 3 && (
                  <button
                    onClick={() => navigate('/personas')}
                    className="w-full text-center text-sm font-inter text-ink-2 hover:text-ink py-2 transition-colors"
                  >
                    + {stats.totalPersonas - 3} more personas →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Workflows */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-outfit text-gradient-animate">Your Workflows</h2>
              <Button variant="gradient" size="sm" onClick={() => navigate('/workflows')}>
                Manage All →
              </Button>
            </div>

            {loadingData ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <Card key={i} variant="premium" className="p-4">
                    <div className="h-4 bg-ink/5 rounded animate-pulse mb-2 w-1/2" />
                    <div className="h-3 bg-ink/5 rounded animate-pulse w-3/4" />
                  </Card>
                ))}
              </div>
            ) : recentWorkflows.length === 0 ? (
              <Card variant="premium" className="p-8 text-center hover-glow">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-vivid-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-md animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-lg font-bold font-outfit mb-2 text-gradient-intelligence">No automations running yet</h3>
                <p className="text-ink-2 font-inter text-sm mb-4">
                  Build your first AI workflow in under 10 minutes using one of our ready-made templates.
                </p>
                <Button variant="gradient" size="sm" onClick={() => navigate('/workflows')}>
                  ⚙️ Create First Workflow
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentWorkflows.map(wf => (
                  <Card key={wf.id} variant="premium" className="p-4 hover-glow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-vivid-purple rounded-xl flex items-center justify-center shadow-glow-sm flex-shrink-0">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold font-inter text-ink text-sm truncate">{wf.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${getWorkflowStatusColor(wf.status)}`}>
                            {wf.status}
                          </span>
                        </div>
                        <p className="text-ink-2 font-inter text-xs">
                          {wf.steps?.length ?? 0} steps · {wf.run_count ?? 0} runs · {wf.trigger?.type}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => navigate('/workflows')}
                      >
                        Open
                      </Button>
                    </div>
                  </Card>
                ))}
                {stats.totalWorkflows > 3 && (
                  <button
                    onClick={() => navigate('/workflows')}
                    className="w-full text-center text-sm font-inter text-ink-2 hover:text-ink py-2 transition-colors"
                  >
                    + {stats.totalWorkflows - 3} more workflows →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ──────────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-bold font-outfit mb-6 text-gradient-animate">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: '🤖', label: 'AI Playground',     sub: 'Chat with agents',         path: '/playground',  gradient: 'from-cyber-cyan to-vivid-purple',  shadow: 'shadow-glow-md',     badge: 'HOT' },
              { icon: '🎭', label: 'Persona Manager',   sub: 'Manage AI personalities',  path: '/personas',    gradient: 'from-hot-pink to-vivid-purple',    shadow: 'shadow-glow-purple', badge: null },
              { icon: '⚙️', label: 'Workflow Builder',  sub: 'Build automations',        path: '/workflows',   gradient: 'from-electric-blue to-cyber-cyan', shadow: 'shadow-glow-md',     badge: null },
              { icon: '📊', label: 'Execution Logs',    sub: 'Track all runs',           path: '/executions',  gradient: 'from-vivid-purple to-electric-blue',shadow: 'shadow-glow-purple', badge: null },
              { icon: '🔌', label: 'Integrations',      sub: 'Connect 12+ apps',         path: '/integrations',gradient: 'from-neon-green to-electric-blue',  shadow: 'shadow-glow-sm',     badge: null },
              { icon: '🚀', label: 'Agents Catalog',    sub: 'Browse AI agents',         path: '/agents',      gradient: 'from-amber-glow to-hot-pink',       shadow: 'shadow-glow-pink',   badge: null },
              { icon: '💬', label: 'Live Support',      sub: 'Chat with our team',       path: '/support',     gradient: 'from-electric-blue to-vivid-purple',shadow: 'shadow-glow-md',     badge: null },
              { icon: '📅', label: 'Schedule Demo',     sub: 'Book a walkthrough',       path: '/demo',        gradient: 'from-neon-green to-cyber-cyan',     shadow: 'shadow-glow-sm',     badge: null },
            ].map(action => (
              <div key={action.path} onClick={() => navigate(action.path)} className="cursor-pointer">
                <Card variant="premium" className="p-5 hover-glow relative overflow-hidden h-full">
                  {action.badge && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green rounded-full text-[10px] font-bold">{action.badge}</span>
                    </div>
                  )}
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 mx-auto ${action.shadow}`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="text-sm font-bold font-inter text-center text-ink mb-1">{action.label}</h3>
                  <p className="text-ink-3 text-xs text-center font-inter">{action.sub}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
