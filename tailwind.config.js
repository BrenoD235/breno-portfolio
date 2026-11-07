/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        border:     'hsl(var(--border))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted:      { foreground: 'hsl(var(--muted-foreground))' },
        accent:     'hsl(var(--accent))',
        card:       'hsl(var(--card))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
      },
      keyframes: {
        fadeUp:       { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scrollBounce: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(5px)' } },
      },
      animation: {
        fadeUp:       'fadeUp 0.7s ease both',
        scrollBounce: 'scrollBounce 2s infinite',
      },
    },
  },
}
