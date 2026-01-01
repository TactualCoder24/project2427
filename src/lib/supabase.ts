import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Database Types
export interface UserProfile {
    id: string;
    full_name: string | null;
    company: string | null;
    created_at: string;
    updated_at: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    company: string | null;
    subject: string;
    message: string;
    created_at: string;
}

export interface AgentDeployment {
    id: string;
    user_id: string;
    agent_name: string;
    status: 'pending' | 'active' | 'inactive';
    created_at: string;
}


