# 🚀 ZNOTE - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Local Development Setup](#local-development-setup)
4. [Database Setup (Neon)](#database-setup-neon)
5. [Backend Deployment (Render)](#backend-deployment-render)
6. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
7. [Environment Variables](#environment-variables)
8. [Features & Usage](#features--usage)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**ZNOTE** is a minimalist, gamified productivity application designed for:
- 🎓 Students
- 👨‍💻 Engineers & knowledge workers
- 👨‍👩‍👧 Parents
- 🧘 Minimalist productivity users

### Core Features
- ✍️ **Notes** - Rich note-taking with AI assistance
- ✅ **Tasks** - Priority-based task management with completion tracking
- 💡 **Ideas Vault** - Capture and organize brilliant ideas
- 📅 **Calendar** - Weekly/Monthly views with week numbers
- 📊 **Dashboard** - Overview of your productivity
- 🌓 **Dark/Light Mode** - Easy on the eyes
- 🎮 **XP System** - Gamified productivity rewards
- 🔥 **Streak System** - Stay consistent with daily goals
- 🎨 **Geometric Avatar** - Evolves as you level up
- 🤖 **AI Integration** - Gemini API for content enhancement

---

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Zustand** for state management with persistence
- **React Router DOM** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Prisma ORM** for database management
- **PostgreSQL** (Neon) for data storage
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Google Gemini AI** for content assistance

### Deployment
- **Backend**: Render
- **Frontend**: Vercel
- **Database**: Neon PostgreSQL

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- Text editor (VS Code recommended)

### Step 1: Clone or Navigate to Project

```powershell
cd "f:\Lab arena\znote"
```

### Step 2: Backend Setup

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Open .env and configure variables (see Environment Variables section)
notepad .env
```

**Configure your `.env` file:**
```env
DATABASE_URL="postgresql://username:password@host.neon.tech/znote?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this"
GEMINI_API_KEY="your-gemini-api-key"
PORT=5000
NODE_ENV="development"
```

**Initialize Prisma:**
```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations (requires database connection)
npx prisma migrate dev --name init
```

**Start backend server:**
```powershell
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

Open a **new terminal window**:

```powershell
# Navigate to client directory
cd "f:\Lab arena\znote\client"

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Configure .env
notepad .env
```

**Configure your `.env` file:**
```env
VITE_API_URL="http://localhost:5000/api"
```

**Start frontend server:**
```powershell
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You can now:
- ✅ Continue as Guest (data stored locally)
- ✅ Create an account
- ✅ Login

---

## 🗄 Database Setup (Neon)

### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Connection String
1. In your Neon dashboard, click on your project
2. Go to **Connection Details**
3. Copy the **Connection string** (Pooled connection recommended)
4. It looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/znote?sslmode=require
   ```

### Step 3: Configure Backend
Update your `server/.env` file:
```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/znote?sslmode=require"
```

### Step 4: Run Migrations
```powershell
cd server
npx prisma migrate deploy
```

### Step 5: Verify Database
```powershell
npx prisma studio
```
This opens a GUI to view your database at `http://localhost:5555`

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Repository
1. Initialize git if not already done:
```powershell
cd "f:\Lab arena\znote"
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub:
```powershell
git remote add origin https://github.com/yourusername/znote.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up or login
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:

**Settings:**
- **Name**: `znote-api` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install; npx prisma generate`
- **Start Command**: `node server.js`
- **Instance Type**: Free

**Environment Variables:**
Click **Advanced** → **Add Environment Variable**

Add these:
```
DATABASE_URL = your-neon-connection-string
JWT_SECRET = your-secret-key-here
GEMINI_API_KEY = your-gemini-api-key
NODE_ENV = production
```

6. Click **Create Web Service**

### Step 3: Wait for Deployment
- First deployment takes 5-10 minutes
- Watch the logs for any errors
- Once deployed, you'll get a URL like: `https://znote-api.onrender.com`

### Step 4: Run Database Migration
After deployment, open the Render Shell and run:
```bash
npx prisma migrate deploy
```

### Step 5: Test Backend
Visit your backend URL:
```
https://znote-api.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "message": "ZNOTE API is running"
}
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
Ensure your frontend code is committed:
```powershell
cd "f:\Lab arena\znote"
git add .
git commit -m "Frontend ready for deployment"
git push
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or login with GitHub
3. Click **New Project**
4. Import your GitHub repository
5. Configure:

**Project Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables:**
Click **Environment Variables** and add:
```
VITE_API_URL = https://znote-api.onrender.com/api
```
(Replace with your actual Render backend URL)

6. Click **Deploy**

### Step 3: Wait for Deployment
- Takes 2-5 minutes
- You'll get a URL like: `https://znote-xyz.vercel.app`

### Step 4: Test Frontend
Visit your Vercel URL and test:
- ✅ Guest mode works
- ✅ Create account
- ✅ Login
- ✅ All features functional

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
# Database Connection
DATABASE_URL="postgresql://username:password@host.neon.tech/znote?sslmode=require"

# JWT Secret (generate random string)
JWT_SECRET="use-a-long-random-string-here"

# Gemini API Key (from Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# Server Configuration
PORT=5000
NODE_ENV="production"
```

### Frontend (`client/.env`)
```env
# API URL (point to your backend)
VITE_API_URL="https://znote-api.onrender.com/api"
```

### Getting API Keys

**Gemini API Key:**
1. Go to [ai.google.dev](https://ai.google.dev)
2. Click **Get API Key**
3. Create a new API key
4. Copy and add to your `.env`

**JWT Secret:**
Generate a random string:
```powershell
# Use any random string generator
# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎮 Features & Usage

### Guest Mode
- No login required
- All data stored in browser's LocalStorage
- Full access to all features
- Perfect for trying out the app

### User Mode (Registered)
- Cloud sync across devices
- XP and streak tracking
- AI features enabled
- Data backed up to database

### XP System
| Action | XP Reward |
|--------|-----------|
| Complete a task | +5 XP |
| Create a note | +2 XP |
| Add calendar event | +1 XP |
| Daily login bonus | +10 XP |
| Weekly streak bonus (7 days) | +20 XP |

### Avatar Evolution
| Level | Shape |
|-------|-------|
| 1-4 | Dot (Gray) |
| 5-9 | Circle (Blue) |
| 10-14 | Triangle (Purple) |
| 15-19 | Square (Amber) |
| 20+ | Hexagon (Pink) |

### AI Features (Logged-in users only)
- **Summarize**: Condense long notes
- **Explain**: Simplify complex content
- **Improve**: Enhance writing quality

---

## 🔧 Troubleshooting

### Backend Issues

**Problem: Database connection failed**
```
Error: Can't reach database server
```
Solution:
- Verify DATABASE_URL is correct
- Ensure `?sslmode=require` is at the end
- Check Neon dashboard for connection issues
- Use pooled connection string

**Problem: Prisma Client not generated**
```
Error: Cannot find module '@prisma/client'
```
Solution:
```powershell
cd server
npx prisma generate
npm install
```

**Problem: Port already in use**
```
Error: Port 5000 is already in use
```
Solution:
```powershell
# Change PORT in .env file
# Or kill the process using the port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Issues

**Problem: API connection failed**
```
Network Error / CORS Error
```
Solution:
- Verify VITE_API_URL in `.env`
- Check backend is running
- Ensure backend allows CORS (already configured)

**Problem: Build fails**
```
Error: Failed to build
```
Solution:
```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

**Problem: Dark mode not persisting**
Solution:
- Check browser's LocalStorage is enabled
- Clear browser cache
- Try in incognito mode

### Deployment Issues

**Render Issues:**
- Check build logs for errors
- Ensure environment variables are set
- Verify `node server.js` is the start command
- Check if free instance is sleeping (takes ~30s to wake)

**Vercel Issues:**
- Verify root directory is set to `client`
- Check environment variables are prefixed with `VITE_`
- Ensure build command is `npm run build`
- Check deployment logs for errors

### Database Issues

**Migration Failed:**
```powershell
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix
```

**Connection Pooling:**
- Use Neon's pooled connection string
- Format: `postgresql://...?sslmode=require`

---

## 📂 Project Structure

```
znote/
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── AuthPage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── IdeasPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── stores/           # Zustand state management
│   │   │   ├── authStore.js
│   │   │   ├── eventsStore.js
│   │   │   ├── ideasStore.js
│   │   │   ├── notesStore.js
│   │   │   ├── tasksStore.js
│   │   │   └── uiStore.js
│   │   ├── lib/              # Utilities
│   │   │   ├── api.js
│   │   │   └── utils.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
└── server/                    # Backend Express API
    ├── src/
    │   ├── controllers/      # Request handlers
    │   │   ├── aiController.js
    │   │   ├── authController.js
    │   │   ├── eventsController.js
    │   │   ├── ideasController.js
    │   │   ├── notesController.js
    │   │   ├── tasksController.js
    │   │   └── userController.js
    │   ├── routes/           # API routes
    │   │   ├── ai.js
    │   │   ├── auth.js
    │   │   ├── events.js
    │   │   ├── ideas.js
    │   │   ├── notes.js
    │   │   ├── tasks.js
    │   │   └── user.js
    │   ├── middleware/       # Custom middleware
    │   │   └── auth.js
    │   └── utils/            # Utility functions
    │       └── xp.js
    ├── prisma/
    │   └── schema.prisma     # Database schema
    ├── server.js             # Express server entry
    ├── package.json
    └── .env.example
```

---

## 🎯 Quick Start Commands

### Development
```powershell
# Backend
cd server; npm run dev

# Frontend (new terminal)
cd client; npm run dev
```

### Production Build
```powershell
# Backend (no build needed)
cd server; npm start

# Frontend
cd client; npm run build
```

### Database
```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/sync` - Sync guest data

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Ideas
- `GET /api/ideas` - Get all ideas
- `POST /api/ideas` - Create idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/xp-history` - Get XP history
- `GET /api/user/stats` - Get user stats

### AI
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/explain` - Explain text
- `POST /api/ai/improve` - Improve text

---

## 🌟 Tips & Best Practices

1. **Start with Guest Mode** to test features before creating an account
2. **Daily Login** for consistent XP and streak bonuses
3. **Use AI Features** to enhance your notes and ideas
4. **Pin Important Notes** to keep them at the top
5. **Set Task Priorities** to focus on what matters
6. **Use Week Numbers** for better calendar organization
7. **Dark Mode** reduces eye strain during night sessions

---

## 🤝 Support & Contribution

For issues or questions:
- Check this documentation first
- Review troubleshooting section
- Check console logs for errors
- Verify environment variables

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🎉 Congratulations!

You now have a fully functional ZNOTE application running locally and deployed to production!

**Local URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database Studio: http://localhost:5555

**Production URLs:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.onrender.com

Happy productivity! 🚀
