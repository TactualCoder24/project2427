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

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Launch date: January 1, 2026 00:00:00
  const launchDate = new Date('2026-01-01T00:00:00').getTime();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleExplore = () => {
    handleClose();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-80 backdrop-blur-sm' : 'bg-opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={`relative glass-premium border border-white/20 rounded-3xl max-w-2xl w-full p-4 sm:p-8 md:p-12 shadow-glow-orange transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors duration-200 text-2xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-electric-blue via-vercel-blue to-emerald-green rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-glow-orange animate-float">
            <span className="text-3xl sm:text-4xl md:text-5xl">🚀</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-inter mb-3 sm:mb-4 text-gradient-animate px-2">
            Welcome to VIDVAS AI
          </h2>

          {/* Sanskrit Meaning */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-inter italic mb-4 sm:mb-6 px-2">
            <span className="text-gradient-cyber font-semibold">विद्वस्</span> - Sanskrit for <span className="text-gradient font-semibold">"Intelligence"</span>
          </p>

          {/* Countdown Timer */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 glass-premium rounded-xl sm:rounded-2xl border border-electric-blue/20">
            <div className="text-electric-blue text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-4 font-inter flex items-center justify-center gap-2 px-2">
              🚀 <span className="text-gradient-cyber">Launching Jan 1, 2026</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div className="glass-premium p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-electric-blue/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-cyber font-inter">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-1 font-inter">DAYS</div>
              </div>
              <div className="glass-premium p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-vercel-blue/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient font-inter">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-1 font-inter">HOURS</div>
              </div>
              <div className="glass-premium p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-emerald-green/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-electric font-inter">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-1 font-inter">MINUTES</div>
              </div>
              <div className="glass-premium p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-neon-green/20">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-neon-green font-inter">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-1 font-inter">SECONDS</div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-left px-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-inter">
                <span className="text-electric-blue flex-shrink-0">⚡</span>
                <span>Advanced AI Agents Ready for Deployment</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-inter">
                <span className="text-vercel-blue flex-shrink-0">🔄</span>
                <span>Revolutionary Automation Capabilities</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-inter">
                <span className="text-emerald-green flex-shrink-0">⚡</span>
                <span>Lightning-Fast Performance Optimizations</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 font-inter leading-relaxed px-2">
            Transform your business with <span className="text-gradient font-semibold">intelligent AI agents</span> that work{' '}
            <span className="text-neon-green font-bold">24/7</span> to automate tasks and drive{' '}
            <span className="text-gradient-electric font-semibold">unprecedented growth</span>.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleExplore}
              className="shadow-glow-orange w-full sm:w-auto text-sm sm:text-base"
            >
              Explore AI Agents 🚀
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleClose}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Continue to Site
            </Button>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-electric-blue rounded-full animate-float opacity-60" />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-emerald-green rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-vercel-blue rounded-full animate-float opacity-60" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export default WelcomeModal;

