#!/bin/bash
# setup.sh — ExecutiveOS AI — One-command project setup
# Run: bash setup.sh

set -e

echo ""
echo "🚀 ExecutiveOS AI — Setup Script"
echo "================================="
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from: https://nodejs.org (v18+)"
  exit 1
fi
NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js v18+ required. Current: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v) detected"

# 2. Check Git
if ! command -v git &> /dev/null; then
  echo "❌ Git not found. Install from: https://git-scm.com"
  exit 1
fi
echo "✅ Git $(git --version | cut -d' ' -f3) detected"

# 3. Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# 4. Check .env.local
if [ ! -f ".env.local" ]; then
  echo ""
  echo "⚠  .env.local not found. Creating from template..."
  cat > .env.local << 'EOF'
# ExecutiveOS AI — Environment Variables
# Get Gemini key FREE at: https://aistudio.google.com/app/apikey

GEMINI_API_KEY=AIza_PASTE_YOUR_FREE_KEY_HERE

GITLAB_TOKEN=glpat_PASTE_YOUR_TOKEN_HERE
GITLAB_URL=https://gitlab.com
GITLAB_USERNAME=your_gitlab_username

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/executiveos

NEXTAUTH_SECRET=change_this_to_random_string
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ExecutiveOS AI
EOF
  echo "✅ .env.local created — edit it with your API keys"
else
  echo "✅ .env.local already exists"
fi

# 5. ShadCN check
echo ""
echo "🎨 Checking ShadCN UI..."
if [ -f "components/ui/button.tsx" ]; then
  echo "✅ ShadCN UI already initialized"
else
  echo "ℹ  Run this to add ShadCN components (optional):"
  echo "   npx shadcn@latest init && npx shadcn@latest add button input card badge dialog tabs"
fi

# 6. Done
echo ""
echo "================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local → add your FREE Gemini API key"
echo "     Get it at: https://aistudio.google.com/app/apikey"
echo ""
echo "  2. Start the dev server:"
echo "     npm run dev"
echo ""
echo "  3. Open: http://localhost:3000"
echo ""
echo "  4. In the app → go to ⚙️ Settings → paste your Gemini key"
echo ""
echo "  5. Push to GitHub:"
echo "     git init && git add . && git commit -m 'feat: ExecutiveOS AI'"
echo "     git remote add origin https://github.com/YOUR_USERNAME/executiveos-ai.git"
echo "     git push -u origin main"
echo ""
echo "  6. Deploy to Vercel (free):"
echo "     npx vercel"
echo ""
echo "  Free API Links:"
echo "  - Gemini:  https://aistudio.google.com/app/apikey"
echo "  - GitLab:  https://gitlab.com/-/profile/personal_access_tokens"
echo "  - MongoDB: https://mongodb.com/atlas"
echo "================================="
