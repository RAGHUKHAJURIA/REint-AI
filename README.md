# Wind Forecast Monitoring App

A production-quality full-stack application that visualizes and analyzes the accuracy of wind power generation forecasts in the United Kingdom using data from the Elexon BMRS platform.

The system allows users to compare **actual wind generation vs forecasted generation** and analyze forecast accuracy over time.

---

# Project Overview

This project consists of two main components:

1. **Forecast Monitoring Application**
2. **Forecast Error Analysis**

The application helps users intuitively understand the accuracy of wind generation forecasts.

The quantity being forecasted is **national-level wind power generation in the UK**.

The dashboard visualizes:

- Actual generation values (blue line)
- Forecast generation values (green line)

Users can select:

- Start time
- End time
- Forecast horizon

---

# Forecast Horizon Logic

For each generation timestamp **T**, the application selects the latest forecast created at least **H hours before T**.

Example:

Target Time = 24/05/24 18:00  
Forecast Horizon = 4 hours

The selected forecast must satisfy:

publishTime ≤ 18:00 − 4h = 14:00

Among these forecasts, the **most recent publishTime** is selected.

This ensures the forecast reflects information that would have been available before the generation occurred.

---

# Data Sources

Data is obtained from the **Elexon BMRS API**.

Actual Generation Dataset:

https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream

Fields used:

startTime → generation timestamp  
generation → wind power generated  
fuelType → filtered for WIND

Forecast Dataset:

https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream

Fields used:

startTime → forecast target time  
publishTime → time forecast was created  
generation → forecasted generation

The analysis focuses on **January 2024 data**.

---

# Project Structure
wind-forecast-app
│
├── analysis
│ └── analysis.ipynb
│
├── backend
│ ├── server.js
│ ├── routes
│ └── services
│
├── frontend
│ ├── src
│ └── public
│
└── README.md


---

# Tech Stack

Frontend

React  
Vite  
TailwindCSS  
Recharts

Backend

Node.js  
Express  
Axios

Data Analysis

Python  
Pandas  
Matplotlib  
Jupyter Notebook

Deployment

Frontend → Vercel  
Backend → Render / Railway

---

# Setup Instructions

## Clone the Repository
git clone https://github.com/RAGHUKHAJURIA/REint-AI.git

cd wind-forecast-app

# Backend Setup

cd backend
npm install

Create a `.env` file in the backend directory:

PORT=3000

FRONTEND_URL=http://localhost:5173

npm run dev

# Frontend Setup

cd frontend
npm install

npm run dev


---

# Forecast Monitoring Dashboard

Features:

Interactive line chart showing:

Actual wind generation  
Forecast wind generation

User controls:

Start time selector  
End time selector  
Forecast horizon slider

The chart updates dynamically based on selected parameters.

The UI is responsive and works on both **desktop and mobile devices**.

---

# Data Analysis

The `analysis.ipynb` notebook analyzes forecast accuracy and wind power reliability.

The analysis includes:

Forecast error metrics:

Mean Error  
Median Error  
P99 Error  
Mean Absolute Error (MAE)  
Root Mean Squared Error (RMSE)

Additional analysis:

Error distribution  
Error vs time-of-day  
Actual vs forecast comparison  
Wind generation probability distribution

Reliability analysis:

Wind generation percentiles were computed to estimate reliable generation capacity.

The **P10 percentile** is used as a conservative estimate of reliably available wind power.

---

# Deployment

Frontend deployed on:

Vercel

App Demo:

https://r-eint-ai-fun1.vercel.app/

Backend can be deployed on:

Render  
Railway

---

# AI Tools Used

AI tools such as **Cursor AI and ChatGPT** were used to assist with:

Code scaffolding  
Debugging  
Library usage

However, the **analysis reasoning and interpretation were developed manually**.

---

# Submission Components

This submission includes:

Forecast monitoring web application  
Jupyter notebook analysis  
Source code repository with commit history  
Deployment link  
Demo video explaining the project

---

# License

This project was developed as part of a software engineering hiring challenge.


