import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

interface AgentDeployment {
  id: string;
  agent_name: string;
  status: 'pending' | 'active' | 'inactive';
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<AgentDeployment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDeployments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('agent_deployments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDeployments(data || []);
      } catch (error) {
        console.error('Error fetching deployments:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchDeployments();
    }
  }, [user]);

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

  const getSubscriptionBadge = (subscription: string) => {
    const badges = {
      free: { color: 'bg-gradient-to-r from-gray-500 to-gray-600', text: 'Free' },
      pro: { color: 'bg-gradient-to-r from-cyber-aqua to-cyber-aqua', text: 'Pro' },
      enterprise: { color: 'bg-gradient-to-r from-neon-green to-lime-green', text: 'Enterprise' }
    };
    return badges[subscription as keyof typeof badges] || badges.free;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-neon-green', text: 'Active' },
      inactive: { color: 'bg-gray-500', text: 'Inactive' },
      pending: { color: 'bg-yellow-500', text: 'Pending' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      await logout();
      console.log('Logout successful, navigating to home');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Header */}
        <div className="mb-12">
          <Card variant="premium" className="p-8 hover-glow">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-cyber-aqua/30 shadow-glow-md"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold font-inter mb-3">
                    Welcome back, <span className="text-gradient-intelligence">{user.name.split(' ')[0]}</span>
                  </h1>
                  <p className="text-gray-300 text-lg font-inter mb-3">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getSubscriptionBadge(user.subscription).color} shadow-glow-sm`}>
                      {getSubscriptionBadge(user.subscription).text} Plan
                    </span>
                  </div>
                </div>
              </div>
              <Button type="button" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card variant="gradient" className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-inter mb-2">Active Agents</p>
                <p className="text-4xl font-bold font-inter text-gradient-animate">
                  {deployments.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua to-cyber-aqua rounded-2xl flex items-center justify-center shadow-glow-md">
                <span className="text-3xl">🤖</span>
              </div>
            </div>
          </Card>

          <Card variant="gradient" className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-inter mb-2">Total Deployments</p>
                <p className="text-4xl font-bold font-inter text-gradient-intelligence">
                  {deployments.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                <span className="text-3xl">📊</span>
              </div>
            </div>
          </Card>

          <Card variant="gradient" className="p-6 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-inter mb-2">Subscription</p>
                <p className="text-2xl font-bold font-inter text-gradient-quantum capitalize">
                  {user.subscription}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center shadow-glow-sm">
                <span className="text-3xl">⭐</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Agent Deployments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-bold font-inter text-gradient-animate">
              Your AI Agents
            </h2>
            <div className="flex gap-3">
              <Button variant="gradient-purple" onClick={() => navigate('/playground')}>
                🚀 AI Playground
              </Button>
              <Button variant="gradient" onClick={() => navigate('/agents')}>
                Deploy New Agent
              </Button>
            </div>
          </div>

          {loadingData ? (
            <Card variant="premium" className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300 font-inter">Loading your agents...</p>
            </Card>
          ) : deployments.length === 0 ? (
            <Card variant="premium" className="p-12 text-center hover-glow">
              <div className="w-24 h-24 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
                <span className="text-5xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold font-inter mb-4 text-gradient-intelligence">
                No Agents Deployed Yet
              </h3>
              <p className="text-gray-300 mb-6 font-inter max-w-md mx-auto">
                Get started by deploying your first AI agent to automate your workflows.
              </p>
              <Button variant="gradient" size="lg" onClick={() => navigate('/agents')}>
                Browse Available Agents
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deployments.map((deployment) => (
                <Card key={deployment.id} variant="premium" className="p-6 hover-glow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyber-aqua to-vivid-purple rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusBadge(deployment.status).color}`}>
                      {getStatusBadge(deployment.status).text}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-inter mb-2 text-gradient-intelligence">
                    {deployment.agent_name}
                  </h3>
                  <p className="text-gray-400 text-sm font-inter mb-4">
                    Deployed {new Date(deployment.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-6 text-gradient-animate">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Playground - Featured */}
            <div onClick={() => navigate('/playground')} className="cursor-pointer">
              <Card variant="gradient" className="p-8 hover-glow relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs font-bold">NEW</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-cyber-aqua to-vivid-purple rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-glow-md animate-float">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold font-inter text-center mb-2 text-gradient-intelligence">AI Playground</h3>
                <p className="text-gray-300 text-sm text-center font-inter">Chat with AI agents using natural language</p>
              </Card>
            </div>

            {/* Integration Hub - Featured */}
            <div onClick={() => navigate('/integrations')} className="cursor-pointer">
              <Card variant="gradient" className="p-8 hover-glow relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-xs font-bold">NEW</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-glow-purple animate-float" style={{ animationDelay: '1s' }}>
                  <span className="text-4xl">🔌</span>
                </div>
                <h3 className="text-xl font-bold font-inter text-center mb-2 text-gradient">Integration Hub</h3>
                <p className="text-gray-300 text-sm text-center font-inter">Connect 12+ apps and services</p>
              </Card>
            </div>

            {/* Deploy Agent */}
            <div onClick={() => navigate('/agents')} className="cursor-pointer">
              <Card variant="premium" className="p-6 hover-glow">
                <div className="w-14 h-14 bg-gradient-to-br from-cyber-aqua to-cyber-aqua rounded-xl flex items-center justify-center mb-4 mx-auto shadow-glow-md">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-lg font-bold font-inter text-center mb-2">Deploy Agent</h3>
                <p className="text-gray-400 text-sm text-center font-inter">Launch a new AI agent</p>
              </Card>
            </div>

            {/* Get Support */}
            <div onClick={() => navigate('/contact')} className="cursor-pointer">
              <Card variant="premium" className="p-6 hover-glow">
                <div className="w-14 h-14 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-xl flex items-center justify-center mb-4 mx-auto shadow-glow-purple">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-lg font-bold font-inter text-center mb-2">Get Support</h3>
                <p className="text-gray-400 text-sm text-center font-inter">Contact our team</p>
              </Card>
            </div>

            {/* Settings */}
            <Card variant="premium" className="p-6 hover-glow cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-green to-lime-green rounded-xl flex items-center justify-center mb-4 mx-auto shadow-glow-sm">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-lg font-bold font-inter text-center mb-2">Settings</h3>
              <p className="text-gray-400 text-sm text-center font-inter">Manage your account</p>
            </Card>

            {/* Upgrade Plan */}
            <Card variant="premium" className="p-6 hover-glow cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-lg font-bold font-inter text-center mb-2">Upgrade Plan</h3>
              <p className="text-gray-400 text-sm text-center font-inter">Unlock more features</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


