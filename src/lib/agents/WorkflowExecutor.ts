import { agentExecutionService, agentWorkflowService, AgentWorkflow, AgentExecution } from '../supabaseAgentService';
import { orchestrator, AgentStep } from './AgentOrchestrator';
import { WorkflowLogger } from './WorkflowLogger';
import { backroom } from './Backroom';
import { supabase } from '../supabase';

type ExecutionStep = AgentExecution['steps'][number];

const MAX_RETRIES = 2;
const BASE_BACKOFF_MS = 600;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class WorkflowExecutor {
    static async run(workflow: AgentWorkflow, userId: string) {
        WorkflowLogger.log({
            level: 'info',
            workflowId: workflow.id,
            workflowName: workflow.name,
            message: `Starting workflow "${workflow.name}" (${workflow.steps.length} steps)`,
        });

        const pendingSteps: ExecutionStep[] = workflow.steps.map(step => ({
            agent: step.agent,
            action: step.action,
            status: 'pending' as const,
            duration: 0,
        }));

        const execution = await agentExecutionService.create({
            workflow_id: workflow.id,
            workflow_name: workflow.name,
            trigger_type: 'manual',
            status: 'running',
            steps: pendingSteps,
        });

        const runningSteps: ExecutionStep[] = [...pendingSteps];

        try {
            for (let i = 0; i < workflow.steps.length; i++) {
                const wfStep = workflow.steps[i];
                const stepStart = Date.now();

                runningSteps[i] = { ...runningSteps[i], status: 'running' };
                await agentExecutionService.update(execution.id, { steps: runningSteps });

                let stepStatus: 'completed' | 'failed' = 'completed';
                let stepOutput: any;
                let stepError: string | undefined;

                for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                    try {
                        const agentStep: AgentStep = {
                            agent: wfStep.agent,
                            action: wfStep.action,
                            input: wfStep.config,
                            status: 'running',
                        };
                        stepOutput = await orchestrator.executeStep(agentStep, userId);
                        stepStatus = 'completed';
                        break;
                    } catch (err) {
                        const errMsg = err instanceof Error ? err.message : 'Step failed';
                        if (attempt < MAX_RETRIES) {
                            const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt);
                            WorkflowLogger.log({
                                level: 'warn',
                                workflowId: workflow.id,
                                workflowName: workflow.name,
                                stepIndex: i,
                                agent: wfStep.agent,
                                action: wfStep.action,
                                message: `Retry ${attempt + 1}/${MAX_RETRIES} for step ${i + 1} (${wfStep.agent} → ${wfStep.action}) in ${backoff}ms`,
                                retryAttempt: attempt + 1,
                            });
                            await sleep(backoff);
                        } else {
                            stepStatus = 'failed';
                            stepError = `${wfStep.agent} → ${wfStep.action} failed after ${MAX_RETRIES + 1} attempts: ${errMsg}`;
                            WorkflowLogger.log({
                                level: 'error',
                                workflowId: workflow.id,
                                workflowName: workflow.name,
                                stepIndex: i,
                                agent: wfStep.agent,
                                action: wfStep.action,
                                message: stepError,
                            });
                        }
                    }
                }

                const duration = Math.round((Date.now() - stepStart) / 1000);
                runningSteps[i] = {
                    ...runningSteps[i],
                    status: stepStatus,
                    duration,
                    output: stepOutput,
                    error: stepError,
                };

                // Backroom: hand off output to next step's agent
                if (stepStatus === 'completed' && i < workflow.steps.length - 1) {
                    const nextStep = workflow.steps[i + 1];
                    const msg = await backroom.sendMessage(
                        execution.id,
                        wfStep.agent,
                        nextStep.agent,
                        'request',
                        { action: nextStep.action, input: stepOutput ?? null }
                    );
                    // Persist to DB (best-effort, non-blocking)
                    supabase.from('backroom_messages').insert([{
                        execution_id: execution.id,
                        from_agent: msg.fromAgent,
                        to_agent: msg.toAgent,
                        message_type: msg.messageType,
                        content: msg.content,
                        status: 'delivered',
                    }]).then(() => {/* fire-and-forget */});
                }

                if (stepStatus === 'failed') {
                    for (let j = i + 1; j < workflow.steps.length; j++) {
                        runningSteps[j] = {
                            ...runningSteps[j],
                            status: 'failed',
                            duration: 0,
                            error: `Skipped — step ${i + 1} failed`,
                        };
                    }
                    await agentExecutionService.update(execution.id, { steps: runningSteps });
                    await agentExecutionService.complete(execution.id, false, undefined, stepError);
                    await agentWorkflowService.incrementRunCount(workflow.id, false);
                    WorkflowLogger.alertOnFailure(workflow.name, stepError || 'Unknown step error');
                    return;
                }
            }

            await agentExecutionService.update(execution.id, { steps: runningSteps });
            await agentExecutionService.complete(execution.id, true);
            await agentWorkflowService.incrementRunCount(workflow.id, true);

            WorkflowLogger.log({
                level: 'success',
                workflowId: workflow.id,
                workflowName: workflow.name,
                message: `Workflow "${workflow.name}" completed successfully`,
            });
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Execution failed';
            await agentExecutionService.complete(execution.id, false, undefined, errMsg);
            await agentWorkflowService.incrementRunCount(workflow.id, false);
            WorkflowLogger.alertOnFailure(workflow.name, errMsg);
            throw err;
        }
    }
}
