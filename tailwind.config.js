/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original colors
        'neon-blue': '#00D4FF',
        'neon-green': '#00FF88',
        'dark-gray': '#1A1A1A',
        'medium-gray': '#2D2D2D',
        'light-gray': '#404040',
        
        // Enhanced vibrant palette
        'electric-blue': '#0EA5E9',
        'cyber-cyan': '#06B6D4',
        'vivid-purple': '#A855F7',
        'hot-pink': '#EC4899',
        'lime-green': '#84CC16',
        'amber-glow': '#F59E0B',
        
        // Gradient stops
        'gradient-start': '#667EEA',
        'gradient-middle': '#764BA2',
        'gradient-end': '#F093FB',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'sora': ['Sora', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-electric': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #A855F7 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #00D4FF 0%, #A855F7 50%, #EC4899 100%)',
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
        'glow-sm': '0 0 10px rgba(0, 212, 255, 0.5)',
        'glow-md': '0 0 20px rgba(0, 212, 255, 0.6)',
        'glow-lg': '0 0 30px rgba(0, 212, 255, 0.7)',
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.6)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.6)',
      },
    },
  },
  plugins: [],
}
