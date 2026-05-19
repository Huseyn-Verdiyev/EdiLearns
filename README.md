<div align="center">
  <h1>🎓 EdiLearns (EduTask)</h1>
  <p><strong>An Autonomous Agent-Powered & Gamified E-Learning Platform for Secondary Education.</strong></p>

  <img src="https://img.shields.io/badge/Platform-PWA%20Ready-6777ef?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stack-Vanilla%20ES6+%20%7C%20Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</div>

<br />

## 📌 Overview

**EdiLearns** (originally prototyped as *EduTask*) is a modern, gamified learning management platform engineered to make secondary school education deeply engaging, structured, and accessible. Built with an offline-first **Progressive Web App (PWA)** architecture, it combines autonomous agent workflows, interactive mastery skill trees, and cognitive productivity tools into a unified, responsive interface.

---

## ✨ Key Features

### 🤖 Autonomous Mentorship & Task Assistance
- Context-aware autonomous learning assistants that provide guided problem-solving hints rather than direct answers.
- Automated homework validation and rubric tracking.

### 🎮 Deep Gamification Engine
- **XP & Leveling System:** Distinguishes between spendable reward points and persistent lifetime Experience Points (XP) with non-linear leveling curves.
- **Daily Streak Mechanics:** In-app retention engine tracking daily active logins with milestone bonus multipliers.
- **Unlockable Badges & Mastery Perks:** Tiered achievements rewarded upon completing subject milestones.

### 🌳 Interactive Subject Skill Trees
- Dynamic, branching competency trees for core curriculum domains (**Mathematics**, **History**, **Literature**).
- Real-time node illumination upon mastering prerequisite modules (e.g., Quadratic Equations, Essay Construction).

### ⏱️ Integrated Pomodoro Focus Engine
- 25-minute deep-work timer directly integrated into the student navigation shell.
- Automated audio triggers and micro-break notifications designed to prevent cognitive fatigue.

### 📱 Offline-First Progressive Web App (PWA)
- Full Service Worker (`sw.js`) lifecycle management providing offline caching of core shell assets and lessons.
- Standalone installability across iOS, Android, macOS, and Windows with native manifest integration.

### 🎨 Adaptive Design & Accessibility
- Seamless Dark/Light mode switching powered by CSS Custom Properties.
- Subject-reactive palette shifting (e.g., warm sepia for History, verdant emerald for Biology) to enhance contextual focus.

---

## 🛠️ Architecture & Tech Stack

```
EdiLearns/
├── index.html           # Main SPA application shell & dashboard
├── script.js            # Reactive UI logic, state management, and gamification engine
├── style.css            # Responsive layout system with CSS custom properties
├── sw.js                # Service Worker for offline asset caching
├── manifest.json        # Web app manifest for native PWA installation
├── server/              # Node.js / Express backend API server
└── assets/              # Interface graphics, badges, and avatars
```

- **Frontend:** Semantic HTML5, Vanilla ES6+ JavaScript, CSS3 Design Tokens
- **Client Storage:** LocalStorage API, Cache Storage API
- **Backend:** Node.js, Express REST API
- **PWA Specs:** Service Worker Cache-First strategy, Maskable Web App Manifest

---

## 🚀 Getting Started

### 1. Run Frontend Locally

Since EdiLearns utilizes modern ES modules and Service Workers, serve it over a local HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node
npx serve .
```

Open `http://localhost:8080` in your browser.

### 2. Run Backend (Optional)

```bash
cd server
npm install
npm start
```

---

## 👥 Contributors

- **Farid Hashimli** — Architecture & Platform Design
- **Huseyn Verdiyev** — Frontend Engineering, PWA Architecture & Gamification Mechanics

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
