require('dotenv').config();
const express = require('express');
const cors = require('cors');
const generationRoutes = require('./routes/generationRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.FRONTEND_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET'],
}));
app.use(express.json());

// Routes
app.use('/api', generationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Wind Forecast API server running on port ${PORT}`);
});

module.exports = app;
