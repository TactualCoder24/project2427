import React, { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// Target: July 25, 2026 00:00:00 IST
const TARGET = new Date(2026, 6, 25, 0, 0, 0).getTime(); // month is 0-indexed (6 = July)

const CountdownTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [launched, setLaunched] = useState(false);

    useEffect(() => {
        const tick = () => {
            const diff = TARGET - Date.now();
            if (diff <= 0) {
                setLaunched(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    if (launched) {
        return (
            <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-ink font-inter font-semibold text-xl">We have launched!</p>
                <p className="text-ink-3 font-inter text-sm mt-1">VIDVAS AI is live. Start building your AI workforce now.</p>
            </div>
        );
    }

    const units = [
        { label: 'Days',    value: timeLeft.days,    color: 'text-cyber-aqua' },
        { label: 'Hours',   value: timeLeft.hours,   color: 'text-vivid-purple' },
        { label: 'Minutes', value: timeLeft.minutes, color: 'text-electric-amber' },
        { label: 'Seconds', value: timeLeft.seconds, color: 'text-hot-pink', pulse: true },
    ];

    return (
        <div className="rounded-2xl border border-edge glass-premium p-8 text-center">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 bg-cyber-aqua rounded-full animate-pulse" />
                <p className="text-cyber-aqua font-inter font-semibold text-sm tracking-widest uppercase">Full Launch</p>
            </div>
            <h3 className="text-ink font-inter font-black text-2xl md:text-3xl mb-1">
                July 25, 2026
            </h3>
            <p className="text-ink-3 font-inter text-sm mb-8">
                Early access is live now — full feature launch coming soon
            </p>

            {/* Countdown blocks */}
            <div className="grid grid-cols-4 gap-3 mb-8 max-w-sm mx-auto">
                {units.map(u => (
                    <div key={u.label} className="flex flex-col items-center gap-1 bg-surface-3 rounded-xl py-4 px-2 border border-edge">
                        <span className={`font-inter font-black text-3xl md:text-4xl tabular-nums leading-none ${u.color} ${u.pulse ? 'animate-pulse' : ''}`}>
                            {u.value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-ink-3 font-inter text-[10px] uppercase tracking-wider">{u.label}</span>
                    </div>
                ))}
            </div>

            {/* Feature bullets */}
            <div className="flex flex-col items-center gap-2 text-ink-3 font-inter text-xs">
                <span>✨ Advanced AI Automation · Full Workflow Engine</span>
                <span>🔗 Gmail, Slack, GitHub, Notion integrations live</span>
                <span>⚡ Enterprise-grade performance &amp; uptime</span>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 bg-cyber-aqua/10 border border-cyber-aqua/20 text-cyber-aqua px-4 py-2 rounded-full text-xs font-inter font-medium">
                <span className="w-1.5 h-1.5 bg-cyber-aqua rounded-full animate-pulse" />
                Launch Sequence Initiated
            </div>
        </div>
    );
};

export default CountdownTimer;
