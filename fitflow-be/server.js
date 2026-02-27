require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
require("./config/passport.js");

const authRoutes = require("./modules/auth/auth.routes"); 
const exercizeRoutes = require("./modules/exercize/exercize.routes");
const userRoutes = require("./modules/users/user.routes");
const workoutRoutes = require("./modules/workout/workout.routes");
const trainerRoutes = require("./modules/trainer/trainer.routes");

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.endsWith('.vercel.app') || origin === 'http://localhost:5173')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.set('trust proxy', 1);

const mongoose = require("mongoose");
const startDB = async () => {
  try {
    const dbURI = process.env.MONGO_CONNECTION_STRING || process.env.MONGODB_URI;
    if (!dbURI) throw new Error("Manca la stringa di connessione al database!");
    await mongoose.connect(dbURI);
    console.log("✅ MongoDB Connesso");
  } catch (err) {
    console.error("❌ Errore DB:", err.message);
  }
};
startDB();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, 
}));

app.use(morgan("dev"));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fitflow_secret', 
  resave: false,
  saveUninitialized: false,
  proxy: true, 
  cookie: { 
    secure: true,
    sameSite: 'none',
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/exercize", exercizeRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/trainers", trainerRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Errore interno del server!" });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`✅ Server in esecuzione sulla porta ${PORT}`));
}

module.exports = app;