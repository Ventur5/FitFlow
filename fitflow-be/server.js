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
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fitflow_secret', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
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
app.listen(PORT, () => console.log(`✅ Server in esecuzione sulla porta ${PORT}`));