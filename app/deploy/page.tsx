'use client'

/**
 * Interactive Deployment Guide
 * ============================
 * 
 * A step-by-step walkthrough for deploying this template.
 * Designed for junior developers with explanations for each step.
 * 
 * Features:
 * - Progress tracking (saves to localStorage)
 * - Glossary tooltips for jargon
 * - Checklists to confirm understanding
 * - Copy buttons for commands
 * - Personalized code blocks based on user inputs
 * - Environment variable generator
 * - One-command setup scripts
 * - Time-saved summary
 * 
 * =============================================================================
 * REMOVING THIS FEATURE
 * =============================================================================
 * Once you've deployed your app and no longer need this guide:
 * 
 * 1. Hide the banner: Set `showDeployBanner: false` in lib/site-config.ts
 * 2. Delete this folder: Remove the entire app/deploy/ directory
 * 
 * That's it! The /deploy route will 404 and the banner disappears.
 * =============================================================================
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/site-config'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

// Section data structure
type Section = {
  id: number
  title: string
  time: string
  content: React.ReactNode
}

// Glossary terms
const glossary: Record<string, string> = {
  'OAuth': 'Open Authorization - lets users log in with existing accounts (Google, GitHub) without you storing their password',
  'SSH': 'Secure Shell - a way to securely connect to and control a remote server from your terminal',
  'Droplet': 'DigitalOcean\'s name for a virtual server - a computer in the cloud that runs 24/7',
  'PM2': 'A process manager that keeps your app running, restarts it if it crashes, and handles logs',
  'Nginx': 'Software that routes web traffic to your app and handles HTTPS',
  'SSL': 'The padlock in your browser - encrypts data between users and your app',
  'PostgreSQL': 'A powerful, free database for storing your app\'s data in production',
  'SQLite': 'A simple file-based database, perfect for local development',
  'ngrok': 'Creates a public URL for your local dev server so you can test on your phone',
}

// Term component with tooltip
function Term({ children }: { children: string }) {
  const definition = glossary[children]
  if (!definition) return <span>{children}</span>
  
  return (
    <span className="border-b border-dashed border-primary cursor-help relative group">
      {children}
      <span className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {definition}
      </span>
    </span>
  )
}

// Copy button component - with label option
function CopyButton({ text, label = "Copy", size = "sm" }: { text: string; label?: string; size?: "sm" | "lg" }) {
  const [copied, setCopied] = useState(false)
  
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button 
      onClick={copy}
      className={cn(
        "transition-all duration-200",
        size === "lg" 
          ? "px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium"
          : "mt-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded text-sm",
        copied && "bg-green-500 text-white hover:bg-green-500"
      )}
    >
      {copied ? '✓ Copied!' : `📋 ${label}`}
    </button>
  )
}

// Copy button for one-liner commands
function OneLinerCopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button 
      onClick={copy}
      className={cn(
        "mt-2 px-4 py-2 rounded-lg text-sm transition-colors",
        copied 
          ? "bg-green-500 text-white" 
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {copied ? '✓ Copied!' : label}
    </button>
  )
}

// Download button for .env files
function DownloadEnvButton({ content, filename = ".env.local" }: { content: string; filename?: string }) {
  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <button 
      onClick={download}
      className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
    >
      📥 Download {filename}
    </button>
  )
}

// Code block component
function Code({ children, copyable = true }: { children: string, copyable?: boolean }) {
  return (
    <div>
      <pre className="bg-background p-4 rounded-lg overflow-x-auto my-3 text-sm">
        <code>{children}</code>
      </pre>
      {copyable && <CopyButton text={children} />}
    </div>
  )
}

// One-liner code block with copy button
function OneLiner({ children, label = "Copy" }: { children: string; label?: string }) {
  return (
    <div className="my-3">
      <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
      <OneLinerCopyButton text={children} label={label} />
    </div>
  )
}

// Explainer box
function Explainer({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-6">
      <div className="font-semibold text-primary text-sm uppercase tracking-wide mb-2">{title}</div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  )
}

// Step component
function Step({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6 pl-4 border-l-2 border-border">
      <div className="font-semibold mb-2">{title}</div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  )
}

// Warning box
function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg my-4">
      <div className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">Common Issue</div>
      {children}
    </div>
  )
}

// Success box
function Important({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg my-4">
      <div className="font-semibold text-green-600 dark:text-green-400 mb-1">Important</div>
      {children}
    </div>
  )
}

// Checkbox item
function CheckItem({ children, checked, onChange }: { 
  children: React.ReactNode
  checked: boolean
  onChange: () => void 
}) {
  return (
    <label className={cn(
      "flex items-start gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
      checked && "opacity-60 line-through"
    )}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 mt-0.5"
      />
      <span>{children}</span>
    </label>
  )
}

// Input field component
function InputField({ label, value, onChange, placeholder, type = "text" }: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
      />
    </div>
  )
}

export default function DeployGuidePage() {
  const [completedSections, setCompletedSections] = useState<number[]>([])
  const [currentSection, setCurrentSection] = useState(1)
  const [openSection, setOpenSection] = useState(1)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  
  // User inputs for personalization
  const [githubUsername, setGithubUsername] = useState('')
  const [repoName, setRepoName] = useState('')
  const [googleClientId, setGoogleClientId] = useState('')
  const [googleClientSecret, setGoogleClientSecret] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminName, setAdminName] = useState('')
  const [ngrokDomain, setNgrokDomain] = useState('')
  const [prodDomain, setProdDomain] = useState('')
  const [dropletIp, setDropletIp] = useState('')
  const [dbConnectionString, setDbConnectionString] = useState('')
  const [nextAuthSecret, setNextAuthSecret] = useState('')
  
  // Detect if running locally (for smart Section 1 content)
  const [isLocalhost, setIsLocalhost] = useState(true) // Default true for SSR
  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    )
  }, [])
  
  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('deployGuideProgress')
    if (saved) {
      const data = JSON.parse(saved)
      setCompletedSections(data.completedSections || [])
      setCurrentSection(data.currentSection || 1)
      setOpenSection(data.currentSection || 1)
      setCheckedItems(data.checkedItems || {})
      setGithubUsername(data.githubUsername || '')
      setRepoName(data.repoName || '')
      setGoogleClientId(data.googleClientId || '')
      setGoogleClientSecret(data.googleClientSecret || '')
      setAdminEmail(data.adminEmail || '')
      setAdminName(data.adminName || '')
      setNgrokDomain(data.ngrokDomain || '')
      setProdDomain(data.prodDomain || '')
      setDropletIp(data.dropletIp || '')
      setDbConnectionString(data.dbConnectionString || '')
      setNextAuthSecret(data.nextAuthSecret || '')
    }
  }, [])
  
  // Save progress
  useEffect(() => {
    localStorage.setItem('deployGuideProgress', JSON.stringify({
      completedSections,
      currentSection,
      checkedItems,
      githubUsername,
      repoName,
      googleClientId,
      googleClientSecret,
      adminEmail,
      adminName,
      ngrokDomain,
      prodDomain,
      dropletIp,
      dbConnectionString,
      nextAuthSecret,
    }))
  }, [completedSections, currentSection, checkedItems, githubUsername, repoName, googleClientId, googleClientSecret, adminEmail, adminName, ngrokDomain, prodDomain, dropletIp, dbConnectionString, nextAuthSecret])
  
  const completeSection = (num: number) => {
    if (!completedSections.includes(num)) {
      setCompletedSections([...completedSections, num])
    }
    setCurrentSection(num + 1)
    setOpenSection(num + 1)
    
    setTimeout(() => {
      document.getElementById(`section-${num + 1}`)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
  
  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }
  
  const resetProgress = () => {
    localStorage.removeItem('deployGuideProgress')
    setCompletedSections([])
    setCurrentSection(1)
    setOpenSection(1)
    setCheckedItems({})
    setGithubUsername('')
    setRepoName('')
    setGoogleClientId('')
    setGoogleClientSecret('')
    setAdminEmail('')
    setAdminName('')
    setNgrokDomain('')
    setProdDomain('')
    setDropletIp('')
    setDbConnectionString('')
    setNextAuthSecret('')
  }
  
  // Generate NEXTAUTH_SECRET
  const generateSecret = () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const secret = btoa(String.fromCharCode.apply(null, Array.from(array)))
    setNextAuthSecret(secret)
  }
  
  const totalSections = 8
  const progress = (completedSections.length / totalSections) * 100
  const isComplete = completedSections.length === totalSections
  
  // Helper to get personalized values with fallbacks
  const gh = githubUsername || 'YOUR_USERNAME'
  const repo = repoName || 'YOUR_REPO'
  const domain = prodDomain || 'yourdomain.com'
  const ip = dropletIp || 'YOUR_DROPLET_IP'

  // Section definitions
  const sections: Section[] = [
    {
      id: 1,
      title: '💻 Local Development Setup',
      time: isLocalhost ? 'Done!' : '~5 min',
      content: isLocalhost ? (
        // LOCALHOST: User ran npm run setup and is here
        <>
          <Important>
            <p>✅ You&apos;re here because <code>npm run setup</code> worked! Dependencies installed, database ready, dev server running.</p>
          </Important>
          
          <Explainer title="What just happened">
            The setup command already did everything needed for local development:
          </Explainer>
          
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-500">
              <span>✓</span> <span>Dependencies installed</span>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <span>✓</span> <span>Environment file created (.env.local)</span>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <span>✓</span> <span>Database set up (SQLite for development)</span>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <span>✓</span> <span>Dev server running at localhost:3000</span>
            </div>
          </div>
          
          <p className="mt-4 text-muted-foreground">
            Next step: Set up Google OAuth so you can sign in.
          </p>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['1-setup']} onChange={() => toggleCheck('1-setup')}>
              Setup complete — ready for Google OAuth
            </CheckItem>
          </div>
        </>
      ) : (
        // PRODUCTION: Visitor considering the template
        <>
          <Explainer title="What you&apos;re doing">
            Getting this template running on your computer. This guide is designed for <strong>Cursor</strong>, an AI-powered code editor.
          </Explainer>
          
          <Step title="1. Install prerequisites">
            <div className="space-y-3">
              <div>
                <a 
                  href="https://cursor.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Download Cursor →
                </a>
                <p className="text-sm text-muted-foreground mt-2">AI-powered code editor (free)</p>
              </div>
              <div>
                <a 
                  href="https://nodejs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Download Node.js →
                </a>
                <p className="text-sm text-muted-foreground mt-2">JavaScript runtime (use LTS version)</p>
              </div>
            </div>
          </Step>
          
          <Step title="2. Clone this template in Cursor">
            <ol className="list-decimal ml-4 space-y-2 text-sm">
              <li>Open <strong>Cursor</strong></li>
              <li>Press <code className="bg-muted px-1.5 py-0.5 rounded">Cmd+Shift+P</code> (Mac) or <code className="bg-muted px-1.5 py-0.5 rounded">Ctrl+Shift+P</code> (Windows)</li>
              <li>Type <strong>&quot;Git: Clone&quot;</strong> and select it</li>
              <li>Paste this URL:</li>
            </ol>
            <Code>https://github.com/hrosenblume/next-cursor</Code>
            <ol className="list-decimal ml-4 space-y-2 text-sm mt-2" start={5}>
              <li>Choose where to save it (e.g., Desktop)</li>
              <li>Click <strong>Open</strong> when prompted</li>
            </ol>
          </Step>
          
          <Step title="3. Run the setup">
            <ol className="list-decimal ml-4 space-y-2 text-sm">
              <li>Open the terminal: Press <code className="bg-muted px-1.5 py-0.5 rounded">Ctrl+`</code> (backtick key)</li>
              <li>Run this command:</li>
            </ol>
            <Code>npm run setup</Code>
            <p className="mt-2 text-sm">This installs dependencies, creates your config, and opens this guide at localhost:3000/deploy</p>
          </Step>
          
          <div className="bg-muted/50 rounded-lg p-4 mt-6">
            <p className="font-medium mb-2">💡 Cursor Basics</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><code className="bg-background px-1 rounded">Ctrl+`</code></div>
              <div className="text-muted-foreground">Open terminal</div>
              <div><code className="bg-background px-1 rounded">Cmd/Ctrl+K</code></div>
              <div className="text-muted-foreground">Ask AI for help</div>
              <div><code className="bg-background px-1 rounded">Cmd/Ctrl+L</code></div>
              <div className="text-muted-foreground">Chat with AI about code</div>
              <div><code className="bg-background px-1 rounded">Cmd/Ctrl+P</code></div>
              <div className="text-muted-foreground">Search files</div>
            </div>
          </div>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['1-cursor']} onChange={() => toggleCheck('1-cursor')}>
              Installed Cursor and Node.js
            </CheckItem>
            <CheckItem checked={!!checkedItems['1-clone']} onChange={() => toggleCheck('1-clone')}>
              Cloned the template
            </CheckItem>
            <CheckItem checked={!!checkedItems['1-setup']} onChange={() => toggleCheck('1-setup')}>
              Ran <code>npm run setup</code> successfully
            </CheckItem>
          </div>
        </>
      ),
    },
    {
      id: 2,
      title: '🔐 Google Login Setup',
      time: '~5 min',
      content: (
        <>
          <Explainer title="What you're doing">
            Setting up &quot;Sign in with Google&quot; so users can log in with their Google account.
            This is called <Term>OAuth</Term>.
          </Explainer>
          
          <Step title="1. Create Google OAuth credentials">
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Open Google Cloud Console →
            </a>
            <ol className="list-decimal ml-4 mt-4 space-y-2 text-sm">
              <li>Create a new project (or select existing)</li>
              <li>Go to <strong>APIs &amp; Services → OAuth consent screen</strong></li>
              <li>Select &quot;External&quot; → Fill in app name &amp; your email</li>
              <li>Go to <strong>Credentials → Create Credentials → OAuth client ID</strong></li>
              <li>Select &quot;Web application&quot;</li>
              <li>Add these redirect URIs:</li>
            </ol>
            <Code>http://localhost:3000/api/auth/callback/google</Code>
          </Step>
          
          <Step title="2. Fill in your credentials">
            <p className="mb-4">Enter your values and we&apos;ll generate your .env.local:</p>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <InputField
                label="Google Client ID"
                value={googleClientId}
                onChange={setGoogleClientId}
                placeholder="123456789-abc.apps.googleusercontent.com"
              />
              <InputField
                label="Google Client Secret"
                value={googleClientSecret}
                onChange={setGoogleClientSecret}
                placeholder="GOCSPX-..."
                type="password"
              />
              <InputField
                label="Your Email (becomes admin)"
                value={adminEmail}
                onChange={setAdminEmail}
                placeholder="you@example.com"
                type="email"
              />
              <InputField
                label="Your Name"
                value={adminName}
                onChange={setAdminName}
                placeholder="Your Name"
              />
            </div>
            
            {(googleClientId || googleClientSecret || adminEmail) && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Copy this to your <code className="bg-muted px-1 rounded">.env.local</code> file in Cursor (open it with <code className="bg-muted px-1 rounded">Cmd/Ctrl+P</code> → type &quot;.env.local&quot;):</p>
                <Code>{`GOOGLE_CLIENT_ID=${googleClientId || 'your-client-id'}
GOOGLE_CLIENT_SECRET=${googleClientSecret || 'your-client-secret'}
ADMIN_EMAIL=${adminEmail || 'you@example.com'}
ADMIN_NAME=${adminName || 'Your Name'}`}</Code>
              </div>
            )}
          </Step>
          
          <Step title="3. Restart and test">
            <p className="mb-2">After updating .env.local, restart the dev server in Cursor&apos;s terminal:</p>
            <ol className="list-decimal ml-4 space-y-2 text-sm">
              <li>Press <code className="bg-muted px-1.5 py-0.5 rounded">Ctrl+C</code> in Cursor&apos;s terminal to stop the server</li>
              <li>Run this command:</li>
            </ol>
            <Code>npm run db:seed && npm run dev</Code>
            <ol className="list-decimal ml-4 space-y-2 text-sm mt-2" start={3}>
              <li>Open <a href="http://localhost:3000/admin" target="_blank" className="text-primary hover:underline">localhost:3000/admin</a> to test sign-in!</li>
            </ol>
          </Step>
          
          <Warning>
            <ul className="list-disc ml-4 space-y-1 text-sm">
              <li><strong>&quot;redirect_uri_mismatch&quot;</strong> → Check redirect URIs match exactly</li>
              <li><strong>&quot;Access blocked&quot;</strong> → Select &quot;External&quot; in consent screen</li>
            </ul>
          </Warning>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['2-oauth']} onChange={() => toggleCheck('2-oauth')}>
              Created OAuth credentials in Google Cloud
            </CheckItem>
            <CheckItem checked={!!checkedItems['2-env']} onChange={() => toggleCheck('2-env')}>
              Added credentials to .env.local
            </CheckItem>
            <CheckItem checked={!!checkedItems['2-signin']} onChange={() => toggleCheck('2-signin')}>
              Can sign in at <a href="http://localhost:3000/admin" target="_blank" className="text-primary hover:underline">localhost:3000/admin</a>
            </CheckItem>
          </div>
        </>
      ),
    },
    {
      id: 3,
      title: '📱 Mobile Testing (Optional)',
      time: '~5 min',
      content: (
        <>
          <Explainer title="What you're doing">
            <Term>ngrok</Term> lets you test on your phone before deploying. Your app stays on your computer, 
            but ngrok creates a public URL your phone can reach.
          </Explainer>
          
          <Step title="1. Get a free ngrok domain">
            <a 
              href="https://dashboard.ngrok.com/cloud-edge/domains" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get ngrok Domain →
            </a>
            <p className="mt-2 text-sm">Sign up (free) → Cloud Edge → Domains → Reserve a domain</p>
          </Step>
          
          <Step title="2. Add to your environment">
            <InputField
              label="Your ngrok domain"
              value={ngrokDomain}
              onChange={setNgrokDomain}
              placeholder="your-app.ngrok.dev"
            />
            {ngrokDomain && (
              <div className="mt-2">
                <p className="text-sm mb-2">Add these lines to your <code className="bg-muted px-1 rounded">.env.local</code> file in Cursor:</p>
                <Code>{`NGROK_DOMAIN=${ngrokDomain}
NGROK_OAUTH_EMAIL=${adminEmail || 'you@example.com'}`}</Code>
              </div>
            )}
          </Step>
          
          <Step title="3. Add ngrok redirect URI to Google">
            <p>In Google Cloud Console → Credentials → Your OAuth client, add:</p>
            <Code>{`https://${ngrokDomain || 'your-domain.ngrok.dev'}/api/auth/callback/google`}</Code>
          </Step>
          
          <Step title="4. Run with tunnel">
            <p className="mb-2">In Cursor&apos;s terminal, run:</p>
            <Code>npm run dev:tunnel</Code>
            <p className="mt-3 mb-2">Then on your phone:</p>
            <ol className="list-decimal ml-4 space-y-2 text-sm">
              <li>Open your phone&apos;s browser (Safari or Chrome)</li>
              <li>Go to: <code className="bg-muted px-2 py-0.5 rounded">{ngrokDomain ? `https://${ngrokDomain}` : 'https://your-domain.ngrok.dev'}</code></li>
              <li>You&apos;ll see your app running — test sign in, navigation, etc.</li>
            </ol>
            <p className="mt-3 text-sm text-muted-foreground">
              The tunnel stays active as long as the terminal is running. Press Ctrl+C to stop.
            </p>
          </Step>
        </>
      ),
    },
    {
      id: 4,
      title: '☁️ Create Your Server',
      time: '~15 min',
      content: (
        <>
          <Explainer title="What you're doing">
            A <Term>Droplet</Term> is a virtual computer in the cloud that runs 24/7.
            DigitalOcean is beginner-friendly (~$6/month).
          </Explainer>
          
          <Step title="1. Generate an SSH key (if you don&apos;t have one)">
            <p className="mb-2">In Cursor&apos;s terminal (<code className="bg-muted px-1 rounded">Ctrl+`</code>), check if you have an SSH key:</p>
            <Code>cat ~/.ssh/id_ed25519.pub</Code>
            <p className="mt-2 text-sm">If you see a key starting with <code className="bg-muted px-1 rounded">ssh-ed25519</code>, skip to step 2.</p>
            <p className="mt-3 mb-2">If you get &quot;No such file&quot;, create a new key in Cursor&apos;s terminal:</p>
            <Code>ssh-keygen -t ed25519 -C &quot;your-email@example.com&quot;</Code>
            <p className="mt-2 text-sm text-muted-foreground">Press Enter 3 times to accept defaults (no passphrase is fine for now).</p>
            <p className="mt-2 mb-2">Then copy your public key (still in Cursor&apos;s terminal):</p>
            <Code>cat ~/.ssh/id_ed25519.pub</Code>
          </Step>
          
          <Step title="2. Create a DigitalOcean droplet">
            <a 
              href="https://cloud.digitalocean.com/droplets/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Droplet →
            </a>
            <ul className="list-disc ml-4 mt-3 space-y-1 text-sm">
              <li>Choose <strong>Ubuntu 22.04</strong></li>
              <li>Basic plan: <strong>$6/mo</strong> (1GB) or <strong>$12/mo</strong> (2GB)</li>
              <li>Under <strong>Authentication</strong> → select <strong>SSH keys</strong></li>
              <li>Click <strong>New SSH Key</strong> → paste the key you copied above</li>
            </ul>
          </Step>
          
          <Step title="3. Save your droplet IP">
            <InputField
              label="Droplet IP Address"
              value={dropletIp}
              onChange={setDropletIp}
              placeholder="123.456.789.0"
            />
          </Step>
          
          <Step title="4. Connect to your server">
            <p className="mb-2">In Cursor&apos;s terminal (<code className="bg-muted px-1 rounded">Ctrl+`</code>), SSH into your server:</p>
            <OneLiner label="Copy SSH command">{`ssh root@${ip}`}</OneLiner>
            
            <Warning>
              <p className="text-sm"><strong>First time?</strong> Type <code className="bg-muted px-1 rounded">yes</code> when asked about fingerprint.</p>
            </Warning>
          </Step>
          
          <Step title="5. Run the setup script">
            <p className="mb-2"><strong>On the server</strong> (you should see <code className="bg-muted px-1 rounded">root@your-droplet:~#</code>), paste this command:</p>
            <OneLiner label="Copy setup command">{`curl -fsSL https://raw.githubusercontent.com/${gh}/${repo}/main/scripts/setup-server.sh | bash`}</OneLiner>
            
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="font-medium mb-2">This script installs:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Node.js 20 (runs your app)</li>
                <li>• nginx (web server)</li>
                <li>• PM2 (keeps your app running)</li>
                <li>• SSH key (so GitHub can connect)</li>
              </ul>
            </div>
            
            <Important>
              <p>When the script finishes, it shows a key starting with <code className="bg-muted px-1 rounded">ssh-ed25519</code>. Copy this entire key — you need it for the next step.</p>
            </Important>
          </Step>
          
          <Step title="6. Add deploy key to GitHub">
            <p className="mb-3">Copy the key from the script and add it here:</p>
            <a 
              href={`https://github.com/${gh}/${repo}/settings/keys/new`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Deploy Key on GitHub →
            </a>
            <p className="mt-2 text-sm text-muted-foreground">Check &quot;Allow write access&quot; when adding.</p>
          </Step>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['4-droplet']} onChange={() => toggleCheck('4-droplet')}>
              Created DigitalOcean droplet
            </CheckItem>
            <CheckItem checked={!!checkedItems['4-script']} onChange={() => toggleCheck('4-script')}>
              Ran setup script on server
            </CheckItem>
            <CheckItem checked={!!checkedItems['4-deploy-key']} onChange={() => toggleCheck('4-deploy-key')}>
              Added deploy key to GitHub
            </CheckItem>
          </div>
        </>
      ),
    },
    {
      id: 5,
      title: '🗄️ Set Up Database',
      time: '~8 min',
      content: (
        <>
          <Explainer title="What you're doing">
            Production needs <Term>PostgreSQL</Term> for reliability. DigitalOcean Managed Database 
            handles backups and updates automatically.
          </Explainer>
          
          <Step title="1. Create PostgreSQL database">
            <a 
              href="https://cloud.digitalocean.com/databases/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Database →
            </a>
            <ul className="list-disc ml-4 mt-3 space-y-1 text-sm">
              <li>Choose <strong>PostgreSQL</strong></li>
              <li>Same region as your droplet</li>
              <li>Basic plan ($15/mo) is fine to start</li>
            </ul>
          </Step>
          
          <Step title="2. Get connection string">
            <p>Once created, go to Connection Details and copy the connection string.</p>
            <InputField
              label="Database Connection String"
              value={dbConnectionString}
              onChange={setDbConnectionString}
              placeholder="postgresql://user:pass@host:25060/defaultdb?sslmode=require"
            />
          </Step>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['5-db']} onChange={() => toggleCheck('5-db')}>
              Created PostgreSQL database
            </CheckItem>
            <CheckItem checked={!!checkedItems['5-string']} onChange={() => toggleCheck('5-string')}>
              Copied connection string
            </CheckItem>
          </div>
        </>
      ),
    },
    {
      id: 6,
      title: '🚀 Deploy Your App',
      time: '~10 min',
      content: (
        <>
          <Explainer title="What you're doing">
            Uploading code to the server and getting it running. After this, your app is live!
          </Explainer>
          
          <Step title="1. Generate NEXTAUTH_SECRET">
            <p className="mb-2">Click to generate a secure secret:</p>
            <div className="flex gap-2 items-center">
              <Button onClick={generateSecret} variant="outline" size="sm">
                Generate Secret
              </Button>
              {nextAuthSecret && (
                <span className="text-green-500 text-sm">✓ Generated</span>
              )}
            </div>
            {nextAuthSecret && (
              <div className="mt-2">
                <code className="text-xs break-all bg-background p-2 rounded block">{nextAuthSecret}</code>
              </div>
            )}
          </Step>
          
          <Step title="2. Your production .env.local">
            <p className="mb-3">Your environment file (auto-generated from your inputs):</p>
            <Code copyable={false}>{`DATABASE_URL_PROD="${dbConnectionString || 'postgresql://your-connection-string'}"
NEXTAUTH_SECRET="${nextAuthSecret || 'click-generate-secret-above'}"
GOOGLE_CLIENT_ID=${googleClientId || 'your-client-id'}
GOOGLE_CLIENT_SECRET=${googleClientSecret || 'your-client-secret'}
NEXT_PUBLIC_SITE_URL=https://${domain}
ADMIN_EMAIL=${adminEmail || 'you@example.com'}
ADMIN_NAME=${adminName || 'Your Name'}`}</Code>
            <div className="flex gap-3 mt-3">
              <DownloadEnvButton 
                content={`DATABASE_URL_PROD="${dbConnectionString || 'postgresql://your-connection-string'}"
NEXTAUTH_SECRET="${nextAuthSecret || 'click-generate-secret-above'}"
GOOGLE_CLIENT_ID=${googleClientId || 'your-client-id'}
GOOGLE_CLIENT_SECRET=${googleClientSecret || 'your-client-secret'}
NEXT_PUBLIC_SITE_URL=https://${domain}
ADMIN_EMAIL=${adminEmail || 'you@example.com'}
ADMIN_NAME=${adminName || 'Your Name'}`}
                filename="env.production.txt"
              />
              <CopyButton 
                text={`DATABASE_URL_PROD="${dbConnectionString || 'postgresql://your-connection-string'}"
NEXTAUTH_SECRET="${nextAuthSecret || 'click-generate-secret-above'}"
GOOGLE_CLIENT_ID=${googleClientId || 'your-client-id'}
GOOGLE_CLIENT_SECRET=${googleClientSecret || 'your-client-secret'}
NEXT_PUBLIC_SITE_URL=https://${domain}
ADMIN_EMAIL=${adminEmail || 'you@example.com'}
ADMIN_NAME=${adminName || 'Your Name'}`}
                label="Copy to Clipboard"
                size="lg"
              />
            </div>
          </Step>
          
          <Step title="3. Clone and deploy on server">
            <p className="mb-2">In Cursor&apos;s terminal, SSH into your server:</p>
            <Code>{`ssh root@${ip}`}</Code>
            
            <p className="mt-4 mb-2"><strong>On the server</strong>, clone the repo and create the env file:</p>
            <OneLiner label="Copy clone command">{`cd /var/www && git clone git@github.com:${gh}/${repo}.git app && cd app && nano .env.local`}</OneLiner>
            
            <div className="bg-muted/50 rounded-lg p-3 my-3 text-sm">
              <p className="font-medium mb-1">📝 In nano (on the server):</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Paste the .env.local content from Step 2</li>
                <li>Press <code className="bg-background px-1 rounded">Ctrl+X</code> → <code className="bg-background px-1 rounded">Y</code> → <code className="bg-background px-1 rounded">Enter</code></li>
              </ol>
            </div>
            
            <p className="mb-2"><strong>Still on the server</strong>, build and start the app:</p>
            <OneLiner label="Copy build commands">{`npm install && npm run db:push:prod && npm run db:seed:prod && npm run build:prod && pm2 start ecosystem.config.js && pm2 save && pm2 startup`}</OneLiner>
          </Step>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['6-clone']} onChange={() => toggleCheck('6-clone')}>
              Cloned repo to /var/www/app
            </CheckItem>
            <CheckItem checked={!!checkedItems['6-env']} onChange={() => toggleCheck('6-env')}>
              Created .env.local with production values
            </CheckItem>
            <CheckItem checked={!!checkedItems['6-running']} onChange={() => toggleCheck('6-running')}>
              App is running with PM2
            </CheckItem>
          </div>
        </>
      ),
    },
    {
      id: 7,
      title: '🌐 Connect Domain + HTTPS',
      time: '~15 min',
      content: (
        <>
          <Explainer title="What you're doing">
            <Term>Nginx</Term> routes traffic to your app. <Term>SSL</Term> adds the security padlock.
          </Explainer>
          
          <Step title="1. Enter your domain">
            <InputField
              label="Your Production Domain"
              value={prodDomain}
              onChange={setProdDomain}
              placeholder="myapp.com"
            />
          </Step>
          
          <Step title="2. Configure nginx">
            <p className="mb-2"><strong>On the server</strong> (SSH in if you&apos;re not already connected), create the nginx config:</p>
            <Code>sudo nano /etc/nginx/sites-available/app</Code>
            <p className="mt-4 mb-2">Paste this config (already customized with your domain):</p>
            <Code>{`server {
    listen 80;
    server_name ${domain} www.${domain};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`}</Code>
          </Step>
          
          <Step title="3. Point DNS to your server">
            <p className="mb-2">In your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.), add these A records:</p>
            <div className="bg-background p-4 rounded-lg mt-2 font-mono text-sm">
              <div>Type: A &nbsp;&nbsp; Name: @ &nbsp;&nbsp;&nbsp;&nbsp; Value: {ip}</div>
              <div>Type: A &nbsp;&nbsp; Name: www &nbsp; Value: {ip}</div>
            </div>
            <Warning>
              <p className="text-sm"><strong>DNS takes time to propagate.</strong> Wait 5-30 minutes before the next step. You can check if it&apos;s ready at <a href={`https://dnschecker.org/#A/${domain}`} target="_blank" className="underline">dnschecker.org</a></p>
            </Warning>
          </Step>
          
          <Step title="4. Enable nginx and install SSL">
            <p className="mb-2">After DNS is pointing to your server, run these commands <strong>on the server</strong>:</p>
            <Code>{`# Enable your site config
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate (this needs DNS to be working)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ${domain} -d www.${domain}

# Enable firewall (keeps port 22 open for SSH)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable`}</Code>
            <p className="text-sm text-muted-foreground mt-2">If certbot fails, wait longer for DNS and try again.</p>
          </Step>
          
          <Step title="5. Add production redirect URI to Google">
            <p>In Google Cloud Console → Credentials, add:</p>
            <Code>{`https://${domain}/api/auth/callback/google`}</Code>
          </Step>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['7-nginx']} onChange={() => toggleCheck('7-nginx')}>
              Configured nginx
            </CheckItem>
            <CheckItem checked={!!checkedItems['7-ssl']} onChange={() => toggleCheck('7-ssl')}>
              Installed SSL certificate
            </CheckItem>
            <CheckItem checked={!!checkedItems['7-dns']} onChange={() => toggleCheck('7-dns')}>
              Updated DNS records
            </CheckItem>
            <CheckItem checked={!!checkedItems['7-google']} onChange={() => toggleCheck('7-google')}>
              Added production redirect URI to Google
            </CheckItem>
          </div>
        </>
      ),
    },
    {
      id: 8,
      title: '⚡ Automatic Deployments',
      time: '~5 min',
      content: (
        <>
          <Explainer title="What you're doing">
            GitHub Actions will automatically deploy when you push to main. No more manual deployments!
          </Explainer>
          
          <Step title="1. Save your GitHub info">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="GitHub Username"
                value={githubUsername}
                onChange={setGithubUsername}
                placeholder="yourusername"
              />
              <InputField
                label="Repo Name"
                value={repoName}
                onChange={setRepoName}
                placeholder="your-repo"
              />
            </div>
          </Step>
          
          <Step title="2. Get your SSH private key">
            <p className="mb-2">Run this in Cursor&apos;s terminal (on your computer, not the server):</p>
            <OneLiner label="Copy command">{`cat ~/.ssh/id_ed25519`}</OneLiner>
            <p className="text-sm text-muted-foreground">Copy the ENTIRE output including the <code className="bg-muted px-1 rounded">-----BEGIN</code> and <code className="bg-muted px-1 rounded">-----END</code> lines.</p>
            
            <Explainer title="What is this for?">
              This is the same SSH key you used to create the DigitalOcean droplet. GitHub Actions will use it to connect to your server and run deploy commands automatically.
            </Explainer>
          </Step>
          
          <Step title="3. Add GitHub secrets">
            <p className="mb-3">Add these three secrets:</p>
            <a 
              href={`https://github.com/${gh}/${repo}/settings/secrets/actions/new`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add GitHub Secret →
            </a>
            <div className="bg-muted/50 p-4 rounded-lg mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div><code className="font-bold">DO_HOST</code> = <span className="text-muted-foreground">{ip || 'your-droplet-ip'}</span></div>
                <CopyButton text={ip || 'YOUR_IP'} label="Copy" />
              </div>
              <div className="flex justify-between items-center">
                <div><code className="font-bold">DO_USER</code> = <span className="text-muted-foreground">root</span></div>
                <CopyButton text="root" label="Copy" />
              </div>
              <div>
                <code className="font-bold">DO_SSH_KEY</code> = <span className="text-muted-foreground">(paste your private key from step 2)</span>
              </div>
            </div>
          </Step>
          
          <Step title="4. Test auto-deploy! 🎉">
            <p className="mb-2">In Cursor&apos;s terminal (on your computer), push any change to trigger deployment:</p>
            <OneLiner label="Copy git commands">{`git add -A && git commit -m "test auto-deploy" && git push origin main`}</OneLiner>
            <p className="mt-3">Watch it deploy:</p>
            <a 
              href={`https://github.com/${gh}/${repo}/actions`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
            >
              📺 Watch GitHub Actions →
            </a>
          </Step>
          
          <h3 className="font-semibold mt-6 mb-3">Checklist</h3>
          <div className="space-y-2">
            <CheckItem checked={!!checkedItems['8-secrets']} onChange={() => toggleCheck('8-secrets')}>
              Added all three GitHub secrets
            </CheckItem>
            <CheckItem checked={!!checkedItems['8-test']} onChange={() => toggleCheck('8-test')}>
              Tested auto-deploy
            </CheckItem>
          </div>
        </>
      ),
    },
  ]

  // Calculate total time
  const totalDeployTime = 63 // ~1 hour with this guide
  const manualDeployTime = 480 // ~8 hours without guide (first-timer researching everything)
  const hoursSaved = Math.round((manualDeployTime - totalDeployTime) / 60)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to {SITE.name}
            </Link>
            <button 
              onClick={resetProgress}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Reset Progress
            </button>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedSections.length} of {totalSections} complete</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Deploy Your Enterprise-Ready App</h1>
        <p className="text-muted-foreground mb-4">
          Step-by-step guide to get your Cursor project live. No prior deployment experience needed.
        </p>
        
        {/* Time estimate banner */}
        <div className="bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">⏱️ Time to deploy: ~1 hour</p>
              <p className="text-sm text-muted-foreground">Step-by-step, no experience needed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-500">~{hoursSaved} hours saved</p>
              <p className="text-xs text-muted-foreground">vs manual setup</p>
            </div>
          </div>
        </div>
        
        {/* What you're building */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold mb-3">What You&apos;re Building</h2>
          <p className="text-muted-foreground text-sm mb-4">
            This guide deploys your Cursor Next.js template using a battle-tested stack:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>DigitalOcean</strong> — Server hosting ($6-12/mo)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>PostgreSQL</strong> — Production database</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>GitHub Actions</strong> — Auto-deploy on push</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>PM2</strong> — Keeps your app running 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>Nginx + SSL</strong> — HTTPS &amp; routing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span><strong>ngrok</strong> — Mobile testing (optional)</span>
            </div>
          </div>
          
          <h3 className="font-semibold mt-6 mb-2">What You&apos;ll Get</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <code className="text-primary font-medium">localhost:3000</code>
              <span className="text-muted-foreground">— Development on your computer</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <code className="text-primary font-medium">*.ngrok.dev</code>
              <span className="text-muted-foreground">— Test on your phone (optional)</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <code className="text-primary font-medium">yourdomain.com</code>
              <span className="text-muted-foreground">— Production, live for everyone</span>
            </div>
          </div>
        </div>
        
        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isCompleted = completedSections.includes(section.id)
            const isCurrent = currentSection === section.id
            const isOpen = openSection === section.id
            
            return (
              <div 
                key={section.id}
                id={`section-${section.id}`}
                className={cn(
                  "border rounded-xl overflow-hidden transition-colors",
                  isCompleted ? "border-green-500/50 bg-green-500/5" : 
                  isCurrent ? "border-primary bg-card" : 
                  "border-border bg-card"
                )}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? 0 : section.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                    isCompleted ? "bg-green-500 text-white" :
                    isCurrent ? "bg-primary text-primary-foreground" :
                    "bg-muted"
                  )}>
                    {isCompleted ? '✓' : section.id}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{section.title}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{section.time}</div>
                  <div className={cn("transition-transform shrink-0", isOpen && "rotate-180")}>
                    ▼
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="pt-6">
                      {section.content}
                      
                      <div className="mt-8 flex gap-3">
                        {section.id > 1 && (
                          <Button 
                            variant="outline" 
                            onClick={() => setOpenSection(section.id - 1)}
                          >
                            ← Previous
                          </Button>
                        )}
                        {section.id === 3 ? (
                          <>
                            <Button variant="outline" onClick={() => completeSection(section.id)}>
                              Skip for now
                            </Button>
                            <Button onClick={() => completeSection(section.id)}>
                              Continue →
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => completeSection(section.id)}>
                            {section.id === totalSections ? 'Finish!' : 'Continue →'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Summary */}
        {isComplete && (
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-green-500/10 border border-primary/50">
            <h2 className="text-2xl font-bold mb-2">🎉 You&apos;re Live!</h2>
            <p className="text-muted-foreground mb-6">You saved approximately {hoursSaved} hours with this guide!</p>
            
            <h3 className="font-semibold mb-3">Your URLs</h3>
            <div className="space-y-3 mb-8">
              <div className="p-4 bg-background rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Local Development</span>
                  <code className="text-green-500">http://localhost:3000</code>
                </div>
                <p className="text-xs text-muted-foreground">
                  For coding &amp; testing. In Cursor: <code className="bg-muted px-1 rounded">Ctrl+`</code> then <code className="bg-muted px-1 rounded">npm run dev</code>
                </p>
              </div>
              
              {ngrokDomain && (
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Mobile Testing</span>
                    <code className="text-green-500">https://{ngrokDomain}</code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Test on your phone. In Cursor: <code className="bg-muted px-1 rounded">npm run dev:tunnel</code>
                  </p>
                </div>
              )}
              
              {prodDomain && (
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Production</span>
                    <a href={`https://${prodDomain}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                      https://{prodDomain}
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Live for everyone! Auto-deploys when you push to GitHub.
                  </p>
                </div>
              )}
            </div>
            
            <h3 className="font-semibold mb-3">Deploy Changes</h3>
            <p className="text-muted-foreground mb-3">Push to GitHub and your production site updates automatically via GitHub Actions:</p>
            <Code>{`git add -A
git commit -m "your changes"
git push origin main`}</Code>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/launch">
                <Button size="lg">Launch Your App →</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">Back to Home</Button>
              </Link>
              {prodDomain && (
                <a href={`https://${prodDomain}`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">View Live Site →</Button>
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
