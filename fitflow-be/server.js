require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
require("./config/passport");

const authRoutes = require("./modules/auth/auth.routes"); 
const exercizeRoutes = require("./modules/exercize/exercize.routes");
const userRoutes = require("./modules/users/user.routes");
const workoutRoutes = require("./modules/workout/workout.routes");
const trainerRoutes = require("./modules/trainer/trainer.routes");

const app = express();
connectDB();

app.use((req, res, next) => {
  console.log(`Richiesta in arrivo: ${req.method} ${req.url}`);
  next();
});

app.use(helmet());
app.use(morgan("dev"));

const allowedOrigins = [
  'http://localhost:5173', 
  'https://fit-flow-be.vercel.app',
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Non consentito dai CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.set('trust proxy', 1);

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