-- Supabase Database Schema for Bhindi-Style Agentic AI System
-- CORRECTED VERSION - Run this in Supabase SQL Editor
-- This version is compatible with Supabase's authentication system

-- =====================================================
-- Table: agent_personas
-- Stores custom AI personalities with behaviors
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '🤖',
    instructions TEXT NOT NULL,
    connected_apps JSONB DEFAULT '[]'::jsonb,
    behavior_patterns JSONB DEFAULT '{"proactive": false, "notificationLevel": "important", "autoExecute": false}'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_personas_user_id ON agent_personas(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_personas_status ON agent_personas(status);

-- =====================================================
-- Table: agent_workflows
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    persona_id UUID REFERENCES agent_personas(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger JSONB NOT NULL DEFAULT '{"type": "manual", "config": {}}'::jsonb,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    run_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_run_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_workflows_user_id ON agent_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_workflows_status ON agent_workflows(status);
CREATE INDEX IF NOT EXISTS idx_agent_workflows_persona_id ON agent_workflows(persona_id);

-- =====================================================
-- Table: agent_executions
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workflow_id UUID NOT NULL REFERENCES agent_workflows(id) ON DELETE CASCADE,
    workflow_name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    success_rate DECIMAL(5,2)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_workflow_id ON agent_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_started_at ON agent_executions(started_at DESC);

-- =====================================================
-- Table: agent_integrations
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    integration_name VARCHAR(100) NOT NULL,
    integration_type VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    scopes JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'expired', 'error')),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, integration_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_integrations_user_id ON agent_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_integrations_status ON agent_integrations(status);

-- =====================================================
-- Table: backroom_messages
-- =====================================================
CREATE TABLE IF NOT EXISTS backroom_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
    from_agent VARCHAR(100) NOT NULL,
    to_agent VARCHAR(100) NOT NULL,
    message_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'processed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_backroom_messages_execution_id ON backroom_messages(execution_id);
CREATE INDEX IF NOT EXISTS idx_backroom_messages_status ON backroom_messages(status);

-- =====================================================
-- Table: background_jobs
-- =====================================================
CREATE TABLE IF NOT EXISTS background_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workflow_id UUID NOT NULL REFERENCES agent_workflows(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('cron', 'webhook', 'event')),
    schedule VARCHAR(100),
    webhook_url TEXT,
    event_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'disabled')),
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_background_jobs_user_id ON background_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_background_jobs_workflow_id ON background_jobs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_background_jobs_status ON background_jobs(status);
CREATE INDEX IF NOT EXISTS idx_background_jobs_next_run_at ON background_jobs(next_run_at);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE agent_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE backroom_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_jobs ENABLE ROW LEVEL SECURITY;

-- Personas policies
CREATE POLICY "Users can view their own personas"
    ON agent_personas FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personas"
    ON agent_personas FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personas"
    ON agent_personas FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personas"
    ON agent_personas FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Workflows policies
CREATE POLICY "Users can view their own workflows"
    ON agent_workflows FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflows"
    ON agent_workflows FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows"
    ON agent_workflows FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows"
    ON agent_workflows FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Executions policies
CREATE POLICY "Users can view their own executions"
    ON agent_executions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own executions"
    ON agent_executions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can view their own integrations"
    ON agent_integrations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own integrations"
    ON agent_integrations FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Backroom messages policies
CREATE POLICY "Users can view backroom messages for their executions"
    ON backroom_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM agent_executions
            WHERE agent_executions.id = backroom_messages.execution_id
            AND agent_executions.user_id = auth.uid()
        )
    );

-- Background jobs policies
CREATE POLICY "Users can view their own background jobs"
    ON background_jobs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own background jobs"
    ON background_jobs FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
DROP TRIGGER IF EXISTS update_agent_personas_updated_at ON agent_personas;
CREATE TRIGGER update_agent_personas_updated_at
    BEFORE UPDATE ON agent_personas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_workflows_updated_at ON agent_workflows;
CREATE TRIGGER update_agent_workflows_updated_at
    BEFORE UPDATE ON agent_workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_integrations_updated_at ON agent_integrations;
CREATE TRIGGER update_agent_integrations_updated_at
    BEFORE UPDATE ON agent_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_background_jobs_updated_at ON background_jobs;
CREATE TRIGGER update_background_jobs_updated_at
    BEFORE UPDATE ON background_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Views for Analytics
-- =====================================================

CREATE OR REPLACE VIEW user_workflow_stats AS
SELECT 
    w.user_id,
    COUNT(DISTINCT w.id) as total_workflows,
    COUNT(DISTINCT CASE WHEN w.status = 'active' THEN w.id END) as active_workflows,
    COALESCE(SUM(w.run_count), 0) as total_runs,
    COALESCE(SUM(w.success_count), 0) as total_successes,
    COALESCE(SUM(w.failure_count), 0) as total_failures,
    ROUND(
        CASE 
            WHEN SUM(w.run_count) > 0 
            THEN (SUM(w.success_count)::decimal / SUM(w.run_count)::decimal) * 100 
            ELSE 0 
        END, 
        2
    ) as success_rate_percentage
FROM agent_workflows w
GROUP BY w.user_id;

CREATE OR REPLACE VIEW user_integration_stats AS
SELECT 
    i.user_id,
    COUNT(*) as total_integrations,
    COUNT(CASE WHEN i.status = 'connected' THEN 1 END) as connected_integrations,
    COUNT(CASE WHEN i.status = 'expired' THEN 1 END) as expired_integrations,
    COUNT(CASE WHEN i.status = 'error' THEN 1 END) as error_integrations
FROM agent_integrations i
GROUP BY i.user_id;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE agent_personas IS 'Stores custom AI personalities with specific behaviors and instructions';
COMMENT ON TABLE agent_workflows IS 'Stores automated workflow definitions with triggers and steps';
COMMENT ON TABLE agent_executions IS 'Stores execution history and results for all workflow runs';
COMMENT ON TABLE agent_integrations IS 'Stores OAuth tokens and credentials for third-party integrations';
COMMENT ON TABLE backroom_messages IS 'Stores agent-to-agent communication for multi-agent coordination';
COMMENT ON TABLE background_jobs IS 'Stores scheduled jobs and webhook configurations';
