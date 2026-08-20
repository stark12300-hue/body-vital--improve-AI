# FitForge AI - Workout, Diet & Health Coach

AI-driven personalized bodybuilding workout splits, customized diet charts, calorie & macro targets, health safety precautions, and weekly progression tracking.

---

## 🚀 GitHub Se App Ko Kaise Run Karein (How to Run Locally)

Agar aapne is repository ko GitHub se clone ya download kiya hai, toh niche diye steps follow karein:

### Step 1: Dependencies Install Karein
Apne terminal / command prompt mein project folder open karein aur run karein:
```bash
npm install
```

### Step 2: Environment Variables Setup (.env)
Project ke root folder mein ek nayi `.env` file banayein aur usme apna Google Gemini API Key add karein:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Aap apna free Gemini API key [Google AI Studio](https://aistudio.google.com/app/apikey) se generate kar sakte hain)*

### Step 3: Development Server Start Karein
```bash
npm run dev
```
Ab browser mein **`http://localhost:3000`** open karein. Aapki app full-stack features (AI Coach + Custom Workout + Diet Planner) ke sath smoothly chalegi!

---

## 🌐 Online Hosting / Deployment Guide

Yeh app ek **Full-Stack Application (React + Vite + Node/Express + Gemini AI)** hai:

### Option A: Render / Railway / Vercel (Recommended for Full-Stack AI)
1. **Render.com / Railway.app** par apna GitHub repository connect karein.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Environment Variable mein `GEMINI_API_KEY` set karein.
5. Deploy karein!

### Option B: GitHub Pages (Static Hosting)
- GitHub Pages sirf static HTML/JS/CSS host karta hai.
- `.github/workflows/deploy.yml` file is repository mein already included hai.
- GitHub repo settings -> **Pages** -> Source mein **"GitHub Actions"** select karein.
- Push karne par site automatic build aur live ho jayegi.

---

## 🛠️ Features
- **Custom Bodybuilding Splits**: Push-Pull-Legs, Upper-Lower, Arnold Split, Bro Split, Full Body.
- **Precision Diet Plans**: High-protein Indian & Global diets, macro targets, and portion guidance.
- **Injury & Health Guard**: Automatic exercise replacements for joint pain, diabetes, BP, etc.
- **Weekly Check-In & AI Recalibration**: Dynamic weekly adjustments based on weight progress.
- **PWA & Offline Ready**: Mobile installable app with PDF export capabilities.
