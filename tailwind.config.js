/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original neon colors (kept for compatibility)
        'neon-blue': '#00D4FF',
        'neon-green': '#00FF88',
        'dark-gray': '#1A1A1A',
        'medium-gray': '#2D2D2D',
        'light-gray': '#404040',

        // Professional AI platform palette (Vercel/Linear/Stripe inspired)
        'vercel-blue': '#0070F3',
        'electric-blue': '#0EA5E9',
        'cyber-cyan': '#06B6D4',
        'deep-ocean': '#0284C7',
        'sky-blue': '#38BDF8',
        'emerald-green': '#10B981',
        'mint-green': '#34D399',
        'lime-green': '#84CC16',

        // Warm accent colors
        'vibrant-orange': '#FF6B35',
        'coral-orange': '#FF8B5A',
        'sunset-orange': '#FF9E7A',
        'peach': '#FFB088',

        // Gradient stops (blue/teal/emerald theme)
        'gradient-start': '#0070F3',
        'gradient-middle': '#06B6D4',
        'gradient-end': '#10B981',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #0070F3, #06B6D4, #10B981)',
        'gradient-electric': 'linear-gradient(135deg, #0070F3, #38BDF8, #10B981)',
        'gradient-ocean': 'linear-gradient(135deg, #0284C7, #38BDF8, #06B6D4)',
        'gradient-emerald': 'linear-gradient(135deg, #06B6D4, #10B981, #34D399)',
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
        'glow-sm': '0 0 10px rgba(0, 112, 243, 0.5)',
        'glow-md': '0 0 20px rgba(0, 112, 243, 0.6)',
        'glow-lg': '0 0 30px rgba(0, 112, 243, 0.7)',
        'glow-blue': '0 0 30px rgba(0, 112, 243, 0.6)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.6)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.6)',
        'glow-orange': '0 0 30px rgba(255, 107, 53, 0.6)',
      },
    },
  },
  plugins: [],
}
