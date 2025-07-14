/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F9FAFB',
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
          accent: '#16A34A',
          alert: '#DC2626',
          suggestion: '#F59E0B',
          chart: '#6366F1',
        },
        dark: {
          background: '#0F172A',
          surface: '#1E293B',
          text: '#F8FAFC',
          muted: '#94A3B8',
          border: '#334155',
          accent: '#22C55E',
          alert: '#F87171',
          suggestion: '#FBBF24',
          chart: '#8B5CF6',
        },
      },
    },
  },
  plugins: [],
}