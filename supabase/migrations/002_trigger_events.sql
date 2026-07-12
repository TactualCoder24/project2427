-- Paste this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS workflow_trigger_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id   UUID NOT NULL REFERENCES agent_workflows(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL,
  trigger_type  VARCHAR(50) NOT NULL CHECK (trigger_type IN ('webhook', 'schedule')),
  payload       JSONB DEFAULT '{}',
  status        VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  triggered_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at  TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_trigger_events_user_status
  ON workflow_trigger_events(user_id, status, triggered_at DESC);

ALTER TABLE workflow_trigger_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own trigger events"
  ON workflow_trigger_events FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow Edge Functions (service role) to insert trigger events on behalf of users
CREATE POLICY "Service role can insert trigger events"
  ON workflow_trigger_events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Enable Realtime on this table (so useTriggerListener gets instant notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_trigger_events;
