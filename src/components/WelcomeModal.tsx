import React, { useState, useEffect } from 'react';
import Button from './Button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Full launch: July 25, 2026 00:00:00
const LAUNCH_DATE = new Date(2026, 6, 25, 0, 0, 0).getTime();

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen]);

  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH_DATE - Date.now();
      if (diff <= 0) {
        setLaunched(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleExplore = () => {
    handleClose();
    setTimeout(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  if (!isOpen) return null;

  const countdown = [
    { label: 'DAYS',    value: timeLeft.days,    gradient: 'text-gradient-cyber' },
    { label: 'HOURS',   value: timeLeft.hours,   gradient: 'text-gradient' },
    { label: 'MINS',    value: timeLeft.minutes, gradient: 'text-gradient-electric' },
    { label: 'SECS',    value: timeLeft.seconds, gradient: 'text-neon-green', pulse: true },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-85 backdrop-blur-sm' : 'bg-opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`relative glass-premium border border-edge-2 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-glow-purple transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} overflow-hidden`}>

        {/* Background glow inside modal */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-vivid-purple/10 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-electric-blue rounded-full animate-float opacity-60" />
        <div className="absolute bottom-8 right-8 w-2 h-2 bg-hot-pink rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-12 w-1.5 h-1.5 bg-vivid-purple rounded-full animate-float opacity-50" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 left-6 w-1.5 h-1.5 bg-neon-green rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-ink-2 hover:text-ink transition-colors w-9 h-9 flex items-center justify-center rounded-full hover:bg-ink/10 text-xl z-10"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-electric-blue via-vivid-purple to-hot-pink rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple animate-float">
            <span className="text-4xl sm:text-5xl">🤖</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-electric-blue/30 bg-electric-blue/5 text-xs font-inter font-semibold text-electric-blue mb-4 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-electric-blue rounded-full animate-pulse" />
            Now in Early Access · India 🇮🇳
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-outfit mb-3 text-gradient-animate">
            Welcome to VIDVAS AI
          </h2>

          {/* Sanskrit */}
          <p className="text-base sm:text-lg text-ink-2 font-jakarta italic mb-2">
            <span className="text-gradient-cyber font-semibold">विद्वस्</span> (VIDVAS) — Sanskrit for{' '}
            <span className="text-gradient font-semibold">"Intelligence"</span>
          </p>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-ink-2 font-jakarta mb-6 max-w-md mx-auto leading-relaxed">
            India's <span className="text-gradient font-semibold">AI lab</span> — building
            intelligent agents, custom AI systems, automation, and enterprise integrations, all in one place.
          </p>

          {/* Countdown */}
          {!launched ? (
            <div className="mb-6 p-5 sm:p-6 glass-premium rounded-2xl border border-electric-blue/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
                <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase">
                  Full Platform Launch · July 25, 2026
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5">
                {countdown.map(u => (
                  <div key={u.label} className="glass-premium rounded-xl py-3 px-1 border border-edge flex flex-col items-center gap-1">
                    <span className={`font-outfit font-black text-2xl sm:text-3xl tabular-nums leading-none ${u.gradient} ${u.pulse ? 'animate-pulse' : ''}`}>
                      {String(u.value).padStart(2, '0')}
                    </span>
                    <span className="text-ink-3 font-inter text-[9px] sm:text-[10px] uppercase tracking-wider">{u.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-left">
                {[
                  ['⚡', 'text-electric-blue', 'AI Automation · Workflow Builder · Custom Agents'],
                  ['🔗', 'text-vivid-purple', 'Gmail, Slack, GitHub, Notion integrations'],
                  ['🇮🇳', 'text-neon-green', 'Made in India · Enterprise-grade security'],
                ].map(([icon, color, text]) => (
                  <div key={text as string} className="flex items-center gap-2 text-xs sm:text-sm text-ink-2 font-jakarta">
                    <span className={color as string}>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-5 glass-premium rounded-2xl border border-neon-green/20 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-neon-green font-outfit font-bold text-xl">We have launched!</p>
              <p className="text-ink-2 font-jakarta text-sm mt-1">VIDVAS AI is live. Start building today.</p>
            </div>
          )}

          {/* Services strip */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['AI Agents', 'Automation', 'Custom AI', 'Consulting', 'Integrations'].map(s => (
              <span key={s} className="px-3 py-1 rounded-full glass-premium border border-edge text-ink-2 font-jakarta text-xs hover:border-electric-blue/30 hover:text-ink transition-all">
                {s}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="gradient" size="lg" onClick={handleExplore} className="shadow-glow-purple w-full sm:w-auto">
              Explore Platform 🚀
            </Button>
            <Button variant="outline" size="lg" onClick={handleClose} className="w-full sm:w-auto">
              Continue to Site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
