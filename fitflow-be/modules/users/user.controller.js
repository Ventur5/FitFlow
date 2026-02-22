const User = require("./users.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const exercises = require("../exercize/exercises.json");
const trainerService = require("../trainer/trainer.service");

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  surname: user.surname,
  email: user.email,
  birthdate: user.birthdate,
  height: user.height,
  weight: user.weight,
  diet: user.diet,
  goal: user.goal,
  bmi: user.bmi,
  category: user.category,
  exercises: user.exercises || [],
  nutrition: user.nutrition || [],
  myTrainer: user.myTrainer || null
});

exports.register = async (req, res) => {
  try {
    const { email, password, name, surname, birthdate, height, weight, diet, goal } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utente già registrato" });
    }

    const bmi = weight / ((height / 100) ** 2);
    let category;
    if (bmi < 18.5) category = "underweight";
    else if (bmi >= 18.5 && bmi <= 24.9) category = "normal";
    else category = "overweight";

    const { exercises: recommendedExercises, nutrition: recommendedNutrition } = exercises[category];

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      birthdate,
      height,
      weight,
      diet,
      goal,
      bmi,
      category,
      exercises: recommendedExercises,
      nutrition: recommendedNutrition
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Utente registrato con successo",
      token,
      user: formatUserResponse(newUser)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore registrazione" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("myTrainer");
    if (!user) {
      return res.status(400).json({ message: "Utente non trovato" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password errata" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login effettuato",
      token,
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore login" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("myTrainer");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore recupero utente" });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { height, weight, diet, goal } = req.body;
    const userId = req.params.id;

    if (!height || !weight || !diet || !goal) {
      return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
    }

    const bmi = weight / ((height / 100) ** 2);
    let category;
    if (bmi < 18.5) category = "underweight";
    else if (bmi >= 18.5 && bmi <= 24.9) category = "normal";
    else category = "overweight";

    const { exercises: recommendedExercises, nutrition: recommendedNutrition } = exercises[category];

    const user = await User.findByIdAndUpdate(
      userId,
      { height, weight, diet, goal, bmi, category, exercises: recommendedExercises, nutrition: recommendedNutrition },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json({
      message: "Preferenze aggiornate",
      user: formatUserResponse(user)
    });
  } catch (err) {
    console.error("Errore:", err);
    res.status(500).json({ message: "Errore nell'aggiornamento" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Utente non trovato" });
    res.status(200).json({ message: "Utente eliminato" });
  } catch (err) {
    res.status(500).json({ message: "Errore eliminazione" });
  }
};

exports.selectTrainer = async (req, res) => {
    try {
        const { userId, trainerId } = req.body;
        const updatedUser = await trainerService.chooseTrainer(userId, trainerId);
        res.status(200).json({
            message: "Trainer selezionato con successo!",
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};