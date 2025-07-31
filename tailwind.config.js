/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Global surface/background
        background: {
          light: '#f9fafb',
          dark: '#0B0E1E',
        },
        surface: {
          light: '#f3f4f6',
          dark: '#12162A',
        },
        surfaceVariant: {
          light: '#f3f4f6',
          dark: '#1E243F',
        },
        onSurface: {
          light: '#E5E7EB',
          dark: '#374151',
        },

        // Text
        text: {
          primary: {
            light: '#111827',
            dark: '#f9fafb',
          },
          secondary: {
            light: '#4b5563',
            dark: '#d1d5db',
          },
          muted: {
            light: '#6b7280',
            dark: '#9ca3af',
          },
        },

        // Borders / dividers
        border: {
          light: '#e5e7eb',
          dark: '#374151',
        },

        // Accent / brand colors
        brand: {
          light: '#2563eb', // blue-600
          dark: '#3b82f6',  // blue-500
        },

        // Utility (for fallback contrast / icons)
        inverted: {
          light: '#000000',
          dark: '#ffffff',
        },

        green: {
          light: '#67AC5C',
          dark: '#10b981'
        }
      },
    },
  },
  plugins: [],
}
