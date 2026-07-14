import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message { role: 'user' | 'assistant'; content: string; }

const LiveSupport: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [error, setError] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

    const startChat = () => {
        setStarted(true);
        setMessages([{ role: 'assistant', content: 'Hi! I\'m the VIDVAS AI support assistant. How can I help you today?' }]);
    };

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setInput('');
        setError('');
        const updated: Message[] = [...messages, { role: 'user', content: text }];
        setMessages(updated);
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('chat-support', {
                body: { message: text, history: updated.slice(-10) },
            });
            if (error) throw new Error(error.message || 'Request failed');
            setMessages([...updated, { role: 'assistant', content: data.reply }]);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-5">Live Support</p>
                    <h1 className="text-5xl md:text-6xl font-bold font-inter text-ink mb-4">
                        Get Help <span className="text-gradient">Instantly</span>
                    </h1>
                    <p className="text-xl text-ink-2 font-inter">AI-powered support, available 24/7</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Window */}
                    <div className="lg:col-span-2 flex flex-col bg-surface-3/60 border border-edge rounded-2xl overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-electric-blue/20 to-cyber-cyan/20 border-b border-edge p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-ink font-inter">VIDVAS AI Support</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
                                    <p className="text-xs text-ink-2 font-inter">Online • Powered by Gemini</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 h-96 p-5 overflow-y-auto space-y-4">
                            {!started ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="text-5xl mb-4 animate-bounce-subtle">👋</div>
                                    <h3 className="text-xl font-bold text-ink mb-2 font-inter">Welcome to VIDVAS Support!</h3>
                                    <p className="text-ink-2 mb-6 font-inter text-sm">Ask anything about our AI services, pricing, or integrations.</p>
                                    <button onClick={startChat} className="bg-gradient-to-r from-electric-blue to-cyber-cyan text-white px-8 py-3 rounded-xl font-bold hover:shadow-glow-md transition-all font-inter btn-shimmer overflow-hidden">
                                        Start Chat
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm bg-ink/10">
                                                {m.role === 'assistant' ? '🤖' : '👤'}
                                            </div>
                                            <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm font-inter leading-relaxed ${m.role === 'assistant' ? 'bg-ink/5 border border-edge text-ink-2' : 'bg-electric-blue/20 border border-electric-blue/30 text-ink'}`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex gap-3">
                                            <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center text-sm">🤖</div>
                                            <div className="px-4 py-3 rounded-2xl bg-ink/5 border border-edge">
                                                <div className="flex gap-1 items-center h-4">
                                                    {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {error && <p className="text-red-400 text-xs font-inter text-center">⚠️ {error}</p>}
                                    <div ref={bottomRef} />
                                </>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-edge">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && send()}
                                    placeholder={started ? 'Type your message...' : 'Start the chat first'}
                                    disabled={!started || loading}
                                    className="flex-1 px-4 py-3 bg-ink/5 border border-edge rounded-xl text-ink placeholder-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue transition-colors font-inter text-sm disabled:opacity-40"
                                />
                                <button
                                    onClick={send}
                                    disabled={!started || !input.trim() || loading}
                                    className="bg-gradient-to-r from-electric-blue to-cyber-cyan text-white px-5 py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-md transition-all font-inter text-sm"
                                >
                                    {loading ? '...' : 'Send →'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {[
                            { title: 'Support Hours', items: ['✅ 24/7 AI Chat', '✅ Email Support', '🕐 Phone: Mon–Fri 9AM–6PM IST'] },
                        ].map(s => (
                            <div key={s.title} className="bg-surface-3/60 border border-edge rounded-xl p-5">
                                <h3 className="text-sm font-bold text-ink mb-3 font-inter">{s.title}</h3>
                                <div className="space-y-2">{s.items.map(item => <p key={item} className="text-ink-2 text-sm font-inter">{item}</p>)}</div>
                            </div>
                        ))}
                        <div className="bg-surface-3/60 border border-edge rounded-xl p-5 space-y-2">
                            <h3 className="text-sm font-bold text-ink mb-3 font-inter">Quick Links</h3>
                            {[['📖 FAQ', '/faq'], ['📚 Docs', '/docs'], ['📅 Book Demo', '/demo']].map(([label, href]) => (
                                <a key={href} href={href} className="block p-2.5 rounded-lg bg-white/[0.03] border border-edge hover:border-electric-blue/30 text-ink-2 hover:text-ink text-sm font-inter transition-all">{label}</a>
                            ))}
                        </div>
                        <div className="bg-surface-3/60 border border-edge rounded-xl p-5">
                            <h3 className="text-sm font-bold text-ink mb-3 font-inter">Contact</h3>
                            <div className="space-y-1.5 text-sm text-ink-2 font-inter">
                                <p>📧 support@vidvasai.com</p>
                                <p>📞 +91 98765 43210</p>
                                <p>📍 Delhi, India 🇮🇳</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveSupport;
