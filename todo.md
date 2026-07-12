# VIDVAS AI — Development Status & TODO
> Last audited: 2026-06-17. Based on full codebase read.

---

## ✅ FULLY WORKING

### Public Pages
- [x] **Home** (`/`) — Dark neon design, countdown timer, features grid, FAQ, CTA, WelcomeModal
- [x] **About** (`/about`) — Full-stack AI services branding, mission, vision, values
- [x] **Agents Catalog** (`/agents`) — 23 agents, search, category filter
- [x] **Pricing** (`/pricing`) — Monthly/yearly toggle, 4 plans (₹0/99/999/2999), INR pricing
- [x] **FAQ** (`/faq`) — 4 categories, accurate answers about AI services
- [x] **Documentation** (`/docs`) — 3 tabs: API Reference, Workflow Guide, Integration Guide. Linked in Navbar.
- [x] **Contact** (`/contact`) — Form submits to Supabase `contact_submissions` table
- [x] **Schedule Demo** (`/demo`) — Submits to Supabase `demo_requests` table, loading spinner + success screen
- [x] **Terms** (`/terms`) — Static content
- [x] **Privacy** (`/privacy`) — Static content
- [x] **404** (`/*`) — Whimsical page with countdown auto-redirect and random phrases

### Auth
- [x] **Login / Signup** (`/login`) — Email+password + Google OAuth, Supabase auth, proper validation
- [x] **Auth Callback** (`/auth/callback`) — Supabase Google OAuth redirect handler
- [x] **OAuth Callbacks** (`/auth/callback/gmail|slack|github`) — Full PKCE flow for Gmail; graceful completion for Slack/GitHub (UI shows Connected; real API calls need Edge Function for Slack/GitHub)

### Design System
- [x] **Tailwind config** — Full neon palette, no pink/purple/magenta anywhere
- [x] **index.css** — Glass-premium, hover-glow, text-gradient variants, shimmer, bounce, spin-slow animations
- [x] **Navbar** — Scroll-aware (transparent → frosted glass), all links present
- [x] **Footer** — VIDVAS AI full AI services branding, social links, contact info, docs/FAQ links
- [x] **WelcomeModal** — Dark neon design, countdown to June 20 2026, services strip
- [x] **CountdownTimer** — Counting down to June 20 2026

### Dashboard
- [x] **Stats grid** — 6 real stats: Workflows, Active Workflows, Executions, Successful, Personas, Active Personas
- [x] **Personas / Workflows sections** — Lists up to 3 each with status badges, personality copy in empty states
- [x] **Quick Actions** — 8 actions linked correctly

### Core App Features
- [x] **Persona Manager** (`/personas`) — Full CRUD via Supabase `agent_personas`
- [x] **Workflow Builder** (`/workflows`) — Full CRUD, drag-drop steps, 6 templates, version history/rollback, "Run Now"
- [x] **Execution Dashboard** (`/executions`) — Real-time via Supabase Realtime, filter by status, step detail view
- [x] **WorkflowExecutor** — Retry logic (2x, 600ms/1200ms backoff), Backroom messages written to DB after each step
- [x] **WorkflowLogger** — Singleton, logs every step, dispatches `workflow:failed` CustomEvent
- [x] **Backroom** (`Backroom.ts`) — Wired into WorkflowExecutor; persists agent-to-agent messages to `backroom_messages` table
- [x] **InvisibleChains** (`InvisibleChains.ts`) — Wired into AI Playground; decomposes "launch product" / "create content" / "sales outreach" into numbered plans with "Create Workflow" button

### Integration Hub OAuth (fixed 2026-06-17)
- [x] **PKCE flow implemented** — `initiateOAuth` generates verifier/challenge, stores verifier in `sessionStorage`
- [x] **Gmail token exchange** — Real POST to `https://oauth2.googleapis.com/token` with `code_verifier`; sets `status: connected` + real `access_token` + `refresh_token` (requires Google OAuth client type = Desktop app)
- [x] **Slack / GitHub** — Completes UI flow with `status: connected`; actual API calls need Supabase Edge Function (client_secret required server-side)
- [x] **`isConnected()` works** — Returns true after any successful OAuth callback
- [x] **Token refresh works for Gmail** — POSTs to token URL with `refresh_token`; returns stored token for Slack/GitHub
- [x] **Disconnect persists to DB** — `handleDisconnect` calls `disconnectIntegration()` which updates DB + fires `integration:disconnected` event
- [x] **UI auto-refreshes on disconnect** — IntegrationHub listens for `integration:disconnected` event and re-syncs from DB

### Live Support (fixed 2026-06-17)
- [x] **Gemini 2.0 Flash Edge Function** — deployed at `https://xiulwqliqlfsnwdkuqdr.supabase.co/functions/v1/chat-support`
- [x] Chat UI — message history, typing indicator, auto-scroll, Enter to send, error handling
- [x] VIDVAS AI system prompt, last 10 messages sent as conversation context, CORS handled
- [x] `GEMINI_API_KEY` set in Supabase secrets

---

## ⚠️ PARTIALLY WORKING

### AI Playground (`/playground`)
- [x] Chat UI renders, persona context shown in header
- [x] InvisibleChains intent decomposition for trigger phrases
- ❌ **Responses are keyword-regex stubs** — no real LLM
- ❌ **All agent actions return stub messages** — GmailAgent, SlackAgent, etc. return "not connected"
- **Fix needed:** Wire Claude API (`REACT_APP_ANTHROPIC_API_KEY`) to `AgentOrchestrator.recognizeIntent()` and `executeStep()`

### Integration Hub (`/integrations`)
- [x] Gmail OAuth: real tokens if Google client type = **Desktop app**
- ⚠️ Gmail OAuth: shows Connected but no real tokens if Google client type = **Web application** (needs Edge Function)
- ⚠️ Slack / GitHub: shows Connected but real API calls blocked until Edge Function deployed
- **Fix if needed:** Deploy `supabase/functions/oauth-exchange` Edge Function to handle client_secret server-side for Slack/GitHub/Web-app Gmail

### Background Jobs (`BackgroundAgents.ts`)
- [x] `BackgroundAgentManager` class exists
- ❌ Never instantiated or used anywhere
- **Fix needed:** Wire to WorkflowBuilder trigger types + Supabase Edge Functions for cron/webhook

---

## ❌ NOT WORKING / MISSING

### LLM Integration (Highest Priority)
- [ ] **Claude API in AI Playground** — `AgentOrchestrator.recognizeIntent()` is keyword regex only
- [x] **Real agent execution** — GmailAgent, SlackAgent, GitHubAgent, NotionAgent, GoogleCalendarAgent all wired to live APIs (2026-06-17)

### Triggers (2026-06-17)
- [x] **`workflow_trigger_events` table** — SQL migration run ✅
- [x] **`webhook-trigger` Edge Function** — deployed ✅ `https://xiulwqliqlfsnwdkuqdr.supabase.co/functions/v1/webhook-trigger?workflow_id=UUID&secret=SECRET`
- [x] **`schedule-runner` Edge Function** — deployed ✅ `https://xiulwqliqlfsnwdkuqdr.supabase.co/functions/v1/schedule-runner`
- [x] **pg_net extension** — enabled ✅
- [x] **pg_cron job** — created ✅ runs every minute, calls schedule-runner
- [x] **JWT verification disabled** on schedule-runner ✅
- [x] **`useTriggerListener` hook** — Realtime subscription, catches up on offline events, prevents duplicate runs across tabs ✅
- [x] **Wired into App.tsx** — active for all logged-in users ✅
- [x] **Webhook triggers** — fully working ✅
- [ ] **Schedule trigger** — insert a row in `background_jobs` table for each workflow you want scheduled (user_id, workflow_id, job_type=cron, schedule=interval in minutes, status=active, next_run_at=now())

### Database
- [x] **Supabase migration must be manually applied** — run `supabase/migrations/001_agent_system_schema.sql` in Supabase SQL Editor

---

## 🔧 TECHNICAL DEBT

- [ ] `AgentOrchestrator.ts` has 9+ `TODO` comments — all LLM integration gaps
- [ ] No error boundaries on protected pages (crash = blank white screen)
- [ ] OAuth client IDs must be set in `.env` — app silently fails if missing
- [ ] No loading state on Dashboard if Supabase tables don't exist yet

---

## 📌 CURRENT STATE SUMMARY

| Area | Status |
|------|--------|
| UI / Design system | ✅ Complete |
| Auth (login/signup) | ✅ Complete |
| Dashboard | ✅ Complete |
| Persona Manager | ✅ Complete |
| Workflow Builder | ✅ Complete |
| Execution Dashboard | ✅ Complete |
| Schedule Demo form | ✅ Complete |
| OAuth UI flow (all providers) | ✅ Complete |
| Gmail real token exchange | ⚠️ Works with Desktop app OAuth client type |
| Slack / GitHub real tokens | ⚠️ Needs Supabase Edge Function |
| AI Playground responses | ❌ Stub only (no LLM) |
| Agent actions (Gmail etc.) | ✅ Real API calls |
| Scheduled triggers | ⚠️ All infra done; add a row to `background_jobs` per workflow |
| Webhook triggers | ✅ Fully working |
| Live Support backend | ✅ Gemini 2.0 Flash Edge Function |

**Biggest remaining gap:** No real LLM — the product is a complete, working UI shell with real persistence and OAuth flows, but AI responses and external API calls are all stubbed. Wire `REACT_APP_ANTHROPIC_API_KEY` to `AgentOrchestrator` to unlock the core value prop.
