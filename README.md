# Kerala Rail Intelligence Platform (Nexus AI)

Welcome to the **Kerala Rail Intelligence Platform**, an enterprise-grade web application designed to monitor, track, and dynamically predict train telemetry using Advanced Machine Learning (AI).

This platform acts as a unified digital twin for railway networking, allowing operators to oversee train schedules, monitor real-time delays, check hardware health, and execute AI-based predictive actions safely.

---

## What This Project Does

The platform aggregates live train statuses across the Kerala rail network and provides deep operational insights. Key features include:

- **Live Fleet Tracking**: See where trains currently are on their routes alongside live delay metrics.
- **Critical Alerts**: Automatically alerts operators when a train needs immediate mechanical attention based on predictive mileage and wear.
- **AI Reroute Command**: In the event of heavy delays or congestion, the platform's AI engine calculates alternate branch lines to rescue schedules.
- **Dynamic Dashboards**: Global visualizations of network delays and health statuses.

---

## The Machine Learning Engine (Nexus AI)

The core intelligence behind this platform is a **Python FastAPI Microservice** leveraging `scikit-learn`.

### The Algorithm: Random Forest Ensembles
We utilized a **Random Forest Regressor** to predict continuous variables (Delay Minutes) and a **Random Forest Classifier** to predict categorical conditions (Maintenance Health). 

1. **How it Learns**: The model was trained aggressively on the `kerala_train_data.csv` dataset, learning the intricate behaviors of the fleet over time.
2. **The Features**: It intakes 6 distinct real-time telemetry markers:
   - `speed`
   - `mileage` 
   - `lastMaintenanceDaysAgo`
   - `previous_delay`
   - `congestion`
   - `occupancyPercentage`
3. **The Predictions**: By charting these decision trees against each other, the AI returns two core predictions per second:
   - Predicted Delay Minutes *(e.g., 26.6m)*
   - Predicted Maintenance Status *(Healthy, Minor Issue, or Critical)*

---

## Front-End to Back-End Architecture

This is a modern, decoupled **Full-Stack Application** featuring three primary layers:

### 1. The React Vite Interface (Frontend)
Built with React, SCSS, Framer Motion, and Zustand. The UI aggressively fetches live data from the API and gracefully handles network unavailability. When a Train is clicked, the UI opens a modal and calls the AI Endpoint to pull a unique **AI Rerouting Insight**.

### 2. The Node.js / TypeScript Proxy (Backend)
Built on Express and Drizzle ORM (PostgreSQL). This layer acts as the absolute source of truth. It stores all train locations, origins, and destinations. When the React app requests an "AI Insight" for a specific train, Node.js extracts the live telemetry from PostgreSQL and forwards it internally to Python.

### 3. The Python FastAPI Engine (Microservice)
Running on Port `8000`, this lightning-fast AI bridge receives the telemetry from Node.js, deserializes the pre-trained Random Forest `.pkl` files, and spits out instantaneous predictive intelligence back down the pipeline.

---

## Getting Started

### 1. Start the Machine Learning Engine
```bash
cd UrbanRail-Experience/server/ai_service
python -m uvicorn app:app --port 8000
```

### 2. Start the Database Proxy
```bash
cd UrbanRail-Experience
set NODE_ENV=development
set DATABASE_URL="postgresql://user:pass@host/db"
npx tsx server/index.ts
```

### 3. Start the UI Platform
```bash
cd kerala-rail-platform
npm run dev
```
