/**
 * Site Configuration
 * ==================
 * 
 * Central configuration for site-wide content and settings.
 * Edit this file to customize your site's branding and content.
 * 
 * This keeps content DRY - change once, update everywhere.
 * Used by: homepage, layout metadata, footer, etc.
 */

export type FooterLink = {
  label: string
  href?: string
  type?: 'email'
}

export const SITE = {
  // -----------------------------------------------------------------------------
  // Branding
  // -----------------------------------------------------------------------------
  name: 'Your App',
  tagline: 'A modern Next.js starter template',
  description: 'Production-ready Next.js 15 starter with auth, admin dashboard, and deployment infrastructure.',
  
  // -----------------------------------------------------------------------------
  // Contact
  // -----------------------------------------------------------------------------
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  
  // -----------------------------------------------------------------------------
  // URLs
  // -----------------------------------------------------------------------------
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  github: 'https://github.com/hrosenblume/next-cursor',
  
  // -----------------------------------------------------------------------------
  // Footer Links
  // -----------------------------------------------------------------------------
  // Shown in the homepage footer
  // type: 'email' will use the EmailLink component (obfuscated mailto)
  footerLinks: [
    { label: 'GitHub', href: 'https://github.com/hrosenblume/next-cursor' },
    { label: 'Twitter', href: '' },
    { label: 'Email', type: 'email' },
  ] as FooterLink[],
  
  // -----------------------------------------------------------------------------
  // Features (for homepage)
  // -----------------------------------------------------------------------------
  // Edit these to describe your app's features
  features: [
    {
      title: 'Authentication',
      description: 'NextAuth.js v5 with Google OAuth and role-based access control.',
      icon: 'lock',
    },
    {
      title: 'Admin Dashboard',
      description: 'Built-in user management with a clean, responsive interface.',
      icon: 'users',
    },
    {
      title: 'shadcn/ui',
      description: 'Beautiful, accessible components ready to customize.',
      icon: 'palette',
    },
    {
      title: 'Dark Mode',
      description: 'System-aware theme switching with smooth transitions.',
      icon: 'moon',
    },
    {
      title: 'Production Ready',
      description: 'PM2, GitHub Actions, and DigitalOcean deployment guides.',
      icon: 'rocket',
    },
    {
      title: 'Mobile Testing',
      description: 'ngrok tunnel setup for testing on real devices.',
      icon: 'smartphone',
    },
  ],
}

