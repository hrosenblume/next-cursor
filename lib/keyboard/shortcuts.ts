/**
 * Keyboard Shortcuts Configuration
 * =================================
 * 
 * Central registry of keyboard shortcuts used throughout the app.
 * 
 * To add a new shortcut:
 * 1. Add it here with key and modifiers
 * 2. Use useKeyboard() hook to bind the handler
 * 
 * Current shortcuts:
 * - Cmd/Ctrl + . : Toggle dark/light theme
 * 
 * Example usage:
 *   import { SHORTCUTS } from '@/lib/keyboard'
 *   useKeyboard([
 *     { ...SHORTCUTS.THEME_TOGGLE, handler: () => toggleTheme() },
 *   ])
 */

export const SHORTCUTS = {
  // Toggle dark/light theme
  THEME_TOGGLE: { key: '.', meta: true, allowInInput: true },
} as const

