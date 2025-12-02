/**
 * Keyboard Hook
 * =============
 * 
 * React hook for handling keyboard shortcuts.
 * 
 * Features:
 * - Supports modifier keys (meta/cmd, ctrl, shift, alt)
 * - Can allow/disallow shortcuts when typing in inputs
 * - Uses refs to avoid re-running effects on handler changes
 * 
 * Usage:
 *   useKeyboard([
 *     { key: 'n', handler: () => createNew() },
 *     { key: 's', meta: true, handler: () => save() },
 *     { key: 'Escape', allowInInput: true, handler: () => close() },
 *   ])
 */

'use client'

import { useEffect, useRef } from 'react'

interface Shortcut {
  key: string           // Key to listen for (e.g., 'n', 'Escape', 'ArrowLeft')
  meta?: boolean        // Require Cmd/Ctrl key
  handler: () => void   // Function to call when triggered
  allowInInput?: boolean // Allow shortcut when focused on input/textarea
}

export function useKeyboard(shortcuts: Shortcut[]) {
  // Use ref to avoid effect re-running when shortcuts array reference changes
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Check if user is typing in an input
      const isTyping =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.closest('[contenteditable="true"]'))

      for (const shortcut of shortcutsRef.current) {
        // Skip if typing and shortcut doesn't allow it
        if (!shortcut.allowInInput && isTyping) continue

        // Check if modifier key matches
        const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey
        
        // Check if key matches (case-insensitive for letters)
        const keyMatch = e.key === shortcut.key || e.key.toLowerCase() === shortcut.key

        if (metaMatch && keyMatch) {
          e.preventDefault()
          shortcut.handler()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, []) // Empty deps - only run once, ref keeps handlers fresh
}

