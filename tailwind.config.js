/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional AI Platform Palette (Balanced & Sophisticated)
        // Primary Colors - More Restrained
        'intelligence-blue': '#0066FF',
        'deep-slate': '#0F1419',
        'quantum-teal': '#00D4AA',

        // Secondary Colors - Neutral Focus
        'cyber-aqua': '#00B8D4',
        'neural-gray': '#6B7280',
        'arctic-white': '#F9FAFB',
        'slate-gray': '#475569',
        'warm-gray': '#78716C',

        // Accent Colors
        'signal-green': '#10B981',
        'alert-amber': '#F59E0B',
        'soft-purple': '#8B5CF6',
        'coral-accent': '#F97316',

        // Legacy compatibility (mapped to new colors)
        'neon-blue': '#0066FF',
        'dark-gray': '#0F1419',
        'medium-gray': '#1A1F2E',
        'light-gray': '#6B7280',

        // Gradient stops - More Balanced
        'gradient-start': '#475569',
        'gradient-middle': '#0066FF',
        'gradient-end': '#00D4AA',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-intelligence': 'linear-gradient(135deg, #475569, #0066FF, #00D4AA)',
        'gradient-quantum': 'linear-gradient(135deg, #00D4AA, #8B5CF6)',
        'gradient-deep-space': 'linear-gradient(180deg, #0F1419, #1A1F2E)',
        'gradient-cyber': 'linear-gradient(135deg, #475569, #00B8D4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'scale-in': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #00D4FF, 0 0 30px #00D4FF' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8), 0 0 60px rgba(168, 85, 247, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 102, 255, 0.5)',
        'glow-md': '0 0 20px rgba(0, 102, 255, 0.6)',
        'glow-lg': '0 0 30px rgba(0, 102, 255, 0.7)',
        'glow-blue': '0 0 30px rgba(0, 102, 255, 0.6)',
        'glow-teal': '0 0 30px rgba(0, 212, 170, 0.6)',
        'glow-aqua': '0 0 30px rgba(0, 184, 212, 0.6)',
        'glow-green': '0 0 30px rgba(16, 185, 129, 0.6)',
      },
    },
  },
  plugins: [],
}
