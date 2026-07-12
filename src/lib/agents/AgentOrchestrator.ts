import type { AgentPersona } from '../supabaseAgentService';
import { WorkflowLogger } from './WorkflowLogger';
import { supabase } from '../supabase';

const AGENT_EXECUTOR_URL = 'https://xiulwqliqlfsnwdkuqdr.supabase.co/functions/v1/agent-executor';

async function callAgentExecutor(agent: string, action: string, input: any): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(AGENT_EXECUTOR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agent, action, input }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Agent execution failed');
  return data.result;
}

export interface AgentTask {
  id: string;
  intent: string;
  entities: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface AgentStep {
  agent: string;
  action: string;
  input: any;
  output?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
}

export interface ExecutionPlan {
  taskId: string;
  steps: AgentStep[];
  dependencies: Map<number, number[]>; // step index -> dependent step indices
}

export class AgentOrchestrator {
  private agents: Map<string, any> = new Map();
  private executionQueue: AgentTask[] = [];
  private activePersona: AgentPersona | null = null;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    console.log('Initializing agent registry...');
  }

  setPersona(persona: AgentPersona | null) {
    this.activePersona = persona;
  }

  getActivePersona(): AgentPersona | null {
    return this.activePersona;
  }

  getSystemInstructions(): string {
    return this.activePersona?.instructions || '';
  }

  /**
   * Main entry point: Takes natural language input and orchestrates execution
   */
  async executeTask(userInput: string, userId: string): Promise<any> {
    try {
      const intent = await this.recognizeIntent(userInput);
      const plan = await this.createExecutionPlan(intent);
      const result = await this.executePlan(plan, userId);

      return {
        success: true,
        intent,
        plan,
        result,
        persona: this.activePersona ? {
          name: this.activePersona.name,
          instructions: this.activePersona.instructions,
        } : null,
      };
    } catch (error) {
      console.error('Task execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Intent Recognition: Parse natural language to understand user goal
   */
  private async recognizeIntent(userInput: string): Promise<any> {
    // TODO: Integrate with LLM for intent recognition
    // For now, use simple keyword matching
    
    const intent: any = {
      raw: userInput,
      type: 'unknown',
      entities: {},
      confidence: 0
    };

    // Email detection
    if (userInput.toLowerCase().includes('email') || userInput.toLowerCase().includes('send')) {
      intent.type = 'send_email';
      intent.confidence = 0.8;
      
      // Extract email address
      const emailMatch = userInput.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        intent.entities.to = emailMatch[0];
      }
      
      // Extract subject
      const subjectMatch = userInput.match(/subject[:\s]+"([^"]+)"/i);
      if (subjectMatch) {
        intent.entities.subject = subjectMatch[1];
      }
    }
    
    // Meeting/Calendar detection
    else if (userInput.toLowerCase().includes('meeting') || userInput.toLowerCase().includes('schedule')) {
      intent.type = 'schedule_meeting';
      intent.confidence = 0.8;
      
      // Extract time
      const timeMatch = userInput.match(/(\d{1,2})\s*(am|pm)/i);
      if (timeMatch) {
        intent.entities.time = timeMatch[0];
      }
      
      // Extract date
      if (userInput.toLowerCase().includes('tomorrow')) {
        intent.entities.date = 'tomorrow';
      }
    }
    
    // Research/Search detection
    else if (userInput.toLowerCase().includes('research') || userInput.toLowerCase().includes('find')) {
      intent.type = 'research';
      intent.confidence = 0.7;
      intent.entities.query = userInput;
    }
    
    // Report generation
    else if (userInput.toLowerCase().includes('report') || userInput.toLowerCase().includes('summary')) {
      intent.type = 'generate_report';
      intent.confidence = 0.75;
    }

    return intent;
  }

  /**
   * Create Execution Plan: Break down intent into agent steps
   */
  private async createExecutionPlan(intent: any): Promise<ExecutionPlan> {
    const plan: ExecutionPlan = {
      taskId: `task_${Date.now()}`,
      steps: [],
      dependencies: new Map()
    };

    switch (intent.type) {
      case 'send_email':
        plan.steps = [
          {
            agent: 'IntentRecognizer',
            action: 'validate_email_intent',
            input: intent,
            status: 'completed'
          },
          {
            agent: 'GmailAgent',
            action: 'check_connection',
            input: {},
            status: 'pending'
          },
          {
            agent: 'GmailAgent',
            action: 'send_email',
            input: intent.entities,
            status: 'pending'
          }
        ];
        // Step 2 must complete before step 3
        plan.dependencies.set(2, [1]);
        break;

      case 'schedule_meeting':
        plan.steps = [
          {
            agent: 'IntentRecognizer',
            action: 'validate_calendar_intent',
            input: intent,
            status: 'completed'
          },
          {
            agent: 'GoogleCalendarAgent',
            action: 'check_availability',
            input: intent.entities,
            status: 'pending'
          },
          {
            agent: 'GoogleCalendarAgent',
            action: 'create_event',
            input: intent.entities,
            status: 'pending'
          },
          {
            agent: 'NotificationAgent',
            action: 'send_confirmation',
            input: {},
            status: 'pending'
          }
        ];
        plan.dependencies.set(2, [1]);
        plan.dependencies.set(3, [2]);
        break;

      case 'research':
        plan.steps = [
          {
            agent: 'IntentRecognizer',
            action: 'validate_research_intent',
            input: intent,
            status: 'completed'
          },
          {
            agent: 'SearchAgent',
            action: 'web_search',
            input: { query: intent.entities.query },
            status: 'pending'
          },
          {
            agent: 'SummarizerAgent',
            action: 'summarize_results',
            input: {},
            status: 'pending'
          }
        ];
        plan.dependencies.set(2, [1]);
        break;

      default:
        plan.steps = [
          {
            agent: 'IntentRecognizer',
            action: 'unknown_intent',
            input: intent,
            status: 'completed',
            output: { message: 'Intent not recognized. Please try rephrasing your request.' }
          }
        ];
    }

    return plan;
  }

  /**
   * Execute Plan: Run agents in correct order with dependency management
   */
  private async executePlan(plan: ExecutionPlan, userId: string): Promise<any> {
    const results: any[] = [];
    
    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      
      // Check if dependencies are met
      const deps = plan.dependencies.get(i) || [];
      const depsCompleted = deps.every(depIndex => 
        plan.steps[depIndex].status === 'completed'
      );
      
      if (!depsCompleted) {
        step.status = 'failed';
        step.error = 'Dependencies not met';
        continue;
      }
      
      // Execute step
      try {
        step.status = 'running';
        const result = await this.executeStep(step, userId);
        step.output = result;
        step.status = 'completed';
        results.push(result);
      } catch (error) {
        step.status = 'failed';
        step.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }
    }
    
    return {
      steps: plan.steps,
      results
    };
  }

  /**
   * Execute Single Step: Run a specific agent action
   */
  async executeStep(step: AgentStep, userId: string): Promise<any> {
    const stepStart = Date.now();
    WorkflowLogger.log({
      level: 'info',
      agent: step.agent,
      action: step.action,
      message: `Starting ${step.agent} → ${step.action}`,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));

      let result: any;
      const REAL_AGENTS = ['GmailAgent', 'SlackAgent', 'GitHubAgent', 'NotionAgent', 'GoogleCalendarAgent'];

      if (REAL_AGENTS.includes(step.agent)) {
        result = await callAgentExecutor(step.agent, step.action, step.input || {});
      } else {
        switch (step.agent) {
          case 'SearchAgent':
            result = { results: [{ title: 'Sample Result', snippet: 'Connect a real search API for live results.' }] };
            break;
          case 'SummarizerAgent':
            result = { summary: 'Summarizer stub — wire an LLM Edge Function for real summaries.' };
            break;
          case 'DataCollector':
            result = { metrics: { placeholder: true } };
            break;
          case 'ReportGenerator':
            result = { report: 'Report stub — wire an LLM Edge Function for real reports.' };
            break;
          default:
            result = { success: true, message: `${step.agent} → ${step.action} executed.` };
        }
      }

      const duration = Date.now() - stepStart;
      WorkflowLogger.log({
        level: 'success',
        agent: step.agent,
        action: step.action,
        message: `${step.agent} → ${step.action} completed in ${duration}ms`,
        duration,
      });
      return result;
    } catch (err) {
      const duration = Date.now() - stepStart;
      const msg = err instanceof Error ? err.message : 'Unknown error';
      WorkflowLogger.log({
        level: 'error',
        agent: step.agent,
        action: step.action,
        message: `${step.agent} → ${step.action} failed after ${duration}ms: ${msg}`,
        duration,
      });
      throw err;
    }
  }

  /**
   * Get Agent Status: Check which agents are available
   */
  getAgentStatus(): Record<string, 'active' | 'inactive'> {
    return {
      'IntentRecognizer': 'active',
      'RoutingAgent': 'active',
      'GmailAgent': 'inactive',
      'SlackAgent': 'inactive',
      'NotionAgent': 'inactive',
      'GitHubAgent': 'inactive',
      'GoogleCalendarAgent': 'inactive',
      'SearchAgent': 'active',
      'SummarizerAgent': 'active'
    };
  }
}

// Singleton instance
export const orchestrator = new AgentOrchestrator();


