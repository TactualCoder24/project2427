import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-webhook-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const url = new URL(req.url);
    const workflowId = url.searchParams.get('workflow_id');
    const secret = url.searchParams.get('secret') || req.headers.get('x-webhook-secret');

    if (!workflowId || !secret) {
      return new Response(JSON.stringify({ error: 'workflow_id and secret required' }), { status: 400, headers: CORS });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Validate workflow exists and secret matches
    const { data: workflow, error } = await supabase
      .from('agent_workflows')
      .select('id, user_id, name, trigger, status')
      .eq('id', workflowId)
      .single();

    if (error || !workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), { status: 404, headers: CORS });
    }

    if (workflow.trigger?.config?.secret !== secret) {
      return new Response(JSON.stringify({ error: 'Invalid secret' }), { status: 401, headers: CORS });
    }

    if (workflow.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Workflow is not active' }), { status: 400, headers: CORS });
    }

    // Parse incoming payload
    let payload = {};
    try { payload = await req.json(); } catch { /* no body */ }

    // Queue the trigger event — frontend Realtime picks this up and runs WorkflowExecutor
    const { data: event, error: insertError } = await supabase
      .from('workflow_trigger_events')
      .insert({ workflow_id: workflowId, user_id: workflow.user_id, trigger_type: 'webhook', payload })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, event_id: event.id, workflow: workflow.name }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS });
  }
});
