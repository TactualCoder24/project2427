/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      // ─── Colors ──────────────────────────────────────────────────────────
      colors: {
        // Semantic theme tokens — driven by CSS variables, flip with .dark on <html>
        'surface':    'var(--surface)',
        'surface-2':  'var(--surface-2)',
        'surface-3':  'var(--surface-3)',
        'ink':        'var(--ink)',
        'ink-2':      'var(--ink-2)',
        'ink-3':      'var(--ink-3)',
        'edge':       'var(--edge)',
        'edge-2':     'var(--edge-2)',
        'accent':     'var(--accent)',
        'accent-2':   'var(--accent-2)',

        // Core neon palette (original)
        'neon-blue':        '#00D4FF',
        'neon-green':       '#00FF88',
        'electric-blue':    '#0EA5E9',
        'cyber-cyan':       '#06B6D4',
        'vivid-purple':     '#2563EB',
        'hot-pink':         '#F59E0B',
        'lime-green':       '#84CC16',
        'amber-glow':       '#F59E0B',
        'coral-accent':     '#F87171',

        // Dark backgrounds
        'dark-gray':        '#1A1A1A',
        'medium-gray':      '#2D2D2D',
        'light-gray':       '#404040',

        // Gradient stops (original)
        'gradient-start':   '#2563EB',
        'gradient-middle':  '#1D4ED8',
        'gradient-end':     '#00FF88',

        // Extended palette (kept from latest)
        'cyber-aqua':       '#00CED1',
        'deep-cyan':        '#00CED1',
        'intelligence-blue':'#3B82F6',
        'neon-blue-alt':    '#60A5FA',
        'signal-green':     '#10B981',
        'neural-gray':      '#4B5563',
        'quantum-teal':     '#0D9488',

        // Editorial tokens (kept so Login/misc pages work)
        'electric-amber':   '#FFB627',
        'retro-orange':     '#FF6B35',
        'vintage-magenta':  '#0EA5E9',
        'soft-cream':       '#F5F1E8',
        'cosmic-purple':    '#0C2461',
        'midnight-blue':    '#0F1B2E',
        'deep-black':       '#0A0A0A',
        'warm-black':       '#1A1614',
      },

      // ─── Font Families ───────────────────────────────────────────────────
      fontFamily: {
        'inter':        ['Inter', 'system-ui', 'sans-serif'],
        'outfit':       ['Outfit', 'system-ui', 'sans-serif'],
        'jakarta':      ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'sora':         ['Sora', 'system-ui', 'sans-serif'],
        'space':        ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'manrope':      ['Manrope', 'system-ui', 'sans-serif'],
        'body':         ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        'display':      ['"Playfair Display"', 'Georgia', 'serif'],
        'mono':         ['"IBM Plex Mono"', 'monospace'],
      },

      // ─── Box Shadows ─────────────────────────────────────────────────────
      boxShadow: {
        'glow-sm':       '0 0 10px rgba(0, 212, 255, 0.5)',
        'glow-md':       '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)',
        'glow-lg':       '0 0 30px rgba(0, 212, 255, 0.7)',
        'glow-purple':   '0 0 30px rgba(37, 99, 235, 0.6), 0 0 60px rgba(0, 212, 255, 0.3)',
        'glow-pink':     '0 0 30px rgba(245, 158, 11, 0.6)',
        'glow-blue':     '0 0 30px rgba(37, 99, 235, 0.5)',
        'glow-teal':     '0 0 30px rgba(0, 206, 209, 0.6)',
        'glow-cyan':     '0 0 30px rgba(0, 212, 255, 0.5)',
        'glow-amber':    '0 0 30px rgba(245, 158, 11, 0.5)',
        'glow-magenta':  '0 0 30px rgba(0, 212, 255, 0.5)',
        'atmospheric':   '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(0,212,255,0.1)',
        'editorial':     '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(255,182,39,0.15)',
        'dramatic':      '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,206,209,0.15)',
      },

      // ─── Background Images ───────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial':        'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':         'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-electric':      'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        'gradient-cyber':         'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #2563EB 100%)',
        'gradient-sunset':        'linear-gradient(135deg, #00D4FF 0%, #2563EB 100%)',
        'gradient-aurora':        'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 50%, #00FF88 100%)',
        'gradient-intelligence':  'linear-gradient(135deg, #00CED1 0%, #0C2461 100%)',
        'gradient-quantum':       'linear-gradient(135deg, #0EA5E9 0%, #0C2461 100%)',
        'gradient-amber':         'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      },

      // ─── Animations ──────────────────────────────────────────────────────
      animation: {
        'fadeIn':           'fadeInUp 0.45s ease-out',
        'scaleIn':          'scaleIn 0.3s ease-out',
        'float':            'float 6s ease-in-out infinite',
        'pulse-slow':       'pulse 3s ease-in-out infinite',
        'gradient-shift':   'gradientShift 8s ease infinite',
        'shimmer':          'shimmer 2s linear infinite',
        'glow':             'glow 2s ease-in-out infinite alternate',
        'glow-pulse':       'glowPulse 3s ease-in-out infinite',
        'smoothPulse':      'smoothPulse 2s ease-in-out infinite',
      },

      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #00D4FF, 0 0 30px #00D4FF' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(37, 99, 235, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8), 0 0 60px rgba(37, 99, 235, 0.6)' },
        },
        smoothPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
