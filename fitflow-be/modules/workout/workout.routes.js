const express = require("express");
const router = express.Router();
const Workout = require("./Workout");
const verifyToken = require("../../middlewares/auth/verifyToken");

router.get("/user/:userId", verifyToken, async (req, res) => {
  try {

    const authenticatedUserId = req.user._id || req.user.id;

    if (authenticatedUserId.toString() !== req.params.userId) {
      return res.status(401).json({ message: "Accesso non autorizzato: non puoi vedere i dati di altri utenti" });
    }

    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error("Errore GET workouts:", err);
    res.status(500).json({ message: "Errore nel recupero allenamenti" });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  const { name, type, duration, difficulty } = req.body;
  
  try {
    const userId = req.user._id || req.user.id;

    const newWorkout = new Workout({
      userId: userId,
      name,
      type,
      duration,
      difficulty,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error("Errore POST workout:", err);
    res.status(500).json({ message: "Errore nel salvataggio dell'allenamento" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Allenamento non trovato" });
    }
    const authenticatedUserId = req.user._id || req.user.id;
    if (workout.userId.toString() !== authenticatedUserId.toString()) {
      return res.status(401).json({ message: "Accesso non autorizzato: non puoi vedere i dati di altri utenti" });
    }
    res.json(workout);
  } catch (err) {
    console.error("Errore GET workout by ID:", err);
    res.status(500).json({ message: "Errore nel recupero dell'allenamento" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { name, type, duration, difficulty } = req.body;
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: "Allenamento non trovato" });
    }
    const authenticatedUserId = req.user._id || req.user.id;
    if (workout.userId.toString() !== authenticatedUserId.toString()) {
      return res.status(401).json({ message: "Accesso non autorizzato: non puoi modificare i dati di altri utenti" });
    }
    workout.name = name || workout.name;
    workout.type = type || workout.type;
    workout.duration = duration || workout.duration;
    workout.difficulty = difficulty || workout.difficulty;
    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (err) {
    console.error("Errore PUT workout:", err);
    res.status(500).json({ message: "Errore nella modifica dell'allenamento" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Allenamento non trovato" });
    }

    const authenticatedUserId = req.user._id || req.user.id;
    if (workout.userId.toString() !== authenticatedUserId.toString()) {
      return res.status(401).json({ message: "Non autorizzato" });
    }

    await Workout.findByIdAndDelete(req.params.id); 
    
    res.json({ message: "Workout eliminato con successo" });
  } catch (err) {
    console.error("Errore DELETE workout:", err);
    res.status(500).json({ message: "Errore durante l'eliminazione" });
  }
});


module.exports = router;