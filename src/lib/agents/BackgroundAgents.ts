// Background Agents - Cron Jobs and Webhook Listeners
// Automatically trigger workflows based on schedules or events

import { agentWorkflowService, agentExecutionService } from '../supabaseAgentService';
import { orchestrator } from './AgentOrchestrator';

export interface BackgroundJob {
    id: string;
    userId: string;
    workflowId: string;
    type: 'cron' | 'webhook' | 'event';
    schedule?: string; // Cron expression
    webhookUrl?: string;
    eventType?: string;
    status: 'active' | 'paused' | 'disabled';
    lastTriggeredAt?: Date;
    nextRunAt?: Date;
}

export class BackgroundAgentManager {
    private jobs: Map<string, BackgroundJob> = new Map();
    private intervals: Map<string, NodeJS.Timeout> = new Map();

    /**
     * Register a cron-based background job
     */
    registerCronJob(job: BackgroundJob) {
        if (job.type !== 'cron' || !job.schedule) {
            throw new Error('Invalid cron job configuration');
        }

        this.jobs.set(job.id, job);

        // Parse cron schedule and set up interval
        // For demo purposes, using simple intervals
        const interval = this.parseCronSchedule(job.schedule);

        const timer = setInterval(async () => {
            if (job.status === 'active') {
                await this.executeJob(job);
            }
        }, interval);

        this.intervals.set(job.id, timer);
    }

    /**
     * Register a webhook listener
     */
    registerWebhook(job: BackgroundJob) {
        if (job.type !== 'webhook' || !job.webhookUrl) {
            throw new Error('Invalid webhook configuration');
        }

        this.jobs.set(job.id, job);

        // In production, this would set up an actual webhook endpoint
        console.log(`Webhook registered: ${job.webhookUrl}`);
    }

    /**
     * Register an event listener
     */
    registerEventListener(job: BackgroundJob) {
        if (job.type !== 'event' || !job.eventType) {
            throw new Error('Invalid event configuration');
        }

        this.jobs.set(job.id, job);

        // In production, this would subscribe to event bus
        console.log(`Event listener registered: ${job.eventType}`);
    }

    /**
     * Execute a background job
     */
    private async executeJob(job: BackgroundJob) {
        try {
            console.log(`Executing background job: ${job.id}`);

            // Get workflow
            const workflows = await agentWorkflowService.getAll();
            const workflow = workflows.find(w => w.id === job.workflowId);

            if (!workflow) {
                console.error(`Workflow not found: ${job.workflowId}`);
                return;
            }

            // Create execution record
            const execution = await agentExecutionService.create({
                workflow_id: workflow.id,
                workflow_name: workflow.name,
                trigger_type: job.type,
                status: 'running',
                steps: workflow.steps.map(s => ({
                    agent: s.agent,
                    action: s.action,
                    status: 'pending' as const,
                    duration: 0
                }))
            });

            // Execute workflow
            const result = await orchestrator.executeTask(
                `Execute workflow: ${workflow.name}`,
                job.userId
            );

            // Update execution
            await agentExecutionService.complete(
                execution.id,
                result.success,
                result,
                result.error
            );

            // Update workflow stats
            await agentWorkflowService.incrementRunCount(workflow.id, result.success);

            // Update job
            job.lastTriggeredAt = new Date();
            job.nextRunAt = this.calculateNextRun(job);

        } catch (error) {
            console.error('Background job execution failed:', error);
        }
    }

    /**
     * Parse cron schedule to milliseconds
     * Simplified version - in production use a proper cron parser
     */
    private parseCronSchedule(schedule: string): number {
        // Simple patterns
        if (schedule.includes('minute')) {
            return 60 * 1000;
        } else if (schedule.includes('hour')) {
            return 60 * 60 * 1000;
        } else if (schedule.includes('daily')) {
            return 24 * 60 * 60 * 1000;
        }

        // Default to 1 hour
        return 60 * 60 * 1000;
    }

    /**
     * Calculate next run time
     */
    private calculateNextRun(job: BackgroundJob): Date {
        const now = new Date();
        const interval = job.schedule ? this.parseCronSchedule(job.schedule) : 0;
        return new Date(now.getTime() + interval);
    }

    /**
     * Pause a job
     */
    pauseJob(jobId: string) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.status = 'paused';
        }
    }

    /**
     * Resume a job
     */
    resumeJob(jobId: string) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.status = 'active';
        }
    }

    /**
     * Stop and remove a job
     */
    removeJob(jobId: string) {
        const timer = this.intervals.get(jobId);
        if (timer) {
            clearInterval(timer);
            this.intervals.delete(jobId);
        }
        this.jobs.delete(jobId);
    }

    /**
     * Get all active jobs
     */
    getActiveJobs(): BackgroundJob[] {
        return Array.from(this.jobs.values()).filter(j => j.status === 'active');
    }
}

// Singleton instance
export const backgroundAgentManager = new BackgroundAgentManager();

// =====================================================
// Example Background Jobs
// =====================================================

export const exampleBackgroundJobs = {
    // Daily report at 9 AM
    dailyReport: {
        id: 'daily-report',
        userId: 'user-123',
        workflowId: 'workflow-123',
        type: 'cron' as const,
        schedule: '0 9 * * *', // 9 AM daily
        status: 'active' as const
    },

    // GitHub PR webhook
    githubPR: {
        id: 'github-pr',
        userId: 'user-123',
        workflowId: 'workflow-456',
        type: 'webhook' as const,
        webhookUrl: '/api/webhooks/github',
        status: 'active' as const
    },

    // New customer event
    newCustomer: {
        id: 'new-customer',
        userId: 'user-123',
        workflowId: 'workflow-789',
        type: 'event' as const,
        eventType: 'customer.created',
        status: 'active' as const
    }
};
