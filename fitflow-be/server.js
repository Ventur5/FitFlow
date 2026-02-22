const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const exercizeRoutes = require("./modules/exercize/exercize.routes");
const userRoutes = require("./modules/users/user.routes");
const workoutRoutes = require("./modules/workout/workout.routes");
const trainerRoutes = require("./modules/trainer/trainer.routes");
const { trace } = require("node:console");

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/exercize", exercizeRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/trainers", trainerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato con successo sulla porta ${PORT}`);
});