import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { agentWorkflowService } from '../lib/supabaseAgentService';
import { WorkflowExecutor } from '../lib/agents/WorkflowExecutor';
import { useAuth } from '../contexts/AuthContext';

export function useTriggerListener() {
    const { user } = useAuth();
    const processingRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!user) return;

        const handleEvent = async (eventId: string, workflowId: string) => {
            if (processingRef.current.has(eventId)) return;
            processingRef.current.add(eventId);

            try {
                // Mark as processing (prevents duplicate runs if multiple tabs open)
                const { error } = await supabase
                    .from('workflow_trigger_events')
                    .update({ status: 'processing' })
                    .eq('id', eventId)
                    .eq('status', 'pending'); // Only take it if still pending

                if (error) return; // Another tab already grabbed it

                const workflows = await agentWorkflowService.getAll();
                const workflow = workflows.find(w => w.id === workflowId);

                if (!workflow) throw new Error('Workflow not found');

                await WorkflowExecutor.run(workflow, user.id);

                await supabase.from('workflow_trigger_events')
                    .update({ status: 'done', processed_at: new Date().toISOString() })
                    .eq('id', eventId);
            } catch (err) {
                console.error('Trigger execution failed:', err);
                await supabase.from('workflow_trigger_events')
                    .update({ status: 'failed', processed_at: new Date().toISOString() })
                    .eq('id', eventId);
            } finally {
                processingRef.current.delete(eventId);
            }
        };

        // Process any pending events that arrived while offline
        const catchUp = async () => {
            const { data } = await supabase
                .from('workflow_trigger_events')
                .select('id, workflow_id')
                .eq('user_id', user.id)
                .eq('status', 'pending')
                .order('triggered_at', { ascending: true });

            for (const event of data || []) {
                handleEvent(event.id, event.workflow_id);
            }
        };

        catchUp();

        // Subscribe to new trigger events via Realtime
        const channel = supabase
            .channel(`triggers:${user.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'workflow_trigger_events',
                filter: `user_id=eq.${user.id}`,
            }, (payload) => {
                const { id, workflow_id, status } = payload.new;
                if (status === 'pending') handleEvent(id, workflow_id);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user]);
}
