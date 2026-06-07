# ExecutiveOS AI 🚀

> Your entire AI Executive Board — CEO, CTO, CFO, COO, CMO, CHRO, CSO, CPO — powered by **Gemini 2.0 Flash (FREE)**

---

## ✅ What's Inside

- **8 AI Executive Agents** — each powered by Gemini 2.0 Flash
- **Board Directive Engine** — all execs collaborate on your goal in real-time
- **Ask the Board** — query any executive directly via Gemini
- **Startup Builder** — generate a full company blueprint in seconds
- **GitLab MCP Integration** — CTO agent creates repos, milestones, issues
- **Analytics Dashboard** — revenue, team, engineering velocity, marketing
- **AI Documents Hub** — business plans, financial models, hiring plans
- **100% Free APIs** — Gemini free tier, GitLab free, MongoDB Atlas free

---

## 🔑 Free APIs Needed

| API | Where to get | Cost |
|-----|-------------|------|
| **Gemini** | [aistudio.google.com](https://aistudio.google.com/app/apikey) | FREE (15 RPM, 1M tokens/day) |
| **GitLab** | [gitlab.com/-/profile/personal_access_tokens](https://gitlab.com/-/profile/personal_access_tokens) | FREE |
| **MongoDB** | [mongodb.com/atlas](https://mongodb.com/atlas) | FREE (512MB) |

---

## 🛠 Setup — VS Code to GitHub to Deploy

### Step 1 — Clone or create project

```bash
# Option A: Use this repo
git clone https://github.com/YOUR_USERNAME/executiveos-ai.git
cd executiveos-ai

# Option B: Fresh start (already have files)
cd executiveos-ai
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
GEMINI_API_KEY=AIza...your_free_key_here
GITLAB_TOKEN=glpat-...your_token_here
GITLAB_URL=https://gitlab.com
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/executiveos
NEXTAUTH_SECRET=run_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

**Get Gemini key (30 seconds):**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with any Google account
3. Click "Get API Key" → "Create API Key"
4. Copy and paste into `.env.local`

**Get GitLab token:**
1. Go to [gitlab.com/-/profile/personal_access_tokens](https://gitlab.com/-/profile/personal_access_tokens)
2. Name: `executiveos-ai`
3. Scopes: ✅ api ✅ read_repository ✅ write_repository
4. Copy token into `.env.local`

**Get MongoDB free cluster:**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account → Free cluster (M0)
3. Database Access: create user with password
4. Network Access: add `0.0.0.0/0`
5. Connect → Copy connection string into `.env.local`

### Step 4 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the dashboard!

---

## 📁 Project Structure

```
executiveos-ai/
├── app/
│   ├── api/
│   │   ├── gemini/route.ts      ← All Gemini AI calls
│   │   ├── gitlab/route.ts      ← GitLab MCP integration
│   │   └── builder/route.ts     ← Startup blueprint builder
│   ├── dashboard/page.tsx       ← Command Center
│   ├── ask/page.tsx             ← Ask any executive
│   ├── board/page.tsx           ← Executive Board view
│   ├── builder/page.tsx         ← Startup Builder
│   ├── gitlab/page.tsx          ← GitLab Workspace
│   ├── analytics/page.tsx       ← Analytics Dashboard
│   ├── settings/page.tsx        ← API Key configuration
│   ├── layout.tsx               ← Root layout
│   └── globals.css              ← Design system
├── components/
│   └── layout/AppShell.tsx      ← Sidebar + nav + right panel
├── lib/
│   ├── gemini.ts                ← Gemini 2.0 Flash client
│   ├── gitlab.ts                ← GitLab API client
│   ├── mongodb.ts               ← MongoDB connection
│   ├── executives.ts            ← All 8 executive definitions
│   ├── store.ts                 ← Zustand global state
│   └── utils.ts                 ← Helpers
├── types/index.ts               ← TypeScript types
├── .env.local                   ← Your secrets (never commit!)
├── .gitignore                   ← .env.local is excluded
└── package.json
```

---

## 🚀 Push to GitHub

### In VS Code:

**Option A — VS Code GUI:**
1. Click the **Source Control icon** (branch icon, left sidebar)
2. Click "Initialize Repository"
3. Stage all files → Write commit message → Click ✓
4. Click "Publish to GitHub"
5. Choose: public or private → Done!

**Option B — Terminal:**

```bash
# Initialize git
git init
git add .
git commit -m "feat: ExecutiveOS AI — Gemini-powered executive board"

# Create repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/executiveos-ai.git
git branch -M main
git push -u origin main
```

**IMPORTANT:** `.gitignore` already excludes `.env.local` — your API keys are safe!

---

## ☁️ Deploy to Vercel (Free)

### Option A — Vercel CLI:

```bash
npm install -g vercel
vercel
# Follow prompts → done!
```

### Option B — Vercel Dashboard:

1. Go to [vercel.com](https://vercel.com)
2. "New Project" → Import from GitHub
3. Select `executiveos-ai`
4. Add Environment Variables (from your `.env.local`):
   - `GEMINI_API_KEY`
   - `GITLAB_TOKEN`
   - `GITLAB_URL`
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → set to your Vercel URL
5. Click **Deploy**

Your live URL: `executiveos-ai.vercel.app` — live in ~2 minutes!

---

## 🔧 ShadCN UI Setup (Optional)

```bash
npx shadcn@latest init
# Choose: Dark theme, CSS variables, Tailwind
npx shadcn@latest add button input card badge dialog tabs
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/gemini` | Gemini AI — board directive, ask executive, etc. |
| GET  | `/api/gemini` | Check API status |
| POST | `/api/gitlab` | GitLab MCP — create repos, issues, milestones |
| GET  | `/api/gitlab` | List GitLab actions |
| POST | `/api/builder` | Full startup blueprint generation |

### Example — Board Directive:
```bash
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "action": "board_directive",
    "directive": "Launch SmartCart in India",
    "apiKey": "AIza..."
  }'
```

### Example — Ask CTO:
```bash
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ask_executive",
    "role": "CTO",
    "question": "What tech stack for a real-time delivery app?",
    "apiKey": "AIza..."
  }'
```

### Example — Create GitLab Issue:
```bash
curl -X POST http://localhost:3000/api/gitlab \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_issue",
    "projectId": 12345,
    "title": "Implement JWT authentication",
    "description": "Set up JWT with refresh tokens",
    "labels": ["backend", "security"]
  }'
```

---

## 🎯 Hackathon Demo Flow

1. Open dashboard → paste any business goal
2. Click "Execute" → all 8 executives respond via Gemini
3. Go to "Ask the Board" → ask the CEO a specific question
4. Go to "Startup Builder" → enter "SmartCart" → watch full blueprint generate
5. Go to "GitLab" → show CTO agent-created repos and issues

---

## 📄 License

MIT — free to use, modify, and ship!

---

Built with ❤️ using Next.js 15, Gemini 2.0 Flash (free), GitLab MCP, and MongoDB Atlas (free)
