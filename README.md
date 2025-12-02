# Cursor Next.js Template

The **standard Next.js enterprise template optimized for Cursor**, built for modern engineering teams at startups and enterprises.

This isn't just another starter template. It's a complete, production-ready foundation that handles all the infrastructure decisions so you can focus on building your product. Authentication, admin dashboards, deployment pipelines, staging environments—it's all here, pre-configured and ready to go.

We've done the heavy lifting. You bring the ideas.

---

## Why This Template?

Building a production Next.js app means solving the same problems every time: auth flows, user management, deployment scripts, environment handling, CI/CD pipelines. This template solves all of that out of the box.

**Built for Cursor.** Pre-configured rules and context files mean Cursor understands your codebase from day one. The AI knows your patterns, your conventions, and your architecture.

**Actually production-ready.** Not "production-ready" with asterisks. Real OAuth, real database migrations, real deployment guides for real infrastructure. SQLite for development, PostgreSQL for production—zero friction.

**Mobile-first testing.** ngrok tunnels with OAuth protection let you test on real devices without exposing your development environment to the world.

---

## Features

With this template, you get everything you need to ship:

- **Next.js 15** — App Router, React 19, server components, fast by default
- **Authentication** — NextAuth.js v5 with Google OAuth and role-based access control
- **Admin Dashboard** — User management with responsive table/card views
- **shadcn/ui** — Beautiful, accessible components ready to customize
- **Dark Mode** — System-aware theme switching with smooth transitions
- **Prisma ORM** — Type-safe database access with SQLite (dev) and PostgreSQL (prod)
- **Deployment Ready** — DigitalOcean, PM2, GitHub Actions CI/CD all configured
- **Mobile Testing** — ngrok tunnel setup for testing on real devices
- **Staging Environment** — Cloudflare Tunnel with access control
- **Cursor AI Integration** — Pre-configured rules and planning system
- **Health Checks** — Kubernetes-compatible endpoints for robust deployments

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS |
| Components | shadcn/ui |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Process Manager | PM2 |
| CI/CD | GitHub Actions |

---

## Quick Start

```bash
git clone https://github.com/yourusername/cursor-nextjs-template
cd cursor-nextjs-template
npm install
npm run dev   # http://localhost:3000
```

The app starts immediately with a landing page. To enable authentication:

1. Copy `.env.example` to `.env.local`
2. Add your Google OAuth credentials (see [Google OAuth Setup](#google-oauth-setup))
3. Run `npm run db:setup` to create the database and admin user

---

## Environment Variables

The app runs out of the box using defaults from `.env`. Copy `.env.example` to `.env.local` for secrets:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite path (has default) |
| `DATABASE_URL_PROD` | — | PostgreSQL connection string (production) |
| `NEXTAUTH_SECRET` | dev-only | Generate with `openssl rand -base64 32` for production |
| `GOOGLE_CLIENT_ID` | — | From Google Cloud Console (required for auth) |
| `GOOGLE_CLIENT_SECRET` | — | From Google Cloud Console (required for auth) |
| `NEXT_PUBLIC_SITE_URL` | Prod | Your production domain |
| `ADMIN_EMAIL` | Yes | Email for initial admin user |
| `ADMIN_NAME` | No | Name for initial admin user |
| `NGROK_DOMAIN` | No | For mobile testing |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Select **Web application**
6. Add these **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-ngrok-domain.ngrok.dev/api/auth/callback/google` (for mobile testing)
   - `https://yourdomain.com/api/auth/callback/google` (production)
   - `https://staging.yourdomain.com/api/auth/callback/google` (staging)
7. Copy the **Client ID** and **Client Secret** to `.env.local`

---

## Local Development

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run db:studio    # Open Prisma Studio GUI
npm run db:push      # Push schema changes to database
npm run db:seed      # Create/update admin user
```

---

## Mobile Testing with ngrok

Test on real mobile devices with a public URL:

### Setup

1. Create account at [ngrok.com](https://ngrok.com)
2. Reserve a static domain at **Cloud Edge → Domains**
3. Add to `.env.local`:
   ```
   NGROK_DOMAIN=your-domain.ngrok.dev
   NGROK_OAUTH_EMAIL=you@example.com
   ```
4. Add the ngrok callback URL to Google Cloud Console (see OAuth setup)

### Usage

```bash
npm run dev:tunnel
```

This starts:
- Next.js dev server on port 3000
- ngrok tunnel with Google OAuth protection

**How it works:** Two-layer authentication:
1. ngrok OAuth — Only allowed emails can access the tunnel
2. NextAuth — Only users in database can sign in to the app

---

## Production Deployment (DigitalOcean)

### 1. Create Droplet

- Ubuntu 22.04 or later
- At least 1GB RAM (2GB recommended)
- Install Node.js 20+ and PM2:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  sudo npm install -g pm2
  ```

### 2. Create PostgreSQL Database

- Create a **Managed PostgreSQL** in DigitalOcean
- Get connection string, add to `.env.local` as `DATABASE_URL_PROD`
- Format: `postgresql://user:pass@host:25060/defaultdb?sslmode=require`

### 3. Deploy Application

```bash
# Clone to server
cd /var/www
git clone https://github.com/yourusername/app.git

# Set up environment
cd app
cp .env.example .env.local
nano .env.local  # Add production values

# Initialize database
npm install
npm run db:push:prod
npm run db:seed:prod

# Build and start
npm run build:prod
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Auto-start on reboot
```

### 4. PM2 Commands

```bash
pm2 logs app-prod      # View logs
pm2 restart app-prod   # Restart app
pm2 monit              # Real-time monitoring
pm2 status             # Process status
```

---

## Staging with Cloudflare Tunnel

Expose staging without opening firewall ports, with built-in OAuth protection.

### Setup

1. Install cloudflared on your server:
   ```bash
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
   chmod +x cloudflared
   sudo mv cloudflared /usr/local/bin/
   ```

2. Create tunnel in [Cloudflare Zero Trust](https://one.dash.cloudflare.com/):
   - Go to **Access → Tunnels**
   - Create tunnel, copy the token
   - Configure: `localhost:3001` → `staging.yourdomain.com`

3. Set up Access policy:
   - Go to **Access → Applications**
   - Add application for your staging domain
   - Configure Google OAuth, allow specific emails

4. Run as service:
   ```bash
   sudo cloudflared service install <your-token>
   sudo systemctl enable cloudflared
   sudo systemctl start cloudflared
   ```

### Dual Deployment Structure

```
/var/www/app          → main branch → port 3000 (production)
/var/www/app-staging  → dev branch  → port 3001 (staging via Cloudflare)
```

---

## GitHub Actions CI/CD

Automatic deployment on push to `main` or `dev`.

### Required Secrets

Go to **Settings → Secrets → Actions** and add:

| Secret | Value |
|--------|-------|
| `DO_HOST` | Your droplet IP address |
| `DO_USER` | SSH username (usually `root`) |
| `DO_SSH_KEY` | Contents of your private SSH key |

### How It Works

1. Push to `main` → Deploys to production (`/var/www/app`)
2. Push to `dev` → Deploys to staging (`/var/www/app-staging`)

The workflow:
1. SSH into droplet
2. Pull latest code
3. Install dependencies
4. Generate Prisma client
5. Push database schema
6. Build application
7. Restart PM2 process

---

## Database Management

### Dual Schema Pattern

- `prisma/schema.prisma` — SQLite for local development
- `prisma/schema.postgresql.prisma` — PostgreSQL for production

### Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema to SQLite |
| `npm run db:push:prod` | Push schema to PostgreSQL |
| `npm run db:studio` | Open Prisma Studio (SQLite) |
| `npm run db:studio:prod` | Open Prisma Studio (PostgreSQL) |
| `npm run db:seed` | Seed admin user |
| `npm run db:setup` | Push schema + seed (first-time setup) |

---

## Project Structure

```
app/
├── api/                 # API routes
│   ├── admin/users/     # User CRUD
│   ├── auth/            # NextAuth
│   └── health/          # Health check
├── admin/               # Admin dashboard
├── auth/                # Sign-in pages
└── page.tsx             # Landing page

components/
├── admin/               # Admin components
├── ui/                  # shadcn/ui
└── [shared]             # ThemeToggle, Icons, etc.

lib/
├── auth.ts              # NextAuth config
├── db.ts                # Prisma client
├── site-config.ts       # Site content
└── utils/               # Helpers

.cursor/rules/           # Cursor AI context
plans/                   # Planning files
```

---

## Cursor AI Integration

This template includes pre-configured Cursor rules:

- `.cursor/rules/context.mdc` — Project architecture reference
- `.cursor/rules/rules.mdc` — Coding conventions

Update these files as your project evolves to keep Cursor's suggestions relevant.

---

## Planning System

Track tasks with the built-in planning files:

- `plans/Tomorrow.md` — Immediate tasks (use checkboxes)
- `plans/Future.md` — Long-term ideas and backlog

---

## Health Check

The `/api/health` endpoint returns server status:

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

Use for:
- Load balancer health checks
- Uptime monitoring
- Deployment verification

---

## Customization

### Add shadcn Components

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Extend User Model

1. Edit `prisma/schema.prisma` and `prisma/schema.postgresql.prisma`
2. Run `npm run db:push` (dev) or `npm run db:push:prod` (production)
3. Update TypeScript types as needed

### Add New Pages

1. Create file in `app/` directory (e.g., `app/about/page.tsx`)
2. Add to sitemap if public (`app/sitemap.ts`)
3. Update robots.txt if needed (`app/robots.ts`)

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run dev:tunnel` | Dev + ngrok for mobile testing |
| `npm run build` | Build (SQLite) |
| `npm run build:prod` | Build (PostgreSQL) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema (SQLite) |
| `npm run db:push:prod` | Push schema (PostgreSQL) |
| `npm run db:studio` | Prisma Studio (SQLite) |
| `npm run db:studio:prod` | Prisma Studio (PostgreSQL) |
| `npm run db:seed` | Seed admin user |
| `npm run db:setup` | Push schema + seed |

---

## License

MIT — See [LICENSE](LICENSE) for details.

