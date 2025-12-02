/**
 * Root Providers
 * ==============
 * 
 * Wraps the app with required context providers:
 * - SessionProvider: NextAuth session management
 * - ThemeProvider: next-themes dark mode support
 * - ThemeShortcut: Cmd+. keyboard shortcut for theme toggle
 */

'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, useTheme } from 'next-themes'
import { useKeyboard, SHORTCUTS } from '@/lib/keyboard'

function ThemeShortcut() {
  const { theme, setTheme } = useTheme()

  useKeyboard([
    { ...SHORTCUTS.THEME_TOGGLE, handler: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
  ])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeShortcut />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

