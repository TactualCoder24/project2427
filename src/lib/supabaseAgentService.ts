// Supabase Client Extensions for Agent System
// Add these type definitions to work with the new database schema

import { supabase } from './supabase';

// =====================================================
// Type Definitions
// =====================================================

export interface AgentPersona {
    id: string;
    user_id: string;
    name: string;
    description: string;
    icon: string;
    instructions: string;
    connected_apps: string[];
    behavior_patterns: {
        proactive: boolean;
        notificationLevel: 'all' | 'important' | 'critical';
        autoExecute: boolean;
    };
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    last_used_at?: string;
}

export interface AgentWorkflow {
    id: string;
    user_id: string;
    persona_id?: string;
    name: string;
    description: string;
    trigger: {
        type: 'manual' | 'scheduled' | 'webhook' | 'event';
        config: Record<string, any>;
    };
    steps: Array<{
        id: string;
        agent: string;
        action: string;
        config: Record<string, any>;
    }>;
    status: 'active' | 'inactive' | 'draft';
    run_count: number;
    success_count: number;
    failure_count: number;
    created_at: string;
    updated_at: string;
    last_run_at?: string;
}

export interface AgentExecution {
    id: string;
    user_id: string;
    workflow_id: string;
    workflow_name: string;
    trigger_type: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    steps: Array<{
        agent: string;
        action: string;
        status: 'pending' | 'running' | 'completed' | 'failed';
        duration: number;
        output?: any;
        error?: string;
    }>;
    input_data?: any;
    output_data?: any;
    error_message?: string;
    started_at: string;
    completed_at?: string;
    duration_seconds?: number;
    success_rate?: number;
}

export interface AgentIntegration {
    id: string;
    user_id: string;
    integration_name: string;
    integration_type: string;
    access_token?: string;
    refresh_token?: string;
    token_expires_at?: string;
    scopes: string[];
    metadata: Record<string, any>;
    status: 'connected' | 'disconnected' | 'expired' | 'error' | 'pending';
    connected_at: string;
    last_used_at?: string;
    created_at: string;
    updated_at: string;
}

// =====================================================
// Database Operations
// =====================================================

export const agentPersonaService = {
    // Get all personas for current user
    async getAll() {
        const { data, error } = await supabase
            .from('agent_personas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as AgentPersona[];
    },

    // Create new persona
    async create(persona: Omit<AgentPersona, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('agent_personas')
            .insert([persona])
            .select()
            .single();

        if (error) throw error;
        return data as AgentPersona;
    },

    // Update persona
    async update(id: string, updates: Partial<AgentPersona>) {
        const { data, error } = await supabase
            .from('agent_personas')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as AgentPersona;
    },

    // Delete persona
    async delete(id: string) {
        const { error } = await supabase
            .from('agent_personas')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Update last used timestamp
    async updateLastUsed(id: string) {
        const { error } = await supabase
            .from('agent_personas')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    }
};

export const agentWorkflowService = {
    // Get all workflows
    async getAll() {
        const { data, error } = await supabase
            .from('agent_workflows')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as AgentWorkflow[];
    },

    // Create workflow
    async create(workflow: Omit<AgentWorkflow, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'run_count' | 'success_count' | 'failure_count'>) {
        const { data, error } = await supabase
            .from('agent_workflows')
            .insert([workflow])
            .select()
            .single();

        if (error) throw error;
        return data as AgentWorkflow;
    },

    // Update workflow
    async update(id: string, updates: Partial<AgentWorkflow>) {
        const { data, error } = await supabase
            .from('agent_workflows')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as AgentWorkflow;
    },

    // Delete workflow
    async delete(id: string) {
        const { error } = await supabase
            .from('agent_workflows')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Increment run count
    async incrementRunCount(id: string, success: boolean) {
        const { data: workflow } = await supabase
            .from('agent_workflows')
            .select('run_count, success_count, failure_count')
            .eq('id', id)
            .single();

        if (!workflow) return;

        const { error } = await supabase
            .from('agent_workflows')
            .update({
                run_count: workflow.run_count + 1,
                success_count: success ? workflow.success_count + 1 : workflow.success_count,
                failure_count: success ? workflow.failure_count : workflow.failure_count + 1,
                last_run_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    }
};

export const agentExecutionService = {
    // Get all executions
    async getAll(limit = 50) {
        const { data, error } = await supabase
            .from('agent_executions')
            .select('*')
            .order('started_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as AgentExecution[];
    },

    // Get executions by workflow
    async getByWorkflow(workflowId: string) {
        const { data, error } = await supabase
            .from('agent_executions')
            .select('*')
            .eq('workflow_id', workflowId)
            .order('started_at', { ascending: false });

        if (error) throw error;
        return data as AgentExecution[];
    },

    // Create execution
    async create(execution: Omit<AgentExecution, 'id' | 'user_id' | 'started_at'>) {
        const { data, error } = await supabase
            .from('agent_executions')
            .insert([execution])
            .select()
            .single();

        if (error) throw error;
        return data as AgentExecution;
    },

    // Update execution
    async update(id: string, updates: Partial<AgentExecution>) {
        const { data, error } = await supabase
            .from('agent_executions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as AgentExecution;
    },

    // Complete execution
    async complete(id: string, success: boolean, output?: any, error?: string) {
        const completedAt = new Date();
        const { data: execution } = await supabase
            .from('agent_executions')
            .select('started_at')
            .eq('id', id)
            .single();

        if (!execution) return;

        const startedAt = new Date(execution.started_at);
        const durationSeconds = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);

        const { error: updateError } = await supabase
            .from('agent_executions')
            .update({
                status: success ? 'completed' : 'failed',
                completed_at: completedAt.toISOString(),
                duration_seconds: durationSeconds,
                output_data: output,
                error_message: error
            })
            .eq('id', id);

        if (updateError) throw updateError;
    }
};

export const agentIntegrationService = {
    // Get all integrations
    async getAll() {
        const { data, error } = await supabase
            .from('agent_integrations')
            .select('*')
            .order('integration_name');

        if (error) throw error;
        return data as AgentIntegration[];
    },

    // Get integration by name
    async getByName(name: string) {
        const { data, error } = await supabase
            .from('agent_integrations')
            .select('*')
            .eq('integration_name', name)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
        return data as AgentIntegration | null;
    },

    // Create or update integration
    async upsert(integration: Omit<AgentIntegration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('agent_integrations')
            .upsert([integration], { onConflict: 'user_id,integration_name' })
            .select()
            .single();

        if (error) throw error;
        return data as AgentIntegration;
    },

    // Update status
    async updateStatus(id: string, status: AgentIntegration['status']) {
        const { error } = await supabase
            .from('agent_integrations')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    // Update integration
    async update(id: string, updates: Partial<Omit<AgentIntegration, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
        const { data, error } = await supabase
            .from('agent_integrations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as AgentIntegration;
    },

    // Delete integration
    async delete(id: string) {
        const { error } = await supabase
            .from('agent_integrations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// =====================================================
// Real-time Subscriptions
// =====================================================

export const subscribeToExecutions = (userId: string, callback: (execution: AgentExecution) => void) => {
    return supabase
        .channel('executions')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'agent_executions',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                callback(payload.new as AgentExecution);
            }
        )
        .subscribe();
};

export const subscribeToWorkflows = (userId: string, callback: (workflow: AgentWorkflow) => void) => {
    return supabase
        .channel('workflows')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'agent_workflows',
                filter: `user_id=eq.${userId}`
            },
            (payload) => {
                callback(payload.new as AgentWorkflow);
            }
        )
        .subscribe();
};


