/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.6' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.6' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.6' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],        // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],     // 60px
      },
      lineHeight: {
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      colors: {
        // AL-NOOR BAKERY brand colors
        primary: {
          50: '#fef7ed',
          100: '#fde8c8',
          200: '#fbd08c',
          300: '#f9b750',
          400: '#f7a52d',
          500: '#f59e0b',
          600: '#e08806',
          700: '#bc6f04',
          800: '#9c5807',
          900: '#7c4209',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.body').join(', '),
            fontSize: theme('fontSize.base')[0],
            lineHeight: theme('fontSize.base')[1].lineHeight,
            color: theme('colors.gray.800'),
            maxWidth: '65ch',
            h1: {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontSize: theme('fontSize.4xl')[0],
              lineHeight: theme('fontSize.4xl')[1].lineHeight,
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            h2: {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontSize: theme('fontSize.3xl')[0],
              lineHeight: theme('fontSize.3xl')[1].lineHeight,
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            h3: {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontSize: theme('fontSize.2xl')[0],
              lineHeight: theme('fontSize.2xl')[1].lineHeight,
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            strong: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.primary.700'),
                textDecoration: 'underline',
              },
            },
          },
        },
        lg: {
          css: {
            fontSize: theme('fontSize.lg')[0],
            lineHeight: theme('fontSize.lg')[1].lineHeight,
            h1: {
              fontSize: theme('fontSize.5xl')[0],
              lineHeight: theme('fontSize.5xl')[1].lineHeight,
            },
            h2: {
              fontSize: theme('fontSize.4xl')[0],
              lineHeight: theme('fontSize.4xl')[1].lineHeight,
            },
            h3: {
              fontSize: theme('fontSize.3xl')[0],
              lineHeight: theme('fontSize.3xl')[1].lineHeight,
            },
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};