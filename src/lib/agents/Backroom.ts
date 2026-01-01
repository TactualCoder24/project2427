// Backroom Communication Layer
// Enables agent-to-agent communication without user interaction

export interface BackroomMessage {
    id: string;
    executionId: string;
    fromAgent: string;
    toAgent: string;
    messageType: 'request' | 'response' | 'notification' | 'error';
    content: any;
    status: 'pending' | 'delivered' | 'processed' | 'failed';
    createdAt: Date;
    processedAt?: Date;
}

export class BackroomCommunicationLayer {
    private messageQueue: BackroomMessage[] = [];
    private messageHandlers: Map<string, (message: BackroomMessage) => Promise<void>> = new Map();

    /**
     * Register an agent to receive messages
     */
    registerAgent(agentName: string, handler: (message: BackroomMessage) => Promise<void>) {
        this.messageHandlers.set(agentName, handler);
    }

    /**
     * Send a message from one agent to another
     */
    async sendMessage(
        executionId: string,
        fromAgent: string,
        toAgent: string,
        messageType: BackroomMessage['messageType'],
        content: any
    ): Promise<BackroomMessage> {
        const message: BackroomMessage = {
            id: `msg_${Date.now()}`,
            executionId,
            fromAgent,
            toAgent,
            messageType,
            content,
            status: 'pending',
            createdAt: new Date()
        };

        this.messageQueue.push(message);

        // Attempt delivery
        await this.deliverMessage(message);

        return message;
    }

    /**
     * Deliver a message to the target agent
     */
    private async deliverMessage(message: BackroomMessage) {
        const handler = this.messageHandlers.get(message.toAgent);

        if (!handler) {
            message.status = 'failed';
            console.error(`No handler registered for agent: ${message.toAgent}`);
            return;
        }

        try {
            message.status = 'delivered';
            await handler(message);
            message.status = 'processed';
            message.processedAt = new Date();
        } catch (error) {
            message.status = 'failed';
            console.error('Message delivery failed:', error);
        }
    }

    /**
     * Get all messages for an execution
     */
    getExecutionMessages(executionId: string): BackroomMessage[] {
        return this.messageQueue.filter(m => m.executionId === executionId);
    }

    /**
     * Get pending messages for an agent
     */
    getPendingMessages(agentName: string): BackroomMessage[] {
        return this.messageQueue.filter(
            m => m.toAgent === agentName && m.status === 'pending'
        );
    }

    /**
     * Clear processed messages
     */
    clearProcessedMessages() {
        this.messageQueue = this.messageQueue.filter(
            m => m.status !== 'processed'
        );
    }
}

// Singleton instance
export const backroom = new BackroomCommunicationLayer();

// =====================================================
// Example: Multi-Agent Coordination
// =====================================================

export class MultiAgentCoordinator {
    /**
     * Coordinate multiple agents to complete a complex task
     * Example: Research Agent asks Data Agent for metrics, then asks Report Agent to compile
     */
    async coordinateResearchTask(executionId: string) {
        // Research Agent requests data
        await backroom.sendMessage(
            executionId,
            'ResearchAgent',
            'DataAgent',
            'request',
            {
                action: 'fetch_metrics',
                params: { timeframe: 'last_30_days' }
            }
        );

        // DataAgent processes and responds
        await backroom.sendMessage(
            executionId,
            'DataAgent',
            'ResearchAgent',
            'response',
            {
                metrics: {
                    users: 1500,
                    revenue: 45000,
                    growth: 15
                }
            }
        );

        // Research Agent forwards to Report Agent
        await backroom.sendMessage(
            executionId,
            'ResearchAgent',
            'ReportAgent',
            'request',
            {
                action: 'generate_report',
                data: {
                    metrics: {
                        users: 1500,
                        revenue: 45000,
                        growth: 15
                    }
                }
            }
        );

        // Report Agent notifies completion
        await backroom.sendMessage(
            executionId,
            'ReportAgent',
            'ResearchAgent',
            'notification',
            {
                status: 'completed',
                reportUrl: '/reports/monthly-summary.pdf'
            }
        );
    }

    /**
     * Parallel agent coordination
     * Example: Multiple agents work simultaneously and sync results
     */
    async coordinateParallelTask(executionId: string) {
        // Coordinator sends tasks to multiple agents
        const tasks = [
            backroom.sendMessage(
                executionId,
                'Coordinator',
                'EmailAgent',
                'request',
                { action: 'fetch_inbox' }
            ),
            backroom.sendMessage(
                executionId,
                'Coordinator',
                'SlackAgent',
                'request',
                { action: 'fetch_messages' }
            ),
            backroom.sendMessage(
                executionId,
                'Coordinator',
                'NotionAgent',
                'request',
                { action: 'fetch_tasks' }
            )
        ];

        // Wait for all agents to respond
        await Promise.all(tasks);

        // Agents send responses back
        await backroom.sendMessage(
            executionId,
            'EmailAgent',
            'Coordinator',
            'response',
            { emails: [] }
        );

        await backroom.sendMessage(
            executionId,
            'SlackAgent',
            'Coordinator',
            'response',
            { messages: [] }
        );

        await backroom.sendMessage(
            executionId,
            'NotionAgent',
            'Coordinator',
            'response',
            { tasks: [] }
        );
    }
}

export const multiAgentCoordinator = new MultiAgentCoordinator();

