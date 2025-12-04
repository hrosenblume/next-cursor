# Next.js Cursor Template

The fastest way to build production-ready Next.js apps with AI.

A complete, production-ready foundation with authentication, admin dashboard, and deployment infrastructure—all optimized for [Cursor](https://cursor.com).

---

## 🚀 Getting Started (New to Cursor?)

This template is designed for **Cursor**, an AI-powered code editor. If you're new, follow these steps:

### Step 1: Install Prerequisites

1. **Cursor** — Download from [cursor.com](https://cursor.com) (free)
   - Install like any other app
   - Sign in with Google or GitHub when prompted

2. **Node.js** — Download from [nodejs.org](https://nodejs.org) (use the LTS version)
   - This lets you run JavaScript on your computer

### Step 2: Clone This Template in Cursor

1. Open **Cursor**
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) to open the Command Palette
3. Type **"Git: Clone"** and select it
4. Paste this URL:
   ```
   https://github.com/hrosenblume/next-cursor
   ```
5. Choose where to save it (e.g., Desktop)
6. Click **Open** when prompted

### Step 3: Run the Setup

1. Open the terminal in Cursor: Press `` Ctrl+` `` (backtick key, next to 1)
2. Type this command and press Enter:
   ```bash
   npm run setup
   ```
3. Follow the prompts!

### 💡 Cursor Basics

| What you want to do | How to do it |
|---------------------|--------------|
| Open terminal | Press `` Ctrl+` `` |
| Ask AI for help | Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) |
| Chat with AI about code | Press `Cmd+L` (Mac) or `Ctrl+L` (Windows) |
| Search files | Press `Cmd+P` (Mac) or `Ctrl+P` (Windows) |

**Pro tip:** Select any code and press `Cmd+K` to ask AI to explain, edit, or fix it!

---

## ⚡ Quick Start (Experienced Developers)

```bash
git clone https://github.com/hrosenblume/next-cursor && cd next-cursor && npm run setup
```

---

## 📦 What You Get

After setup, you'll have:

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Homepage | `localhost:3000` | Landing page with features |
| 🚀 Launch Wizard | `/launch` | Personalize template & generate build spec |
| 🔐 Sign In | `/auth/signin` | Google OAuth authentication |
| 👤 Admin Dashboard | `/admin` | Manage users and roles |
| 📦 Deploy Guide | `/deploy` | Interactive deployment walkthrough |

---

## ✨ Features

- **Next.js 15** — App Router, React 19, server components
- **Launch Wizard** — Personalize template, generate build specs for Cursor
- **Authentication** — Google OAuth with role-based access control
- **Admin Dashboard** — User management with responsive views
- **shadcn/ui** — Beautiful, accessible components
- **Dark Mode** — System-aware theme switching
- **Smart Deploy Banner** — Auto-hides once production is live
- **Deployment Ready** — DigitalOcean, GitHub Actions CI/CD
- **Mobile Testing** — ngrok tunnel for testing on real devices
- **Cursor AI Integration** — Pre-configured rules and context

---

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| `npm run setup` fails | Make sure Node.js is installed: run `node -v` in terminal |
| Can't sign in with Google | Check that `ADMIN_EMAIL` in `.env.local` matches your Google email |
| "Access Denied" after sign in | Run `npm run db:seed` to add yourself as admin |
| Port already in use | Kill the process: `lsof -ti:3000 \| xargs kill` |

---

## 🚀 Launch Wizard

Ready to build your own app? The Launch Wizard at `/launch` helps you:

1. **Personalize** — Enter your project name, tagline, and description
2. **Generate** — Creates `BUILD.md`, `README.md`, `site-config.ts`, and task lists
3. **Build** — Copy the generated Cursor prompt and let AI build your app

**How it works:**

```
Visit /launch → Fill in your app idea → Copy prompt → Paste into Cursor (Cmd+L)
```

The wizard also sets up deployment detection — a unique `APP_ID` that lets the deploy banner know when your production site is live.

---

## 🎯 Smart Deploy Banner

A green banner appears at the top of your app reminding you to deploy. It automatically:

- **Hides on `/deploy`** — You're already reading the guide
- **Hides in production** — End users never see it
- **Hides when deployed** — Detects when your production URL is live

**How detection works:**

1. The Launch Wizard generates a unique `APP_ID` in `.env.local`
2. The `/api/health` endpoint returns this ID
3. The banner checks if production returns the same ID
4. Match confirmed → banner disappears

No manual steps needed — deploy your app and the banner goes away automatically.

---

## 📚 Interactive Deploy Guide

New to deployment? We have an interactive walkthrough at `/deploy` that explains everything step-by-step.

**⏱️ Estimated time: ~45 minutes**

The guide covers:
- Local development setup
- Google OAuth configuration
- Mobile testing with ngrok
- DigitalOcean server creation
- PostgreSQL database setup
- Nginx + SSL configuration
- GitHub Actions auto-deploy

**Access:** Click the banner at the top of the homepage, or visit `localhost:3000/deploy`

---

## 🔐 Google OAuth Setup

To enable authentication, you need Google OAuth credentials (~5 minutes).

### 1. Create Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Go to **APIs & Services → OAuth consent screen**
4. Select **External** → Fill in app name & your email
5. Go to **Credentials → Create Credentials → OAuth client ID**
6. Select **Web application**
7. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
8. Copy your **Client ID** and **Client Secret**

### 2. Configure Environment

Add to your `.env.local`:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
ADMIN_EMAIL=your-google-email@gmail.com
ADMIN_NAME=Your Name
```

### 3. Set Up Database

```bash
npm run db:setup
npm run dev
```

Visit [localhost:3000/admin](http://localhost:3000/admin) to test sign-in!

---

## 📱 Mobile Testing with ngrok

Test on real devices with a public URL:

1. Create account at [ngrok.com](https://ngrok.com)
2. Reserve a domain at **Cloud Edge → Domains**
3. Add to `.env.local`:
   ```
   NGROK_DOMAIN=your-domain.ngrok.dev
   NGROK_OAUTH_EMAIL=your@email.com
   ```
4. Add ngrok redirect URI to Google Cloud Console
5. Run: `npm run dev:tunnel`

---

## 🗄️ Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | First-time setup (push schema + seed) |
| `npm run db:push` | Push schema changes to SQLite |
| `npm run db:seed` | Create/update admin user |
| `npm run db:studio` | Open Prisma Studio GUI |

**Production (PostgreSQL):**

| Command | Description |
|---------|-------------|
| `npm run db:push:prod` | Push schema to PostgreSQL |
| `npm run db:studio:prod` | Open Prisma Studio for production |

---

## 🚀 Production Deployment

### Quick Deploy to DigitalOcean

1. **Create Droplet** — Ubuntu 22.04, 1GB+ RAM
2. **SSH in and run:**
   ```bash
   # Install Node.js, nginx, PM2
   apt update && apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs nginx
   npm install -g pm2
   
   # Clone and setup
   cd /var/www
   git clone https://github.com/hrosenblume/next-cursor app
   cd app
   npm install
   ```

3. **Create `.env.local`** with production values
4. **Build and start:**
   ```bash
   npm run db:push:prod
   npm run db:seed:prod
   npm run build:prod
   pm2 start ecosystem.config.js
   pm2 save && pm2 startup
   ```

See the [Interactive Deploy Guide](#-interactive-deploy-guide) for detailed instructions!

---

## 🔄 GitHub Actions CI/CD

Auto-deploy when you push to `main`.

### Add GitHub Secrets

Go to **Settings → Secrets → Actions**:

| Secret | Value |
|--------|-------|
| `DO_HOST` | Your droplet IP |
| `DO_USER` | `root` |
| `DO_SSH_KEY` | Contents of `~/.ssh/id_ed25519` |

---

## 📁 Project Structure

```
app/
├── api/
│   ├── admin/users/        # User CRUD
│   ├── auth/               # NextAuth
│   ├── deployment-status/  # Deployment detection
│   ├── health/             # Health check + APP_ID
│   └── launch/             # Launch wizard API
├── admin/                  # Admin dashboard
├── auth/                   # Sign-in pages
├── deploy/                 # Deploy guide
├── launch/                 # Launch wizard UI
└── page.tsx                # Landing page

components/
├── admin/                  # Admin components
├── ui/                     # shadcn/ui components
├── DeployBanner.tsx        # Smart deploy banner
└── [shared]                # ThemeToggle, Icons, etc.

lib/
├── auth.ts                 # NextAuth config
├── db.ts                   # Prisma client
└── site-config.ts          # Site branding

.cursor/rules/              # Cursor AI context
plans/                      # Build specs & roadmaps
```

---

## 🛠️ All Commands

### Setup
| Command | Description |
|---------|-------------|
| `npm run setup` | One-command local setup |
| `npm run setup:check` | Check prerequisites |
| `npm run setup:validate` | Validate environment |
| `npm run cleanup` | Remove template files after using Launch Wizard |

### Development
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:tunnel` | Dev + ngrok mobile testing |
| `npm run build` | Build for production |
| `npm run lint` | Run linter |

### Production
| Command | Description |
|---------|-------------|
| `npm run build:prod` | Build with PostgreSQL |
| `pm2 start ecosystem.config.js` | Start with PM2 |
| `pm2 logs app-prod` | View logs |
| `pm2 restart app-prod` | Restart app |

---

## 🎨 Customization

### Add shadcn Components

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Update Site Branding

Edit `lib/site-config.ts`:

```typescript
export const SITE = {
  name: 'Your App Name',
  tagline: 'Your tagline here',
  // ...
}
```

### Remove Deploy Guide

The deploy banner auto-hides once you've deployed to production. To fully remove:

1. Delete `app/deploy/` folder
2. Delete `components/DeployBanner.tsx`
3. Remove `<DeployBanner />` from `app/layout.tsx`

---

## 📄 License

MIT — See [LICENSE](LICENSE) for details.

---

**Built by [Hunter Rosenblume](https://hunterrosenblume.com)** · [GitHub](https://github.com/hrosenblume)

This template was created at [Ordo](https://ordo.com). Interested in joining the team? Reach out at [careers@ordo.com](mailto:careers@ordo.com).
