# Kerala Rail Intelligence Platform (KRIP) - Nexus AI

Welcome to the **Kerala Rail Intelligence Platform**, an enterprise-grade digital twin system designed to monitor, track, and dynamically predict train telemetry using Advanced Machine Learning (AI).

This platform acts as a unified command center for the Kerala railway network, allowing operators to oversee train schedules, monitor real-time delays, check hardware health, and execute AI-based predictive actions safely.

---

## 🚀 What This Project Does

The platform aggregates live train statuses across the Kerala rail network and provides deep operational intelligence. Key features include:

- **Live Fleet Tracking**: Real-time GPS-simulated tracking of trains alongside live delay metrics.
- **Active AI Decision Engine**: Unlike standard dashboards, KRIP allows operators to **execute** AI recommendations (e.g., Rerouting) which dynamically updates the fleet's arrival projections in real-time.
- **Passenger Strength Index**: Visual heatmaps and capacity bars for every train, allowing Load Balancing based on passenger volume.
- **Critical Maintenance Alerts**: Automated dispatch system that identifies hardware risks before they cause failures using predictive analysis.
- **Dynamic Analytics**: cumulative delay charting and fleet health distribution via high-performance Recharts visualizations.

---

## 🧠 The Machine Learning Engine (Nexus AI)

The core intelligence behind this platform is a **Python FastAPI Microservice** leveraging `scikit-learn`.

### The Algorithm: Random Forest Ensembles
We utilized a **Random Forest Regressor** to predict continuous variables (Delay Minutes) and a **Random Forest Classifier** to predict categorical conditions (Maintenance Health). 

1. **How it Learns**: The model was trained on the `kerala_train_data.csv` dataset, learning the intricate behaviors of the fleet including congestion patterns and maintenance cycles.
2. **The Features**: It intakes 6 distinct real-time telemetry markers:
   - `speed`
   - `mileage` 
   - `lastMaintenanceDaysAgo`
   - `previous_delay`
   - `congestion`
   - `occupancyPercentage`
3. **The Predictions**: The AI returns two core predictions:
   - **Predicted Delay Minutes**: Forecasting arrivals up to 2 hours in advance.
   - **Predicted Maintenance Status**: Binary and multi-class classification of hardware risk (Healthy, Minor Issue, or Critical).

---

## 🏗️ Technical Architecture

This is a modern, decoupled **Full-Stack Application** featuring three primary layers:

### 1. The React Platform (Frontend)
- **Framework**: React 18 (Vite)
- **State Management**: Zustand (Global Telemetry Store)
- **Animations**: Framer Motion (Fluid status transitions)
- **Styling**: SCSS (Modern `@use` syntax)
- **Visuals**: Lucide Icons & Recharts

### 2. The TypeScript Proxy (Core Backend)
- **Server**: Node.js Express
- **Database**: PostgreSQL with Drizzle ORM
- **Role**: Acts as the secure bridge and data validator between the UI and the ML Microservice.

### 3. The Python ML Cluster (Microservice)
- **Server**: FastAPI
- **ML Logic**: Scikit-Learn (Random Forest)
- **Role**: Performs high-speed inference on telemetry arrays passed from the Node.js proxy.

---

## 🛠️ Getting Started

### 1. Start the Machine Learning Engine
```bash
cd UrbanRail-Experience/server/ai_service
python -m uvicorn app:app --port 8000
```

### 2. Start the Database Proxy
```bash
cd UrbanRail-Experience
# Ensure you have your PostgreSQL DATABASE_URL in .env
npm run dev
```

### 3. Start the UI Platform
```bash
cd kerala-rail-platform
npm run dev
```

---

## 🛠️ System Control & AI Override
KRIP features an **Active Control Mode**. In the Train Table, operators can click **"Execute AI Fix"**. This simulates the AI's rerouting logic, instantly neutralizing delays and updating the train's status to "On Time" across all connected dashboards.
