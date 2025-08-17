# 🛡️ Crowd Risk Management Dashboard  

An AI-powered **real-time crowd risk monitoring system** that processes **live video feeds** to analyze crowd density, predict risks for the next 10–30 minutes, and trigger **proactive safety actions**.  

This project is designed for large gatherings (like **Simhastha Kumbh Mela**, concerts, or sports events) to prevent **overcrowding and stampedes** by empowering authorities with **early warnings, automated safety measures, and visual dashboards**.  

---

## 🚀 Features  

✅ **Video Input & Processing** – Upload or stream crowd videos for live analysis.  
✅ **AI Risk Prediction** – Categorizes crowd status into 4 levels:  
   1. 🟢 Good to Go / Low Crowd  
   2. 🟡 Moderate Crowd (Safe)  
   3. 🟠 Overcrowded (Attention Needed)  
   4. 🔴 Stampede Risk (Emergency, Medical Needed)  
✅ **Future Prediction** – Forecasts **10 min** & **30 min ahead crowd risk**.  
✅ **Automated Actions** – Suggests actions like deploying officers, barricading routes, or calling medical teams.  
✅ **Alerts Panel** – Live alerts for "Overcrowd" & "Stampede" situations.  
✅ **Map Panel** – Shows crowd hotspots & affected areas.  
✅ **Real-time Dashboard** – Intuitive frontend built with **React + TailwindCSS**.  
✅ **WebSocket Integration** – For **live data streaming**.  

---

## 🏗️ Tech Stack  

### 🌐 Frontend
- React + TypeScript  
- TailwindCSS (UI styling)  
- Lucide Icons  
- Video.js / Custom Video Player  

### ⚙️ Backend
- Node.js / Flask (for AI model serving)  
- WebSocket API for real-time updates  

### 🤖 AI & Prediction
- Crowd density detection from video frames  
- Risk prediction model for **10 & 30 min future states**  
- Category classification (Low, Moderate, Overcrowded, Stampede)  

### ☁️ Deployment
- IBM Watsonx (for Agentic AI workflows)  
- Cloud Object Storage (for video handling)  
- Any cloud (IBM Cloud / AWS / GCP / Azure)  



## ⚡ Getting Started  

### 1️⃣ Clone the Repo  
```bash
git clone https://github.com/your-username/crowd-risk-dashboard.git
cd crowd-risk-dashboard
2️⃣ Setup Frontend
cd frontend
npm install
npm start

3️⃣ Setup Backend

For Flask (Python):

cd backend
pip install -r requirements.txt
python app.py


For Node.js:

cd backend
npm install
npm run dev

4️⃣ Connect WebSocket

Make sure backend WebSocket is running → frontend connects automatically.

📊 Risk Categories & Actions
Risk Level	Meaning	Suggested Actions
🟢 Low Crowd	Safe, well managed	No action needed
🟡 Moderate	Manageable crowd, no danger	Monitor only
🟠 Overcrowd	High density, needs attention	Deploy officers, redirect flow
🔴 Stampede	Emergency, danger of casualties	Close barricades, call medical teams, emergency broadcast
🔔 Live Alerts Example

⚠️ WARNING: Overcrowding detected. Increased monitoring recommended.

🚨 EMERGENCY: Stampede risk detected! Immediate action required.

🌍 Use Cases

Religious gatherings (Simhastha Kumbh, Jagannath Rath Yatra)

Concerts / Sports events

Political rallies & protests

Disaster evacuation monitoring

👨‍💻 Contributors

Somya Jaiswal– Full-stack Developer
Jiya Darvau- Full-stack Developer


## 📂 Project Structure  
---
crowd-risk-dashboard/
│── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # VideoPlayer, RiskPanel, MapPanel, AlertsPanel, ActionsPanel
│ │ ├── contexts/ # WebSocket context
│ │ ├── pages/ # Dashboard.tsx
│ │ └── App.tsx
│ └── package.json
│
│── backend/ # API & AI services
│ ├── app.py / server.js # Flask or Node backend
│ ├── models/ # AI models for crowd risk prediction
│ └── requirements.txt
│
│── README.md

---

