import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Called by Supabase pg_cron every minute.
// Setup in Dashboard → Database → Cron Jobs:
//   Schedule: * * * * *  (every minute)
//   Command:  select net.http_post('https://xiulwqliqlfsnwdkuqdr.supabase.co/functions/v1/schedule-runner', '{}', 'application/json');

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Find all due schedule jobs
  const { data: dueJobs, error } = await supabase
    .from('background_jobs')
    .select('id, user_id, workflow_id, schedule, next_run_at')
    .eq('status', 'active')
    .eq('job_type', 'cron')
    .lte('next_run_at', new Date().toISOString());

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!dueJobs?.length) return new Response(JSON.stringify({ triggered: 0 }), { status: 200 });

  let triggered = 0;

  for (const job of dueJobs) {
    // Verify workflow is still active
    const { data: workflow } = await supabase
      .from('agent_workflows')
      .select('id, status')
      .eq('id', job.workflow_id)
      .single();

    if (!workflow || workflow.status !== 'active') continue;

    // Insert trigger event — frontend Realtime picks this up and runs WorkflowExecutor
    await supabase.from('workflow_trigger_events').insert({
      workflow_id: job.workflow_id,
      user_id: job.user_id,
      trigger_type: 'schedule',
      payload: { job_id: job.id, scheduled_at: job.next_run_at },
    });

    // Advance next_run_at by interval_minutes (stored as number string in schedule field)
    const intervalMinutes = parseInt(job.schedule || '60', 10);
    const nextRun = new Date(Date.now() + intervalMinutes * 60 * 1000).toISOString();

    await supabase.from('background_jobs').update({
      last_triggered_at: new Date().toISOString(),
      next_run_at: nextRun,
    }).eq('id', job.id);

    triggered++;
  }

  return new Response(JSON.stringify({ triggered }), { status: 200 });
});
