# 📊 ZNOTE - Project Presentation

---

## 🎯 Project Overview

**ZNOTE** is a **full-stack, gamified productivity web application** designed for students, engineers, and productivity enthusiasts. It combines note-taking, task management, idea capture, and calendar scheduling into one clean, minimalist interface with gamification elements to keep users motivated.

---

## 👥 Target Users

| User Group | Use Case |
|------------|----------|
| 🎓 **Students** | Organize study notes, track assignments, plan exam schedules |
| 👨‍💻 **Engineers/Developers** | Technical documentation, project tasks, meeting notes |
| 👨‍👩‍👧 **Parents** | Family scheduling, to-do lists, event planning |
| 🧘 **Minimalists** | Simple, distraction-free productivity |

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Component Library |
| **Vite** | 5.4.0 | Build Tool & Dev Server |
| **Tailwind CSS** | 3.4.9 | Utility-First CSS Styling |
| **Zustand** | 4.5.5 | State Management |
| **React Router DOM** | 6.26.0 | Client-Side Routing |
| **Axios** | 1.7.4 | HTTP Client |
| **Lucide React** | 0.428.0 | Icon Library |
| **date-fns** | 3.6.0 | Date Utilities |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express** | 4.19.2 | REST API Framework |
| **Prisma** | 5.19.0 | ORM (Database Access) |
| **JWT** | 9.0.2 | Authentication Tokens |
| **bcryptjs** | 2.4.3 | Password Hashing |
| **Google Generative AI** | 0.17.1 | AI Integration (Gemini) |

### Database

| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Relational Database |
| **Neon** | Serverless PostgreSQL Hosting |

### Deployment

| Platform | Purpose |
|----------|---------|
| **Vercel** | Frontend Hosting |
| **Render** | Backend Hosting |
| **Neon** | Database Hosting |

---

## 📱 Application Features

### 1️⃣ Dashboard
- Overview of today's tasks
- Recent notes display
- XP progress bar
- Streak counter
- Geometric avatar display
- Quick statistics

### 2️⃣ Notes Management
- Create, edit, delete notes
- Pin important notes
- Tag-based organization
- Search functionality
- AI-powered summarization (optional)

### 3️⃣ Task Management
- Create tasks with priorities (Low/Medium/High)
- Set due dates
- Mark as complete
- Filter by status (All/Active/Completed)
- Earn XP on completion

### 4️⃣ Idea Vault
- Capture and store ideas
- Tag organization
- AI-powered explanation (optional)
- Search functionality

### 5️⃣ Calendar
- **Monthly View** with week numbers
- **Weekly View** with week numbers
- Finnish national holidays (2025-2030)
- Add/edit events with color coding
- Today highlighting

### 6️⃣ Settings
- Dark/Light theme toggle
- Profile management
- XP system information
- Avatar evolution guide

---

## 🎮 Gamification System

### XP Rewards

| Action | XP Earned |
|--------|-----------|
| Complete a task | +5 XP |
| Create a note | +2 XP |
| Add calendar event | +1 XP |
| Daily login bonus | +10 XP |
| Weekly streak (7 days) | +20 XP |

### Avatar Evolution

| Level | Shape | Color |
|-------|-------|-------|
| 1-4 | Dot | Gray |
| 5-9 | Circle | Blue |
| 10-14 | Triangle | Purple |
| 15-19 | Square | Amber |
| 20+ | Hexagon | Pink |

### Streak System
- Daily login tracking
- Consecutive day rewards
- Weekly bonus multiplier

---

## 🔐 Authentication System

### Two Modes

**1. Guest Mode**
- No registration required
- Data stored in browser (LocalStorage)
- Full feature access
- Perfect for trying the app

**2. User Mode (Registered)**
- Cloud sync across devices
- Persistent data in PostgreSQL
- XP and streak tracking
- Guest data sync on registration

---

## 🗄️ Database Schema

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (UUID)       │
│ email           │
│ password        │
│ username        │
│ xp, level       │
│ streak          │
└────────┬────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    ▼         ▼         ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐
│ Notes │ │ Tasks │ │ Ideas │ │ Events │
└───────┘ └───────┘ └───────┘ └────────┘
```

**6 Database Tables:**
- Users
- Notes
- Tasks
- Ideas
- Events
- XpHistory

---

## 🌐 API Endpoints

| Category | Endpoints |
|----------|-----------|
| **Auth** | POST `/register`, `/login`, `/sync` |
| **Notes** | GET, POST, PUT, DELETE `/notes` |
| **Tasks** | GET, POST, PUT, DELETE `/tasks` |
| **Ideas** | GET, POST, PUT, DELETE `/ideas` |
| **Events** | GET, POST, PUT, DELETE `/events` |
| **User** | GET `/profile`, `/stats`, `/xp-history` |
| **AI** | POST `/summarize`, `/explain`, `/improve` |

---

## 🌟 Special Features

### 🇫🇮 Finnish Holidays
- Pre-loaded official holidays (2025-2030)
- Fixed holidays: New Year, Independence Day, Christmas, etc.
- Movable holidays: Easter, Midsummer, calculated automatically
- Visual highlighting in calendar

### 🌓 Dark/Light Mode
- System-wide theme switching
- Persisted preference
- Tailwind CSS dark mode classes

### 📱 Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly interactions

---

## 📁 Project Structure

```
znote/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # 7 Reusable UI components
│   │   ├── pages/          # 7 Page components
│   │   ├── stores/         # 6 Zustand stores
│   │   ├── lib/            # Utilities & API
│   │   └── styles/         # Tailwind CSS
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # 7 API controllers
│   │   ├── routes/         # 7 Route files
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # XP calculations
│   ├── prisma/             # Database schema
│   └── package.json
│
└── README.md               # Documentation
```

---

## 📈 Project Summary

| Metric | Value |
|--------|-------|
| **Frontend Files** | ~25 files |
| **Backend Files** | ~15 files |
| **Database Tables** | 6 tables |
| **API Endpoints** | 20+ endpoints |
| **Lines of Code** | ~3,000+ |
| **Dependencies** | 20+ packages |

---

## ✅ Key Accomplishments

1. ✅ Full-stack application with REST API
2. ✅ Secure JWT authentication
3. ✅ Guest mode with LocalStorage
4. ✅ Cloud sync for registered users
5. ✅ Gamification (XP, Levels, Streaks, Avatars)
6. ✅ Calendar with Finnish holidays
7. ✅ Dark/Light theme
8. ✅ Responsive design
9. ✅ AI integration ready (Gemini API)
10. ✅ Production deployment ready

---

## 🚀 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Collaborative notes
- [ ] File attachments
- [ ] Notifications/Reminders
- [ ] More AI features
- [ ] Export/Import data
- [ ] Multiple languages

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Frontend** | Deployed on Vercel |
| **Backend** | Deployed on Render |
| **Database** | Hosted on Neon |
| **Repository** | github.com/zaw-ye-tun/znote2 |

---

## 👨‍💻 Developer

**Zaw Ye Tun**

---

**ZNOTE** - *Your Minimalist Productivity Companion* 🎯
