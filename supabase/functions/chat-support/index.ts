import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-supabase-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM = `You are a friendly support agent for VIDVAS AI (विद्वस्), India's full-stack AI services company.
Help users with questions about AI agents, workflow automation, integrations, pricing (₹0–₹2999/mo), and demos.
Be concise, warm, and professional. If you can't answer something, offer to escalate to the team at support@vidvas.ai.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { message, history = [] } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: 'message required' }), { status: 400, headers: CORS });

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not set' }), { status: 500, headers: CORS });

    const contents = [
      ...history.map(({ role, content }: { role: string; content: string }) => ({
        role: role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const message = data?.error?.message ?? 'Gemini request failed';
      return new Response(JSON.stringify({ error: message }), { status: res.status, headers: { ...CORS, 'Content-Type': 'application/json' } });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I couldn\'t process that. Please try again.';

    return new Response(JSON.stringify({ reply }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS });
  }
});
