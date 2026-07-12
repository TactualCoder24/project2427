export interface WorkflowLog {
    id: string;
    timestamp: string;
    workflowId?: string;
    workflowName?: string;
    stepIndex?: number;
    agent?: string;
    action?: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
    duration?: number;
    retryAttempt?: number;
}

type LogListener = (log: WorkflowLog) => void;

class WorkflowLoggerService {
    private logs: WorkflowLog[] = [];
    private listeners: LogListener[] = [];
    private readonly MAX_LOGS = 500;

    log(entry: Omit<WorkflowLog, 'id' | 'timestamp'>) {
        const log: WorkflowLog = {
            ...entry,
            id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            timestamp: new Date().toISOString(),
        };
        this.logs.unshift(log);
        if (this.logs.length > this.MAX_LOGS) this.logs.splice(this.MAX_LOGS);
        this.listeners.forEach(fn => fn(log));

        const prefix = `[VIDVAS][${log.level.toUpperCase()}]${log.agent ? ` [${log.agent}]` : ''}`;
        if (log.level === 'error') console.error(prefix, log.message);
        else if (log.level === 'warn') console.warn(prefix, log.message);
        else console.log(prefix, log.message);
    }

    getLogs(): WorkflowLog[] {
        return [...this.logs];
    }

    getLogsForWorkflow(workflowId: string): WorkflowLog[] {
        return this.logs.filter(l => l.workflowId === workflowId);
    }

    onLog(listener: LogListener): () => void {
        this.listeners.push(listener);
        return () => this.offLog(listener);
    }

    offLog(listener: LogListener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    clear() {
        this.logs = [];
    }

    alertOnFailure(workflowName: string, errorMsg: string) {
        this.log({
            level: 'error',
            message: `WORKFLOW FAILED: "${workflowName}" — ${errorMsg}`,
        });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('workflow:failed', { detail: { workflowName, error: errorMsg } })
            );
        }
    }
}

export const WorkflowLogger = new WorkflowLoggerService();
