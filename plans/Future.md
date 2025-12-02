# Future

> **What is this file?**
> Long-term ideas, features, and someday/maybe items.
> No deadlines — this is your backlog of possibilities.
> Use `---` dividers between ideas.
> 
> When you complete something, add learnings or notes here for reference.

---

## Additional Auth Providers

Add more OAuth providers beyond Google.

**Options:**
- GitHub OAuth
- Email/password with magic links
- Apple Sign-In

**Considerations:**
- Each provider needs credentials in `.env.local`
- Update NextAuth config in `lib/auth.ts`

---

## Email Notifications

Add transactional email support.

**Options:**
- Resend (simple, good DX)
- SendGrid (more features)
- AWS SES (cheapest at scale)

**Use cases:**
- Welcome emails
- Password reset
- Admin notifications

---

## API Rate Limiting

Protect API routes from abuse.

**Options:**
- Upstash Redis rate limiting
- In-memory with LRU cache
- Cloudflare rate limiting (if using CF)

---

## Monitoring & Observability

Add production monitoring.

**Options:**
- Sentry (error tracking)
- Vercel Analytics / PostHog (usage analytics)
- Better Stack (uptime monitoring)

---

## Testing

Add automated testing.

**Options:**
- Vitest for unit tests
- Playwright for E2E tests
- Testing Library for component tests

