# 🛡️ BurnoutGuardian: Predictive Workforce Sustainability Platform

[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://your-app.vercel.app)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://your-api.onrender.com)
[![Tech-React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tech-Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)

**BurnoutGuardian** is an ethical, AI-driven enterprise workforce management system designed to prevent employee burnout before it happens. Using advanced cognitive metrics and behavioral patterns, it provides real-time insights into team stability, focus levels, and potential performance collapse.

---

## 🚀 Key Features

### 🏢 For Administrators (Executive Suite)
- **Economic Impact Analysis**: Real-time tracking of the financial cost of burnout vs. prevention.
- **Strategic Intelligence**: AI-generated organizational health reports.
- **Crisis Console**: Immediate alerts for high-risk departments.
- **Policy Simulator**: Predict the impact of wellness policies before implementing them.

### 👔 For Managers (Operational Lead)
- **Team Stability Funnel**: Visualize employee distribution across burnout phases (P1-P4).
- **AI Retention Predictor**: ML-based churn probability scores for every team member.
- **Cognitive Workload Balancer**: Suggests task redistribution to normalize neural load.
- **Real-time Risk Alerts**: Instant notifications when behavior signals high stress.

### 👤 For Employees (The Workhorse)
- **Mindfulness Hub**: AI-recommended recovery breaks based on current focus patterns.
- **Neuro Recovery Tracker**: Personal insights into cognitive energy and habit efficiency.
- **Focus Forecast**: Predicts peak productivity hours to help manage deep work.
- **Privacy-First Insights**: Peer metrics comparison without exposing individual data.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18+ via Vite
- **Styling**: Custom CSS3 (Glassmorphism & Cyber-Dark Aesthetics)
- **Visualization**: Recharts (Funnel, Radar, Area, and Bar charts)
- **Reports**: html2canvas & jsPDF for dynamic report generation

### **Backend**
- **Environment**: Node.js & Express
- **Database**: SQL.js (SQLite) with auto-seeding logic
- **Security**: JWT Authentication & BCrypt password hashing
- **Deployment**: Render (API) & Vercel (UI)

---

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/din-esh-2007/finalprod.git
   cd finalprod
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   node index.js
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   VITE_API_BASE=http://localhost:5000/api
   JWT_SECRET=your_secure_random_string
   ```

---

## 🔒 Security & Ethics
BurnoutGuardian is designed with a **Privacy-First** philosophy.
- All cognitive data is anonymized in peer comparisons.
- No invasive surveillance; focus is on behavioral output and neural load signals rather than screen-recording.
- Encrypted data transmission and secure authentication protocols.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.

---
*Built with ❤️ for Human Sustainability.*
