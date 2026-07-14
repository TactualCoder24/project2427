import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const glitchPhrases = [
    'Even our AI got lost here.',
    'The bots searched. Nothing found.',
    'Our agents looked everywhere.',
    '404: Intelligence not located.',
    'No workflow exists for this URL.',
];

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const [phrase] = useState(() => glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(timer);
                    navigate('/');
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden px-4">
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(37,99,235,0.12),transparent_60%)]" />
            </div>

            {/* Decorative floating ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-edge animate-spin-slow pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-electric-blue/10 animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />

            <div className="relative z-10 text-center max-w-lg mx-auto">
                {/* Icon */}
                <div className="w-28 h-28 bg-gradient-to-br from-electric-blue via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(37,99,235,0.5)] animate-bounce-subtle">
                    <span className="text-6xl">🤖</span>
                </div>

                {/* 404 heading */}
                <h1 className="text-[120px] sm:text-[160px] font-bold font-outfit leading-none mb-2 text-gradient-animate">
                    404
                </h1>

                <p className="text-xl sm:text-2xl font-outfit font-semibold text-ink mb-3">
                    Page Not Found
                </p>

                <p className="text-ink-2 font-jakarta text-base sm:text-lg mb-8 italic">
                    "{phrase}"
                </p>

                {/* Countdown */}
                <div className="glass-premium rounded-xl px-5 py-3 inline-flex items-center gap-3 mb-8 border border-edge">
                    <span className="text-sm text-ink-2 font-jakarta">Redirecting to home in</span>
                    <span className="text-2xl font-bold font-outfit text-gradient-cyber">{countdown}</span>
                    <span className="text-sm text-ink-2 font-jakarta">seconds</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <Button variant="gradient" size="lg" className="w-full sm:w-auto btn-shimmer">
                            🏠 Take Me Home
                        </Button>
                    </Link>
                    <Link to="/agents">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Browse AI Services →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
