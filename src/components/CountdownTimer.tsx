import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target time to 27 hours from now
    const targetTime = new Date().getTime() + (18 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-neon-blue/10 to-neon-green/10 border border-neon-blue/30 rounded-2xl p-8 text-center animate-fadeInUp backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-2xl md:text-3xl font-bold font-space-grotesk mb-2">
          🚀 <span className="text-neon-blue">Something Big</span> is Coming!
        </h3>
        <p className="text-gray-300 text-lg">
          We're just about to launch our revolutionary AI platform that will change everything
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
          <div className="text-3xl md:text-4xl font-bold text-neon-blue mb-1">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Days</div>
        </div>
        
        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
          <div className="text-3xl md:text-4xl font-bold text-neon-green mb-1">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Hours</div>
        </div>
        
        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
          <div className="text-3xl md:text-4xl font-bold text-neon-blue mb-1">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Minutes</div>
        </div>
        
        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
          <div className="text-3xl md:text-4xl font-bold text-neon-green mb-1 animate-pulse">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Seconds</div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-400">
        <p>✨ Advanced AI Agents Ready for Deployment</p>
        <p>🔥 Revolutionary Automation Capabilities</p>
        <p>⚡ Lightning-Fast Performance Optimizations</p>
      </div>
      
      <div className="mt-6">
        <div className="inline-flex items-center space-x-2 bg-neon-blue/20 text-neon-blue px-4 py-2 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
          <span>Launch Sequence Initiated</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
