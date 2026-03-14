# Wind Forecast Monitoring App

A production-quality web application to visualize and analyze the accuracy of wind power generation forecasts in the United Kingdom. It compares actual wind generation against forecasted generation using data from the Elexon BMRS API.

## 🚀 Project Overview

This project provides a full-stack solution for monitoring grid-scale wind power generation. It includes:
- **Data Analysis**: A comprehensive Jupyter notebook analyzing forecast errors, time-of-day patterns, and generation reliability.
- **Backend API**: A Node.js/Express server that fetches and serves wind generation and forecast data.
- **Frontend Dashboard**: A modern React application featuring interactive Recharts visualizations and a custom Forecast Horizon filter.

### Forecast Horizon Logic
The application implements a strict **4-hour Forecast Horizon** rule. For any target time $T$, it selects the latest forecast published at or before $T - 4$ hours. This allows energy traders and grid operators to assess the quality of information available for short-term planning.

## 📁 Project Structure

```text
wind-forecast-app/
├── analysis/               # Data Science & Research
│   ├── analysis.ipynb      # Professional analysis report
│   └── data/               # Raw data exports (optional)
├── backend/                # Node.js / Express API
│   ├── server.js           # API Entry point
│   ├── routes/             # API Route definitions
│   └── services/           # External API integration
├── frontend/               # React / Vite Dashboard
│   ├── src/                # UI Components and Logic
│   └── public/             # Static assets
└── README.md               # Project documentation
```

## 🛠️ Tech Stack

- **Data Science**: Python, Pandas, Matplotlib, Jupyter.
- **Backend**: Node.js, Express, Axios.
- **Frontend**: React 19, Vite, TailwindCSS, Recharts, Lucide React.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Repository Setup
```bash
git clone <repository-url>
cd wind-forecast-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🏁 Running the Application

### Start the Backend
```bash
cd backend
npm run dev
```
The API will run on `http://localhost:3001`.

### Start the Frontend
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📊 Data Analysis Report
To view the detailed statistical analysis:
1. Navigate to the `analysis/` folder.
2. Open `analysis.ipynb` using Jupyter Lab or VS Code.
3. The report covers MAE, RMSE, P10/P20 reliability metrics, and time-of-day error characteristics.

## 🌐 Deployment
- **Backend**: Suitable for deployment on Render or Railway (Node.js runtime).
- **Frontend**: [Vercel](https://vercel.com) (Vite preset).
- **Demo Link**: [App on Vercel](https://your-app-link.vercel.app)

---
*Developed as part of an engineering challenge focused on grid-scale energy forecasting.*
