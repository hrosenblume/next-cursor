/**
 * Landing Page
 * ============
 * 
 * A polished homepage template with:
 * - Hero section with title and tagline
 * - Feature cards showcasing what's included
 * - Call-to-action section
 * - Footer with links and theme toggle
 * 
 * Edit lib/site-config.ts to customize content.
 * 
 * DEPLOY GUIDE FEATURE: The banner at the top links to the deployment guide.
 * To remove it: set SITE.showDeployBanner = false in lib/site-config.ts,
 * then delete the {SITE.showDeployBanner && ...} block below (lines ~44-58).
 */

import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SITE } from '@/lib/site-config'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { 
  LockIcon, 
  UsersIcon, 
  PaletteIcon, 
  MoonIcon, 
  RocketIcon, 
  SmartphoneIcon,
  GitHubIcon
} from '@/components/Icons'

const featureIcons: Record<string, React.ReactNode> = {
  lock: <LockIcon />,
  users: <UsersIcon />,
  palette: <PaletteIcon />,
  moon: <MoonIcon className="w-6 h-6" />,
  rocket: <RocketIcon />,
  smartphone: <SmartphoneIcon />,
}

export default async function Home() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Deploy guide banner - toggle with SITE.showDeployBanner in lib/site-config.ts */}
      {SITE.showDeployBanner && (
        <div className="bg-gradient-to-r from-primary to-green-500 text-primary-foreground">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              Built-in deployment guide included.
            </span>
            <Link 
              href="/deploy" 
              className="text-sm font-semibold hover:underline"
            >
              View the Deploy Guide →
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <a 
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <GitHubIcon className="w-4 h-4" />
          Fork on GitHub
        </a>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button variant="ghost" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {SITE.name}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          {SITE.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <>
              {isAdmin && (
                <Button size="lg" asChild>
                  <Link href="/admin">Go to Admin →</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/auth/signin">Get Started →</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">What&apos;s Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE.features.map((feature, i) => (
            <div 
              key={feature.title}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                {featureIcons[feature.icon] || <LockIcon />}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-card border border-border rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Clone the template and start building your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer">
                Clone Template →
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Enterprise Next.js template optimized for Cursor
          </p>
          <div className="flex items-center gap-6">
            {SITE.footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.type === 'email' ? `mailto:${SITE.email}` : link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                target={link.type === 'email' ? undefined : '_blank'}
                rel={link.type === 'email' ? undefined : 'noopener noreferrer'}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

